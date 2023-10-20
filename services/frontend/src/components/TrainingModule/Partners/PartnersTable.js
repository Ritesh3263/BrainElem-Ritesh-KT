import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {Badge} from "@mui/material";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))

export default function PartnersTable(props) {
    const{
        partners=[],
        setFormIsOpen=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    const partnersList = partners.length>0 ? partners.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            createdAt: item.createdAt,
            isActive: item.isActive,
            NumbersOfEmployees: item.examiners?.concat(item.trainees)?.length??0,
            partnerId: item._id
        })) : [];

    useEffect(()=>{
        setRows(partnersList);
    },[partners]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Company name'), width: 120, flex: 1 },
        { field: 'NumbersOfEmployees', headerName: t('Number of employees'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'isActive', headerName: t('Status'), width: 80, align: 'center', sortable: false, disableColumnMenu: true,
            renderCell: (params) => params.row.isActive ? <Badge color="success" variant="dot"/> : <Badge color="error" variant="dot"/>
        },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton size="small" color="secondary"  onClick={()=>{setFormIsOpen({isOpen: true, isNew: false, partnerId: params.row.partnerId})}}>
                    <BsPencil style={{color: `rgba(82, 57, 112, 1)`}}/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={partnersList}
                />
        </div>
    );
}
