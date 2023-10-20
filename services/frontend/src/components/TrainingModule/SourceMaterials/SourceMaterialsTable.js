import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {Badge} from "@mui/material";
import {useTranslation} from "react-i18next";
import Visibility from "@material-ui/icons/Visibility";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}))


export default function SourceMaterialsTable(props) {
    const{
        tooltip13,
        sourceMaterials=[],
        setEditFormHelper=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [_rows, _setRows] = useState([]);


    const sourceMaterialsList = sourceMaterials.length>0 ? sourceMaterials.map((item,index)=>
        ({  id: index+1,
            name: item?.name,
            level: item?.level??'-',
            ISBN: item?.ISBN??'-',
            category: item?.category?.name??'-',
            year: item?.year??'-',
            status: item?.status??'-',
            sourceMaterialId: item?._id,
        })) : [];

    useEffect(()=>{
        _setRows(sourceMaterialsList);
    },[sourceMaterials]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: 'Source name', width: 120, flex: 1 },
        { field: 'level', headerName: 'Level', width: 120, flex: 1 },
        { field: 'category', headerName: 'Category', width: 120, flex: 1 },
        { field: 'year', headerName: 'Year', width: 120, flex: 1 },
        { field: 'ISBN', headerName: 'ISBN', width: 120, flex: 1 },
        { field: 'status', headerName: t('Status'), width: 80, align: 'center', sortable: false, disableColumnMenu: true,
            renderCell: ({row:{status}}) => status ? <Badge color="success" variant="dot"/> : <Badge color="error" variant="dot"/> },
        { field: 'action-preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            hide: false,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{sourceMaterialId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            ref={tooltip13}
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'PREVIEW', sourceMaterialId});
                            }}><Visibility />
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
            renderCell: ({row:{sourceMaterialId}}) =>(
                <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                setEditFormHelper({isOpen: true, openType: 'EDIT', sourceMaterialId});
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
                originalData={sourceMaterialsList}
            />
        </div>
    );
}
