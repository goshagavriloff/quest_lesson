
import { pgPool } from "../src/config/database";
import { BaseRepository } from "../src/repo/BaseRepository";
import { lessonRepository } from "../src/repo/LessonRepository";
import { lessonStudentRepository } from "../src/repo/LessonStudentRepository";
import { lessonTeacherRepository } from "../src/repo/LessonTeacherRepository";
import { studentRepository } from "../src/repo/StudentRepository";
import { teacherRepository } from "../src/repo/TeacherRepository";
import { LessonSearchInputTest, LessonSaveInputTest, LessonTest } from "../src/types/Lesson";


const APP_PORT = process.env.APP_PORT as unknown as number || 8000;
const APP_HOST = process.env.APP_HOST as string || "http://localhost";

const APP_URL = `${APP_HOST}:${APP_PORT}`;


const isFinishTests = (arr: any) => {
    return arr.every((el:{isFinish: any})=> el.isFinish);
}
function* generateTestData(listTest:LessonTest[], inputTest: LessonSearchInputTest | LessonSaveInputTest) {


    while (!isFinishTests(listTest)) {
        var input = JSON.parse(JSON.stringify(inputTest));
        let cursor: LessonTest | undefined = listTest.find(el => !el.isFinish);
        if (cursor == undefined) {
            break;
        }

        let curKey = cursor.key;
        let curTest = cursor.tests.pop();

        if (curTest == undefined) {
            cursor.isFinish = true;
            continue;
        }
        input[curKey] = curTest;
        yield input;
    }
}

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

    const invalidTests: LessonTest[] = [
        { key: "date", tests: ["19.99.2021", "2022-00-99", "2022-09-09,2022-20-02", "2022-09-09,2022-12-02,,2022-12-05", ""], isFinish: false },
        { key: "status", tests: ["true", "1", "01", ""], isFinish: false },
        { key: "teacherIds", tests: ["122,12,1", "err", "1;1", ""], isFinish: false },
        { key: "studentsCount", tests: ["12;1", "1,2,3", "err", ""], isFinish: false },
        { key: "page", tests: ["-1", "0", ""], isFinish: false },
        { key: "lessonsPerPage", tests: ["-1", "0", ""], isFinish: false }
    ];

    const validTests: LessonTest[] = [
        { "key": "date", tests: ["2019-09-09", "2019-09-09,2023-09-09"], isFinish: false },
        { "key": "status", tests: ["0", "1"], isFinish: false },
        { "key": "teacherIds", tests: ["1,2", "1,1", "1,4"], isFinish: false },
        { "key": "studentsCount", tests: ["1", "2", "1,5"], isFinish: false },
        { "key": "page", tests: ["1", "2", "5"], isFinish: false },
        { "key": "lessonsPerPage", tests: ["1", "5", "15"], isFinish: false },
    ];

    const defaulSearchtTest: LessonSearchInputTest = {

        date: "2019-02-02",
        status: "0",
        teacherIds: "1",
        studentsCount: "1",
        page: "1",
        lessonsPerPage: "5"

    };

    const errorTests = [...generateTestData(invalidTests, defaulSearchtTest)];

    const successTests = [...generateTestData(validTests, defaulSearchtTest)];


    

    for (let errorTest of errorTests) {
        const getQueryParams = new URLSearchParams(errorTest).toString();

        test(`check invalid body data in REST API: GET ${APP_URL}/?${getQueryParams}`, async () => {
            const status = await (await fetch(`${APP_URL}/?${getQueryParams}`)).status;
            const failed = status === 500;
            expect(failed).toBe(true);

        });
    }

    for (let successTest of successTests) {
        const getQueryParams = new URLSearchParams(successTest).toString();

        test(`check valid body data in REST API: GET ${APP_URL}/?${getQueryParams}`, async () => {
            const status = await (await fetch(`${APP_URL}/?${getQueryParams}`)).status;
            const successed = status === 200;
            expect(successed).toBe(true);

        });
    }




});

describe("REST API Lessons: POST /lessons", () => {
    const invalidTests: LessonTest[] = [
        { key: "teacherIds", tests: ["19.99.2021", "2022-00-99", "2022-09-09,2022-20-02", "2022-09-09,2022-12-02,,2022-12-05", ""], isFinish: false },
        { key: "title", tests: ["true", "1", "01", ""], isFinish: false },
        { key: "days", tests: ["122,12,1", "err", "1;1", ""], isFinish: false },
        { key: "firstDate", tests: ["12;1", "1,2,3", "err", ""], isFinish: false },
        { key: "lessonsCount", tests: ["-1", "0", ""], isFinish: false },
        { key: "lastDate", tests: ["-1", "0", ""], isFinish: false }
    ];
    const defaulSavetTest: LessonSaveInputTest = {

        title: "TestLesson",
        days: "[0]",
        teacherIds: "1",
        firstDate: "2000-03-03",
        lessonsCount: "1",
        lastDate: "2000-03-10"
    };
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const errorTests = [...generateTestData(invalidTests, defaulSavetTest)];
    var requestOptions:RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body:undefined
      };
    for (let bodyJSON of errorTests) {
        const body = JSON.stringify(bodyJSON);
        requestOptions.body=body;

        test(`check invalid body data in REST API: GET ${APP_URL}/lessons with body(${body})`, async () => {
            const status = await (await fetch(`${APP_URL}/lessons`,requestOptions)).status;
            const failed = status === 500;
            expect(failed).toBe(true);

        });
    }

});