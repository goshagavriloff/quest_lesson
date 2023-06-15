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
exports.lessonSaveMiddleware = void 0;
const createHelper_1 = require("../helper/createHelper");
const lessonSaveMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            teacherIds: req.body.teacherIds,
            title: req.body.title,
            days: req.body.days,
            firstDate: req.body.firstDate,
            lessonsCount: req.body.lessonsCount,
            lastDate: req.body.lastDate
        };
        yield createHelper_1.createLessonSchema.safeParseAsync(options).then((result) => {
            if (result.success) {
                const parser = result.data;
                if ((parser.lastDate !== undefined) && (parser.lastDate < parser.firstDate)) {
                    throw "Error: lastDate less then firstDate";
                }
                res.locals.options = parser;
                next();
            }
            else {
                throw result.error;
            }
        }).catch((err) => next(err));
    }
    catch (err) {
        next(err);
    }
});
exports.lessonSaveMiddleware = lessonSaveMiddleware;
