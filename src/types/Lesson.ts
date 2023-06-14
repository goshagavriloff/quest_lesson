export type Lesson = {
    id: number;
    date: Date;
    title: string;
    status: boolean;
    visitCount: number;
    students:StudentLessons[];
    teachers:Teacher[];
};

export type Teacher = {
    id: number;
    name: string;
};

export type Student={
    id:number;
    name:string;
};

export type LessonQuery={
    date?:Date[];
    status?:number;
    teacherIds?:string;
    studentsCount?:number[];
    page?:number;
    lessonsPerPage?:number;
};

export const defaultPage:string="1";
export const defaultPerPage:string="5";

type StudentLessons=Lesson & {visit:boolean};