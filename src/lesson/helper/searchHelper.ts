import { z } from "zod";
import { transformDateList,transformStatus,transformTeachers,transformStudentsCount,transformPage} from "./validate";

export const searchLessonSchema = z.object({
  date: transformDateList,
  status: transformStatus,
  teacherIds: transformTeachers,
  studentsCount: transformStudentsCount,
  page: transformPage,
  lessonsPerPage: transformPage
}).partial();




