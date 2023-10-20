import React, { lazy, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// MUIv5
import Typography from '@mui/material/Typography';
import EIconButton from "styled_components/EIconButton";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

// Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as ForwardIcon } from 'icons/icons_48/Arrow small R.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';



const NoWrapTypography = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
})

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

// Action button for single event
//
// `event` - event for which button is created
// `examinationAction` -  optional - acttion to exectue as Examinsation - by default it goes to `/examinate/${event._id}`
// `setActiveEvent` - optional - used only for clicable elements
const ListItemButton = ({ event, examinationAction, setActiveEvent=()=>{}, size = "medium" }) => {
    const navigate = useNavigate()
    const { F_getHelper } = useMainContext();
    const { user, userPermissions } = F_getHelper()
    // Latest result of active user
    const [result, setResult] = useState()
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [disabled, setDisabled] = useState(true)

    useEffect(() => {
        if (event) {
            setEndDate(event.endDate ? new Date(event.endDate) : undefined)
            setStartDate(new Date(event.date))

            const result = event.results?.find(r => r.user == user.id)
            setResult(result)
        }
    }, [event])


    useEffect(() => {
        // Button is enabled only for trainers
        // Or for trainees - when after startDate and content is assinged
        if (userPermissions?.isTrainer || userPermissions?.bcTrainer?.access ) return setDisabled(false)
        else if (!event.assignedContent) setDisabled(false)
        else if (userPermissions.isTrainee && event.assignedContent && new Date() >= startDate) setDisabled(false)
    }, [startDate, endDate])

    const isFinished = () => {
        let now = new Date()
        return (now > endDate || (!endDate && new Date()>startDate) || !startDate)
    }
    return (
        <StyledEIconButton disabled={disabled} onClick={() => {
            setActiveEvent(event)
            let now = new Date()
            // Trainee
            if (userPermissions.isTrainee) {
                // Already finished test
                if (event?.allowExtraAttemptFor?.includes(user.id)) navigate(`/event/${event._id}/content/display`)
                else if (isFinished() && result && event.assignedContent?.contentType == "TEST") navigate(`/results/event/${event._id}/${user.id}`)
                else if (!event.assignedContent) {}//Pass - settinh activeElement will trigerr modal window in Event/List.js
                else navigate(`/event/${event._id}/content/display`)
            } else { // Not trainee
                if (!event.assignedContent){
                    if (examinationAction) examinationAction(event._id)
                    else navigate(`/examinate/${event._id}`)
                }
                else if (isFinished() || userPermissions?.bcTrainer?.access) {// Already finished or if bcTrainer - he can see results before end of the event
                    if (examinationAction) examinationAction(event._id)
                    else if (event.assignedContent?.contentType == "PRESENTATION") navigate(`/event/${event._id}/content/display`)
                    else navigate(`/examinate/${event._id}`)
                } else {//Current or before
                    navigate(`/event/${event._id}/content/display`)
                }
            }

        }}
            size="medium" color="primary">
            {/* <SvgIcon sx={{ backgroundColor: 'transparent !important' }} viewBox={size == "small" ? "12 12 24 24" : "15 15 18 18"} component={ForwardIcon} /> */}
            <ChevronRightIcon />
        </StyledEIconButton>

    )
}

export default ListItemButton;