import React, { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


// MUIv5
import Grid from '@mui/material/Grid';
import EDialog from "styled_components/Dialog";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Redux
import { useDispatch, useSelector } from "react-redux";

// MUI v4
import { theme } from "MuiTheme";

const palette = theme.palette

// Other components
const EventsList = lazy(() => import("components/Item/Event/List"));
const GroupExaminationView = lazy(() => import("components/Trainer/Examinate/Group/GroupExaminationView"));


function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}


const Examinate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const isSmUp = useIsWidthUp('sm')
    const isMdUp = useIsWidthUp('md')

    const { item, examHelper, itemDetails } = useSelector(s => s.myCourses);

    const { F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { userPermissions, user } = F_getHelper();


    // Inline examination view - on mobie it's modal/dialog
    const [eventForExamination, setEventForExamination] = useState()
    const [openExaminationDialog, setOpenExaminationDialog] = useState(false);

    var events = item.examinate?.exams?.concat(item.examinate.homeworks)
    if (!events) events = [];
    return (
        <>
            <Grid container>
                <Grid container item xs={12} md={userPermissions.isTrainer ? 4 : 12} sx={{pr: 2, pl: { xs: 2, md: 0 }, justifyContent: 'center'}}>
                    <EventsList title={t("Exams and assigments")} types={['Exam', 'Homework']} events={events}
                        examinationAction={(eventId) => {
                            let event = events.find(e => e._id == eventId)
                            if (event.assignedContent?.contentType == "PRESENTATION") navigate(`/event/${event._id}/content/display`)
                            else {
                                F_handleSetShowLoader(true)
                                setEventForExamination(event)
                                setOpenExaminationDialog(true)
                                setTimeout(() => { F_handleSetShowLoader(false) }, 1000)
                            }
                        }}
                    ></EventsList>
                </Grid>
                <Grid item xs={12} md={8}>
                    {isMdUp && eventForExamination && <GroupExaminationView background={theme.palette.glass.opaque} eventId={eventForExamination._id} fullWidth={true} hideBackIcon={true} />}
                </Grid>

            </Grid>

            {/* MODAL WINDOW FOR MOBILE DEVICES*/}
            {!isMdUp && eventForExamination && <EDialog fullWidth={true} maxWidth={'md'} open={openExaminationDialog} onClose={() => { setOpenExaminationDialog(false) }}>
                <GroupExaminationView background={theme.palette.glass.opaque} eventId={eventForExamination._id} fullWidth={true} backIconAction={() => { setOpenExaminationDialog(false) }} />
            </EDialog>}


        </>
    )
}

export default Examinate;