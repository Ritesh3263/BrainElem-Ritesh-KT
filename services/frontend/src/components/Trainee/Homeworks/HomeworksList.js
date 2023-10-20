import React, {useEffect, useState} from "react";
import EventService from "services/event.service"
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {EDataGrid} from "styled_components";
import {BsPencil} from "react-icons/bs";
import {useTranslation} from "react-i18next";
import TableToolbar from "components/common/Table/TableToolbar";
import TableSearch from "components/common/Table/TableSearch";
import CustomNoRowsOverlay from "components/common/Table/CustomNoRowsOverlay";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";

const useStyles = makeStyles(theme=>({}))

export default function HomeworksList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const [homeworks, setHomeworks] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const {setMyCurrentRoute, currentScreenSize, F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();

    const homeworksList = homeworks.length>0 ? homeworks.map((item,index)=>
        ({id: index+1,
            name: item?.name??"-",
            startDate: item?.date??"-",
            endDate: item?.endDate??"-",
            subject: item.assignedSubject && item.assignedSubject ? item.assignedSubject.name : "-",
            durationTime: item?.durationTime??"-",
            contentId: item?.assignedContent?._id??"",
            eventId: item?._id??""
        })) : [];

    useEffect(()=>{
        setRows(homeworksList);
    },[homeworks]);

    useEffect(()=>{
        EventService.getHomeworks().then(res=>{
            setHomeworks(res.data);
        });
        setMyCurrentRoute("Homework")
    },[]);

    const isColumnVisible=()=>{
        return !isWidthUp('sm',currentScreenSize);
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'name', headerName: t('Homework name'), width: 210, flex: 1 },
        { field: 'subject', headerName: t('Subject'), width: 120, flex: 1, hide: isColumnVisible() },
        { field: 'durationTime', headerName: t('Duration Time'), width: 30, flex: 1,hide: isColumnVisible(), renderCell: (params)=>(`${params.row.durationTime} min`) },
        { field: 'startDate', headerName: t('Start date'), width: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params)=>(
                new Date (params.row.startDate).toLocaleDateString()
            )
        },
        { field: 'endDate',hide:true, headerName: t('End date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.endDate ? (new Date (params.row.endDate).toLocaleDateString()) : ("-")
        },
        { field: 'action',
            width: 140,
            sortable: false,
            hide: userPermissions.isParent,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
            (params.row.contentId && <>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"  startIcon={<BsPencil/>} onClick={()=>{
                    window.open(`/event/${params.row.eventId}/content/display`, '_blank')
                }
                }><small>{t("Homework")}</small></Button>
            </>)
            )
        }
    ];


    return(
            <Grid container spacing={3} className='mt-4'>
                <Grid item xs={12}>
                        <div style={{width: 'auto', height: 'auto'}} >
                                <EDataGrid
                                    rows={rows}
                                    columns={columns}
                                    setRows={setRows}
                                    originalData={homeworksList}
                                    isVisibleToolbar={false}
                                />
                        </div>
                </Grid>
            </Grid>
    )
}