import { z } from "zod";
import { transformDate,transformStatus,transformTeachers,transformStudentsCount,transformPage} from "./validate";

export const searchLessonSchema = z.object({
  date: transformDate,
  status: transformStatus,
  teacherIds: transformTeachers,
  studentsCount: transformStudentsCount,
  page: transformPage,
  lessonsPerPage: transformPage
}).partial();




