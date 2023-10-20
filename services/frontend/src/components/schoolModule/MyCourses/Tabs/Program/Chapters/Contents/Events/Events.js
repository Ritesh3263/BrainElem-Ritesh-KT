import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/system";

import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";

// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import EDialog from "styled_components/Dialog";
import ESvgIcon from "styled_components/SvgIcon";

import EIconButton from "styled_components/EIconButton";

import ListItemButton from "components/Item/Event/ListItemButton";
import CreateEvent from "components/Item/Event/Create";

// Services
import EventService from "services/event.service";

//Redux
import {myCourseActions} from "app/features/MyCourses/data";
import {useDispatch, useSelector} from "react-redux";

// Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';
import { ReactComponent as ForwardIcon } from 'icons/icons_48/Arrow small R.svg';
import { ReactComponent as Calendar } from "icons/icons_32/Calendar.svg";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


// MUI v4
import Confirm from "components/common/Hooks/Confirm";
import { theme } from "MuiTheme";
const palette = theme.palette

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

const StyledCalendar = styled(Calendar)({
    backgroundColor: 'transparent !important',
    "& line": {
        stroke: theme.palette.neutrals.almostBlack,
        fill: "transparent"
    },
    "& polyline": {
        stroke: theme.palette.neutrals.almostBlack,
        fill: "transparent"
    },
    "& path": {
        stroke: theme.palette.neutrals.almostBlack,
        fill: "transparent"
    },
    '& circle': {
        stroke: theme.palette.neutrals.almostBlack,
        fill: "transparent"
    },
})

// List of events inside program
// events - array of events objects
// contentId - optional - base content id, when provided content selection will not be necessary when adding new event
// contentType - optional - base content type, when provided it will preselect event type  when adding new event
export default function Events({ events, contentId, contentType }) {
    const { F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader, F_getHelper, F_getLocalTime } = useMainContext();
    const { user, userPermissions, manageScopeIds } = F_getHelper();
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const navigate = useNavigate();
    const [eventForDialog, setEventForDialog] = useState(false)
    const [openEventDialog, setOpenEventDialog] = useState(false)
    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");

    const { dndHelper, formHelper, programHelper, item } = useSelector(s => s.myCourses);
    const dispatch = useDispatch();


    // Allow editing date, name etc.
    const canEditEvent = (event) => {
        if (canDeleteEvent(event)) return true;
        else if (user.id===event.assignedTrainer) return true;
        else return false

    }
    // Allow remving event
    const canDeleteEvent = (event) => {
        if (user.id===event.creator) return true;
        else return false
    }
    

    return (
        <Grid container>
            <Grid item container sx={{ alignItems: 'center' }}>
                <SvgIcon viewBox="0 0 24 24" component={StyledCalendar}></SvgIcon>
                <Typography sx={{ pr: '16px', pl: '8px', ...theme.typography.p, textAlign: 'left', fontSize: "14px" }} >
                    {("Events")}
                </Typography>
                {userPermissions.isTrainer && <EIconButton 
                    onClick={() => {
                        setOpenEventDialog(true); 
                        setEventForDialog({
                            assignedGroup: item.group._id,
                            assignedTrainer:  user.id,
                            assignedSubject: item._id,
                            assignedChapter: dndHelper.dndChapter.chapterId,
                            assignedContent: contentId,
                            eventType: contentType==="PRESENTATION" ? "Online Class" : "Exam"
                        })
                    }} 
                    size="small" variant="contained" color="secondary">
                    <ESvgIcon viewBox="0 0 32 32" component={AddIcon} />
                </EIconButton>}
            </Grid>
            {events && events.map((event,index) =>
                <Grid key={event._id} item container sx={{ pt: '16px', alignItems: 'center' }}>
                    <Typography sx={{ ...theme.typography.p, textAlign: 'left', width: { xs: '80px', md: '160px' }, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: "ellipsis", fontSize: "14px" }} >
                        {event.name}
                    </Typography>
                    <Typography sx={{ ...theme.typography.p, px: '16px', textAlign: 'left', fontSize: "14px" }} >
                        {F_getLocalTime(event.date, true)}
                    </Typography>
                    {userPermissions.isTrainer && <EIconButton disabled={!canEditEvent(event)} sx={{ mr: '8px' }} 
                        onClick={() => {
                            setOpenEventDialog(true); 
                            setEventForDialog({
                                ...event,
                                assignedGroup: event.assignedGroup._id,
                                assignedSubject: event.assignedSubject._id,
                                assignedChapter: event.assignedChapter._id,
                                assignedContent: event.assignedContent._id,
                            })}} 
                        size="small" variant="contained" color="secondary">
                        <ESvgIcon viewBox="0 0 32 32" component={EditIcon} />
                    </EIconButton>}
                    {userPermissions.isTrainer && <EIconButton disabled={!canDeleteEvent(event)} sx={{ mr: '8px' }} onClick={async () => { 
                        if (!await isConfirmed(t("Are you sure you want to delete this event with all the associated data?"))) return;
                        else EventService.remove(event._id).then(res => {
                            dispatch(myCourseActions.fetchItem(formHelper.itemId));
                            F_showToastMessage(t("Event was removed"), "success");
                        }).catch(err => {
                            F_showToastMessage(t("Could not remove this event"), "error");
                        });
                    }} size="small" variant="contained" color="secondary">
                        <ESvgIcon viewBox="0 0 32 32" component={DeleteIcon} />
                    </EIconButton>}
                    
                    <ListItemButton event={event} size='small'></ListItemButton>
                </Grid>
            )}

            {userPermissions.isTrainer && <EDialog open={openEventDialog} onClose={() => { setOpenEventDialog(false);  }}>
                <CreateEvent 
                    data={eventForDialog}
                    hidden={["offline", "groups","trainers","trainingModules","chapters", "contents"]}
                    onClose={()=>setOpenEventDialog(false)}
                    onSuccess={()=>dispatch(myCourseActions.fetchItem(formHelper.itemId))}
                ></CreateEvent>
            </EDialog>}
        </Grid>
    )
}