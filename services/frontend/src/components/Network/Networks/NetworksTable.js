import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function NetworksTable(props) {
    const{
        networks=[],
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();

    const networksList = networks.length>0 ? networks.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            assignedManager: item.owner ? (item.owner.name+" "+item.owner.surname) : "-",
            createdAt: item.createdAt,
            modulesInNetwork: item.modules ? item.modules.length : 0,
            networkId: item._id
        })) : [];

    useEffect(()=>{
        setRows(networksList);
    },[networks]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Network name'), width: 120, flex: 1 },
        { field: 'assignedManager', headerName: t('Assigned managers'), width: 120, flex: 1,
            renderCell: (params)=> params.row.assignedManager? (<Badge key={params.row.id} variant="secondary">{params.row.assignedManager}</Badge>) : "-" },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'modulesInNetwork', headerName: t('Modules in network'), width: 120, flex: 1},
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`} onClick={()=>{navigate(`/networks/form/${params.row.networkId}`)}}>
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
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={networksList}
                />
        </div>
    );
}
