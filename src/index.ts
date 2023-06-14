import express, { Application, Request, Response } from "express";
import LessonRouter from "./lesson/lessonRouter";
import { lessonRepository } from "./repo/LessonRepository";
import { pgPool } from "./config/database";
import { lessonStudentRepository } from "./repo/LessonStudentRepository";
import { lessonTeacherRepository } from "./repo/LessonTeacherRepository";
import { studentRepository } from "./repo/StudentRepository";
import { teacherRepository } from "./repo/TeacherRepository";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.plugins();
    this.routes();
  }

  protected plugins(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  protected routes(): void {
    this.app.use(LessonRouter);
  }
}
const dbinit = async () => {
    await lessonRepository.ensureTableExists();
    await studentRepository.ensureTableExists();
    await teacherRepository.ensureTableExists();
    await lessonStudentRepository.ensureTableExists();
    await lessonTeacherRepository.ensureTableExists();
}

dbinit();

const port: number = 8000;
const app = new App().app;

const server=app.listen(port, () => {
  console.log("✅ Server started successfully on port 8000!");
});

for (let signal of ["SIGTERM", "SIGINT"])
    process.on(signal, () => {

        pgPool.end();
        console.log("PgSQL connection Pool closed.");

        server.close((err) => {
            console.log("Http server closed.");
            process.exit(err ? 1 : 0);
        });
    });