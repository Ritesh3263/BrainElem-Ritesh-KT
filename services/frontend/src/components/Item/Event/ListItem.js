import React, { lazy, useState, useEffect, useRef } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ListItemButton from "./ListItemButton";
import ListItemStatus from "./ListItemStatus";

// MUI v4
import { theme } from "MuiTheme";



const NoWrapTypography = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
})

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

// Single event on the list
// `event` - event to display
// `examinationAction` - `optional` - acttion for examination- by default it goes to `/examinate/${event._id}`
// `activeEvent`,`setActiveEvent` - optional - used only for clicable elements
const ListItem = ({ event, examinationAction,  activeEvent, setActiveEvent }) => {
    const { t } = useTranslation();
    const { F_getLocalTime, F_getHelper } = useMainContext();
    const { user, userPermissions } = F_getHelper()

    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    // Latest result of the user - only used for Trainee
    const [latestResult, setLatestResult] = useState()

    useEffect(() => {

        // Start and end date
        if (event.date) { // Dont set for exams from gradebook
            setEndDate(event.endDate ? new Date(event.endDate) : undefined)
            setStartDate(event.date ? new Date(event.date) : undefined)
        }

        let result = event.results.find(r => r.user == user.id)
        setLatestResult(result)


    }, [event])

    const getPath = () =>{
        let type = t(event.eventType)
        if (!event.assignedContent) type+= " "+t("in class")
        if (event.assignedSubject) return `${event.assignedSubject.name} > ${type}`
        else return type
    }


    return (
        <Grid container item xs={12} sx={{ borderRadius: '4px', p: '8px', background: (activeEvent?._id==event._id) ? theme.palette.neutrals.white : theme.palette.shades.whiteStroke }}>
            <Grid container item xs={10}>
                <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.primary.darkViolet }}>{getPath()}</NoWrapTypography>
                </Grid>

                <ListItemStatus event={event}></ListItemStatus>
                {!userPermissions.isTrainee && event.assignedGroup &&
                    <Grid>
                        <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.primary.green }}>{t("Class") + " " + event.assignedGroup.name}</NoWrapTypography>
                    </Grid>
                }
                <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 16 }}>{event.name}</NoWrapTypography>
                </Grid>
                {userPermissions.isTrainee && latestResult && latestResult.grade && <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 16 }}>{t("Grade")+": "+latestResult.grade}</NoWrapTypography>
                </Grid>}
                {!latestResult?.publishedAt && startDate && <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>
                        {(new Date() > startDate ? t("Started on") : t("Starts on")) + ": " + F_getLocalTime(startDate)}
                    </NoWrapTypography>
                </Grid>}
                {!latestResult?.publishedAt && endDate && <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>{t("Due date") + ": " + F_getLocalTime(endDate)}</NoWrapTypography>
                </Grid>}
                {latestResult?.publishedAt && 
                    <Grid item xs={12}>
                    <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>{t("Published") + ": " + F_getLocalTime(latestResult?.publishedAt)}</NoWrapTypography>
                </Grid>}
            </Grid>
            <Grid container item xs={2} sx={{ pr: '10px', alignItems: 'center', justifyContent: 'flex-end' }}>
                <ListItemButton event={event} examinationAction={examinationAction} setActiveEvent={setActiveEvent}></ListItemButton>
            </Grid>
        </Grid >
    )
}

export default ListItem;