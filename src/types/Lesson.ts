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
    date?:string[];
    status?:number;
    teacherIds?:string;
    studentsCount?:number[];
    page?:number;
    lessonsPerPage?:number;
};

export type LessonSaveQuery={
    teacherIds:Promise<number[]>;
    title:string;
    days:number[];
    firstDate:string;
    lessonsCount?:number;
    lastDate?:string;
};

export const defaultPage:string="1";
export const defaultPerPage:string="5";

export const limit={
    year:1,
    maxCount:300
};

type StudentLessons=Student & {visit:boolean};