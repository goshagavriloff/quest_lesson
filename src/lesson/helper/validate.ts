import { z } from "zod";
import Validator from "validator";
export const transformDate = z.string().refine(
    (val) => val.split(',').every(el=>Validator.isDate(el, {format: 'YYYY-MM-DD'}))
).refine(
    (val) => val.split(',').length <= 2
).transform(
    (val) => val.split(',')
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
);

export const transformPage = z.string().refine(
    (val) => !isNaN(+val)
).transform(
    (val) => Number(val)
).refine(
    (val) => val > 0
);
