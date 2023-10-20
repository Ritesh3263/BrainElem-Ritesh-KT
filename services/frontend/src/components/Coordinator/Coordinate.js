import {Col, ListGroup, Row} from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {CardActions, Paper} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import CertificationSessionService from "../../services/certification_session.service"

const useStyles = makeStyles(theme=>({}))

export default function Coordinate(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {userPermissions, manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { contentId } = useParams();
    const [content, setContent] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlreadyAccepted, setIsAlreadyAccepted] = useState();
    const [isAlreadyRejected, setIsAlreadyRejected] = useState();
    const [isContentUsedInSession, setIsContentUsedInSession] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    useEffect(()=>{ 
        // CertificationSessionService.issueInternship('613a35c37124ba003c4bc143', '613a352b7124ba003c4bc026').then(res => {
        //     F_showToastMessage(t("Internship credit was added"), "success");
        // }).catch(err => console.log(err))
    },[]);

return(
    <div className="p-0 fluid m-0">
        Credits
    </div>
)}