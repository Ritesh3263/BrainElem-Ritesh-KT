import React, {useEffect, useState} from "react";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import {useNavigate, useParams} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import UserService from "services/user.service"
import SoftSkills from "./ReportTypes/SoftSkills";
import UserActivity from "./ReportTypes/UserActivity";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "styled_components";

const useStyles = makeStyles(theme=>({}));

export default function ReportTraineePreview(){
    const { t } = useTranslation();
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const navigate = useNavigate();
    const classes = useStyles();
    const { groupId, traineeId, reportId } = useParams();
    const [softSkills,setSoftSkills]=useState([]);

    const [currentReport, setCurrentReport]=useState({
        creator: user.id,
        group: groupId,
        trainee: traineeId,
        comment: "",
        softSkillsTemplate: null,
        softSkills: [],
    });
    const [currentTab, setCurrentTab] = useState(0)
    const [currentTrainee, setCurrentTrainee]=useState({
        name:"",
        surname:""
    });

    useEffect(()=>{
        if(reportId !== "new"){
            UserService.getReport(traineeId,reportId).then(res=>{
                if(res.status === 200){
                    setCurrentReport(res.data)
                }
            }).catch(error=>console.log(error));
        }

        UserService.read(traineeId).then(res=>{
            if(res.status === 200){
                setCurrentTrainee(res.data);
            }
        }).catch(error=>console.log(error));
    },[]);



    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${reportId === "new" ? "Create new report for: " : "Edit report: "} ${currentTrainee ? currentTrainee.name +" "+ currentTrainee.surname : "-"}`}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${currentTrainee ? currentTrainee.name +" "+ currentTrainee.surname : "-"}`}
                </Typography>
            )} avatar={<Chip label={reportId==="new" ? t("Add"):t("Edit")} color="primary" />}
            />

            <CardContent>
                <Grid container>
                    <Grid item xs={12} md={6} lg={4}>
                        <ETabBar style={{minWidth:'200px'}}
                                 className="mt-3"
                                 value={currentTab}
                                 onChange={(e,i)=>setCurrentTab(i)}
                                 eSize='small'
                        >
                            <ETab  style={{minWidth:'100px'}}  label='Soft skills' eSize='small'/>
                            <ETab   style={{minWidth:'100px'}}  label={`User's activity (demo)`} eSize='small'/>
                        </ETabBar>
                    </Grid>
                </Grid>
                {/*<ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" style={{width:"100%"}} className="d-flex justify-content-center">*/}
                {/*    /!* <Button variant="contained" color={`${currentTab === 0 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(0)}>{t("Report")}</Button> *!/*/}
                {/*    <Button disabled={false} variant="contained" color={`${currentTab === 1 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(1)}>{t("Soft skills")}</Button>*/}
                {/*    <Button disabled={true} variant="contained" color={`${currentTab === 2 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(2)}>{t("User's activity (demo)")}</Button>*/}
                {/*</ButtonGroup>*/}

                {/* { currentTab === 0 && (<ProAndCon currentTrainee={currentTrainee} currentReport={currentReport} setCurrentReport={setCurrentReport} reportType={"EDIT"}/>)} */}
                { currentTab === 0 && (<SoftSkills currentTrainee={currentTrainee} currentReport={currentReport}
                                                   setCurrentReport={setCurrentReport} reportType={'PREVIEW'}/>)}
                { currentTab === 1 && (<UserActivity currentTrainee={currentTrainee} currentReport={currentReport}
                                                     setCurrentReport={setCurrentReport} reportType={"PREVIEW"}/>)}
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                navigate("/reports")
                            }}>
                                {t("Back")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}