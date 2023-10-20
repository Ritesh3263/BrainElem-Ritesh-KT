import * as React from 'react';
import {EDataGrid} from "styled_components";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";

const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function SessionsTable(props) {
    const{
        sessions=[],
        active,
    }=props;
    const { t } = useTranslation();
    const {F_getHelper, F_getLocalTime} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);

    const {
        setIsOpenSessionForm,
    } = useSessionContext();


    const sessionsList = sessions.length>0 ? sessions.map((item,index)=>
        ({  id: index+1,
            name: item.name,
            company: item.enquiry?.company?.name??'[No company]',
            hasEnquiry: !!item.enquiry,
            isArchived: item.archived,
            // category: item.category ? item.category: "-",
            createdAt: item.createdAt,
            startDate: item.startDate,
            endDate: item.endDate,
            // to remove
            certificationSessionId: item._id,
            sessionId: item._id,
        })) : [];

    useEffect(()=>{
        setRows(sessionsList);
    },[sessions]);


    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Session name'), width: 120, flex: 1 },
        { field: 'company', headerName: 'Company name', width: 120, flex: 1, renderCell: (params)=> params.row.company ? <span className={params.row.company === "[No company]" && "text-danger"}>{params.row.company}</span> : "-" },
        { field: 'startDate', headerName: t('Start date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.startDate ? (F_getLocalTime(params.row.startDate, true)) : ("-")
        },
        { field: 'endDate', headerName: t('End date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.endDate ? (F_getLocalTime(params.row.endDate, true)) : ("-")
        },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (F_getLocalTime(params.row.createdAt, true)) : ("-")
        },
        { field: 'isArchived', headerName: t('Archived'), width: 120, flex: 1 },
        { field: 'preview',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            hide: (userPermissions.isArchitect || userPermissions.isTrainingManager),
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(" "),
            renderCell: (params) =>(
                <IconButton  size="small" className={`${classes.darkViolet}`}
                            onClick={()=>{
                                //navigate(`/modules-core/users/form/${params.row.userId}`)
                                setIsOpenSessionForm({isOpen: true, type: 'PREVIEW', sessionId: params.row.sessionId })
                            }}>
                    <VisibilityIcon/>
                </IconButton>
            )
        },
                { field: 'edit',
                    width: 50,
                    sortable: false,
                    disableColumnMenu: true,
                    hide: !(userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager || userPermissions.isTrainingManager),
                    headerAlign: 'center',
                    cellClassName: 'super-app-theme--cell',
                    align: 'center',
                    renderHeader: ()=>(" "),
                    renderCell: ({row:{sessionId, hasEnquiry}}) =>(
        <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                    // disabled={(userPermissions.isTrainingManager && !hasEnquiry)}
                    onClick={()=>{setIsOpenSessionForm({isOpen: true, type: 'EDIT', sessionId, active })}}>
            <BsPencil/>
        </IconButton>)},
    ];

    const handleOnCellClick =  ({field, hasFocus, row:{sessionId}}) =>{
        if(['preview', 'edit'].includes(field)) return;
        // used the same logic as in the edit button
        setIsOpenSessionForm(({isOpen: true, type: (userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager || userPermissions.isTrainingManager)? 'EDIT': 'PREVIEW', sessionId, active }));
    }

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid style={{cursor: "pointer"}}
                    rows={rows}
                    columns={columns}
                    onCellClick={handleOnCellClick}
                    isVisibleToolbar={false}
                    setRows={setRows}
                    originalData={sessionsList}
                />
        </div>
    );
}
