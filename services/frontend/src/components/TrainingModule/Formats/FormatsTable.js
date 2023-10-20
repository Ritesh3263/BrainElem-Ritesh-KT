import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import Visibility from "@material-ui/icons/Visibility";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


export default function FormatsTable(props) {
    const{
        formats=[],
        setEditFormHelper=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [_rows, _setRows] = useState([]);

    const formatsList = formats.length>0 ? formats.map((item,index)=>
        ({  id: index+1,
            name: item?.name,
            formatId: item._id,
            startDate: item.startDate,
            endDate: item.endDate,
            startsAtTheSameTime: item.startsAtTheSameTime,
            daysOfWeek: item.daysOfWeek,
        })) : [];

    useEffect(()=>{
        _setRows(formatsList);
    },[formats]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: 'Format name', width: 120, flex: 1 },
        { field: 'startDate', headerName: 'Start time', width: 120, type: 'date', flex: 1,
            renderCell: ({row:{startDate}})=> startDate ? (new Date (startDate).toLocaleDateString()) : ("-")
        },
        { field: 'endDate', headerName: 'End time', width: 120, type: 'date', flex: 1,
            renderCell: ({row:{endDate}})=> endDate ? (new Date (endDate).toLocaleDateString()) : ("-")
        },
        { field: 'daysOfWeek', headerName: 'Days', width: 120, type: 'date', flex: 1, hide: true,
            renderCell: ({row:{daysOfWeek}})=> daysOfWeek ? (daysOfWeek.map(d=>`${d}, `)) : ("-")
        },
        { field: 'startsAtTheSameTime', headerName: 'Classes start at the same time', width: 120, flex: 1 },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            hide: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{formatId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'PREVIEW', formatId});
                            }}><Visibility/>
                </IconButton>
            )
        },
        { field: 'action-edit',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{formatId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'EDIT', formatId});
                            }}><BsPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
            <EDataGrid
                rows={_rows}
                columns={columns}
                isVisibleToolbar={false}
                setRows={_setRows}
                originalData={formatsList}
            />
        </div>
    );
}
