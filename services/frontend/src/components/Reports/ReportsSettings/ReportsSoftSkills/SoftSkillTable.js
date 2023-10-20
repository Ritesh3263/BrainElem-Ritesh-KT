import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

const useStyles = makeStyles(theme=>({}))

export default function SoftSkillTable(props) {
    const{
        softSkills=[],
        setEditFormHelperSoftSkills=()=>{},
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const softSkillsList = softSkills.length>0 ? softSkills.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            createdAt: item.createdAt ? item.createdAt : "-",
            softSkillId: item._id
        })) : [];

    useEffect(()=>{
        setRows(softSkillsList);
    },[softSkills]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Soft skill name'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
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
                    onClick={()=>setEditFormHelperSoftSkills(
                    {isOpen: true, type: 'EDIT',
                    softSkillId: params.row.softSkillId})}><BsPencil/>
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
                originalData={softSkillsList}
            />
        </div>
    );
}
