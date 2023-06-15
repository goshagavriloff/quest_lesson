export function addYears(date:Date, years:number):Date {
    let result= new Date(date.getTime());;
    result.setFullYear(result.getFullYear() + years);
  
    return result;
}
export function getNearestDay(targetDate:Date,targetDay:number):Date{
    const delta = targetDay - targetDate.getDay();

    if (delta >= 0) {
        targetDate.setDate(targetDate.getDate() + delta)
        
    }
    else {
        targetDate.setDate(targetDate.getDate() + 7 + delta)
        
    }
    return targetDate;
}

export function* arrGenerator(arr:number[]):Generator<number,void,unknown>{
    let i = 0
    let length = arr.length
    while(true) {
        yield arr[i]
        i++
        if(i === length) i = 0
    }
}