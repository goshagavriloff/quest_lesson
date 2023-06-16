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
const database_1 = require("../src/config/database");
const LessonRepository_1 = require("../src/repo/LessonRepository");
const LessonStudentRepository_1 = require("../src/repo/LessonStudentRepository");
const LessonTeacherRepository_1 = require("../src/repo/LessonTeacherRepository");
const StudentRepository_1 = require("../src/repo/StudentRepository");
const TeacherRepository_1 = require("../src/repo/TeacherRepository");
const APP_PORT = process.env.APP_PORT || 8000;
const APP_HOST = process.env.APP_HOST || "http://localhost";
const APP_URL = `${APP_HOST}:${APP_PORT}`;
const isFinishTests = (arr) => {
    return arr.every((el) => el.isFinish);
};
function* generateTestData(listTest, inputTest) {
    while (!isFinishTests(listTest)) {
        var input = JSON.parse(JSON.stringify(inputTest));
        let cursor = listTest.find(el => !el.isFinish);
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
        database_1.pgPool.connect().then(data => {
            data.release();
            expect(output).toBe(true);
        });
    });
    [LessonRepository_1.lessonRepository, TeacherRepository_1.teacherRepository, StudentRepository_1.studentRepository, LessonTeacherRepository_1.lessonTeacherRepository, LessonStudentRepository_1.lessonStudentRepository].forEach((repo) => {
        test(`exist table ${repo.getTableName()} in database`, () => __awaiter(void 0, void 0, void 0, function* () {
            const output = yield repo.tableExists();
            expect(output).toBe(true);
        }));
    });
});
describe("REST API Lessons: GET /", () => {
    const invalidTests = [
        { key: "date", tests: ["19.99.2021", "2022-00-99", "2022-09-09,2022-20-02", "2022-09-09,2022-12-02,,2022-12-05", ""], isFinish: false },
        { key: "status", tests: ["true", "1", "01", ""], isFinish: false },
        { key: "teacherIds", tests: ["122,12,1", "err", "1;1", ""], isFinish: false },
        { key: "studentsCount", tests: ["12;1", "1,2,3", "err", ""], isFinish: false },
        { key: "page", tests: ["-1", "0", ""], isFinish: false },
        { key: "lessonsPerPage", tests: ["-1", "0", ""], isFinish: false }
    ];
    const validTests = [
        { "key": "date", tests: ["2019-09-09", "2019-09-09,2023-09-09"], isFinish: false },
        { "key": "status", tests: ["0", "1"], isFinish: false },
        { "key": "teacherIds", tests: ["1,2", "1,1", "1,4"], isFinish: false },
        { "key": "studentsCount", tests: ["1", "2", "1,5"], isFinish: false },
        { "key": "page", tests: ["1", "2", "5"], isFinish: false },
        { "key": "lessonsPerPage", tests: ["1", "5", "15"], isFinish: false },
    ];
    const defaulSearchtTest = {
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
        test(`check invalid body data in REST API: GET ${APP_URL}/?${getQueryParams}`, () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield (yield fetch(`${APP_URL}/?${getQueryParams}`)).status;
            const failed = status === 500;
            expect(failed).toBe(true);
        }));
    }
    for (let successTest of successTests) {
        const getQueryParams = new URLSearchParams(successTest).toString();
        test(`check valid body data in REST API: GET ${APP_URL}/?${getQueryParams}`, () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield (yield fetch(`${APP_URL}/?${getQueryParams}`)).status;
            const successed = status === 200;
            expect(successed).toBe(true);
        }));
    }
});
describe("REST API Lessons: POST /lessons", () => {
    const invalidTests = [
        { key: "teacherIds", tests: ["19.99.2021", "2022-00-99", "2022-09-09,2022-20-02", "2022-09-09,2022-12-02,,2022-12-05", ""], isFinish: false },
        { key: "title", tests: ["true", "1", "01", ""], isFinish: false },
        { key: "days", tests: ["122,12,1", "err", "1;1", ""], isFinish: false },
        { key: "firstDate", tests: ["12;1", "1,2,3", "err", ""], isFinish: false },
        { key: "lessonsCount", tests: ["-1", "0", ""], isFinish: false },
        { key: "lastDate", tests: ["-1", "0", ""], isFinish: false }
    ];
    const defaulSavetTest = {
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
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: undefined
    };
    for (let bodyJSON of errorTests) {
        const body = JSON.stringify(bodyJSON);
        requestOptions.body = body;
        test(`check invalid body data in REST API: GET ${APP_URL}/lessons with body(${body})`, () => __awaiter(void 0, void 0, void 0, function* () {
            const status = yield (yield fetch(`${APP_URL}/lessons`, requestOptions)).status;
            const failed = status === 500;
            expect(failed).toBe(true);
        }));
    }
});
