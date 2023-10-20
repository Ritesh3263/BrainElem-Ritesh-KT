import React, {useEffect, useState} from "react";
import {Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import {now} from "moment";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import FormGeneral from "./FormGeneral";
import FormStudents from "./FormStudents";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETab, ETabBar} from "../../../../../styled_components";


const internshipInit = {
    name: '',
    description: '',
    internshipLocation: '',
    guidelines: '',
    duration: '2 week',
    status: true,
    attachedGuidelines: '',
    category:'',
    startTime: new Date(now()).toISOString(),
    assignedCoordinator:{}
};

export default function InternshipForm({isOpenInternshipHelper, setIsOpenInternshipHelper}){
    const { t } = useTranslation();
    const {currentSession} = useSessionContext();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const [currentInternship,setCurrentInternship] = useState({});
    const [activeTab,setActiveTab] = useState(0);

    useEffect(()=>{
        if(isOpenInternshipHelper.isOpen && isOpenInternshipHelper.internshipId){
           let foundedCurrentInternship = currentSession?.internships?.find(intern=> intern._id === isOpenInternshipHelper.internshipId);
           if(foundedCurrentInternship){
               setCurrentInternship(foundedCurrentInternship);
           }else{
               setCurrentInternship(internshipInit);
           }
        }
    },[isOpenInternshipHelper, currentSession]);

    return(
        <Paper elevation={10} className="p-2">
            <Grid container>
                <Grid item xs={12} className="p-2 d-flex align-items-center justify-content-between">
                    <Typography variant="h5" component="h5" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        <strong>{currentInternship?.name || '-'}</strong>
                    </Typography>
                    {/* <Chip label={currentInternship?.category?.toLowerCase() || "-"}
                          size="medium" variant="outlined"
                          style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.9)'}}
                    /> */}
                </Grid>
                {(userPermissions.isTrainingManager || userPermissions.isArchitect || userPermissions.isCoordinator) && (
                <Grid item xs={12} className="p-2 d-flex justify-content-center">
                        <ETabBar  className="mt-3"
                            value={activeTab}
                            onChange={(e,i)=>setActiveTab(i)}
                            eSize='small'
                        >
                            <ETab label='General' eSize='small'/>
                            <ETab  label='Trainees' eSize='small'/>
                        </ETabBar>
                </Grid>
                )}
                <Grid item xs={12} className="p-1 pt-2">
                    {(activeTab === 0) && (
                        <FormGeneral currentInternship={currentInternship} isOpenInternshipHelper={isOpenInternshipHelper}/>
                    )}
                    {(activeTab === 1) && (
                        <FormStudents students={currentInternship?.students}/>
                    )}
                </Grid>
                <Grid item xs={12} className="p-1 pt-2">
                    <Grid container>
                        <Grid item xs={6} className="d-flex justify-content-start">
                            <Button variant="contained" size="small" color="secondary"
                                    onClick={()=>setIsOpenInternshipHelper({isOpen: false,  type: 'PREVIEW', internshipId: undefined})}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        {/* {(userPermissions.isTrainingManager || userPermissions.isArchitect) && (
                        <Grid item xs={6} className="d-flex justify-content-center">
                            <Button variant="contained" size="small" color="primary"
                                    onClick={()=>{window.open(`/internships`, '_blank')}}>
                                <VisibilityIcon/>
                            </Button>
                        </Grid>
                        )} */}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}