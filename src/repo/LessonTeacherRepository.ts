import { PoolClient, QueryResult } from "pg";
import { BaseRepository } from "./BaseRepository";
import { pgPool } from "../config/database";
import { LessonTeacherRecord } from "../types/Lesson";

export class LessonTeacherRepository extends BaseRepository {

    public async save(record:LessonTeacherRecord):Promise<void>{

        const query = `INSERT INTO lesson_teachers ( lesson_id, teacher_id)
        SELECT ${record.lesson_id}	,${record.teacher_id}
        WHERE
        NOT EXISTS (
        SELECT lesson_id FROM lesson_teachers WHERE lesson_id = ${record.lesson_id} and teacher_id=${record.teacher_id}
        );`;


        const client: PoolClient = await pgPool.connect();
        
        await client.query(query);
        await client.release();
    }
}
export const lessonTeacherRepository = new LessonTeacherRepository("lesson_teachers");