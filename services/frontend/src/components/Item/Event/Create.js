import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeProvider, FormHelperText} from '@mui/material';
// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services 
import EventService from "services/event.service";

// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { now } from "moment";
// MUIv5 - Styled components
import { ESelect, ETextField } from "new_styled_components";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import StyledButton from "new_styled_components/Button/Button.styled";

// Icons
import SvgIcon from '@mui/material/SvgIcon';
import { ReactComponent as CalendarIcon } from 'icons/icons_32/calendar_month.svg';
import { ReactComponent as ClockIcon } from 'icons/icons_32/access_time.svg';

// MUI v4 :()
import { theme } from "MuiTheme";
import { KeyboardDatePicker, KeyboardTimePicker } from "@material-ui/pickers";
import { new_theme } from "NewMuiTheme";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";

// Universal component for creating and editing events
// To use it as modal window see example in Events.js component

// - data - event object, if _id is porovided it will trigger edit mode automatically
// - types - types of event to select, if only one provided the field will not be displayed 
// - groups - groups to select for event,
// - trainers - trainers to select for event,

// - trainingModules - trainingModules to select for event,
// - sessions - sessions to select for event,
// - chapters - chapters to select for event,
// - contents - contents to select for event,

// - hidden - Array of hidden values - prevents modifying those values by the user 
// - onClose - optional - action to call on Dissmiss button - when not provided button is hidden 
// - onSuccess - optional - action to call after successfuly saving in database
const Create = ({
    data = {},
    types = ["Exam", "Homework", "Online Class"],
    groups = [{ _id: 'g1', name: "Group 1" }],
    trainers = [{ _id: 't1', name: "Trainer 1" }],

    trainingModules = [{ _id: 'tm1', name: "Subject 1" }],
    chapters = [{_id: "g1", name:"Group1"}],
    // contents = [{_id: "c1", name:"Content"}],

    hidden = [],
    onClose = undefined,
    onSuccess = undefined

}) => {
    const { t } = useTranslation();
    const [contents, setContents] = useState([])
    // By default select first option for some fields
    var initEvent = {
        _id: undefined,
        name: '',
        description: '',
        eventType: types[0],

        assignedGroup: groups[0]?._id,
        assignedTrainer: trainers[0]?._id,

        // Training Center
        assignedSession: '',
        assignedCourse: '',
        // School Center
        assignedSubject: trainingModules[0]?._id,
        assignedChapter: chapters[0]?._id,
        assignedContent: contents[0]?._id,

         date: undefined,
        endDate: undefined,
        durationTime: 0,
    }

    const [event, setEvent] = useState({ ...initEvent, ...data })
    const [eventAllDay, setEventAllDay] = useState(false)
    const [eventWithoutContent, setEventWithoutContent] = useState(false)
    const [errorValidator, setErrorValidator] = useState({})
    const [isStartDateValid, setIsStartDateValid] = useState(true);
    const [isEndDateValid, setIsEndDateValid] = useState(true);
    const { F_showToastMessage } = useMainContext();


    // On first lodaing - process `data` 
    useEffect(() => {
        if(data?._id){
            chapters.map((chapter) =>{
                if(chapter?.chapter?._id === data?.assignedChapter){
                    setEvent({...event, assignedContent: data?.assignedContent})
                    setContents(chapter?.chosenContents)
                }
            })
        }
        // If there is no content set property
        if (data.assignedContent) setEventWithoutContent(false)
        else setEventWithoutContent(true)

        // Set proper start and end date
        let start = data.date ? new Date(event.date) : new Date()
        let end;

        if (data.endDate) {// End date exists
            end = new Date(event.endDate)
        } else {// For older events - there was not endDate -> set 24h
            end = new Date(start.getTime() + 3600000)
        }

        setEvent({ ...event, date: start, endDate: end})

        // Set eventAllDay if 00:00->23:59:59
        if (start.getHours() == 0 && start.getMinutes() == 0 && start.getSeconds() == 0 &&
            end.getHours() == 23 && end.getMinutes() == 59 && end.getSeconds() == 59) setEventAllDay(true)

    }, [data]);

    // When modifying start and end date - calculate durationTime
    useEffect(() => {
        if (!event.date || !event.endDate) return

        let start = new Date(event.date)
        let end = new Date(event.endDate)
        let durationTime = (end.getTime() - start.getTime()) / (60 * 1000)
        setEvent({ ...event, durationTime: durationTime })

    }, [event.date, event.endDate]);


    // When eventAllDay - set proper start/end dates
    useEffect(() => {
        if (!event.date || !event.endDate) return
        let start = new Date(event.date)
        let end = new Date(event.endDate)

        if (eventAllDay) {
            start.setHours(0, 0, 0, 0)
            end.setHours(23, 59, 59, 999)
            setEvent({ ...event, date: start, endDate: end })
        }
    }, [eventAllDay]);

    // Due to the issue https://github.com/mui/material-ui/issues/26799
    // I decided to split this function into 3 smaller functions

    // Set new start time - keep the same date
    // and then update the event 
    const setStartTime = (time) => {
        let currentDate = new Date(event.date)
        time.set('year', currentDate.getFullYear());
        time.set('month', currentDate.getMonth());
        time.set('date', currentDate.getDate());
        updateStartDateAndTime(time)
    }

    // Set new end time - keep the same date
    // and then update the event 
    const setEndTime = (time) => {
        let currentDate = new Date(event.date)
        time.set('year', currentDate.getFullYear());
        time.set('month', currentDate.getMonth());
        time.set('date', currentDate.getDate());
        updateEndDateAndTime(time)
    }
    // Set new start date - keep the same time
    // and then update the event 
    const setStartDate = (date) => {
        let currentDate = new Date(event.date)
        date.set('hour', currentDate.getHours());
        date.set('minute', currentDate.getMinutes());
        updateStartDateAndTime(date)
    }

    // Set new end date - keep the same  time
    // and then update the event 
    const setEndDate = (date) => {
        let currentDate = new Date(event.date)
        date.set('hour', currentDate.getHours());
        date.set('minute', currentDate.getMinutes());
        updateEndDateAndTime(date)
    }

    // Update event start date and time
    const updateStartDateAndTime = (date) => {
        if (date && date.isValid()) {
            setIsStartDateValid(true)
            let start = new Date(date)
            let end = new Date(event.endDate);
            if (start.getTime() > end.getTime()) {
                let currentDiffrence = end.getTime() - (new Date(event.date).getTime())
                end = new Date(start.getTime() + currentDiffrence)
            }
            setEvent({ ...event, date: start, endDate: end })
        } else {
            setIsStartDateValid(false)
        }
    }

    // Update event end date and time
    const updateEndDateAndTime = (date) => {
        if (date && date.isValid()) {
            setIsEndDateValid(true)
            let start = new Date(event.date)
            let end = new Date(date)
            if (end.getTime() < start.getTime()) {
                let currentDiffrence = new Date(event.endDate).getTime() - start.getTime()
                start = new Date(end.getTime() - currentDiffrence)
            }
            setEvent({ ...event, date: start, endDate: end })
        } else setIsEndDateValid(false)
    }
    // checking errors in form
    const validateEvent=(event)=>{
        let error = {};
        if(!event?.name){
            error.name = t('Event name is required');
        } else if(event?.name?.length < 3){
            error.name = t('Event name must be at least 3 characters');
        }
        if(!event?.eventType){
            error.eventType = t('Event type is required');
        }
        if(chapters?.length > 0){
            if(!event?.assignedChapter){
                error.assignedChapter = t('Assigned chapter is required');
            }
            if(!event?.assignedContent){
                error.assignedContent = t('Assigned content is required');
            }
        }
        setErrorValidator(error);
        return error;
    }

    // Save event in database
    const saveEvent = (e) => {
        e.preventDefault();
        let eventToSave = {}
        for (let key of Object.keys(initEvent)) {
            eventToSave[key] = event[key]
        }
        let error = validateEvent(eventToSave);
        if (Object.keys(error).length===0){
            if (eventToSave._id) {// Update
                EventService.update(eventToSave).then(res => {
                    F_showToastMessage(res?.data?.message, "success");
                    if (onSuccess) onSuccess()
                    if (onClose) onClose()
                }).catch(error => {
                    console.log(error)
                    F_showToastMessage("Could not update the event", "error");
                })
            } else {// Add new
                EventService.add(eventToSave).then(res => {
                    F_showToastMessage(res?.data?.message, "success");
                    if (onSuccess) onSuccess()
                    if (onClose) onClose()
                }).catch(error => {
                    console.log(error)
                    F_showToastMessage("Could not add the event", "error");
                })
            }
        }

    }

    // Get offline label for specific event type
    const getOfflineLabel = () => {
        if (event.eventType == "Exam") return t("Exam on the paper");
        else if (event.eventType == "Homework") return t("Homework on the paper")
        else if (event.eventType == "Online Class") return t("Lesson in class")
        else return t("Event offline")
    }

    const isChapterSelect = (value) => {
        chapters.map((chapter) =>{
            if(chapter?.chapter?._id === value){
                setContents(chapter?.chosenContents)
            }
        })
    }

    useEffect(() => {
        if('assignedChapter' in errorValidator){
            validateEvent(event);
        }
        if('assignedContent' in errorValidator){
            validateEvent(event);
        }
    }, [event?.assignedChapter, event?.assignedContent]);
    return (
        <ThemeProvider theme={new_theme}>
        <form>
            <Grid container item xs={12} sx={{ background: theme.palette.glass.opaque, backdropFilter: 'blur(10px)', p: '24px', pt: 2, borderRadius: '16px' }}>
                <Grid item xs={12}>
                    <Typography variant="body3" component="h6" className="mobile_heading" sx={{ mb: 2, fontWeight: '700', fontSize: '21px', textAlign: 'center' }}>
                        {event._id ? t("Edit event") : t("Assign event type")}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mb: 2 }}>
                    <ETextField value={event.name} onChange={(e) => { 
                        setEvent({ ...event, name: e.target.value })
                        if('name' in errorValidator){
                            validateEvent(event)
                        }
                    }} 
                    error={'name' in errorValidator}
                    helperText={'name' in errorValidator && 'Event name is required'}
                    sx={{ width: "100%" }} label={t("Event name")} />
                </Grid>
                {event.eventType && types.length > 2 && <Grid item xs={12}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        value={event.eventType}
                        onChange={(e) => {
                            setEvent({ ...event, eventType: e.target.value })
                            if('eventType' in errorValidator){
                                validateEvent(event)
                            }
                        }}
                        label={t("Event type")}
                    >
                        {types.map((type, index) =>
                            <MenuItem key={index} value={type}>{type} </MenuItem>
                        )}
                    </ESelect>
                    {'eventType' in errorValidator && errorValidator?.eventType}
                </Grid>}
                {!hidden.includes("offline") &&
                    <Grid item xs={12} sx={{ m: 1, mt: 2 }}>
                        <ESwitchWithTooltip className="examSwitch" checked={eventWithoutContent} onChange={() => setEventWithoutContent(p => !p)}
                            name={getOfflineLabel()}
                            fontSize="16px">  </ESwitchWithTooltip>
                    </Grid>}
                {!hidden.includes("trainers") && trainers.length > 0 && <Grid item xs={12}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        value={event.assignedTrainer}
                        onChange={(e) => setEvent({ ...event, assignedTrainer: e.target.value })}
                        label={t("Assign trainer")}
                    >
                        {trainers.map((trainer, index) =>
                            <MenuItem key={index} value={trainer._id}>{trainer.name} </MenuItem>
                        )}

                    </ESelect>
                </Grid>}
                {!hidden.includes("groups") && <Grid item xs={12} sx={{ mt: 2 }}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        value={event.assignedGroup}
                        onChange={(e) => setEvent({ ...event, assignedGroup: e.target.value })}
                        label={t("Assign group")}
                    >
                        {groups.map((group, index) =>
                            <MenuItem key={index} value={group._id}>{group.name} </MenuItem>
                        )}

                    </ESelect>
                </Grid>}
                <Grid container sx={{ mt: 2 }}>
                    <ESwitchWithTooltip name={t("All day")} checked={eventAllDay} onChange={() => setEventAllDay(p => !p)} fontSize="16px">  </ESwitchWithTooltip>
                </Grid>
                <Grid container item xs={12} sx={{ justifyContent: 'space-between', mt: 0 }} spacing={2} >
                    <Grid item xs={6} >
                        <KeyboardDatePicker
                            keyboardIcon={<CalendarIcon sx={{height: '18px', width: '18px'}} />}
                            label={t("Start date")}
                            format="DD.MM.yyyy"
                            inputVariant={'filled'}
                            value={event.date}
                            onChange={setStartDate}
                            error={isStartDateValid?false:true}
                            onError={(err)=>{if (err) setIsStartDateValid(false)}}
                            className="event_datepicker datepicker"
                        />
                    </Grid>
                    {<Grid item xs={6} >
                        <KeyboardDatePicker
                            keyboardIcon={<CalendarIcon />}
                            label={t("End date")}
                            format="DD.MM.yyyy"
                            inputVariant={'filled'}
                            value={event.endDate}
                            onChange={setEndDate}
                            error={isEndDateValid?false:true}
                            onError={(err)=>{if (err) setIsEndDateValid(false)}}
                            className="event_datepicker datepicker"
                        />
                    </Grid>}

                    {!eventAllDay && <>
                        <Grid item xs={6} >
                            <KeyboardTimePicker
                                keyboardIcon={<ClockIcon />}
                                label={t("Start time")}
                                inputVariant={'filled'}
                                ampm={false}
                                value={event.date}
                                onChange={setStartTime}
                                error={isStartDateValid?false:true}
                                onError={(err)=>{if (err) setIsStartDateValid(false)}}
                                className="event_datepicker datepicker"
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <KeyboardTimePicker
                                keyboardIcon={<ClockIcon />}
                                label={t("End time")}
                                inputVariant={'filled'}
                                ampm={false}
                                value={event.endDate}
                                onChange={setEndTime}
                                    error={isEndDateValid?false:true}
                                    onError={(err)=>{if (err) setIsEndDateValid(false)}}
                                    className="event_datepicker datepicker"
                            />
                        </Grid>
                    </>}
                </Grid>


                {!hidden.includes("trainingModules") && <Grid item xs={12} sx={{ mt: 2 }}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        required
                        value={event.assignedSubject}
                        onChange={(e) => setEvent({ ...event, assignedSubject: e.target.value })}
                        label={t("Assign training module")}
                    >
                        {trainingModules.map((tm, index) =>
                            <MenuItem key={index} value={tm._id}>{tm.name} </MenuItem>
                        )}
                    </ESelect>
                </Grid>}
                {!hidden.includes("chapters") && <Grid item xs={12} sx={{ mt: 2 }}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        required
                        value={event.assignedChapter}
                        onChange={(e) => {
                            isChapterSelect(e.target.value)
                            setEvent({ ...event, assignedChapter: e.target.value, assignedContent:'' })
                            if('assignedChapter' in errorValidator){
                                validateEvent(event)
                            }
                        }}
                        label={t("Assign chapter")}
                        error={'assignedChapter' in errorValidator}
                    >
                        {chapters.map((ch, index) =>
                            <MenuItem key={index} value={ch?.chapter?._id}>{ch?.chapter?.name} </MenuItem>
                        )}
                    </ESelect>
                    {'assignedChapter' in errorValidator && <FormHelperText sx={{color: new_theme.palette.error.main, marginLeft: '14px'}}>{errorValidator?.assignedChapter}</FormHelperText> }    
                </Grid>}
                {!hidden.includes("contents") && <Grid item xs={12} sx={{ mt: 2 }}>
                    <ESelect
                        variant="filled"
                        size="medium"
                        required
                        value={event.assignedContent}
                        onChange={(e) => {
                            setEvent({ ...event, assignedContent: e.target.value })
                            if('assignedContent' in errorValidator){
                                validateEvent(event)
                            }
                        }}
                        label={t("Assign content")}
                        error={'assignedContent' in errorValidator}
                    >
                        {contents.map((c, index) =>
                            <MenuItem key={index} value={c?.content?._id}>{c?.content?.title} </MenuItem>
                        )}
                    </ESelect>
                    {'assignedContent' in errorValidator && <FormHelperText sx={{color: new_theme.palette.error.main, marginLeft: '14px'}}>{errorValidator?.assignedContent}</FormHelperText>}
                </Grid>}
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <ETextField value={event.description} onChange={(e) => { setEvent({ ...event, description: e.target.value }) }} sx={{ width: "100%" }} label={t("Additional info")} />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, gap: '12px' }}>
                    {onClose && <StyledButton eVariant="secondary" eSize="small" sx={{width: '50%'}}
                        onClick={onClose}>
                        {t("Cancel")}
                    </StyledButton>}
                    <StyledButton eSize="small" eVariant="primary" sx={{width: '50%'}} onClick={saveEvent}>
                        {t("Confirm")}
                    </StyledButton>
                </Grid>

            </Grid>
        </form>
        </ThemeProvider>
    )
}

export default Create;