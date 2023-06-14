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
const lessonRouter = (0, express_1.Router)();
// lessonRouter.put(
//   "/users/:id",
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       const user: User = userService.getUserFromRequest(req);
//       await userService.save(user);
//       res.json({ ok: true });
//     } catch (err) {
//       next(err);
//     }
//   }
// );
lessonRouter.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lessonInfo = yield LessonService_1.lessonService.search(req);
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
