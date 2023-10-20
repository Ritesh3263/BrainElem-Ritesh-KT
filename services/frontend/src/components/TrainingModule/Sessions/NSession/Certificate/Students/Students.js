import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../../../../_ContextProviders/SessionProvider/SessionProvider";
import { ThemeProvider, Typography, Grid, List } from "@mui/material";
import ListSubheader from "@material-ui/core/ListSubheader";
import GroupsList from "../../EnrolledStudents/GroupsListForCertification";
import StudentForm from "./StudentForm";
import { new_theme } from "NewMuiTheme";
import "../Certificate.scss";

export default function Students({ students = [] }) {
    const { t } = useTranslation();
    const [studentFormHelper, setStudentFormHelper] = useState({ isOpen: false, type: 'PREVIEW', groupIndex: undefined, studentId: undefined });
    const {
        isOpenSessionForm,
        currentSession,
    } = useSessionContext();

    const [assignTraineeSecondHelper, setAssignTraineeSecondHelper] = useState({ isOpen: false, currentGroupId: undefined, currentGroupIndex: undefined });
    const [isOpenDrawer, setIsOpenDrawer] = useState({ isOpen: false, groupId: undefined, groupIndex: undefined });

    const groupsList = currentSession?.groups?.length > 0 ? currentSession?.groups.map((item, index) => (
        <GroupsList item={item} index={index}
            formCertificate
            setStudentFormHelper={setStudentFormHelper}
            assignTraineeSecondHelper={assignTraineeSecondHelper}
            setAssignTraineeSecondHelper={setAssignTraineeSecondHelper}
            isOpenDrawer={isOpenDrawer}
            setIsOpenDrawer={setIsOpenDrawer}
        />)) : [];
    return (
        <ThemeProvider theme={new_theme}>
            <Grid container sx={{mt: 4}} spacing={4}>
                {/* {!studentFormHelper.isOpen && <> */}
                    <Grid item xs={studentFormHelper.isOpen ? 6 : 12} sx={{paddingTop: '0 !important'}}>
                        <List
                        sx={{paddingTop:0}}
                            component="nav"
                            aria-labelledby="nested-list-subheader">
                            {groupsList}
                        </List>
                    </Grid>
                {/* </>
                } */}
                {studentFormHelper.isOpen && studentFormHelper.studentId && <>
                    <Grid item xs={6} sx={{paddingTop: '0 !important'}}>
                        <StudentForm studentFormHelper={studentFormHelper} setStudentFormHelper={setStudentFormHelper} />
                    </Grid>
                </>}
            </Grid>
        </ThemeProvider>
    )
}