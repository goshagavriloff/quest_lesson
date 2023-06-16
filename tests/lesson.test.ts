import { pgPool } from "../src/config/database";
import { BaseRepository } from "../src/repo/BaseRepository";
import { lessonRepository } from "../src/repo/LessonRepository";
import { lessonStudentRepository } from "../src/repo/LessonStudentRepository";
import { lessonTeacherRepository } from "../src/repo/LessonTeacherRepository";
import { studentRepository } from "../src/repo/StudentRepository";
import { teacherRepository } from "../src/repo/TeacherRepository";
import { LessonSearchTest, LessonSaveTest, LessonQuery, LessonSearchInputTest } from "../src/types/Lesson";


const APP_PORT=process.env.APP_PORT as unknown as number||8000;
const APP_HOST=process.env.APP_HOST as string||"http://localhost";

const APP_URL=`${APP_HOST}:${APP_PORT}`;

describe("PostgreSQL Database", () => {

    test("test connect to database", () => {
        const output = true;

        pgPool.connect().then(data => {
            data.release();
            expect(output).toBe(true);
        });
    });

    [lessonRepository, teacherRepository, studentRepository, lessonTeacherRepository, lessonStudentRepository].forEach((repo: BaseRepository) => {
        test(`exist table ${repo.getTableName()} in database`, async () => {
            const output = await repo.tableExists();
            expect(output).toBe(true);

        });

    });

});


describe("REST API Lessons: GET /", () => {
    // test("",()=>{

    // });
    //invalid request body GET /:
    let isFinishTests = (arr: LessonSearchTest[]) => {
        return arr.every(el => el.isFinish);
    }

    const invalidTests: LessonSearchTest[] = [
        { key: "date", tests: ["19.99.2021", "2022-00-99", "2022-09-09,2022-20-02", "2022-09-09,2022-12-02,,2022-12-05", ""], isFinish: false },
        { key: "status", tests: ["true", "1", "01", ""], isFinish: false },
        { key: "teacherIds", tests: ["122,12,1", "err", "1;1", ""], isFinish: false },
        { key: "studentsCount", tests: ["12;1", "1,2,3", "err", ""], isFinish: false },
        { key: "page", tests: ["-1", "0", ""], isFinish: false },
        { key: "lessonsPerPage", tests: ["-1", "0", ""], isFinish: false }
    ];

    const validTests = {
        date: ["", "", ""],
        status: ["", "", ""],
        teacherIds: ["", "", ""],
        studentsCount: ["", "", ""],
        page: ["1", "2", "5"],
        lessonsPerPage: ["", "", ""]
    };

    const defaultTest: LessonSearchInputTest= {

        date: "2019-02-02",
        status: "0",
        teacherIds: "1",
        studentsCount: "1",
        page: "1",
        lessonsPerPage: "5"

    };

    var input: {
        [key in keyof LessonQuery]: string;
    } = JSON.parse(JSON.stringify(defaultTest));

    while (!isFinishTests(invalidTests)) {
        let cursor: LessonSearchTest | undefined = invalidTests.find(el => !el.isFinish);
        if (cursor == undefined) {
            break;
        }

        let curKey = cursor.key;
        let curTest = cursor.tests.pop();

        if (curTest == undefined) {
            cursor.isFinish = true;
            continue;
        }
        input[curKey]=curTest;
        const getQueryParams=new URLSearchParams(input).toString();

        test(`check invalid body data in REST API: GET ${APP_URL}/?${getQueryParams}`, async () => {
            
            const status = await (await fetch(`${APP_URL}/?${getQueryParams}`)).status;
            const failed=status===500;
            input=JSON.parse(JSON.stringify(defaultTest));

            expect(failed).toBe(true);

        });

    }


});

describe("REST API Lessons: POST /lessons", () => {

});