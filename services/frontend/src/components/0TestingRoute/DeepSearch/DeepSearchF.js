function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


export default function DeepSearchF (searchValue, DataRows, setSearchText, setRows){
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const data = JSON.parse(JSON.stringify(DataRows));

    const filteredRows = data.filter((row) => {
        return Object.keys(row).some((field) => {
            if(field && row[field]){
                if(searchRegex.test(row[field].toString())){
                    return searchRegex.test(row[field].toString());
                }
                else{
                    if(typeof row[field] === "object"){
                        const filteredSubRows = row[field].filter((subrow)=>{
                            return Object.keys(subrow).some((subfield)=> {
                                if(subfield && subrow[subfield]){
                                    return searchRegex.test(subrow[subfield].toString())
                                }
                            })
                        })
                        row[field] = filteredSubRows;
                        if(filteredSubRows.length>0){
                            return true;
                        }else{
                            return false;
                        }
                    }
                }
            }
        });
    });
    setRows(filteredRows);
};