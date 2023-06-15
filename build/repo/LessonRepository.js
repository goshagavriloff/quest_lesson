"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonRepository = exports.LessonRepository = void 0;
const Lesson_1 = require("../types/Lesson");
const BaseRepository_1 = require("./BaseRepository");
const database_1 = require("../config/database");
const LessonTeacherRepository_1 = require("./LessonTeacherRepository");
class LessonRepository extends BaseRepository_1.BaseRepository {
    save(record, teacherIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO lessons ( date, title, status)
        SELECT '${record.date}'	,'${record.title}',${record.status}
        WHERE
        NOT EXISTS (
        SELECT id FROM lessons WHERE date = '${record.date}' and title='${record.title}' and status=${record.status}
        )
        returning id;`;
            const client = yield database_1.pgPool.connect();
            const promiseTeachers = [];
            const insertedLesson = yield client.query(query);
            yield client.release();
            if (insertedLesson.rowCount == 0) {
                return;
            }
            const row = insertedLesson.rows[0];
            if (teacherIds) {
                for (let teacher_id of teacherIds) {
                    const lsRecord = {
                        lesson_id: row.id,
                        teacher_id,
                    };
                    promiseTeachers.push(LessonTeacherRepository_1.lessonTeacherRepository.save(lsRecord));
                }
            }
            return yield Promise.all(promiseTeachers).then((data) => {
                return row.id;
            });
        });
    }
    get(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = params.lessonsPerPage || Number(Lesson_1.defaultPerPage);
            const page = params.page || Number(Lesson_1.defaultPage);
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
            const client = yield database_1.pgPool.connect();
            const res = yield client.query(query);
            yield client.release();
            const { data } = res.rows[0];
            return data || [];
        });
    }
    getFilterQuery(params) {
        const filters = [];
        if (params.date) {
            const minDate = params.date[0];
            const maxDate = params.date[1] || minDate;
            filters.push(` t1.date between '${minDate}' and '${maxDate}' 
            `);
        }
        if (params.status !== undefined) {
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
exports.LessonRepository = LessonRepository;
exports.lessonRepository = new LessonRepository("lessons");
