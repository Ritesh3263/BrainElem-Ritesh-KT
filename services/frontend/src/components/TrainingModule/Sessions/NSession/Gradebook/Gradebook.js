import React, {lazy, useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import TraineeGradebook from "./Trainee/TraineeGradebook";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import TrainerGradebook from "./Trainer/TrainerGradebook";
// import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";


export default function Gradebook(){
    const { t } = useTranslation();
    const {F_getHelper} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    const [groupName, setGroupName] = useState([]);
    // const {currentSession} = useSessionContext();

    // useEffect(()=>{
    //     currentSession.groups.map(x=>{
    //         if(x.trainees.some(e => e._id === user.id)) {
    //             setGroupName(x.name)
    //         }
    //     })
    // });

    return(
        <Grid container>
            <Grid item xs={12}>
                {userPermissions.isTrainee ? (
                    // <TraineeGradebook groupName={groupName}/>
                    <TraineeGradebook/>
                ) : (
                    <TrainerGradebook/>
                )}
            </Grid>
        </Grid>
    )
}