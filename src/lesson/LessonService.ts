import { Request, Response } from "express";
import { LessonQuery, Lesson } from "../types/Lesson";
import { lessonRepository } from "../repo/LessonRepository";
// export type Lesson = {
//     id: number;
//     date: Date;
//     title: string;
//     status: boolean;
//     visitCount: number;
//     students:StudentLessons[];
//     teachers:Teacher[];
// };
// date
// status
// teacherIds
// studentsCount
// page
// lessonsPerPage
class LessonService {
    async create() {}
    async search(options:LessonQuery) {

        return await lessonRepository.get(options) as Lesson[];

    }

}
export const lessonService=new LessonService()