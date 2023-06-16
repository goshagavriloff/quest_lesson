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
exports.lessonTeacherRepository = exports.LessonTeacherRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const database_1 = require("../config/database");
class LessonTeacherRepository extends BaseRepository_1.BaseRepository {
    save(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO lesson_teachers ( lesson_id, teacher_id)
        SELECT ${record.lesson_id}	,${record.teacher_id}
        WHERE
        NOT EXISTS (
        SELECT lesson_id FROM lesson_teachers WHERE lesson_id = ${record.lesson_id} and teacher_id=${record.teacher_id}
        );`;
            const client = yield database_1.pgPool.connect();
            yield client.query(query);
            yield client.release();
        });
    }
}
exports.LessonTeacherRepository = LessonTeacherRepository;
exports.lessonTeacherRepository = new LessonTeacherRepository("lesson_teachers");
