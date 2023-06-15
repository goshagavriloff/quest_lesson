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
const lessonSearchMiddleware_1 = require("./middleware/lessonSearchMiddleware");
const lessonSaveMiddleware_1 = require("./middleware/lessonSaveMiddleware");
const lessonRouter = (0, express_1.Router)();
lessonRouter.get("/", lessonSearchMiddleware_1.lessonSearchMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
lessonRouter.post("/lessons", lessonSaveMiddleware_1.lessonSaveMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = res.locals.options;
        const createdLessons = yield LessonService_1.lessonService.create(options);
        if (createdLessons != null) {
            res.json({ createdLessons });
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
