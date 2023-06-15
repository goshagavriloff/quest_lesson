import { PoolClient, QueryResult } from "pg";
import { Lesson, LessonQuery, defaultPage, defaultPerPage } from "../types/Lesson";
import { BaseRepository } from "./BaseRepository";
import { pgPool } from "../config/database";

export class LessonRepository extends BaseRepository {
    public async get(params: LessonQuery): Promise<Lesson[]> {
        const limit = params.lessonsPerPage || Number(defaultPerPage);
        const page = params.page || Number(defaultPage);
        const offset = (page - 1) * limit;
        const filter = this.getFilterQuery(params);

        const query = `
        select
        json_agg(to_jsonb(lesson_info.*)) as data
    from
        (
            select
            t1.*,
            t2.students,
            t3.teachers
        from
            (
            select
                l.id,
                l.date,
                l.title,
                l.status,
                count(l.id) as "visitCount"
            from
                lessons l
            inner join lesson_students ls on
                l.id = ls.lesson_id
            where
                ls.visit = true
            group by
                l.id) as t1
        inner join 
     (
     
            select
                s.lesson_id,
                count(s.*) as "allCount",
                json_agg(to_jsonb(s.*)- 'lesson_id') as students
            from
                (
                select
                    lesson_id,
                    s2.id,
                    name,
                    visit
                from
                    lesson_students ls2
                inner join students s2 on
                    ls2.student_id = s2.id) s
            group by
                s.lesson_id 
                
                
            ) as t2 on
            t1.id = t2.lesson_id
            
        inner join (
            select
                s.lesson_id,
                ARRAY_AGG(s.id) teachers_id,
                json_agg(to_jsonb(s.*)- 'lesson_id') as teachers
            from
                (
                select
                    lesson_id,
                    t.id,
                    name
                from
                    lesson_teachers lt1
                inner join teachers t on
                    lt1.teacher_id = t.id) s
            group by
                s.lesson_id
    )
    as t3 on
            t1.id = t3.lesson_id 
    ${filter}
    limit ${limit} offset ${offset}
    )
    
    as lesson_info;
    
    
        `;

        const client: PoolClient = await pgPool.connect();
        const res: QueryResult<any> = await client.query(query);
        await client.release();
        const { data } = res.rows[0];
        return data || [] as Lesson[];
    }
    
    private getFilterQuery(params: LessonQuery): string {
        const filters: string[] = [];
        if (params.date) {
            const minDate = params.date[0];
            const maxDate = params.date[1] || minDate;
            filters.push(` t1.date between '${minDate}' and '${maxDate}' 
            `);

        }

        if (params.status!==undefined) {
            filters.push(` t1.status=${params.status} `);
        }

        if (params.studentsCount) {
            const minCount = params.studentsCount[0];
            const maxCount = params.studentsCount[1] || minCount;
            filters.push(` t2.allCount between ${minCount} and ${maxCount} `);

        }
        if (params.teacherIds) {
            filters.push(` t3.teachers_id && '{${params.teacherIds}}'::int[] `);

        }

        return filters.length > 0 ? `where ${filters.join(" and ")}` : "";

    }

}
export const lessonRepository = new LessonRepository("lessons");