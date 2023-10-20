import React, {useEffect, useState} from "react";
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
import {makeStyles} from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {useTranslation} from "react-i18next";
import Grid from '@mui/material/Grid';
import Typography from "@material-ui/core/Typography";
import { theme } from "MuiTheme";
import { withStyles } from "@material-ui/core/styles";

// MUIv5
import SvgIcon from "@material-ui/core/SvgIcon";

//Icons
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';

const CheckboxWithWhiteCheck = withStyles({
    root: {
      "&$checked": {
        "& .MuiIconButton-label": {
          position: "relative",
          zIndex: 0,
        },
        "& .MuiIconButton-label:after": {
          content: '""',
          left: 4,
          top: 4,
          height: 15,
          width: 15,
          position: "absolute",
          backgroundColor: theme.palette.neutrals.white,
          zIndex: -1,
          borderColor: "transparent"
        }
      },
    },
    checked: {}
  })(Checkbox);

const useStyles = makeStyles(theme=>({}))

export default function AcceptingContentTable(props){
    const{
        awaiting=[],
        statusFilter,
        setStatusFilter
    }=props;
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [rows, setRows] = useState([]);
    const [filterModel, setFilterModel] = useState({
        items: [{ columnField: 'status', operatorValue: 'Status', value: 'AWAITING' }],
    });

    const awaitingList = awaiting.length>0 ? awaiting.map((item,index)=>
        ({  id: index+1,
            username: item?.username??"-",
            type: item?.contentType??"-",
            creator: item.owner ? item.owner.username : "-",
            title: item?.title??"-",
            status: item?.libraryStatus??"-",
            archiveContentFromLibraryRequested: item?.archiveContentFromLibraryRequested??"-",
            createdAt: item?.createdAt??"-",
            itemId: item._id
        })) : [];

    useEffect(()=>{
        setRows(awaitingList);
    },[awaiting]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 50, hide: false, disableColumnMenu: true, sortable: false},
        { field: 'type', headerName: t('Type'), width: 120, flex: 1, renderCell: (params) => params.row.type ? contentType(params.row.type) : "-"  },
        { field: 'creator', headerName: t('Creator'), width: 120, flex: 1 },
        { field: 'title', headerName: t('Title'), width: 120, flex: 1 },
        { field: 'status', headerName: t('Status'), width: 120, flex: 1, renderCell: (params) => params.row.status ? switchStatus(params.row.status, params.row.archiveContentFromLibraryRequested) : "-" },
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
                     onClick={()=>{navigate(`/accepting-library-content/${params.row.itemId}`)}}><BsPencil/>
                </IconButton>
            )
        }
    ];
    

    function switchStatus(status, toArchive){
        switch (status) {
            case "AWAITING":{
                return (<span className="text-muted"><Tooltip title={t("Content waiting for accepted")}><HourglassFullIcon/></Tooltip></span>);
            }
            // case "UPLOADED":{
            //     return (<span className="text-warning"><Tooltip title="Content was updated and waiting for accepted"><CloudUploadIcon/></Tooltip></span>);
            // }
            case "ACCEPTED":{
                if(toArchive === true){
                    return (<SvgIcon viewBox="0 0 32 32" component={DeleteIcon} title={t("Content waits to be archived")} />)
                }
                else{
                    return (<span className="text-success"><Tooltip title={t("Content was accepted")}><CloudDoneIcon/></Tooltip></span>);
                }
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


    return(
        <Grid container className='px-2'>
            <Grid item xs={12}>
                <Typography variant="body1"
                            component="h6" className="text-left"
                            style={{color: `rgba(82, 57, 112, 1)`, fontSize:"22px"}}>
                    {t("Status")} :
                </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControlLabel
                    control={
                        <CheckboxWithWhiteCheck style={{color:`#A85CFF`}}
                            checked={statusFilter.AWAITING}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,AWAITING: !p.AWAITING}))
                            }}
                            name="checked-1"
                            color="secondary"
                        />
                    }
                    label = {<Typography style={{fontSize:"20px"}}>{t("Awaiting")}</Typography>}
                    
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControlLabel
                    control={
                        <CheckboxWithWhiteCheck style={{color:`#A85CFF`}}
                            checked={statusFilter.ACCEPTED}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,ACCEPTED: !p.ACCEPTED}))
                            }}
                            name="checked-2"
                            color="secondary"
                        />
                    }
                    label = {<Typography style={{fontSize:"20px"}}>{t("Accepted")}</Typography>}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControlLabel
                    control={
                        <CheckboxWithWhiteCheck style={{color:`#A85CFF`}}
                            checked={statusFilter.REJECTED}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,REJECTED: !p.REJECTED}))
                            }}
                            name="checked-3"
                            color="secondary"
                        />
                    }
                    label = {<Typography style={{fontSize:"20px"}}>{t("Rejected")}</Typography>}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControlLabel
                    control={
                        <CheckboxWithWhiteCheck style={{color:`#A85CFF`}}
                            checked={statusFilter.TOARCHIVE}
                            onChange={()=>{
                                setStatusFilter(p=>({...p,TOARCHIVE: !p.TOARCHIVE}))
                            }}
                            name="checked-4"
                            color="secondary"
                        />
                    }
                    label = {<Typography style={{fontSize:"20px"}}>{t("To archive")}</Typography>}
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