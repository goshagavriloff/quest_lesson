import { NextFunction, Request, Response, Router } from "express";
import {LessonQuery,LessonSaveQuery } from "../types/Lesson";
import { lessonService } from "./LessonService";
import { lessonSearchMiddleware } from "./middleware/lessonSearchMiddleware";
import { lessonSaveMiddleware } from "./middleware/lessonSaveMiddleware";

const lessonRouter: Router = Router();
lessonRouter.get(
  "/",
  lessonSearchMiddleware, 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const options= res.locals.options;
      const lessonInfo = await lessonService.search(options as LessonQuery);
      if (lessonInfo != null) {
        res.json(lessonInfo);
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      next(err);
    }
  }
);

lessonRouter.post(
  "/lessons",
  lessonSaveMiddleware, 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const options= res.locals.options;
      const createdLessons = await lessonService.create(options as LessonSaveQuery);
      if (createdLessons != null) {
        res.json({createdLessons});
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      next(err);
    }
  }  
);

export default lessonRouter;
