import { LessonQuery, Lesson, LessonSaveQuery } from "../types/Lesson";
import { lessonRepository } from "../repo/LessonRepository";

class LessonService {
    async create(options:LessonSaveQuery) {
        return {};
    }
    async search(options:LessonQuery) {

        return await lessonRepository.get(options) as Lesson[];

    }

}
export const lessonService=new LessonService()