import React, {useEffect, useState} from 'react';
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import { useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {EDataGrid} from "styled_components";


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function EcosystemsTable(props) {
    const{
        ecosystems=[]
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const ecosystemsList = ecosystems.length>0 ? ecosystems.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            assignedManager: item.assignedManager ? (item.assignedManager.name+" "+item.assignedManager.surname) : "-",
            createdAt: item.createdAt,
            status: item.isActive,
            ecosystemId: item._id
        })) : [];

    useEffect(()=>{
        setRows(ecosystemsList);
    },[ecosystems]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Ecosystem name'), width: 120, flex: 1 },
        { field: 'assignedManager', headerName: t('Assigned managers'), width: 120, flex: 1,
            renderCell: (params)=> params.row.assignedManager? (<Badge key={params.row.id} variant="secondary">{params.row.assignedManager}</Badge>) : "-" },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: (params) => params.row.status ? <span style={{color: "green"}}>{t("Active")}</span> : <span style={{color: "red"}}>{t("InActive")}</span> },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`} onClick={()=>{navigate(`/ecosystems/form/${params.row.ecosystemId}`)}}>
                   <BsPencil/>
                </IconButton>
            )
        }
    ];


    return (
        <div style={{width: 'auto', height: 'auto'}} >
                <EDataGrid
                    rows={rows}
                    columns={columns}
                    setRows={setRows}
                    originalData={ecosystemsList}
                />
        </div>
    );
}