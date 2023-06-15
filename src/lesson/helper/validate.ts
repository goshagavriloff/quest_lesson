import { z } from "zod";
import Validator from "validator";

export const checkDaysList=z.array(z.number().refine(
    (val)=> val>=0 && val<7
));

export const transformDate=z.string().refine(
    (val)=>Validator.isDate(val, {format: 'YYYY-MM-DD',strictMode:true})
).transform(
    (val)=>new Date(val)
);

export const transformDateList = z.string().refine(
    (val) => val.split(',').every(el=>Validator.isDate(el, {format: 'YYYY-MM-DD',strictMode:true}))
).refine(
    (val) => val.split(',').length <= 2
).transform(
    (val) => val.split(',').sort((a,b)=>Date.parse(a)-Date.parse(b))
);


export const transformStatus = z.string().refine(
    (val) => ["0", "1"].includes(val)
).transform(
    (val) => Number(val)
);


export const transformTeachers = z.string().refine(
    (val) => val.split(',').every(el => !isNaN(+el))
);

export const transformStudentsCount = z.string().refine(
    (val) => val.split(',').length <= 2
).refine(
    (val) => val.split(',').every(el => !isNaN(+el))
).transform(
    (val) => val.split(',').map(el=>Number(el)).sort()
);

export const transformPage = z.string().refine(
    (val) => !isNaN(+val)
).transform(
    (val) => Number(val)
).refine(
    (val) => val > 0
);
