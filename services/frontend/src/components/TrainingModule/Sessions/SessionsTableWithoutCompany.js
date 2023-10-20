import React, {useEffect, useState} from 'react';
import {EDataGrid} from "styled_components";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import IconButton from "@material-ui/core/IconButton";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";
import { NewEDataGrid } from 'new_styled_components';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";


const useStyles = makeStyles(theme => ({
    darkViolet: {
        color: theme.palette.primary.darkViolet
    },
}));

export default function SessionsTableWithoutCompany(props) {
    const{
        sessions=[],
        active,
    }=props;
    const { t } = useTranslation();
    const {F_getHelper, F_getLocalTime} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [status, setStatus] = useState('-');
    const [updatedSessions, setUpdatedSessions] = useState([]);
    const [sessionsList, setSessionsList] = useState([]);
    const {
        setIsOpenSessionForm,
    } = useSessionContext();

    useEffect(()=>{
        var data = []
        if (updatedSessions?.length>0) {
            data = updatedSessions.map((item,index)=>
            ({  id: index+1,
                name: item.name,
                // company: item.enquiry?.company?.name??'[No company]',
                hasEnquiry: !!item.enquiry,
                isArchived: item?.updatedStatus,
                // category: item.category ? item.category: "-",
                createdAt: item.createdAt,
                startDate: item.startDate,
                endDate: item.endDate,
                // to remove
                certificationSessionId: item._id,
                sessionId: item._id,
            }))
        }
        setRows(data);
        setSessionsList(data)
    },[updatedSessions]);

    useEffect(()=>{
        const setsessions = sessions.map((item) =>{
        if(new Date() < new Date(item?.startDate)){
            const updatedSession = {...item};
            updatedSession.updatedStatus = 'To do';
            return updatedSession;
        } 
        else if(new Date() > new Date(item?.endDate)){
            const updatedSession = {...item};
            updatedSession.updatedStatus = 'Done';
            return updatedSession;
        } 
        else {
            const updatedSession = {...item};
            updatedSession.updatedStatus = 'In progress';
            return updatedSession;
        }
        })
        setUpdatedSessions(setsessions)
    },[sessions]);


    const columns = [
        // { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 50, hide: false, sortable: false, disableColumnMenu: true},
        { field: 'name', headerName: t('Session name'), minWidth: 160, flex: 1 },
        { field: 'startDate', headerName: t('Start date'), minWidth: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.startDate ? (F_getLocalTime(params.row.startDate, true)) : ("-")
        },
        { field: 'endDate', headerName: t('End date'), minWidth: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.endDate ? (F_getLocalTime(params.row.endDate, true)) : ("-")
        },
        { field: 'createdAt', headerName: t('Created At'), minWidth: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (F_getLocalTime(params.row.createdAt, true)) : ("-")
        },
        { field: 'isArchived', headerName: t('Status'), minWidth: 120, flex: 1 },

        { field: 'preview',
            minWidth: 50,
            sortable: false,
            headerName: t('Actions'),
            disableColumnMenu: true,
            hide: (userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager  || userPermissions.isTrainingManager),
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderCell: (params) =>(
            <StyledEIconButton color="primary" size="medium" onClick={()=>{
                navigate(`${params.row.sessionId}`)
                // setIsOpenSessionForm({isOpen: true, type: 'PREVIEW', sessionId: params.row.sessionId, active })
            }}>
                <KeyboardArrowRightIcon />
            </StyledEIconButton>
            )
        },
                { field: 'edit',
                minWidth: 50,
                    sortable: false,
                    disableColumnMenu: true,
                    hide: ((!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)  && !userPermissions.isTrainingManager),
                    headerAlign: 'center',
                    cellClassName: 'super-app-theme--cell',
                    align: 'center',
                    renderHeader: ()=>(" "),
                    renderCell: ({row:{sessionId, hasEnquiry}}) =>(
                        <StyledEIconButton color="primary" size="medium" onClick={()=>{setIsOpenSessionForm({isOpen: true, type: 'EDIT', sessionId, active })}}>
                            <BsPencil/>
                        </StyledEIconButton>)},
                    // <IconButton color="secondary" size="small" className={`${classes.darkViolet}`}
                    //             // disabled={(userPermissions.isTrainingManager && !hasEnquiry)}
                    //             onClick={()=>{setIsOpenSessionForm({isOpen: true, type: 'EDIT', sessionId, active })}}>
                    //     <BsPencil/>
                    // </IconButton>)},
    ];

    const handleOnCellClick =  ({row:{sessionId}}) =>{
        navigate(`${sessionId}`)
        // setIsOpenSessionForm(({isOpen: true, type: 'EDIT', sessionId, active }))
      ;
    }

    return (
        <div style={{width: 'auto', height: 'auto'}}>
                <NewEDataGrid style={{cursor: "pointer"}}
                    rows={rows}
                    columns={columns}
                    isVisibleToolbar={true}
                    setRows={setRows}
                    onCellClick={handleOnCellClick}
                    originalData={sessionsList}
                />
        </div>
    );
}
