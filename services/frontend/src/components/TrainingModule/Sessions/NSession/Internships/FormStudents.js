import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import GroupsList from "../EnrolledStudents/GroupsList";

export default function FormStudents({students=[]}){
    const { t } = useTranslation();
    const {
        isOpenSessionForm,
        currentSession,
    } = useSessionContext();
    const [assignTraineeSecondHelper,setAssignTraineeSecondHelper] = useState({isOpen: false, currentGroupId: undefined, currentGroupIndex: undefined});
    const [isOpenDrawer, setIsOpenDrawer] = useState({isOpen: false, groupId: undefined, groupIndex: undefined});

    const groupsList = currentSession?.groups?.length>0 ? currentSession?.groups.map((item, index)=>(
        <GroupsList item={item} index={index}
                    fromSessionInternship={true}
                    assignTraineeSecondHelper={assignTraineeSecondHelper}
                    setAssignTraineeSecondHelper={setAssignTraineeSecondHelper}
                    isOpenDrawer={isOpenDrawer}
                    setIsOpenDrawer={setIsOpenDrawer}
        />)) : [];
    return(
        <Grid container>
            <Grid item xs={12} className="mt-4" >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader" className="text-center" style={{color: `rgba(82, 57, 112, 1)`}}>{t("Groups")}</ListSubheader>
                    }
                >
                    {groupsList}
                </List>
            </Grid>
        </Grid>
    )
}