import * as React from 'react';
import { DataGrid} from '@material-ui/data-grid';
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import CustomNoRowsOverlay from "../../common/Table/CustomNoRowsOverlay";
import TableSearch from "../../common/Table/TableSearch";
import {useEffect, useState} from "react";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}));

export default function GradebookTableGrades({tableRows, tableColumns, isTableLoading}) {
    const navigate = useNavigate();
    const { t, i18n, translationsLoaded } = useTranslation();
    const { F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(25);
    const [tableHeight, setTableHeight] = useState(720);



    useEffect(()=>{
        if(userPermissions.isTrainee){
           setTableHeight(500);
        }
    },[])

    useEffect(()=>{
        setRows(tableRows);
    },[tableRows,tableColumns])



    return (
        <>
        <div style={{height: tableHeight, marginTop:"50px", marginLeft:"20px"}} className={classes.root}>
            <DataGrid rows={rows}
                      columns={tableColumns}
                      columnBuffer={30}
                      rowsPerPageOptions={[5, 10, 30, 50]}
                      hideFooter={true}
                      disableSelectionOnClick={true}
                      classes={{root: classes.root}}
                      pageSize={pageSize}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      loading={isTableLoading}
                      components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,tableRows,setSearchText, setRows),
                              clearSearch: () => TableSearch('',tableRows,setSearchText, setRows),
                          },
                      }}
                      getCellClassName={(params) => {
                        if (params.value == null) {
                          return 'emptyCell';
                        }
                        else return 'valueCell';
                        // return params.value >= 15 ? 'hot' : 'cold';
                      }}
            />
        </div>
        </>
    );
}
