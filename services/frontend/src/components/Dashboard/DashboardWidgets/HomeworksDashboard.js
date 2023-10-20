import * as React from 'react';
import {EDataGrid} from "styled_components";
import SettingsIcon from "@material-ui/icons/Settings";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import {Link, useNavigate} from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {BsPencil} from "react-icons/bs";
import {Badge} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {renderCellExpand} from "../../common/Table/renderCellExpand";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {isWidthUp} from "@material-ui/core/withWidth";

const useStyles = makeStyles(theme=>({}))

const rows = [
    { id: 1, contentType: 'contentType', name: 'name', level: "level", updatedAt: "" },
];

export default function HomeworksDashboard({homeworks}) {
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_getHelper, currentScreenSize} = useMainContext();
    const {userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const isColumnVisible=()=>{
        if(!userPermissions.isParent){
            return true
        }else{
            return !isWidthUp('sm',currentScreenSize);
        }
    }

    const getTableWidth=()=>{
        if(isWidthUp('sm',currentScreenSize)){
            return 380;
        }else{
            return 220;
        }
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: true, disableColumnMenu: true, sortable: false},
        { field: 'userName', headerName: t('Children'), width: 120, hide: isColumnVisible(), flex: 1,
            // renderCell: (params)=>(params.row.children.map(x=>(<Badge key={x._id} variant="secondary">{`${x?.name} ${x?.surname}`}</Badge>)))
            renderCell:renderCellExpand
        },
        { field: 'homeworkName', headerName: t('Homework name'), width: 120, flex: 1,  renderCell:renderCellExpand },
        { field: 'startDate', headerName: t('Start date'), width: 120, type: 'date', flex: 1, hide: isColumnVisible(),
            renderCell: (params)=>(
                new Date (params.row.startDate).toLocaleDateString()
            )
        },
        { field: 'endDate', hide:true, headerName: t('End date'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.endDate ? (new Date (params.row.endDate).toLocaleDateString()) : ("-")
        },
        { field: 'subject', headerName: t('Subject'), width: 120, flex: 1 },
        { field: 'action',
            width: 140,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: (params) =>(
            (params.row.contentId && <>
                <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"  startIcon={userPermissions.isParent ? <VisibilityIcon/> :<BsPencil/>}
                        onClick={()=>{
                   window.open( userPermissions.isParent? `/content/display/${params.row.contentId}`: `/event/${params.row.eventId}/content/display`, '_blank')
                }
                }><small>{t("Homework")}</small></Button>
            </>)
            )
        }
    ];


    const homeworksList = homeworks.length>0 ? homeworks.map((item,index)=>
        ({
            id: index+1,
            children: item.assignedGroup?.trainees,
            homeworkName: item?.name,
            userName: item.assignedGroup?.trainees?.map(u=>`${u?.name} ${u?.surname??""} `),
            startDate: item.date, 
            endDate: item.endDate, 
            subject: item.assignedSubject.name, 
            contentId: item.assignedContent?._id
        })) : [];

    return (
        <div style={{width: '100%', height: (homeworksList.length>0) && getTableWidth()}} className={classes.root}>
            {homeworksList.length>0 ?(
                <EDataGrid rows={homeworksList}
                          columns={columns}
                          pageSize={5}
                          isVisibleToolbar={false}
                          rowsPerPageOptions={[5, 10, 25]}
                          disableSelectionOnClick={true}
                          classes={{root: classes.root}}/>
            ):(
                <span>{t("You don't have any homeworks")}</span>
            )}
        </div>
    );
}
