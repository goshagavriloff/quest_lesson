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
const express_1 = require("express");
const LessonService_1 = require("./LessonService");
const searchHelper_1 = require("./helper/searchHelper");
const lessonRouter = (0, express_1.Router)();
lessonRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            date: req.query.date,
            status: req.query.status,
            teacherIds: req.query.teacherIds,
            studentsCount: req.query.studentsCount,
            page: req.query.page || "1",
            lessonsPerPage: req.query.lessonsPerPage || "5"
        };
        const parser = searchHelper_1.searchLessonSchema.parse(options);
        res.locals.options = parser;
        console.log(req.query);
        next();
    }
    catch (err) {
        next(err);
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = res.locals.options;
        const lessonInfo = yield LessonService_1.lessonService.search(options);
        if (lessonInfo != null) {
            res.json(lessonInfo);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        next(err);
    }
}));
exports.default = lessonRouter;
