"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonTeacherRepository = exports.LessonTeacherRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class LessonTeacherRepository extends BaseRepository_1.BaseRepository {
}
exports.LessonTeacherRepository = LessonTeacherRepository;
exports.lessonTeacherRepository = new LessonTeacherRepository("lesson_teachers");
