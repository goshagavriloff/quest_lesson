"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLessonSchema = void 0;
const zod_1 = require("zod");
const validate_1 = require("./validate");
exports.searchLessonSchema = zod_1.z.object({
    date: validate_1.transformDate,
    status: validate_1.transformStatus,
    teacherIds: validate_1.transformTeachers,
    studentsCount: validate_1.transformStudentsCount,
    page: validate_1.transformPage,
    lessonsPerPage: validate_1.transformPage
}).partial();
