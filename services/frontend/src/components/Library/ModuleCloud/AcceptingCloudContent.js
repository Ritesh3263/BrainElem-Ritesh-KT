import {Col, ListGroup, Row} from "react-bootstrap";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import CloudOffIcon from "@material-ui/icons/CloudOff";
import CloudService from "services/cloud.service"
import ContentService from "services/content.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import DisplayContent from "components/Content/Display/DisplayContent";
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import BurstModeIcon from '@material-ui/icons/BurstMode';
import SaveIcon from '@material-ui/icons/Save';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import {EButton, ETab, ETabBar} from "../../../styled_components";
import {Paper} from "@material-ui/core";

import {Box} from "@mui/material"

const useStyles = makeStyles(theme=>({}))

export default function AcceptingCloudContent(){
    const { t } = useTranslation();
    const classes = useStyles();
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const navigate = useNavigate();
    const { contentId } = useParams();
    const [savingOptions, setSavingOptions] = useState(false);
    const [content, setContent] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isAlreadyAccepted, setIsAlreadyAccepted] = useState();
    const [isAlreadyRejected, setIsAlreadyRejected] = useState();
    const [isContentUsedInSession, setIsContentUsedInSession] = useState();
    const [currentTab, setCurrentTab] = useState(0);
    useEffect(()=>{
        
        ContentService.getContent(contentId).then(res=>{
            if(res.data){
                setContent(res.data);
                if(res.data.cloudStatus === "ACCEPTED"){
                    setIsAlreadyAccepted(true)
                }
                else if (res.data.cloudStatus === "REJECTED"){
                    setIsAlreadyRejected(true)
                }
                else{
                    setIsAlreadyAccepted(false)
                    setIsAlreadyRejected(false)
                } 
                
            }
        }).catch(err=>console.log(err))
        setTimeout(()=>{
            setIsOpen(true);
        },500);
    
        ContentService.isContentUsedInSession(contentId).then(res=>{
                setIsContentUsedInSession(res.data.isUsed)   
            }).catch(err=>console.log(err))
    },[]);

    
    function switchStatus(cloudStatus){
        switch (cloudStatus) {
            case "AWAITING":{
                return (<span className="text-muted"><HourglassFullIcon /></span>);
            }
            // case "UPLOADED":{
            //     return (<span className="text-warning"><CloudUploadIcon/></span>);
            // }
            case "ACCEPTED":{
                return (<span className="text-success"><CloudDoneIcon/></span>);
            }
            case "REJECTED":{
                return (<span className="text-danger"><CloudOffIcon/></span>);
            }
            default :{
                return (<span>unknown</span>);
            }
        }
    };

    async function changeContentStatus(type){
        if(type === "accept"){
            await setContent(p=>{
                let val = Object.assign({},p);
                val.cloudStatus = "ACCEPTED"
                return val;
            })
        }else if(type === "reject"){
            await setContent(p=>{
                let val = Object.assign({},p);
                val.cloudStatus = "REJECTED"
                return val;
            })
        }
    }

    function editContent(){
        window.localStorage.setItem(content.contentType, JSON.stringify(content));
        navigate(`/edit-${content.contentType.toLowerCase()}/${contentId}`);
    }

    async function actionType(type){
        await changeContentStatus(type).then(()=>{
            switch (type){
                case "accept":{
                    let newContent = {...content,cloudStatus: "ACCEPTED"}
                        CloudService.manageContentStatus(newContent).then(res=>{
                            console.log(res);
                            F_showToastMessage(t("Data was saved success","success"));
                            navigate("/accepting-cloud-content")
                        }).catch(err=>console.error(err))
                    break;
                }
                case "reject":{
                    let newContent = {...content,cloudStatus: "REJECTED"}
                    CloudService.manageContentStatus(newContent).then(res=>{
                        console.log(res);
                        F_showToastMessage(t("Data was saved success","success"));
                        navigate("/accepting-cloud-content")
                    }).catch(err=>console.error(err))
                    break
                }
                default: break;
            }
        })
    }

return(
    <Box sx={{height: {xs: '65%', sm: "70%", md: "80%", "lg": '85%', 'xl': '88%'}}} className="p-0 fluid m-0">
        <ListGroup>
                <Card className="p-3 mb-2">
                    <Grid container>
                        <Grid item xs={12} sm={6} lg={4}>
                            <EButton eSize="small" eVariant="primary"
                                    startIcon={<KeyboardArrowLeftIcon/>}
                                    onClick={()=>{navigate("/accepting-Cloud-content")}}
                            >{t("Back to list")}</EButton>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4}>
                            <Grid container>
                                <Grid item xs={12} md={6} className="d-flex justify-content-center p-2">
                                    <span>{t("Library status")}: {switchStatus(content.cloudStatus)} <strong>{t(content.cloudStatus)}</strong></span>
                                </Grid>
                                <Grid item xs={12} md={6} className="d-flex justify-content-center p-2">
                                    <span>{t("Author")}: <strong>{content.owner ? content.owner.name+" "+content.owner.surname : "-"}</strong></span>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={4} className="d-flex justify-content-end align-items-center">
                            <Button variant="danger" className="mr-5"
                                    startIcon={<ClearIcon/>}
                                    size="small" color="inherit"
                                    disabled = {!!isAlreadyRejected || !!isContentUsedInSession }
                                    onClick={()=>actionType("reject").then()}
                            >{t("Reject")}</Button>
                            <Button size="small" variant="contained" color="primary"
                                    startIcon={<CheckIcon/>}
                                    disabled = {isAlreadyAccepted}
                                    onClick={()=>actionType("accept")}
                            >{t("Accept")}</Button>
                        </Grid>
                    </Grid>
                </Card>
        </ListGroup>



       <DisplayContent isPreview={true} show={isOpen} hideTopBar={true} showSettingsTab={true}></DisplayContent>

    </Box>
)
}