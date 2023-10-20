import React, {useEffect, useState} from 'react';
import { NewEDataGrid } from 'new_styled_components';
import { HiPencil } from 'react-icons/hi';
import IconButton from "@mui/material/IconButton";
import {useTranslation} from "react-i18next";
import { new_theme } from 'NewMuiTheme';



export default function CompetenceBlockTable(props) {
    const{
        competenceBlocks=[],
        setFormIsOpen=()=>{},
    }=props;
    const { t } = useTranslation();
    const [rows, setRows] = useState([]);

    const competenceBlocksList = competenceBlocks.length>0 ? competenceBlocks.map((item,index)=>
        ({  id: index+1,
            identificationCode: item.identificationCode,
            name: item.title,
            competences: item.competences.length,
            assesmentCriteria: item.assesmentCriteria?.name??"-",
            assesmentMethod: item.assesmentMethod?.name??"-",
            createdAt: item.createdAt,
            competenceBlockId: item._id
        })) : [];

    useEffect(()=>{
        setRows(competenceBlocksList);
    },[competenceBlocks]);

    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Competence block name'), minWidth: 300, flex: 1 },
        { field: 'competences', headerName: t('Competences'), minWidth: 150, flex: 1 },
        { field: 'assesmentCriteria', headerName: t('Assesment criteria'), minWidth: 180, flex: 1 },
        { field: 'assesmentMethod', headerName: t('Assesment method'), minWidth: 180, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), minWidth: 90, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            headerName: 'Action',
            // renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <IconButton style={{color:new_theme.palette.newSupplementary.NSupText, padding:6}} size="medium"
                     onClick={()=>{
                        //navigate(`/certifications/competenceBlock/${params.row.competenceBlockId}`)
                        setFormIsOpen({isOpen: true, isNew: false, competenceBlockId: params.row.competenceBlockId});
                    }}><HiPencil/>
                </IconButton>
            )
        }
    ];

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <NewEDataGrid
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={competenceBlocksList}
                />
        </div>
    );
}
