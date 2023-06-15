import { z } from "zod";
import { checkDate, checkDaysList } from "./validate";
import { teacherService } from "../../teacher/TeacherService";



const baseLessonSchema = z.object({
    teacherIds: (z.array(z.number().refine(
        async (id) => await teacherService.checkIfExists(id)
        ))),
    title: z.string(),
    days: checkDaysList,
    firstDate: checkDate,
    lessonsCount: z.number().positive().refine((val)=>val<=300),
    lastDate: checkDate,
});

export const createLessonSchema = z.union(
    [baseLessonSchema.partial({
        lessonsCount: true,
    }),
    baseLessonSchema.partial({
        lastDate: true,
    })
    ]
);

