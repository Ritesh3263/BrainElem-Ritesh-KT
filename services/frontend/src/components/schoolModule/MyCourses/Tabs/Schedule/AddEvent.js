import React, {useEffect, useState} from 'react';
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import {now} from "moment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import EventService from "services/event.service";
import MenuItem from "@material-ui/core/MenuItem";
import {myCourseActions} from "app/features/MyCourses/data";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DoneIcon from '@mui/icons-material/Done';
import ListItemText from "@material-ui/core/ListItemText";
import ModuleService from "services/module.service";
import Confirm from "components/common/Hooks/Confirm";

const AddEvent=(props)=> {
    const{
        addEventHelper,
        setAddEventHelper,
        currentEvent,
        setCurrentEvent,
        errorValidator,
        updateEvent,
    }=props;
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const { F_showToastMessage} = useMainContext();
    const dispatch = useDispatch();
    const {item, formHelper, itemDetails} = useSelector(s=>s.myCourses);
    const [eventTypes,setEventTypes] = useState([]);
    const [trainers,setTrainers] = useState([]);

    useEffect(()=>{
        if(formHelper.isOpen){
            setCurrentEvent(p=>({...p, assignedSubject: item?._id, assignedGroup: item?.group?._id }));
            dispatch(myCourseActions.fetchItemDetails({itemId: item._id, type: 'PROGRAM'}));

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
            
        }
    },[formHelper.isOpen]);


    const updateValueHandler=(field, value)=>{
        setCurrentEvent(p=>({...p, [field]: value}));
    };

    const eventTypesList = eventTypes.map((ev, index) => (<MenuItem key={index} value={ev.type}>{ev.type}</MenuItem>));
    const chaptersList = itemDetails?.assignedChapters?.length>0 ? itemDetails.assignedChapters.map((ch, index)=>(
        <MenuItem key={index} value={ch._id}>
            <ListItemText >
                {ch?.isDone && (
                    <DoneIcon className='mr-2'/>
                )}
                {ch?.name}
            </ListItemText>
            {/*{ch?.isDone && (*/}
            {/*    <ListItemIcon>*/}
            {/*        <DoneIcon />*/}
            {/*    </ListItemIcon>*/}
            {/*)}*/}
        </MenuItem>
    )):[];

    const contentsList = currentEvent.assignedChapter ?
        itemDetails.assignedChapters.find(ch => (ch._id === currentEvent?.assignedChapter))?.assignedContents?.length>0 ?
            itemDetails.assignedChapters.find(ch => (ch._id === currentEvent?.assignedChapter))?.assignedContents.map((c, index)=>(
                <MenuItem key={index} value={c._id}>
                    <ListItemText style={{display:'flex', justifyContent:'start', alignItems:'center'}}>
                        {c?.isDone && (
                                <DoneIcon className='mr-2'/>
                        )}
                        {c?.title}
                    </ListItemText>
                    {/*{c?.isDone && (*/}
                    {/*    <ListItemIcon>*/}
                    {/*        <DoneIcon />*/}
                    {/*    </ListItemIcon>*/}
                    {/*)}*/}
                </MenuItem>
            ))
            :[]
        :[];

    const trainersList = trainers.map((tr, index)=>(<MenuItem key={index} value={tr._id}>{`${tr?.name} ${tr?.surname}`}</MenuItem>));

     return (
         <Card className="p-0 m-0 d-flex flex-column">
             <CardHeader title={(
                 <Typography variant="h3" component="h3" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                     {` ${currentEvent?.name || t("Event name")}`}
                 </Typography>
             )}
             />
             <CardContent className="pt-0">
                 <Grid container>
                     <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-start">
                         <TextField label={t("Event name")} margin="dense"
                                    InputProps={{
                                        readOnly: (formHelper.openType === 'PREVIEW'),
                                        disableUnderline: (formHelper.openType === 'PREVIEW'),
                                    }}
                                    name='name'
                                    fullWidth
                                    error={'name' in errorValidator}
                                    helperText={'name' in errorValidator && 'required'}
                                    style={{maxWidth: "400px"}}
                                    variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={true}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentEvent?.name}
                                    onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                         />
                         <KeyboardDatePicker
                             InputProps={{
                                 readOnly: (formHelper.openType === 'PREVIEW' ),
                                 disableUnderline: (formHelper.openType === 'PREVIEW'),
                             }}
                             readOnly={(formHelper.openType === 'PREVIEW')}
                             fullWidth
                             style={{maxWidth: "400px"}}
                             name='date'
                             margin="dense"
                             id="date-picker-dialog"
                             label={t("Event date")}
                             format="DD.MM.yyyy"
                             minDate={new Date(now()).toISOString().split("T")[0]}
                             minDateMessage={"It is a past date"}
                             InputLabelProps={{
                                 shrink: true,
                             }}
                             inputVariant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
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
                         <FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}
                                      error={false}
                                      variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}>
                             <InputLabel id="eventType-select-label">{t("Event type")}</InputLabel>
                             <Select
                                 name='eventType'
                                 labelId="eventType-select-label"
                                 id="eventType-select"
                                 value={currentEvent?.eventType}
                                 readOnly={(formHelper.openType === 'PREVIEW')}
                                 disableUnderline={(formHelper.openType === 'PREVIEW')}
                                 onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                             >
                                 {eventTypesList}
                             </Select>
                         </FormControl>
                         <KeyboardTimePicker
                             fullWidth
                             style={{maxWidth: "400px"}}
                             ampm={false}
                             InputProps={{
                                 readOnly: (formHelper.openType === 'PREVIEW'),
                                 disableUnderline: (formHelper.openType === 'PREVIEW'),
                             }}
                             inputVariant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                             readOnly={(formHelper.openType === 'PREVIEW')}
                             name='date-time'
                             margin="dense"
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
                         <FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}
                                      error={false}
                                      variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}>
                             <InputLabel id="assignedChapter-select-label">{t("Select chapter")}</InputLabel>
                             <Select
                                 name='assignedChapter'
                                 labelId="assignedChapter-select-label"
                                 id="assignedChapter-select"
                                 disabled={!currentEvent?.eventType}
                                 value={currentEvent?.assignedChapter}
                                 readOnly={(formHelper.openType === 'PREVIEW')}
                                 disableUnderline={(formHelper.openType === 'PREVIEW')}
                                 onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                             >
                                 {chaptersList}
                             </Select>
                         </FormControl>
                         <FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}
                                      error={false}
                                      variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}>
                             <InputLabel id="assignedContent-select-label">{t("Select content")}</InputLabel>
                             <Select
                                 name='assignedContent'
                                 labelId="assignedContent-select-label"
                                 id="assignedContent-select"
                                 disabled={!currentEvent?.assignedChapter}
                                 value={currentEvent?.assignedContent}
                                 readOnly={(formHelper.openType === 'PREVIEW')}
                                 disableUnderline={(formHelper.openType === 'PREVIEW')}
                                 onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                             >
                                 {contentsList}
                             </Select>
                         </FormControl>
                         <FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}
                                      error={false}
                                      //hidden={(userPermissions.isTrainer)}
                                      variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}>
                             <InputLabel id="assignedTrainer-select-label">{t("Assign trainer")}</InputLabel>
                             <Select
                                 name='assignedTrainer'
                                 labelId="assignedTrainer-select-label"
                                 id="assignedTrainer-select"
                                 value={currentEvent?.assignedTrainer}
                                 readOnly={(formHelper.openType === 'PREVIEW')}
                                 disableUnderline={(formHelper.openType === 'PREVIEW')}
                                 onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}
                             >
                                 {trainersList}
                             </Select>
                         </FormControl>
                         <TextField label={t("Description (additional info)")} margin="dense"
                                    InputProps={{
                                        readOnly: (formHelper.openType === 'PREVIEW'),
                                        disableUnderline: (formHelper.openType === 'PREVIEW'),
                                    }}
                                    name='description'
                                    fullWidth
                                    style={{maxWidth: "400px"}}
                                    variant={(formHelper.openType === 'PREVIEW') ? 'standard' : 'filled'}
                                    required={false}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentEvent?.description}
                                    onInput={(e) => updateValueHandler(e.target.name, e.target.value)}
                         />
                     </Grid>
                 </Grid>
             </CardContent>
             <CardActionArea >
                 <CardActions className="d-flex justify-content-between align-items-center" >
                     <Grid container>
                         <Grid item xs={6}>
                             <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                                 F_showToastMessage(t("No change"),);
                                 setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                             }}>
                                 {t("Dismiss")}
                             </Button>
                         </Grid>
                         <Grid item xs={6} className="p-0 mb-2 d-flex justify-content-end">

                             {addEventHelper.type !== "ADD" ?
                                 <Button variant="contained" size="small" color="inherit"
                                         onClick={async ()=>{
                                            let confirm = await isConfirmed(t("Are you sure you want to remove this event?"), {promptHeader:t("Remove event"), proceedText:t("Yes"), cancelText:t("No")});
                                            if(confirm) updateEvent({type: 'remove', data: currentEvent})
                                        }}>
                                     {t("Remove")}
                                 </Button> : null}

                             {
                                 (formHelper.openType !== 'PREVIEW') // trainer bypass
                                 && (
                                     <Button size="small" variant="contained" color="primary" className="ml-5" onClick={()=>{
                                         if(addEventHelper.type !== "ADD"){
                                             updateEvent({type: 'update', data: currentEvent})
                                         }else if(addEventHelper.type === "ADD"){
                                             updateEvent({type: 'add', data: currentEvent})
                                         }
                                     }}>
                                         {t("Save")}
                                     </Button>
                                 )}
                         </Grid>
                     </Grid>
                 </CardActions>
             </CardActionArea>
         </Card>
     )
 }

export default AddEvent;