import { NextFunction, Request, Response, Router } from "express";
import { createLessonSchema } from "../helper/createHelper";
import { LessonSaveQuery } from "../../types/Lesson";

export const lessonSaveMiddleware=  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const options={
        teacherIds:req.body.teacherIds,
        title:req.body.title,
        days:req.body.days,
        firstDate:req.body.firstDate,
        lessonsCount:req.body.lessonsCount,
        lastDate:req.body.lastDate
      };
      
      await createLessonSchema.safeParseAsync(options).then(
        (result)=>{
          if (result.success){            
            const parser=result.data as LessonSaveQuery;
            
            if ((parser.lastDate!==undefined)&&(parser.lastDate<parser.firstDate)){
                throw "Error: lastDate less then firstDate";
            }

            res.locals.options=parser;

            next();
          } else {
            throw result.error;
          }
          
        }
      ).catch((err)=>next(err));
     
    } catch (err) {
      next(err);
    }

  }