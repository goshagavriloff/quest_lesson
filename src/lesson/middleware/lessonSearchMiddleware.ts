import { NextFunction, Request, Response, Router } from "express";
import { LessonQuery, defaultPage, defaultPerPage } from "../../types/Lesson";
import { searchLessonSchema } from "../helper/searchHelper";

export const lessonSearchMiddleware=async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const options={
        date:req.query.date,
        status:req.query.status,
        teacherIds:req.query.teacherIds,
        studentsCount:req.query.studentsCount,
        page:req.query.page||defaultPage,
        lessonsPerPage:req.query.lessonsPerPage||defaultPerPage
      };
      const parser:LessonQuery=searchLessonSchema.parse(options) as LessonQuery;
      res.locals.options=parser;
      
      next();      
    } catch (err) {
      next(err);
    }

  }