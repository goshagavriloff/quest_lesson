import { NextFunction, Request, Response, Router } from "express";
import {LessonQuery,LessonSaveQuery,defaultPage,defaultPerPage } from "../types/Lesson";
import { lessonService } from "./LessonService";
import { searchLessonSchema } from "./helper/searchHelper";
import { createLessonSchema } from "./helper/createHelper";

const lessonRouter: Router = Router();
lessonRouter.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

  }, 
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
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const options={
        teacherIds:req.body.teacherIds,
        title:req.body.title,
        days:req.body.days,
        firstDate:req.body.firstDate,
        lessonsCount:req.body.lessonsCount,
        lastDate:req.body.lastDate
      };
      
      const parserPromise=createLessonSchema.safeParseAsync(options).catch((err)=>{
        throw err;
      });
      const parserAsync=await parserPromise;
      
      if (!parserAsync.success){
        next(parserAsync.error);
      } else {
        const parser=parserAsync.data as LessonSaveQuery;
        res.locals.options=parser;
      }
      
      next();      
    } catch (err) {
      next(err);
    }

  }, 
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

      const options= res.locals.options;
      const lessonInfo = await lessonService.create(options as LessonSaveQuery);
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
