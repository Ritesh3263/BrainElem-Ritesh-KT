import * as React from 'react';
import { DataGrid} from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import TableToolbar from "../../../../../common/Table/TableToolbar";
import TableSearch from "../../../../../common/Table/TableSearch";
import CustomNoRowsOverlay from "../../../../../common/Table/CustomNoRowsOverlay";
import {useEffect, useState} from "react";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useSessionContext} from "../../../../../_ContextProviders/SessionProvider/SessionProvider";

const useStyles = makeStyles(theme=>({}))

export default function UserActivityTable({currentReport={}}) {
    const { t } = useTranslation();
    const classes = useStyles();
    const {
        isOpenSessionForm,
    } = useSessionContext();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(5);


    const activityList = currentReport?.lasActivity?.length>0 ? currentReport?.lasActivity.map((item,index)=>
        ({  id: index+1,
            eventType: item?.eventType,
            eventName: item?.eventName,
            date: item?.date || '-',
            activityId: item._id
        })):[];

    useEffect(()=>{
        setRows(activityList);
    },[currentReport]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'eventType', headerName: t('Event type'), width: 120, flex: 1 },
        { field: 'eventName', headerName: t('Event name'), width: 120, flex: 1, hide: false },
        { field: 'date', headerName: t('Date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.date ? (new Date (params.row.date).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            hide: false,
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small"
                            style={{width:'45px', height: '45px'}}
                            onClick={()=>{}}
                >
                    <VisibilityIcon style={{fill: "rgba(82, 57, 112, 1)"}} />
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: '100%', height: 'auto'}} className={classes.root}>
            <DataGrid rows={rows}
                      columns={columns}
                      autoHeight={true}
                      rowsPerPageOptions={[5, 10, 25]}
                      disableSelectionOnClick={true}
                      classes={{root: classes.root}}
                      pageSize={pageSize}
                      onPageSizeChange={(e)=>setPageSize(e.pageSize)}
                      components={{ Toolbar: TableToolbar, NoRowsOverlay: CustomNoRowsOverlay, }}
                      componentsProps={{
                          toolbar: {
                              value: searchText,
                              onChange: (e) => TableSearch(e.target.value,activityList,setSearchText, setRows),
                              clearSearch: () => TableSearch('',activityList,setSearchText, setRows),
                          },
                      }}
                      getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
            />
        </div>
    );
}
