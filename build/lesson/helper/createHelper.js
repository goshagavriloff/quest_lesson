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
exports.createLessonSchema = void 0;
const zod_1 = require("zod");
const validate_1 = require("./validate");
const TeacherService_1 = require("../../teacher/TeacherService");
const baseLessonSchema = zod_1.z.object({
    teacherIds: (zod_1.z.array(zod_1.z.number().refine((id) => __awaiter(void 0, void 0, void 0, function* () { return yield TeacherService_1.teacherService.checkIfExists(id); })))),
    title: zod_1.z.string(),
    days: validate_1.checkDaysList,
    firstDate: validate_1.transformDate,
    lessonsCount: zod_1.z.number().positive().refine((val) => val <= 300),
    lastDate: validate_1.transformDate,
});
exports.createLessonSchema = zod_1.z.union([baseLessonSchema.partial({
        lessonsCount: true,
    }),
    baseLessonSchema.partial({
        lastDate: true,
    })
]);
