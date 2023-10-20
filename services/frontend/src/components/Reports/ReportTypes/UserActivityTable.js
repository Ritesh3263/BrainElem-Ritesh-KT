import React from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {EDataGrid} from "../../../styled_components";

const useStyles = makeStyles(theme=>({}))

export default function UserActivityTable(props) {
    const{
        lastUserActivity=[],
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: false, flex: 1},
        { field: 'eventType', headerName: t('Event Type'), width: 120, flex: 1 },
        { field: 'eventTitle', headerName: t('Event Title'), width: 120, flex: 1 },
        { field: 'date', headerName: t('Date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.date ? (new Date (params.row.date).toLocaleDateString()) : ("-")
        },
        { field: 'subject', headerName: t('Subject name'), width: 120, flex: 1},
        { field: 'action',
            width: 150,
            sortable: false,
            hide: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" color="secondary"
                     onClick={()=>{}}><VisibilityIcon/>
                </IconButton>
            )
        }
    ];

    const lastUserActivityList = lastUserActivity.length>0 ? lastUserActivity.map((item,index)=>
        ({  id: index+1,
            eventType: item.eventType,
            eventTitle: item.eventTitle,
            date: item.date,
            subject: item.subject,
            eventId: item.id
        })) : [];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={lastUserActivityList}
                    setRows={()=>{}}
                    columns={columns}
                    originalData={lastUserActivityList}
                    isVisibleToolbar={false}
                />
        </div>
    );
}
