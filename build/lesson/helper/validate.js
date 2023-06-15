"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPage = exports.transformStudentsCount = exports.transformTeachers = exports.transformStatus = exports.transformDateList = exports.transformDate = exports.checkDaysList = void 0;
const zod_1 = require("zod");
const validator_1 = __importDefault(require("validator"));
exports.checkDaysList = zod_1.z.array(zod_1.z.number().refine((val) => val >= 0 && val < 7));
exports.transformDate = zod_1.z.string().refine((val) => validator_1.default.isDate(val, { format: 'YYYY-MM-DD', strictMode: true })).transform((val) => new Date(val));
exports.transformDateList = zod_1.z.string().refine((val) => val.split(',').every(el => validator_1.default.isDate(el, { format: 'YYYY-MM-DD', strictMode: true }))).refine((val) => val.split(',').length <= 2).transform((val) => val.split(',').sort((a, b) => Date.parse(a) - Date.parse(b)));
exports.transformStatus = zod_1.z.string().refine((val) => ["0", "1"].includes(val)).transform((val) => Number(val));
exports.transformTeachers = zod_1.z.string().refine((val) => val.split(',').every(el => !isNaN(+el)));
exports.transformStudentsCount = zod_1.z.string().refine((val) => val.split(',').length <= 2).refine((val) => val.split(',').every(el => !isNaN(+el))).transform((val) => val.split(',').map(el => Number(el)).sort());
exports.transformPage = zod_1.z.string().refine((val) => !isNaN(+val)).transform((val) => Number(val)).refine((val) => val > 0);
