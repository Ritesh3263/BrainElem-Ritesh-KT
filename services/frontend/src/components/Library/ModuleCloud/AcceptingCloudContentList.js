import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Col, ListGroup, Row} from "react-bootstrap";
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import CloudService from "services/cloud.service"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import {useTranslation} from "react-i18next";
import {EButton, EDataGrid} from "../../../styled_components";
import AcceptingContentTable from "../ModuleLibrary/AcceptingContentTable";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
import Chip from "@material-ui/core/Chip";

import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function AcceptingCloudContentList(){

    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [awaiting, setAwaiting] = useState([]);
    const [fetchingContent, setFetchingContent] = useState([]);
    const [rows, setRows] = useState([]);
    const [statusFilter, setStatusFilter] =useState({AWAITING: true, ACCEPTED: false, REJECTED: false})
    
    const {
        setMyCurrentRoute
      } = useMainContext();

    useEffect(()=>{
        setMyCurrentRoute(t("Manage cloud"))
        CloudService.getAllContent().then(res=>{
            if(res.data.length>0){
                console.log(res.data);
                let sortedByDate =  res.data.sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))
                setFetchingContent(sortedByDate);
                handleStatusFilter(sortedByDate);
            }

        }).catch(error=>console.log(error));
    },[]);

    useEffect(()=>{
        //filter data by status
        handleStatusFilter(fetchingContent)
    },[statusFilter]);


    const awaitingList = awaiting.length>0 ? awaiting.map((item,index)=>
        ({  id: index+1,
            username: item?.username??"-",
            type: item?.contentType??"-",
            creator: item.owner ? item.owner.username : "-",
            title: item?.title??"-",
            status: item?.cloudStatus??"-",
            createdAt: item?.createdAt??"-",
            itemId: item._id
        })) : [];

    useEffect(()=>{
        setRows(awaitingList);
    },[awaiting]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'type', headerName: t('Type'), width: 120, flex: 1, renderCell: ({row:{type}}) => type ? contentType(type) : "-"  },
        { field: 'creator', headerName: t('Creator'), width: 120, flex: 1 },
        { field: 'title', headerName: t('Title'), width: 120, flex: 1 },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: ({row:{status}}) => status ? switchStatus(status) : "-" },
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
            renderCell: ({row:{itemId}}) =>(
                <IconButton size="small" color="secondary"
                            onClick={()=>{navigate(`/accepting-cloud-content/${itemId}`)}}><BsPencil/>
                </IconButton>
            )
        }
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
                return (<span><Tooltip title={t("Content is private")}><Chip label={t("private")} size="small"/></Tooltip></span>);
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


    function handleStatusFilter(data){
        let newData = data.filter(c=> {
            if(statusFilter.ACCEPTED && c.cloudStatus === 'ACCEPTED'){ // view copy
                return c
            }
            if(statusFilter.AWAITING && c.cloudStatus === 'AWAITING' && !c.approvedByCloudManager ){ // view original
                return c
            }
            if(statusFilter.REJECTED && c.cloudStatus === 'REJECTED' && !c.approvedByCloudManager ){ // view original
                return c
            }
        });
        setAwaiting(newData);
    }


    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                    <EButton eSize="small" eVariant="primary"
                             startIcon={<KeyboardArrowLeftIcon/>}
                             onClick={()=>{navigate("/module-cloud")}}
                    >{t("Storage")}</EButton>
                </div>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body1"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Status")} :
                </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusFilter.AWAITING}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,AWAITING: !p.AWAITING}))
                            }}
                            name="checked-1"
                            color="primary"
                        />
                    }
                    label={t("Awaiting")}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusFilter.REJECTED}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,REJECTED: !p.REJECTED}))
                            }}
                            name="checked-3"
                            color="primary"
                        />
                    }
                    label={t("Rejected")}
                />
            </Grid>
            <Grid item xs={12} md={4}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={statusFilter.ACCEPTED}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,ACCEPTED: !p.ACCEPTED}))
                            }}
                            name="checked-2"
                            color="primary"
                        />
                    }
                    label={t("Accepted")}
                />
            </Grid>
            <Grid item xs={12}>
                <div style={{width: 'auto', height: 'auto'}} >
                    <EDataGrid
                        rows={rows}
                        setRows={setRows}
                        columns={columns}
                        originalData={awaitingList}
                    />
                </div>
            </Grid>
        </Grid>
    )
}