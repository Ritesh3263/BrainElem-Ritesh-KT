import React, {useEffect, useState} from "react";
import Card from '@mui/material/Card';
import {Box, CardHeader, Divider, FormControlLabel, IconButton, ListSubheader, OutlinedInput, FilledInput, ThemeProvider, FormHelperText} from '@mui/material';
import { Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import StyledButton from "new_styled_components/Button/Button.styled";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useSessionContext} from "components/_ContextProviders/SessionProvider/SessionProvider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField"
import Select from "@mui/material/Select";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {now} from "moment";
import EventService from "services/event.service";
import ModuleService from "services/module.service";
import MenuItem from "@mui/material/MenuItem"
import Confirm from "components/common/Hooks/Confirm";
import { new_theme } from "NewMuiTheme";


export default function EventSidebar(props){
    const{
        addEventHelper,
        setAddEventHelper,
        updateEvent,
        currentEvent={},
        setCurrentEvent,
        errorValidator,
        setIsConfirm,
    }=props;

    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const [groups,setGroups] = useState([]);
    const [selectedGroup,setSelectedGroup] = useState([]);
    const [course,setCourse] = useState([]);
    const [courses,setCourses] = useState([]);
    const [chapters,setChapters] = useState([]);
    const [contents,setContents] = useState([]);
    const [trainers,setTrainers] = useState([]);
    const [eventTypes,setEventTypes] = useState([]);

    const { F_showToastMessage, F_getHelper} = useMainContext();
    const {manageScopeIds, userPermissions} = F_getHelper();
    const {
        isOpenSessionForm,
        currentSession,
    } = useSessionContext();
    useEffect(()=>{
        // setCurrentEvent(currentEvent||{});
        EventService.getEventTypes().then((res) => {
            if(res.status === 200 && res?.data){
                setEventTypes(res.data);
            }
        }).catch(err=>console.log(err));

        ModuleService.getAllTrainersInModule().then((res) => {
            if(res.status === 200 && res?.data){
                setTrainers(res.data);
            }
        }).catch(err=>console.log(err));

        setCurrentEvent(prevState=>{
            let group = currentSession.groups?.find(group=>group?._id === prevState.assignedGroup?._id) || prevState.assignedGroup
            let course = group?.duplicatedCoursePath?.courses?.find(course=>course?._id === prevState.assignedCourse?._id) || prevState.assignedCourse
            let chapter = course?.chosenChapters?.find(chapter=>chapter?.chapter?._id === prevState.assignedChapter?._id) || prevState.assignedChapter
            let content = chapter?.chosenContents?.find(content=>content?.content?._id === prevState.assignedContent?._id) || prevState.assignedContent
            return {...prevState, 
                assignedGroup: group,
                assignedCourse: course,
                assignedChapter: chapter?.chapter||chapter,
                assignedContent: content?.content||content,
                assignedSession: currentSession._id,
                }

            });
            setGroups(currentSession?.groups||[]);
            setCourses(currentSession?.groups?.find(x=>x._id == selectedGroup?._id)?.duplicatedCoursePath?.courses||[]);
            setChapters(currentSession?.groups?.find(x=>x._id == selectedGroup?._id)?.duplicatedCoursePath?.courses?.[0]?.chosenChapters?.map(x=>x.chapter)||[]);
            setContents(currentSession?.groups?.find(x=>x._id == selectedGroup?._id)?.duplicatedCoursePath?.courses?.[0]?.chosenChapters?.[0]?.chosenContents?.map(x=>x.content)||[]);

    },[selectedGroup])

    const updateValueHandler=(field, value)=>{
        setCurrentEvent(p=>({...p, [field]: value}));
        switch(field){
            case 'assignedGroup':
                setSelectedGroup(value);
                break;
            case 'assignedCourse':
                setCourse(value);
                setChapters(value.chosenChapters.map(x=>x.chapter));
                break;
            case 'assignedChapter':
                setContents(course.chosenChapters.find(x=>x.chapter._id===value._id).chosenContents.map(x=>x.content));
                break;
            default:
                break;
        }
    };

    const eventTypesList = eventTypes.map((ev, index) => (<MenuItem key={index} value={ev.type}>{ev.type}</MenuItem>));
    const groupsList = groups.map((gr, index)=>(<MenuItem key={index} value={gr}>{gr?.name}</MenuItem>));
    const coursesList = courses.map((cr, index)=>(<MenuItem key={index} value={cr}>{cr?.name}</MenuItem>));
    const chaptersList = chapters.map((ch, index)=>(<MenuItem key={index} value={ch}>{ch?.name}</MenuItem>));
    const contentsList = contents.map((c, index)=>(<MenuItem key={index} value={c}>{c?.title}</MenuItem>));
    const trainersList = trainers.map((tr, index)=>(<MenuItem key={index} value={tr._id}>{`${tr?.name} ${tr?.surname}`}</MenuItem>));

    const handleSubmit = (e) =>{
        setIsConfirm(true)
    }
    return(
        <ThemeProvider theme={new_theme}>
            <Card className="p-0 m-0 d-flex flex-column mb-popup" sx={{boxShadow:'none'}}>
                <CardHeader title={(
                    <Typography variant="h3" component="h3" style={{color:new_theme.palette.newSupplementary.NSupText, textAlignLast:'center'}}>
                        {` ${currentEvent?.name || t("Event name")}`}
                    </Typography>
                )}
                />
                <CardContent className="pt-0">
                    <form onSubmit={handleSubmit}>
                        <Grid container className="mb-m-2">
                            <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-start">
                                <TextField label={t("Event name")} margin="dense"
                                    InputProps={{
                                        //    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                        //    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                        readOnly: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access ),
                                        disableUnderline: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access ),
                                    }}
                                    name='name'
                                    fullWidth={true}
                                    error={'name' in errorValidator}
                                    helperText={'name' in errorValidator && 'Event name is required'}

                                    variant="filled"                                   
                                    required={true}
                                    
                                    value={currentEvent?.name}
                                    onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                            />


                            <FormControl fullWidth required={true}  margin="dense"
                                        error={!currentEvent.eventType}
                                        helperText={!currentEvent.eventType && 'Event type is required'}
                                        variant="filled">
                                <InputLabel id="eventType-select-label">{t("Event type")}</InputLabel>
                                <Select
                                    name='eventType'
                                    labelId="eventType-select-label"
                                    id="eventType-select"
                                    value={currentEvent?.eventType}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                    onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                >
                                    {eventTypesList}
                                </Select>
                                { !currentEvent.eventType && <FormHelperText>{t("Event type is required")}</FormHelperText>}
                            </FormControl>


                            <div className="my-8-16" style={{display:"flex", gap:"20px", marginBottom:"22px"}}>
                                <KeyboardDatePicker
                                    className="datepicker event_name"
                                    InputProps={{
                                            //    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                            //    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                            readOnly: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access ),
                                            disableUnderline: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access ),
                                    }}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                    fullWidth
                                    style={{maxWidth: "50%"}}
                                    name='date'
                                    id="date-picker-dialog"
                                    label={t("Event date")}
                                    format="DD.MM.yyyy"
                                    minDate={new Date(now()).toISOString().split("T")[0]}
                                    minDateMessage={"It is a past date"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputVariant='filled'
                                    value={currentEvent?.date}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            updateValueHandler('date', new Date(date).toISOString())
                                        }
                                    }}
                                />

                                {/* should be `durationTime` instead of start time  */}
                                <KeyboardTimePicker
                                    className="datepicker event_name"
                                    fullWidth
                                    style={{maxWidth: "50%"}}
                                    ampm={false}
                                    InputProps={{
                                        readOnly: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access),
                                        disableUnderline: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access),
                                    }}
                                    minDateMessage="It is past time"
                                    inputVariant={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access) ? 'standard' : 'filled'}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                    name='date-time'
                                    id="time-picker"
                                    label={t("Start time")}
                                    //disabled={currentEvent?.allDay}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentEvent?.date}
                                    KeyboardButtonProps={{
                                        "aria-label": "change time",
                                    }}
                                    keyboardIcon={<AccessTimeIcon/>}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            updateValueHandler('date', new Date(date).toISOString())
                                        }
                                    }}
                                />

                            </div>


                                {/* NOT SURE WE ARE GOING TO HAVE "Assign to all groups", as each group can have different program (content) */}
                                <FormControl fullWidth required={true}  margin="dense"
                                            error={'assignedGroup' in errorValidator}
                                            helperText={'assignedGroup' in errorValidator && ' this is required'}    
                                            variant="filled">
                                    <InputLabel id="assignedGroup-select-label">{t("Select group")}</InputLabel>
                                    <Select
                                        name='assignedGroup'
                                        labelId="assignedGroup-select-label"
                                        id="assignedGroup-select"
                                        value={currentEvent?.assignedGroup}
                                        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                    >
                                        {groupsList}
                                    </Select>
                                {/* //erorr msg */}
                                {'assignedGroup' in errorValidator && <FormHelperText>{t("Select group is required")}</FormHelperText>}
                                {/* //erorr msg */}
                                </FormControl>
                                <FormControl fullWidth required={true}  margin="dense"
                                           error={'assignedCourse' in errorValidator}
                                           helperText={'assignedCourse' in errorValidator && 'required'}   
                                            variant="filled">
                                    <InputLabel id="assignedCourse-select-label">{t("Assign course")}</InputLabel>
                                    <Select
                                        name='assignedCourse'
                                        labelId="assignedCourse-select-label"
                                        id="assignedCourse-select"
                                        value={currentEvent?.assignedCourse}
                                        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                    >
                                        {coursesList}
                                    </Select>
                                {/* //erorr msg */}
                                {'assignedCourse' in errorValidator && <FormHelperText>{t("Assign course is required")}</FormHelperText>}
                                {/* //erorr msg */}
                                </FormControl>
                                <FormControl fullWidth required={true}  margin="dense"
                                            error={'assignedChapter' in errorValidator}
                                            helperText={'assignedChapter' in errorValidator && 'required'}    
                                            variant="filled">
                                    <InputLabel id="assignedChapter-select-label">{t("Select chapter")}</InputLabel>
                                    <Select
                                        name='assignedChapter'
                                        labelId="assignedChapter-select-label"
                                        id="assignedChapter-select"
                                        value={currentEvent?.assignedChapter}
                                        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                    >
                                        {chaptersList}
                                        {/* {testChaptersList} */}
                                    </Select>
                                    {'assignedChapter' in errorValidator && <FormHelperText>{t("Select chapter is required")}</FormHelperText>}
                                </FormControl>
                                <FormControl fullWidth required={true}  margin="dense"
                                             error={'assignedContent' in errorValidator}
                                             helperText={'assignedContent' in errorValidator && 'required'}     
                                            variant="filled">
                                    <InputLabel id="assignedContent-select-label">{t("Select content")}</InputLabel>
                                    <Select
                                        name='assignedContent'
                                        labelId="assignedContent-select-label"
                                        id="assignedContent-select"
                                        value={currentEvent?.assignedContent}
                                        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access)}
                                        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                    >
                                        {contentsList}
                                        {/* {testContentsList} */}
                                    </Select>
                                    {'assignedContent' in errorValidator && <FormHelperText>{t("Select content is required")}</FormHelperText>}
                                </FormControl>
                                {/* <FormControl fullWidth margin="dense" required={true} 
                                            error={false}
                                            hidden={(userPermissions.isTrainer)}
                                            variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}>
                                    <InputLabel id="assignedTrainer-select-label">{t("Assign trainer")}</InputLabel>
                                    <Select
                                        name='assignedTrainer'
                                        labelId="assignedTrainer-select-label"
                                        id="assignedTrainer-select"
                                        value={currentEvent?.assignedTrainer}
                                        readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                        disableUnderline={(isOpenSessionForm.type === 'PREVIEW')}
                                        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                                    >
                                        {trainersList}
                                    </Select>
                                </FormControl> */}
                                <TextField label={t("Description (additional info)")} margin="dense"
                                        InputProps={{
                                            readOnly: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access),
                                            disableUnderline: (isOpenSessionForm.type === 'PREVIEW' && !userPermissions.bcTrainer.access),
                                        }}
                                        name='description'
                                        fullWidth
                                        
                                        variant="filled"
                                        required={false}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={currentEvent?.description}
                                        onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <CardActionArea >
                    <CardActions className="d-flex justify-content-between align-items-center" >
                        <Grid container>
                            <Grid item xs={6}>
                                <StyledButton className="w-80 mb-gap" eSize="large" eVariant="secondary" onClick={() =>  {
                                    F_showToastMessage(t("No change"),);
                                    setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                                }}>
                                    {t("Dismiss")}
                                </StyledButton>
                            </Grid>
                            <Grid item xs={6} className="p-0 mb-2 d-flex justify-content-end">

                                {addEventHelper.type !== "ADD" && addEventHelper.type !== "update" ?
                                    <StyledButton className="w-80 mb-gap" eSize="large" eVariant="primary" 
                                            onClick={async ()=>{
                                                let confirm = await isConfirmed(t("Are you sure you want to remove this event?"));
                                                if(confirm){
                                                    updateEvent({type: 'remove', data: currentEvent})
                                                } else {
                                                    F_showToastMessage(t("No change"),);
                                                }
                                            }}>
                                        {t("Remove")}
                                    </StyledButton> : null}

                                {
                                (isOpenSessionForm.type === 'EDIT' || userPermissions.bcTrainer.access) && (
                                    <StyledButton  eSize="large" eVariant="primary" className="ml-5 w-80 mb-gap" onClick={()=>{
                                        if(addEventHelper.type !== "ADD"){
                                            updateEvent({type: 'update', data: currentEvent})
                                        }else if(addEventHelper.type === "ADD"){
                                            updateEvent({type: 'add', data: currentEvent})
                                        }
                                    }}>
                                        {t("Confirm")}
                                    </StyledButton>
                                )}
                            </Grid>
                        </Grid>
                    </CardActions>
                </CardActionArea>
            </Card>
        </ThemeProvider>
    )
}