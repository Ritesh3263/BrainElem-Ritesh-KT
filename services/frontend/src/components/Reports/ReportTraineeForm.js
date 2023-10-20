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
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SoftSkills from "./ReportTypes/SoftSkills";
import UserActivity from "./ReportTypes/UserActivity";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "../../styled_components";
import Confirm from "components/common/Hooks/Confirm";

const useStyles = makeStyles(theme=>({}));

export default function ReportTraineeForm(){
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
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
        // date: null,
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

        // UserService.getGroupIds(traineeId).then(res=>{
        //     if(res.status === 200){
        //         setCurrentReport(p=>({...p,group: res.data[0]}))
        //     }
        // }).catch(error=>console.log(error));

        UserService.read(traineeId).then(res=>{
            setCurrentTrainee(res.data);
        }).catch(error=>console.log(error));
    },[]);

    function save(){
        if(reportId === "new"){
            // add new
            // softSkillsTemplateService.add(currentReport).then(res=>{
            UserService.addReport(traineeId,currentReport).then(res=>{
                if(res.status === 200){
                    F_showToastMessage(t("Report was added success"),"success");
                    navigate("/reports")
                }
            }).catch(error=>console.log(error))
        }else{
            // softSkillsTemplateService.update(currentReport).then(res=>{
            UserService.updateReport(traineeId,currentReport).then(res=>{
                if(res.status === 200){
                    F_showToastMessage(t("Report was updated success"),"success");
                    navigate("/reports")
                }
            }).catch(error=>console.log(error))
        }
    }

    async function remove(){
        let confirm = await isConfirmed(t("Are you sure you want to remove this report?"));
        if(!confirm) return;
        UserService.removeReport(traineeId,currentReport._id).then(res=>{
            if(res.status === 200){
                F_showToastMessage(t("Report was removed success"),"success");
                navigate("/reports")
            }
        }).catch(error=>console.log(error))
    }

    return(
        <Card className="p-0 d-flex flex-column m-0">
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${currentTrainee ? currentTrainee.name +" "+ currentTrainee.surname : "-"}`}
                </Typography>
            )} 
            />

            <CardContent>
                {/* <Grid container>
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
                </Grid> */}
                {/*<ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" style={{width:"100%"}} className="d-flex justify-content-center">*/}
                {/*     /!* <Button variant="contained" color={`${currentTab === 0 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(0)}>{t("Report")}</Button> *!/*/}
                {/*     <Button disabled={false} variant="contained" color={`${currentTab === 1 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(1)}>{t("Soft skills")}</Button>*/}
                {/*     <Button disabled={false} variant="contained" color={`${currentTab === 2 ? "primary" : "secondary"}`} style={{width:"20%"}} onClick={()=>setCurrentTab(2)}>{t("User's activity (demo)")}</Button>*/}
                {/*</ButtonGroup>*/}

                {/* { currentTab === 0 && (<ProAndCon currentTrainee={currentTrainee} currentReport={currentReport} setCurrentReport={setCurrentReport} reportType={"EDIT"}/>)} */}
                { currentTab === 0 && (<SoftSkills currentTrainee={currentTrainee} currentReport={currentReport}
                                                   setCurrentReport={setCurrentReport} reportType={reportId === 'new' ? 'ADD' : "EDIT"}/>)}
                { currentTab === 1 && (<UserActivity currentTrainee={currentTrainee} currentReport={currentReport}
                                                     setCurrentReport={setCurrentReport} reportType={"EDIT"}/>)}
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage(t("No change"),)
                                navigate("/reports")
                            }}>
                                {t("Back")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {reportId !== "new" ?
                                <Button onClick={remove} variant="contained" size="small" color="inherit">
                                    {t("Remove")}
                                </Button> : null}
                            <Button onClick={save} size="small" variant="contained" color="primary" className="ml-5">
                                {t("Save")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
        </Card>
    )
}