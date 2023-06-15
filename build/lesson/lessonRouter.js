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
const Lesson_1 = require("../types/Lesson");
const LessonService_1 = require("./LessonService");
const searchHelper_1 = require("./helper/searchHelper");
const createHelper_1 = require("./helper/createHelper");
const lessonRouter = (0, express_1.Router)();
lessonRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            date: req.query.date,
            status: req.query.status,
            teacherIds: req.query.teacherIds,
            studentsCount: req.query.studentsCount,
            page: req.query.page || Lesson_1.defaultPage,
            lessonsPerPage: req.query.lessonsPerPage || Lesson_1.defaultPerPage
        };
        const parser = searchHelper_1.searchLessonSchema.parse(options);
        res.locals.options = parser;
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
lessonRouter.post("/lessons", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            teacherIds: req.body.teacherIds,
            title: req.body.title,
            days: req.body.days,
            firstDate: req.body.firstDate,
            lessonsCount: req.body.lessonsCount,
            lastDate: req.body.lastDate
        };
        const parserPromise = createHelper_1.createLessonSchema.safeParseAsync(options).catch((err) => {
            throw err;
        });
        const parserAsync = yield parserPromise;
        if (!parserAsync.success) {
            next(parserAsync.error);
        }
        else {
            const parser = parserAsync.data;
            res.locals.options = parser;
        }
        next();
    }
    catch (err) {
        next(err);
    }
}), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = res.locals.options;
        const lessonInfo = yield LessonService_1.lessonService.create(options);
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
