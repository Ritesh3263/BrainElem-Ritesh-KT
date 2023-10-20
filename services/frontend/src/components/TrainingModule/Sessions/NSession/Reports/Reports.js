import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import UserService from "../../../../../services/user.service";
import SoftSkillsTemplateService from "../../../../../services/soft_skills_template.service";
import MenuItem from "@material-ui/core/MenuItem";
import ReportForm from "./ReportForm";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ReportsTable from "./ReportsTable";
import Chip from "@material-ui/core/Chip";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function Reports(){
    const { t } = useTranslation();
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [trainees, setTrainees] = useState(undefined);
    const [currentTrainee, setCurrentTrainee] = useState(undefined);
    const [currentTraineeReports, setCurrentTraineeReports] = useState(undefined);
    const [reportPreviewHelper, setReportPreviewHelper] = useState({isOpen: false, type: 'PREVIEW', reportId: undefined});
    const {F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const {
        currentSession,
        isOpenSessionForm,
    } = useSessionContext();



    const handleSelectGroup=(group)=>{
        if(group){
            setSelectedGroup(group);
            setCurrentTrainee(undefined);
            setCurrentTraineeReports(undefined);
            setReportPreviewHelper({isOpen: false, type: 'PREVIEW', reportId: undefined});
            if(group?.trainees?.length>0){
                setTrainees(group.trainees)
            }
        }
    };

    const handleSelectTrainee=(tra)=>{
        setReportPreviewHelper({isOpen: false, type: 'PREVIEW', reportId: undefined});
        if(tra){
            setCurrentTrainee(tra);
            UserService.getReports(tra?._id).then(res => {
                if(res.status === 200 && res.data?.length>0){
                    setCurrentTraineeReports(res.data);
                }else{
                    setCurrentTraineeReports([]);
                }
            }).catch(err => console.log(err))
        }
    };

    useEffect(()=>{
       if(reportPreviewHelper.type === 'SAVED'){
           UserService.getReports(currentTrainee?._id).then(res => {
               if(res.status === 200 && res.data?.length>0){
                   setCurrentTraineeReports(res.data);
               }
           }).catch(err => console.log(err))
       }
    },[reportPreviewHelper.isOpen]);
    const groupsList = currentSession?.groups?.length>0 ? currentSession?.groups.map((gr, index)=>(<MenuItem key={index} value={gr}>{gr?.name}</MenuItem>)) : [];
    // if(user.role === "Trainee") load only 1 user , himself
    const traineesList = user.role === "Trainee" ? trainees?.length>0 ? trainees.filter(x=>(x._id === user.id)).map((tr, index)=>(<MenuItem key={index} value={tr}>{`${tr?.name} ${tr?.surname}`}</MenuItem>)) : [] : 
    trainees?.length>0 ? trainees.map((tr, index)=>(<MenuItem key={index} value={tr}>{`${tr?.name} ${tr?.surname}`}</MenuItem>)) : [];
    
    return(
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Reports")}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={reportPreviewHelper.isOpen ? 5 : 12} className="p-1">
                        <Grid container>
                            <Grid item xs={6} className="pr-1 d-flex justify-content-end">
                                <FormControl fullWidth margin="normal" required={true} style={{maxWidth: "400px"}}
                                             error={false}
                                             variant='filled'
                                >
                                    <InputLabel id="selectedGroup-select-label">{t("Select group")}</InputLabel>
                                    <Select
                                        name='selectedGroup'
                                        labelId="selectedGroup-select-label"
                                        id="eventType-select"
                                        value={selectedGroup}
                                        onChange={({target:{value}}) =>handleSelectGroup(value)}
                                    >
                                        {groupsList}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} className="pl-1 d-flex justify-content-start">
                                <FormControl fullWidth margin="normal" required={true} style={{maxWidth: "400px"}}
                                             error={false}
                                             variant='filled'
                                >
                                    <InputLabel id="trainee-select-label">{t("Select trainee")}</InputLabel>
                                    <Select
                                        name='trainee'
                                        labelId="trainee-select-label"
                                        id="eventType-select"
                                        value={currentTrainee}
                                        disabled={!selectedGroup}
                                        onChange={({target:{value}}) =>handleSelectTrainee(value)}
                                    >
                                        {traineesList}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} className="mt-4">
                                {currentTrainee ? (
                                <>
                                    {(isOpenSessionForm.type !== 'PREVIEW') && (user.role === 'TrainingManager') && (
                                        <Button size="small" variant="contained" color="primary"
                                                className='mb-3'
                                                disabled={(!currentTrainee || reportPreviewHelper.isOpen) }
                                                startIcon={<AddCircleOutlineIcon/>}
                                                onClick={()=>{
                                                    setReportPreviewHelper({isOpen: true, type: 'ADD', reportId: 'ADD'})
                                                }}
                                        >{t("Add new student report")}</Button>
                                    ) }
                                    <ReportsTable currentTraineeReports={currentTraineeReports}
                                                  reportPreviewHelper={reportPreviewHelper}
                                                  setReportPreviewHelper={setReportPreviewHelper}
                                    />
                                </>
                                    ) : (
                                    <div className="text-center mt-5">
                                        <Typography variant="body1" component="span" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                            {t("Select Group, then select trainee to see data")}
                                        </Typography>
                                    </div>
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                    {reportPreviewHelper.isOpen && (
                        <Grid item xs={7}>
                            <ReportForm currentTraineeReports={currentTraineeReports}
                                        setCurrentTraineeReports={setCurrentTraineeReports}
                                        reportPreviewHelper={reportPreviewHelper}
                                        setReportPreviewHelper={setReportPreviewHelper}
                                        currentTrainee={currentTrainee}
                                           />
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    )
}