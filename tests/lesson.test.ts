import { pgPool } from "../src/config/database";
import { BaseRepository } from "../src/repo/BaseRepository";
import { lessonRepository } from "../src/repo/LessonRepository";
import { lessonStudentRepository } from "../src/repo/LessonStudentRepository";
import { lessonTeacherRepository } from "../src/repo/LessonTeacherRepository";
import { studentRepository } from "../src/repo/StudentRepository";
import { teacherRepository } from "../src/repo/TeacherRepository";

describe("PostgreSQL Database", () => {

    test("test connect to database", () => {
        const output = true;
    
        pgPool.connect().then(data => {
            data.release();
            expect(output).toBe(true);
        });
    });

    [lessonRepository,teacherRepository,studentRepository,lessonTeacherRepository,lessonStudentRepository].forEach((repo:BaseRepository)=>{
        test(`exist table ${repo.getTableName()} in database`, async () => {
            const output = await repo.tableExists();
            expect(output).toBe(true);

        });
    
    });

});


describe("REST API Lessons: GET /", () => {

});

describe("REST API Lessons: POST /lessons", () => {

});