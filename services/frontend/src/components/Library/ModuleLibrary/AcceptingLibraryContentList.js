import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import Avatar from '@material-ui/core/Avatar';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@mui/material/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CloudOffIcon from '@material-ui/icons/CloudOff';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import IconButton from "@material-ui/core/IconButton";
import {BsPencil} from "react-icons/bs";
import LibraryService from "services/library.service"
import { makeStyles} from "@material-ui/core/styles";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import AcceptingContentTable from "./AcceptingContentTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton} from "styled_components";

const useStyles = makeStyles(theme=>({}))

export default function AcceptingLibraryContentList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [awaiting, setAwaiting] = useState([]);
    const [fetchingContent, setFetchingContent] = useState([]);
    const {setMyCurrentRoute} = useMainContext();

    const [statusFilter, setStatusFilter] =useState({AWAITING: true, ACCEPTED: false, REJECTED: false, TOARCHIVE: false})

    useEffect(()=>{
        LibraryService.getAllContent().then(res=>{
            //setAwaiting(res.data);
            if(res.data.length>0){
                console.log(res.data);
                let sortedByDate =  res.data.sort((a,b)=>new Date(b.updatedAt) - new Date(a.updatedAt))
                setFetchingContent(sortedByDate);
                handleStatusFilter(sortedByDate);
            }

        }).catch(error=>console.log(error))
        setMyCurrentRoute("Module library overview")
    },[]);

    useEffect(()=>{
        //filter data by status
        handleStatusFilter(fetchingContent)
    },[statusFilter])


    function handleStatusFilter(data) {
        let newData = data.filter(c => { // added logic in the backend
            if (statusFilter.ACCEPTED && c.libraryStatus === 'ACCEPTED') { // view copy
                return c
            }
            if (statusFilter.TOARCHIVE && c.archiveContentFromLibraryRequested === true) { // show contents to be archived
                return c
            }
            if (statusFilter.AWAITING && c.libraryStatus === 'AWAITING') { // view original
                return c
            }
            if (statusFilter.REJECTED && c.libraryStatus === 'REJECTED') { // view original
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
                                    onClick={()=>{navigate("/module-library")}}
                            >{t("Module Library overview")}</EButton>
                        </div>
                </Grid>
                <Grid item xs={12}>
                    <AcceptingContentTable awaiting={awaiting} statusFilter={statusFilter} setStatusFilter={setStatusFilter}/>
                </Grid>
            </Grid>
    )
}