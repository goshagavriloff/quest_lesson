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
    teacherIds:number[];
    title:string;
    days:number[];
    firstDate:Date;
    lessonsCount?:number;
    lastDate?:Date;
};

export type LessonRecord={
    id?:number,
    date:string,
    title:string,
    status:string
};

export type LessonTeacherRecord={
    lesson_id:number,
    teacher_id:number  
};

export const defaultPage:string="1";
export const defaultPerPage:string="5";

export const limit={
    maxYearDist:1,
    maxCount:300
};

type StudentLessons=Student & {visit:boolean};
