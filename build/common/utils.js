"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrGenerator = exports.getNearestDay = exports.addYears = void 0;
function addYears(date, years) {
    let result = new Date(date.getTime());
    ;
    result.setFullYear(result.getFullYear() + years);
    return result;
}
exports.addYears = addYears;
function getNearestDay(targetDate, targetDay) {
    const delta = targetDay - targetDate.getDay();
    if (delta >= 0) {
        targetDate.setDate(targetDate.getDate() + delta);
    }
    else {
        targetDate.setDate(targetDate.getDate() + 7 + delta);
    }
    return targetDate;
}
exports.getNearestDay = getNearestDay;
function* arrGenerator(arr) {
    let i = 0;
    let length = arr.length;
    while (true) {
        yield arr[i];
        i++;
        if (i === length)
            i = 0;
    }
}
exports.arrGenerator = arrGenerator;
