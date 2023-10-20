export function fullMinutes(min){
    if(min<=9){
        return `${0}${min}`;
    }else{
        return min;
    }
}