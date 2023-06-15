import { LessonQuery, Lesson, LessonSaveQuery, limit, LessonRecord } from "../types/Lesson";
import { lessonRepository } from "../repo/LessonRepository";
import { addYears, arrGenerator, getNearestDay } from "../common/utils";

class LessonService {
    public async create(options:LessonSaveQuery):Promise<number[]> {
        const {maxYearDist,maxCount}=limit;
        const promiseLessons:Promise<number|void>[]=[];
        const dayLoop = arrGenerator(options.days);

        var maxDate=addYears(options.firstDate,maxYearDist);

        if (options.lastDate!==undefined){
            maxDate=options.lastDate<maxDate?options.lastDate:maxDate;
        } 
        var counter=0;
        var cursorDate=options.firstDate;
        
        while (counter<=maxCount){
            const dayOfWeek=dayLoop.next().value as number;
            const nextDate=getNearestDay(cursorDate,dayOfWeek);
            const recordDate=nextDate.toISOString().split('T')[0];

            if (nextDate>maxDate){
                break;
            }
            const lessonRecord:LessonRecord={
                date:recordDate,
                title:options.title,
                status:"0"
            };
            promiseLessons.push(lessonRepository.save(lessonRecord,options.teacherIds));
            cursorDate=nextDate;
            counter++;
        }

        return await Promise.all(promiseLessons).then((values)=>{
            return values.filter((i): i is number => {
                return typeof i === "number";
            })
        }) ;
    }
    public async search(options:LessonQuery) {

        return await lessonRepository.get(options) as Lesson[];

    }


}
export const lessonService=new LessonService()