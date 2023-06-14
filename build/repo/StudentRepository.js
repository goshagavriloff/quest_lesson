"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentRepository = exports.StudentRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
class StudentRepository extends BaseRepository_1.BaseRepository {
}
exports.StudentRepository = StudentRepository;
exports.studentRepository = new StudentRepository("students");
