import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField"
import {
    DataGrid,
    GridToolbarDensitySelector,
    GridToolbarFilterButton, useGridColumnResize,
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { createTheme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import QuickSearchToolbarTest from "./QuickSearchToolbarTest";
import TableSearch from "../../common/Table/TableSearch";
import {useTranslation} from "react-i18next";

// function escapeRegExp(value) {
//     return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
// }

export default function QuickSearch() {
    const { t, i18n, translationsLoaded } = useTranslation();
    const { data } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 10,
        maxColumns: 6,
    });
    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(data.rows);

    React.useEffect(() => {
        setRows(data.rows);
    }, [data.rows]);

    // const requestSearch = (searchValue) => {
    //     setSearchText(searchValue);
    //     const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    //     const filteredRows = data.rows.filter((row) => {
    //         return Object.keys(row).some((field) => {
    //             return searchRegex.test(row[field].toString());
    //         });
    //     });
    //     setRows(filteredRows);
    // };


    return (
        <>
        <div style={{ height: 720, width: '100%' }}>
            <DataGrid
                components={{ Toolbar: QuickSearchToolbarTest }}
                rows={rows}
                columns={data.columns}
                componentsProps={{
                    toolbar: {
                        value: searchText,
                        onChange: (e) => TableSearch(e.target.value,data.rows,setSearchText,setRows),
                        clearSearch: () => TableSearch('',data.rows,setSearchText,setRows),
                    },
                }}
            />
        </div>
        </>
    );
}