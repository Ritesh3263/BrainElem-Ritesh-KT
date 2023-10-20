export default function filterFn(value, data){
    console.log("filterFn-data",data);
    console.log("filterFn-value",value);
    // => only first Object.keys level
    if(value && data.length>0){
        return data.filter((item)=>{
            return Object.keys(item).some((f)=>{
                return ((f && item[f]) && (f === value?.field) && (item[f] === value.value))
            });
        })
    }
}