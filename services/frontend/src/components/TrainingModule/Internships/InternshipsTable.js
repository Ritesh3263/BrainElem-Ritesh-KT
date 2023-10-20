import React,{useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "@mui/material";
import {useTranslation} from "react-i18next";
import { HiPencil } from 'react-icons/hi';
import { new_theme } from 'NewMuiTheme';


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


export default function InternshipsTable(props) {
    const{
        internships=[],
        setEditFormHelper=()=>{}
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [_rows, _setRows] = useState([]);


    const internshipsList = internships.length>0 ? internships.map((item,index)=>
        ({  id: index+1,
            name: item?.name,
            location: item?.company,
            companyName: item?.company?.name,
            createdAt: item?.createdAt,
            category: item?.category?.name,
            status: item.isActive,
            internshipId: item._id
        })) : [];

    useEffect(()=>{
        _setRows(internshipsList);
    },[internships]);


    const columns = [
        { field: 'id', headerName: 'ID', flex: 1, minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: 'Internship name', minWidth: 120, flex: 1 },
        { field: 'companyName', headerName: 'Company name', minWidth: 120, flex: 1 },
        { field: 'location', headerName: 'Location', minWidth: 120, flex: 1,
            renderCell: ({row:{location}}) => location ? `${location?.city??'-'}, ${location?.street??'-'}, ${location?.buildNr??'-'}` : '-'
        },
        { field: 'category', headerName: 'Category', minWidth: 120, flex: 1 },
        { field: 'createdAt', headerName: 'Created At', minWidth: 120, type: 'date', flex: 1,
            renderCell: ({row:{createdAt}})=> createdAt ? (new Date (createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), minWidth: 80, align: 'center', sortable: false, disableColumnMenu: true,
            renderCell: ({row:{status}}) => status ? <Badge color="success" variant="dot"/> : <Badge color="error" variant="dot"/> },
        { field: 'action-edit',
            minWidth: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: 'Action',
            renderCell: ({row:{internshipId}}) =>(
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium"
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'EDIT', internshipId});
                            }}><HiPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={_rows}
                    isVisibleToolbar={false}
                    columns={columns}
                    setRows={_setRows}
                    originalData={internshipsList}
                />
        </div>
    );
}
