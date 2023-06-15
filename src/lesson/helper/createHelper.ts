import { z } from "zod";
import { transformDate, checkDaysList } from "./validate";
import { teacherService } from "../../teacher/TeacherService";



const baseLessonSchema = z.object({
    teacherIds: (z.array(z.number().refine(
        async (id) => await teacherService.checkIfExists(id)
        ))),
    title: z.string(),
    days: checkDaysList,
    firstDate: transformDate,
    lessonsCount: z.number().positive().refine((val)=>val<=300),
    lastDate: transformDate,
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

