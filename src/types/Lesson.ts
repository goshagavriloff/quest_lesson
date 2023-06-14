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
    date:string;
    status:string;
    teacherIds:string;
    studentsCount:string;
    page:string;
    lessonsPerPage:string;
};

type StudentLessons=Lesson & {visit:boolean};