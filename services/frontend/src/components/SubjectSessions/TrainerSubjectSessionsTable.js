import React, {useEffect, useState} from "react";
import {BsPencil} from "react-icons/bs";
import {useTranslation} from "react-i18next";

import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';


import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EDataGrid} from "styled_components";

// MUI v4
import { theme } from 'MuiTheme'
const palette = theme.palette


export default function TrainerSubjectSessionsTable(props){
    
    const{
        subjectSessions=[],
    }=props;

    const { t } = useTranslation();

    const [rows, setRows] = useState([]);

    const {F_getHelper} = useMainContext();

    const {userPermissions} = F_getHelper();

    const subjectSessionsList = subjectSessions.length>0 ? subjectSessions.map((item,index)=>
        ({  id: index+1,
            name: item.trainingModule?.name,
            assignedChapter: item.assignedChapter && item.assignedChapter.name ? item.assignedChapter.name : "-",
            assignedGroup: item.group.name,
            examDate: item.date ? item.date : "-",
            assignedGroupId: item?.assignedGroup?._id,
            assignedContentId: item?.assignedContent?._id,
        })) : [];

    useEffect(()=>{
        setRows(subjectSessionsList);
    },[subjectSessions]);

    const StyledIconButton = styled(IconButton)({
        
        background: palette.primary.creme
    })
    
    
    const columns = [
        { field: 'name', headerName: t('Course Name'), width: 100, flex: 1 },
        { field: 'assignedGroup', headerName: t('Class'), width: 100, flex: 1 },
        { field: 'examDate', headerName: t('Period'), width: 100, type: 'date', flex: 1,
            renderCell: (params)=> params.row.examDate ? (new Date (params.row.examDate).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 50,
            sortable: false,
            hide: userPermissions.isParent,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
                <StyledIconButton size="small" color="secondary"
                     disabled={false} onClick={""}><BsPencil/>
                </StyledIconButton>
            )
        }
    ];

    return(
        <Grid container spacing={3} sx={{mt:1}}>
            <Grid item xs={12}>
                <div style={{width: 'auto', height: 'auto'}}>
                        <EDataGrid
                            rows={rows}
                            setRows={setRows}
                            columns={columns}
                            originalData={subjectSessionsList}
                            isVisibleToolbar={false}
                        />
                </div>
            </Grid>
        </Grid>
    )
}