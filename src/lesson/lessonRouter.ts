import { NextFunction, Request, Response, Router } from "express";
import {LessonQuery } from "../types/Lesson";
import { lessonService } from "./LessonService";

const lessonRouter: Router = Router();
lessonRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const options:LessonQuery={
        date:req.params.date,
        status:req.params.status,
        teacherIds:req.params.teacherIds,
        studentsCount:req.params.studentsCount,
        page:req.params.page||"1",
        lessonsPerPage:req.params.lessonsPerPage||"5"
    };
      const lessonInfo = await lessonService.search(options);
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

export default lessonRouter;
