export default function sortFn(value, data){
    console.log("sortFn-data",data);
    console.log("sortFn-value",value);
    // todo sort
    if(value && data.length>0){
        return data.map((item)=>{
            return Object.keys(item).some((f)=>{
                 if((f && item[f]) && (f === value?.field)){
                     console.log("bum",f)
                     // data.sort((a,b)=>{
                     //     console.log("a",a);
                     //     console.log("a",b);
                     // })
                 }
            });
        })
    }
    return data;
}