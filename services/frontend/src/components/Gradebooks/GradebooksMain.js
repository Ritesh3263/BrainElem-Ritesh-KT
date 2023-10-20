import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import Gradebooks2 from "./Trainer/Gradebooks2";
import GradebookSubjectsAverage from "./SubjectsAverage/GradebookSubjectsAverage";
import TraineeGradebook2 from "./Trainee/TraineeGradebook2"
import ParentGradebook from "./Parent/ParentGradebook"
import InspectorGradebook from "./Inspector/InspectorGradebook"
import ArchitectGradebook from "./Architect/ArchitectGradebook"
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {ETabBar, ETab} from "styled_components";
import Confirm from "components/common/Hooks/Confirm";


const useStyles = makeStyles(theme=>({}))

export default function GradebooksMain(){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {manageScopeIds, userPermissions} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);
    let [isBlocking, setIsBlocking] = useState(false);
    const { isConfirmed } = Confirm();


    return(
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <div className="p-2 d-flex text-center align-items-center justify-content-center">
                        <ETabBar
                            value={currentTab}
                            onChange={async (e,i)=>{
                                if (!isBlocking) {
                                    setCurrentTab(i)
                                } else {
                                    let confirm = await isConfirmed("Are you sure you want to leave this tab without saving?");
                                    if(confirm) setCurrentTab(i);
                                }
                            }}
                        >
                            <ETab label={t("Gradebook")}/>
                            {!F_getHelper().manageScopeIds.isTrainingCenter && <ETab label={t("Subjects Averages")}/>}
                        </ETabBar>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    {currentTab === 0 ? (
                        <>
                        {(userPermissions.isTrainer || userPermissions.isClassManager || userPermissions.isArchitect) && (<Gradebooks2 isBlocking={isBlocking} setIsBlocking={setIsBlocking}/>)}
                        {(userPermissions.isTrainee ) && (<TraineeGradebook2/>)}
                        {(userPermissions.isParent) && (<ParentGradebook/>)}
                        {(userPermissions.isInspector) && (<InspectorGradebook/>)}
                        {/* {(userPermissions.isArchitect) && (<ArchitectGradebook/>)} */}
                        </>
                    ): (
                        <GradebookSubjectsAverage setIsBlocking={setIsBlocking}/>
                    )}
                </Grid>
            </Grid>
        </>
    )
}