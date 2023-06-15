import { PoolClient, QueryResult } from "pg";
import { Lesson, LessonQuery, LessonRecord, LessonSaveQuery, LessonTeacherRecord, defaultPage, defaultPerPage } from "../types/Lesson";
import { BaseRepository } from "./BaseRepository";
import { pgPool } from "../config/database";
import { lessonTeacherRepository } from "./LessonTeacherRepository";

export class LessonRepository extends BaseRepository {

    public async save(record:LessonRecord,teacherIds?:number[]):Promise<number|void>{
        const query = `INSERT INTO lessons ( date, title, status)
        SELECT '${record.date}'	,'${record.title}',${record.status}
        WHERE
        NOT EXISTS (
        SELECT id FROM lessons WHERE date = '${record.date}' and title='${record.title}' and status=${record.status}
        )
        returning id;`;

        const client: PoolClient = await pgPool.connect();
        const promiseTeachers:Promise<void>[]=[];
        const insertedLesson=await client.query(query);

        await client.release();
        
        
        if (insertedLesson.rowCount==0){
            return;
        }
        const row=insertedLesson.rows[0];
        
        if (teacherIds){
            for (let teacher_id of teacherIds){
                const lsRecord:LessonTeacherRecord={
                    lesson_id:row.id,
                    teacher_id,
                };
                promiseTeachers.push(lessonTeacherRepository.save(lsRecord));
            }

        }

        return  await Promise.all(promiseTeachers).then((data)=>{
            return row.id;
        });

    }

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
            t0.*,
            case
                when t1."visitCount" is null then 0
                else t1."visitCount"
            end as "visitCount"
          ,
            case
                when t2.students is null then '[]'
                else t2.students
            end as students,
            case
                when t3.teachers is null then '[]'
                else t3.teachers
            end as teachers
        from
            (
            select
                l.id,
                l.date,
                l.title,
                l.status
            from
                lessons l
            ) as t0
        left join
                (
            select
                l.id,
                count(l.id) as "visitCount"
            from
                lessons l
            inner join lesson_students ls on
                l.id = ls.lesson_id
            where
                ls.visit = true
            group by
                l.id) as t1
            on
            t0.id = t1.id
        left join 
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
            t0.id = t2.lesson_id
        left join (
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
            t0.id = t3.lesson_id 
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