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
const LessonRepository_1 = require("../repo/LessonRepository");
// export type Lesson = {
//     id: number;
//     date: Date;
//     title: string;
//     status: boolean;
//     visitCount: number;
//     students:StudentLessons[];
//     teachers:Teacher[];
// };
// date
// status
// teacherIds
// studentsCount
// page
// lessonsPerPage
class LessonService {
    create() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    search(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                date: req.params.datedate,
                status: req.params.status,
                teacherIds: req.params.teacherIds,
                studentsCount: req.params.studentsCount,
                page: req.params.page,
                lessonsPerPage: req.params.lessonsPerPage
            };
            return yield LessonRepository_1.lessonRepository.get(options);
            //select id,date,title,status,(visitCount),students(id,name,visit),teachers(id,name)
            //*date. Либо одна дата в формате YYYY-MM-DD, либо две в таком же формате через запятую
            // (например, «2019-01-01,2019-09-01». Если указана одна дата, выбираются занятия на эту дату. Если
            //     указаны 2 даты, то выбираются занятия за период, включая указанные даты.
            //* status. Статус занятия. принимается либо 0 (не проведено), либо 1 (проведено)
            //* teacherIds. id учителей через запятую. Выбираются все занятия, которые ведет хотя бы один из
            //     указанных учителей.
            //* studentsCount. количество записанных на занятия учеников. либо одно число (тогда выбирается
            //занятие с точным числом записанных), либо 2 числа через запятую, тогда они рассматриваются как
            //диапазон и выбираются занятия с количеством записанных, попадающих в диапазон включительно.
            //* page. Номер возвращаемой страницы. первая страница - 1.
            //* lessonsPerPage. Количество занятий на странице. По-умолчанию - 5 занятий.
        });
    }
}
exports.lessonService = new LessonService();
