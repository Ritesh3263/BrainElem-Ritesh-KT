import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";

const useStyles = makeStyles(theme=>({}))

export default function TemplatesTable(props) {
    const{
        reportsTemplates=[],
        setEditFormHelper=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    const reportsTemplatesList = reportsTemplates.length>0 ? reportsTemplates.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            type: item.type ? item.type : "-",
            itemsQuantity: item?.softSkills?.length || 0,
            createdAt: item.createdAt ? item.createdAt : "-",
            reportTemplateId: item._id
        })) : [];

    useEffect(()=>{
        setRows(reportsTemplatesList);
    },[reportsTemplates]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Template name'), width: 120, flex: 1 },
        { field: 'type', hide: true, headerName: t('Type'), width: 120, flex: 1 },
        { field: 'itemsQuantity', headerName: t('Soft skills count'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1, hide: true,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
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
                <IconButton size="small" color="secondary"
                     onClick={()=>setEditFormHelper(
                    {isOpen: true, itemType: params.row.type, type: 'EDIT',
                    templateId: params.row.reportTemplateId})}><BsPencil/>
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
                originalData={reportsTemplatesList}
            />
        </div>
    );
}
