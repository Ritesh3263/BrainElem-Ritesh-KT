import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useTranslation} from "react-i18next";
import {isWidthUp} from "@material-ui/core/withWidth";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

const rows = [
    { id: 1, contentType: 'contentType', name: 'name', level: "level", updatedAt: "" },
];


export default function ToExaminateDashboard({toExaminate}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const { currentScreenSize} = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();
    const isColumnVisible=()=>{
            return !isWidthUp('sm',currentScreenSize);
    }

    const getTableWidth=()=>{
        if(isWidthUp('sm',currentScreenSize)){
            return 380;
        }else{
            return 220;
        }
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: true, disableColumnMenu: true, sortable: false},
        // { field: 'contentType', headerName: 'Type', width: 110, flex: 1,
        //     headerClassName: 'super-app-theme--header',
        // },
        { field: 'name', headerName: t('Exam name'), width: 180, flex: 1 },
        { field: 'description', hide: true, headerName: t('Description'), width: 120, flex: 1 },
        // { field: 'level', headerName: t('Level'), width: 120, flex: 1 },
        { field: 'Date', headerName: t('Date'), width: 60, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params)=>(
                new Date (params.row.date).toLocaleDateString()
            )
        },
        { field: 'action',
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                        disabled={params.row.contentId === "-"}
                        startIcon={<VisibilityIcon/>} onClick={()=>{
                    window.open(`/examinate/${params.row.eventId}/${params.row.contentId}`, '_blank')
                }
                }>{params.row.contentId !== "-" ? (<small>{t("Exam")}</small>) : (<small>-</small>)}</Button>
            )
        }
    ];


    const toExaminateList = toExaminate.length>0 ? toExaminate.map((item,index)=>
        ({id: index+1,name: item.name ,description: item.description, date: item.date, groupId: item.assignedGroup?._id||"-" ,contentId: item.assignedContent?._id || "-", eventId: item._id})) : [];


    return (
        <div style={{width: '100%', height: (toExaminateList.length>0) && getTableWidth()}} className={classes.root}>
            {toExaminateList.length>0 ?(
                <DataGrid rows={toExaminateList}
                          columns={columns}
                          pageSize={5}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          classes={{root: classes.root}}
                          getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')} />
            ):(
                <span>{t("You don't have any exams to examinate")}</span>
            )}
        </div>
    );
}
