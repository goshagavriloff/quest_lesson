"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPage = exports.transformStudentsCount = exports.transformTeachers = exports.transformStatus = exports.transformDate = void 0;
const zod_1 = require("zod");
const validator_1 = __importDefault(require("validator"));
exports.transformDate = zod_1.z.string().refine((val) => val.split(',').every(el => validator_1.default.isDate(el, { format: 'YYYY-MM-DD' }))).refine((val) => val.split(',').length <= 2).transform((val) => val.split(','));
exports.transformStatus = zod_1.z.string().refine((val) => ["0", "1"].includes(val)).transform((val) => Number(val));
exports.transformTeachers = zod_1.z.string().refine((val) => val.split(',').every(el => !isNaN(+el)));
exports.transformStudentsCount = zod_1.z.string().refine((val) => val.split(',').length <= 2).refine((val) => val.split(',').every(el => !isNaN(+el)));
exports.transformPage = zod_1.z.string().refine((val) => !isNaN(+val)).transform((val) => Number(val)).refine((val) => val > 0);
