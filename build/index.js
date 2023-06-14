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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lessonRouter_1 = __importDefault(require("./lesson/lessonRouter"));
const LessonRepository_1 = require("./repo/LessonRepository");
const database_1 = require("./config/database");
const LessonStudentRepository_1 = require("./repo/LessonStudentRepository");
const LessonTeacherRepository_1 = require("./repo/LessonTeacherRepository");
const StudentRepository_1 = require("./repo/StudentRepository");
const TeacherRepository_1 = require("./repo/TeacherRepository");
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.plugins();
        this.routes();
    }
    plugins() {
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
    }
    routes() {
        this.app.use(lessonRouter_1.default);
    }
}
const dbinit = () => __awaiter(void 0, void 0, void 0, function* () {
    yield LessonRepository_1.lessonRepository.ensureTableExists();
    yield StudentRepository_1.studentRepository.ensureTableExists();
    yield TeacherRepository_1.teacherRepository.ensureTableExists();
    yield LessonStudentRepository_1.lessonStudentRepository.ensureTableExists();
    yield LessonTeacherRepository_1.lessonTeacherRepository.ensureTableExists();
});
dbinit();
const port = 8000;
const app = new App().app;
const server = app.listen(port, () => {
    console.log("✅ Server started successfully on port 8000!");
});
for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => {
        database_1.pgPool.end();
        console.log("PgSQL connection Pool closed.");
        server.close((err) => {
            console.log("Http server closed.");
            process.exit(err ? 1 : 0);
        });
    });
