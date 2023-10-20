function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function searchFn (searchValue, data ){
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    return data.filter((item)=>{
        return Object.keys(item).some((field)=>{
            if(field && item[field]){
                if(searchRegex.test(item[field].toString())){
                    return searchRegex.test(item[field].toString())
                }else{
                    if(typeof item[field] === 'object'){
                        let subFilteredData = [];
                        if(Array.isArray(item[field])){
                            subFilteredData = item[field].filter((subItem)=>{
                                return Object.keys(subItem).some((subField)=>{
                                    if(subItem && subItem[subField]){
                                        return searchRegex.test(subItem[subField].toString())
                                    }
                                })
                            });
                        }else{
                               return Object.keys(item[field]).some(subField=>{
                                   if(item[field] && subField){
                                       return searchRegex.test(item[field][subField].toString())
                                   }
                               })
                        }

                        return subFilteredData.length > 0;
                    }
                }
            }
        })
    });
};