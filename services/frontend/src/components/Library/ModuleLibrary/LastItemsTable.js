import React, { useState} from "react";
import {useNavigate} from "react-router-dom";
import {EDataGrid} from "styled_components";
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import Chip from '@material-ui/core/Chip';
import SettingsIcon from "@material-ui/icons/Settings";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function LastItemsTable(props){
    const{
        awaiting=[],
        lastActivity=[],
        type
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();

    const columns1 = [
        // { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        // { field: 'type', headerName: t('Type'), width: 120, flex: 1, renderCell: (params) => params.row.type ? contentType(params.row.type) : "-"  },
        { field: 'creator', headerName: t('Creator'), width: 120, flex: 1 },
        { field: 'title', headerName: t('Title'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: (params) => params.row.status ? switchStatus(params.row.status) : "-" },
        { field: 'action',
            width: 50,
            sortable: false,
            disableColumnMenu: true,
            headerAlign: 'center',
            cellClassName: 'super-app-theme--cell',
            align: 'center',
            renderHeader: ()=>(<SettingsIcon/>),
            renderCell: ({row:{itemId}}) =>(
                <IconButton size="small" color="secondary"
                     onClick={()=>{
                         if(user.role === 'Librarian') {
                             navigate(`/accepting-library-content/${itemId}`)
                         }else{
                             navigate(`/accepting-cloud-content/${itemId}`)
                         }
                     }}
                ><BsPencil/>
                </IconButton>
            )
        }
    ];

    const columns2 = [
        // { field: 'id', headerName: 'ID', width: 50, hide: false, sortable: false, disableColumnMenu: true},
        // { field: 'type', headerName: t('Type'), width: 120, flex: 1, renderCell: (params) => params.row.type ? contentType(params.row.type) : "-"  },
        { field: 'creator', headerName: t('Creator'), width: 120, flex: 1 },
        { field: 'title', headerName: t('Title'), width: 120, flex: 1 },
        { field: 'createdAt', headerName: t('Created At'), width: 120, type: 'date', flex: 1,
            renderCell: (params)=> params.row.createdAt ? (new Date (params.row.createdAt).toLocaleDateString()) : ("-")
        },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: (params) => params.row.status ? switchStatus(params.row.status) : "-" },
        // { field: 'action',
        //     width: 50,
        //     sortable: false,
        //     disableColumnMenu: true,
        //     headerAlign: 'center',
        //     cellClassName: 'super-app-theme--cell',
        //     align: 'center',
        //     renderHeader: ()=>(<SettingsIcon/>),
        //     renderCell: (params) =>(
        //         <IconButton size="small">
        //             <button className="btn" onClick={()=>{navigate(`/accepting-library-content/${params.row.itemId}`)}}><BsPencil/></button>
        //         </IconButton>
        //     )
        // }
    ];


    function switchStatus(status){
        switch (status) {
            case "AWAITING":{
                return (<span className="text-muted"><Tooltip title={t("Content waiting for accepted")}><HourglassFullIcon/></Tooltip></span>);
            }
            // case "UPLOADED":{
            //     return (<span className="text-warning"><Tooltip title="Content was updated and waiting for accepted"><CloudUploadIcon/></Tooltip></span>);
            // }
            case "ACCEPTED":{
                return (<span className="text-success"><Tooltip title={t("Content was accepted")}><CloudDoneIcon/></Tooltip></span>);
            }
            case "REJECTED":{
                return (<span className="text-danger"><Tooltip title={t("Content was rejected")}><CloudOffIcon/></Tooltip></span>);
            }
            case "PRIVATE":{
                return (<span><Tooltip title={t("Content is private")}><Chip label="private" size="small"/></Tooltip></span>);
            }
            default :{
                return (<span><Chip label="undefined" color="secondary" size="small"/></span>);
            }
        }
    }

    function contentType(item){
        if(item.contentType === "PRESENTATION"){
            return "P"
        }else if(item.contentType === "TEST"){
            return "T"
        }else{
            return item.contentType;
        }
    }

    const awaitingList = awaiting.length>0 ? awaiting.map((item,index)=>
        ({  id: index+1,
            username: item.username,
            type: item,
            creator: item.owner ? item.owner.username : "-",
            title: item.title,
            status: item.status,
            createdAt: item.createdAt,
            itemId: item._id
        })) : [];

    const lastActivityList = lastActivity.length>0 ? lastActivity.map((item,index)=>
        ({  id: index+1,
            username: item.username,
            type: item,
            creator: item.owner ? item.owner.username : "-",
            title: item.title,
            status: item.status,
            createdAt: item.createdAt,
            itemId: null
        })) : []

    return(
        <>
            {type === "AWAITING" ? (
                <>
                    <div className="d-flex px-2 justify-content-between">
                    <Typography variant="h5" component="h3" className="text-left">
                            {t("Awaiting list")}
                        </Typography>
                    </div>
                <div style={{width: 'auto', height: 'auto'}} >
                        <EDataGrid
                            rows={awaitingList}
                            columns={columns1}
                            setRows={()=>{}}
                            originalData={awaitingList}
                            isVisibleToolbar={false}
                        />
                </div>
                </>
            ):(
                <>
                    <div className="d-flex px-2 justify-content-between">
                    <Typography variant="h5" component="h3" className="text-left" >
                            {t("Last activity")}
                        </Typography>
                    </div>
                <div style={{width: 'auto', height: 'auto'}}>
                <EDataGrid
                    rows={lastActivityList}
                    originalData={lastActivityList}
                    setRows={()=>{}}
                    columns={columns2}
                    isVisibleToolbar={false}
                />
                </div>
                </>
            )}
        </>
    )
}