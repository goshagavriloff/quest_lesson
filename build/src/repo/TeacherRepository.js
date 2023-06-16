"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherRepository = exports.TeacherRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class TeacherRepository extends BaseRepository_1.BaseRepository {
}
exports.TeacherRepository = TeacherRepository;
exports.teacherRepository = new TeacherRepository("teachers");
