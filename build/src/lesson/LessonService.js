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
exports.lessonService = void 0;
const Lesson_1 = require("../types/Lesson");
const LessonRepository_1 = require("../repo/LessonRepository");
const utils_1 = require("../common/utils");
class LessonService {
    create(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { maxYearDist, maxCount } = Lesson_1.limit;
            const promiseLessons = [];
            const dayLoop = (0, utils_1.arrGenerator)(options.days);
            var maxDate = (0, utils_1.addYears)(options.firstDate, maxYearDist);
            if (options.lastDate !== undefined) {
                maxDate = options.lastDate < maxDate ? options.lastDate : maxDate;
            }
            var counter = 0;
            var cursorDate = options.firstDate;
            while (counter <= maxCount) {
                const dayOfWeek = dayLoop.next().value;
                const nextDate = (0, utils_1.getNearestDay)(cursorDate, dayOfWeek);
                const recordDate = nextDate.toISOString().split('T')[0];
                if (nextDate > maxDate) {
                    break;
                }
                const lessonRecord = {
                    date: recordDate,
                    title: options.title,
                    status: "0"
                };
                promiseLessons.push(LessonRepository_1.lessonRepository.save(lessonRecord, options.teacherIds));
                cursorDate = nextDate;
                counter++;
            }
            return yield Promise.all(promiseLessons).then((values) => {
                return values.filter((i) => {
                    return typeof i === "number";
                });
            });
        });
    }
    search(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield LessonRepository_1.lessonRepository.get(options);
        });
    }
}
exports.lessonService = new LessonService();
