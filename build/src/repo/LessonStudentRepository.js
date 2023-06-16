"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonStudentRepository = exports.LessonStudentRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class LessonStudentRepository extends BaseRepository_1.BaseRepository {
}
exports.LessonStudentRepository = LessonStudentRepository;
exports.lessonStudentRepository = new LessonStudentRepository("lesson_students");
