import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import Visibility from "@material-ui/icons/Visibility";
import {Badge} from "@mui/material";

const useStyles = makeStyles(theme=>({}))

export default function PartnerExaminersTable(props) {
    const{
        MSUsers=[],
        setExaminersModalHelper=()=>{},
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    const MSUsersList = MSUsers.length>0 ? MSUsers.map((item,index)=>
        ({  id: index+1,
            username: item?.username??"-",
            fullName: `${item?.name??"-"} ${item?.surname??"-"}`,
            role: item.settings && item.settings ? item.settings.role : "-",
            dateOfBirth: item.settings && item.settings.dateOfBirth ? item.settings.dateOfBirth : "-",
            createdAt: item?.createdAt??"-",
            email: item?.email??"-",
            phone: item?.details?.phone??"-",
            status: item.settings && item.settings.isActive ? item.settings.isActive : false,
            userId: item._id,
        })) : [];

    useEffect(()=>{
        setRows(MSUsersList);
    },[MSUsers]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'username', headerName: t('Username'), width: 120, flex: 1, hide: true },
        { field: 'fullName', headerName: t('Full Name'), width: 120, flex: 1 },
        { field: 'role', headerName: t('Role'), width: 120, hide: 1, flex: 1 },
        { field: 'dateOfBirth', headerName: t('Date of birth'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        {
            field: 'status', headerName: t('Status'), width: 80, align: 'center',sortable: false, disableColumnMenu: true,
            renderCell: ({row}) => row.status ? <Badge color="success" variant="dot"/> :
                <Badge color="error" variant="dot"/>
        },
        { field: 'action-edit',
            width: 50,
            hide: true,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" onClick={()=>{}} disabled={true}>
                    <BsPencil style={{color: `rgba(82, 57, 112, 1)`}}/>
                </IconButton>
            )
        },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" onClick={()=>{setExaminersModalHelper({isOpen: true, examinerId: params.row.userId, openType: 'PREVIEW'})}}>
                    <Visibility style={{color: `rgba(82, 57, 112, 1)`}}/>
                </IconButton>
            )
        },
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}} >
                <EDataGrid
                    rows={rows}
                    setRows={setRows}
                    columns={columns}
                    isVisibleToolbar={false}
                    originalData={MSUsersList}
                />
        </div>
    );
}
