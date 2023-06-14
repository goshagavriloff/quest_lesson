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
const BaseRepository_1 = require("./BaseRepository");
const database_1 = require("../config/database");
class LessonRepository extends BaseRepository_1.BaseRepository {
    get(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
                s.lesson_id ) as t2 on
            t1.id = t2.lesson_id
        inner join (
            select
                s.lesson_id,
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
    )
    
    as lesson_info;
    
    
        `;
            const client = yield database_1.pgPool.connect();
            const res = yield client.query(query);
            yield client.release();
            const { data } = res.rows[0];
            console.log(data);
            return data || [];
        });
    }
}
exports.LessonRepository = LessonRepository;
exports.lessonRepository = new LessonRepository("lessons");
