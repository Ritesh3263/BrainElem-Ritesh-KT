import * as React from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function TraineesTable({MSUsers, setCurrentTab}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, hide: false, flex: 1},
        { field: 'username', headerName: t('Username'), width: 120, flex: 1, hide: true },
        { field: 'fullName', headerName: t('Full Name'), width: 120, flex: 1 },
        { field: 'dateOfBirth', headerName: t('Date of birth'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'email', headerName: t('E-mail'), width: 120, flex: 1},
        { field: 'phone', headerName: t('Phone'), width: 120, flex: 1},
        { field: 'isCertificated', headerName: t('Cerificated'), width: 120, flex: 1, renderCell: (params) => params.row.isCertificated ? <span style={{color: "green"}}>TRUE</span> : <span style={{color: "red"}}>FALSE</span> },
        { field: 'action',
            width: 150,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            flex: 1,
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" color="secondary"
                     onClick={()=>{setCurrentTab({openTab:2, type:params.row.userId})}}><BsPencil/>
                </IconButton>
            )
        }
    ];

    const MSUsersList = MSUsers.length>0 ? MSUsers.map((item,index)=>
        ({  id: index+1,
            username: item.username,
            fullName: `${item.name} ${item.surname}`,
            role: item.settings?.role ?? "-",
            dateOfBirth: item.details?.dateOfBirth ?? "-",
            createdAt: item.createdAt,
            email: item.email ?? "-",
            phone: item.details?.phone ?? "-",
            isCertificated: item.isCertificated ?? '',
            userId: item._id,
        })) : [];

    return (
        <div style={{width: '100%', height: (MSUsersList.length>0) && 700}} className={classes.root}>
            {MSUsersList.length>0 ?(
                <DataGrid rows={MSUsersList}
                          columns={columns}
                          pageSize={10}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          classes={{root: classes.root}}
                          components={{
                              Toolbar: GridToolbar
                          }}
                          getCellClassName={params => (params.value == null ? 'emptyCell' : 'valueCell')}
                />
            ):(
                <span>{t("There is no any users yet")}</span>
            )}
        </div>
    );
}
