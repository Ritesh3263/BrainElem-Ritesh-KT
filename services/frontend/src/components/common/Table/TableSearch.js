import PropTypes from "prop-types";
import SearchField from "../Search/SearchField";

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function TableSearch (searchValue, DataRows, setSearchText, setRows){
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = DataRows.filter((row) => {
            return Object.keys(row).some((field) => {
                if(field && row[field]){
                        return searchRegex.test(row[field].toString());
                }
            });
        })
        console.log("🚀 ~ file: TableSearch.js:19 ~ filteredRows ~ filteredRows", filteredRows)
        
    setRows(filteredRows);
};
