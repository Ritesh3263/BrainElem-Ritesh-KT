import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventService from "services/event.service";
import { useTranslation } from "react-i18next";
import ExamsTable from "./ExamsTable";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import { now } from "moment";
import EventModal from "components/Calendar/helpers/EventModal";

// MUI v5
import { Typography, Grid, ThemeProvider } from "@mui/material";
import EButton from "styled_components/Button";
// MUI v4
import { theme } from 'MuiTheme'
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
const palette = theme.palette

export default function ExamList({currentSessionId}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const { userPermissions, manageScopeIds, user } = F_getHelper();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [fromContentDataForEvent, setFromContentDataForEvent] = useState(null);
    const [eventInfo, setEventInfo] = useState({
        type: "ADD_FROM_GRADEBOOK",
        date: new Date(now()).toISOString(),
        eventType: "Exam",
        assignedGroup: "",
        assignedSubject: ""
    });

    useEffect(() => {
        if (!isOpenModal) {
            if (userPermissions.isParent) EventService.getExamEventsforParent().then(res => {
                setExams(res.data)
            }).catch(error => console.log(error))
            // TO DO - LOAD EVENTs via new getExamEventsforTeacher(sessionId)
            else EventService.getExamEventsforSession(currentSessionId).then(res => { setExams(res.data) }).catch(error => console.log(error))
        }
    }, [isOpenModal]);

    async function updateEvent({ type, data }) {
        let newData = { ...data, addedFromGradebook: false }
        switch (type) {
            case "add": {
                await EventService.add(newData).then(res => {
                    F_showToastMessage("Event was added success", "success");
                }).catch(error => console.log(error))
                break;
            }
            default: break;
        }
    }
    return (
    
        <ThemeProvider theme={new_theme}>
            <Grid container xs={12}>
                <Grid container>
                    <Grid item xs={12}>

                        <div style={{ width: 'auto', height: 'auto', borderRadius: "8px", backgroundColor: theme.palette.shades.white30 }} >
                            <Grid container justifyContent='space-between'>
                                {/* <Grid>
                                    <Typography sx={{ px: 2, pt: 2 }} component="h5" style={{ color: palette.primary.darkViolet }}>
                                        {t("List of exams")}
                                    </Typography>                                      

                                </Grid> */}
                                    {/* {(!userPermissions.isInspector && !userPermissions.isParent && !manageScopeIds.isTrainingCenter &&  userPermissions.bcTrainer.edit && userPermissions.bcCoach.access) && <>
                                        <StyledButton eVariant='secondary' eSize='small'
                                            onClick={() => {
                                                setIsOpenModal(true);
                                                setEventInfo(p => ({ ...p, eventType: "Exam" }))
                                            }}
                                        >
                                            {t("Add new exam")}
                                        </StyledButton>
                                    </>} */}
                            </Grid>

                            <ExamsTable exams={exams} />
                        </div>

                        <EventModal isOpen={isOpenModal}
                            setOpen={setIsOpenModal}
                            eventInfo={eventInfo}
                            eventAction={updateEvent}
                            fromContentDataForEvent={fromContentDataForEvent}
                            setFromContentDataForEvent={setFromContentDataForEvent}
                        />


                    </Grid>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}