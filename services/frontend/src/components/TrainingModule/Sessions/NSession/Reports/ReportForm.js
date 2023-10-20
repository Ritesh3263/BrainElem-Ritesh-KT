import React, {useEffect, useState} from "react";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
// import SoftSkills from "./ReportsTypes/SoftSkills";
// import UserActivity from "./ReportsTypes/UserActivity";
import Chip from "@material-ui/core/Chip";
import UserService from "../../../../../services/user.service";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import SoftSkills from "../../../../Reports/ReportTypes/SoftSkills";
import UserActivity from "./ReportsTypes/UserActivity";
import {ETabBar, ETab} from "styled_components";


export default function ReportForm({currentTraineeReports=[], setCurrentTraineeReports, reportPreviewHelper, setReportPreviewHelper, currentTrainee}){
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const [currentReport, setCurrentReport]= useState({});
    const {F_showToastMessage} = useMainContext();

    useEffect(()=>{
        if(currentTraineeReports.length>0 && reportPreviewHelper.reportId){
            let foundedReport = currentTraineeReports.find(r=> r._id === reportPreviewHelper.reportId);
            if(foundedReport){
                setCurrentReport(foundedReport);
            }
        }
    },[reportPreviewHelper]);

    const reportsFormType=(type)=>{
        if(type === 'ADD'){
            return t('Add');
        }else if(type === 'EDIT'){
            return t('Edit');
        }else{
            return t('Preview');
        }
    }
    const saveReport=()=>{
        if(reportPreviewHelper.type === 'ADD'){
            UserService.addReport(currentTrainee._id, currentReport).then(res=>{
                if(res.status === 200){
                    setReportPreviewHelper({isOpen: false, type: 'SAVED', reportId: undefined});
                    F_showToastMessage(t('Report added successfully'), 'success');
                }
            }).catch(err=>{
                console.log(err);
                F_showToastMessage(t('Error while adding report'), 'error');
            })
        }else if(reportPreviewHelper.type === 'EDIT'){
            UserService.updateReport(currentTrainee._id, currentReport).then(res=>{
                if(res.status === 200){
                    setReportPreviewHelper({isOpen: false, type: 'PREVIEW', reportId: undefined});
                    // let index = currentTraineeReports.findIndex(r=> r._id === currentReport._id);
                    // currentTraineeReports[index] = res.data;
                    // setCurrentTraineeReports(currentTraineeReports);
                    F_showToastMessage(t("Report was updated"),"success");
                }
            }).catch(err=>{
                console.log(err);
                F_showToastMessage(t("Error while updating report"), "error");
            })
        }
    }



    return(
            <Paper elevation={10} className="mt-3 ml-2 p-2">
                <Grid container>
                    {/* <Grid item xs={12} className="p-2 d-flex align-items-center justify-content-start">
                        <Chip className="mr-3" label={reportsFormType(reportPreviewHelper.type)} color="primary" />
                        <Typography variant="h5" component="h5" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                            {reportPreviewHelper.type === 'ADD' ? (
                                <strong>{t('Add new report')}</strong>
                            ):(
                                <strong>{t('Trainee report')}</strong>
                            )}
                        </Typography>
                    </Grid> */}
                    <Grid item xs={12} className="p-2 d-flex justify-content-center">
                         <ETabBar
                            value={activeTab}
                            textColor="primary"
                            variant="fullWidth"
                            onChange={(e,i)=>setActiveTab(i)}
                            aria-label="tabs example"
                        >
                            <ETab label={<small>{t("Soft skills")}</small>}/>
                            <ETab label={<small>{t("User activity (demo)")}</small>} />
                        </ETabBar>
                    </Grid>
                    <Grid item xs={12} className="p-1 pt-2">
                        {(activeTab === 0) && (
                           <SoftSkills currentTrainee={currentTrainee}
                                       currentReport={currentReport}
                                       setCurrentReport={setCurrentReport}
                                       reportPreviewHelper={reportPreviewHelper}
                                       reportType={reportPreviewHelper.type}/>
                        )}
                        {(activeTab === 1) && (
                            <UserActivity reportPreviewHelper={reportPreviewHelper}
                                          currentReport={currentReport}/>
                        )}
                    </Grid>
                    <Grid item xs={12} className="p-1 pt-2">
                        <Grid container>
                            <Grid item xs={6} className="d-flex justify-content-center">
                                <Button variant="contained" size="small" color="secondary"
                                        onClick={()=>setReportPreviewHelper({isOpen: false,  type: 'PREVIEW', reportId: undefined})}>
                                    {t("Dismiss")}
                                </Button>
                            </Grid>
                            <Grid item xs={6} className="d-flex justify-content-center">
                                <Button variant="contained" size="small" color="primary"
                                        // disabled={true}
                                        onClick={()=>saveReport()}>
                                    {t("Save")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
    )
}