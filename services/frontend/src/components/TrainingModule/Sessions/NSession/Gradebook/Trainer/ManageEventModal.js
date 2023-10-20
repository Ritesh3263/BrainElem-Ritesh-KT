import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CourseService from "../../../../../../services/course.service";
import MenuItem from "@material-ui/core/MenuItem";
import {now} from "moment";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import EventService from "../../../../../../services/event.service";
import {useMainContext} from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import ResultService from "../../../../../../services/result.service";
import {theme} from "MuiTheme";
import Confirm from "components/common/Hooks/Confirm";


const initialEventState={
    addedFromGradebook: true,
    eventType: "Exam",
    name: "",
    note: "",
    examCoefficient: 1,
    date: new Date(now()).toISOString(),
    allDay: false,
    assignedGroup: undefined,
    assignedCourse:  undefined,
    assignedChapter: undefined,
    assignedContent: null,
    durationTime: "00:45",
    urlToEvent: "",
}

export default function ManageEventModal({eventModalHelper, setEventModalHelper, exams, getExamsList, assignedModel}){
    const {t} = useTranslation();
    const { isConfirmed } = Confirm();
    const {F_showToastMessage} = useMainContext();
    const [currentEvent, setCurrentEvent] = useState(initialEventState);
    const [chapters, setChapters] = useState([]);
    const [selectedExam, setSelectedExam] = useState(undefined);

    useEffect(()=>{
        setSelectedExam(undefined);
        if(eventModalHelper?.assignedModel?.assignedCourse){
            CourseService.read(eventModalHelper?.assignedModel?.assignedCourse).then((res) => {
                if(res.status === 200 && res?.data && res.data?.chosenChapters){
                    setChapters(res.data?.chosenChapters);
                }
            })
        };

        setCurrentEvent(p=>({
            ...p,
            assignedCourse: eventModalHelper?.assignedModel?.assignedCourse??undefined,
            assignedGroup: eventModalHelper?.assignedModel?.assignedGroup??undefined,
        }));
    },[eventModalHelper.isOpen]);

    const returnType=(type)=>{
        if(type === 'ADD'){
            return 'Add'
        }else return ('Manage')
    };

    const save=()=>{
       if(eventModalHelper.type === 'ADD'){
           console.log("ADDD",currentEvent);
           EventService.add(currentEvent).then(res=>{
               setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined});
               setCurrentEvent(initialEventState);
               F_showToastMessage("Grades were saved success","success");
               getExamsList(assignedModel.assignedGroup, assignedModel.assignedCourse)
           }).catch(error=>console.log(error));

       }else if((eventModalHelper.type === 'EDIT')&&(selectedExam)){

           console.log('UPDATE',currentEvent);
           EventService.update(currentEvent).then(res=>{
               setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined});
               setCurrentEvent(initialEventState);
               F_showToastMessage("Updated successfully. Please refresh the page/tab.","success");
               getExamsList(assignedModel.assignedGroup, assignedModel.assignedCourse)
           }).catch(error=>console.log(error))
       }
    };

    const removeExam= async ()=>{
        let confirmed = await isConfirmed("Are you sure you want to delete this exam?");
        if(confirmed) {
            if(selectedExam){
                EventService.removeByExam(selectedExam._id).then(res=>{
                    setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined});
                    setCurrentEvent(initialEventState);
                    F_showToastMessage("Deleted successfully. Please refresh the page/tab.","success");
                    getExamsList(assignedModel.assignedGroup, assignedModel.assignedCourse)
                }).catch(error=> console.log(error));
            } else {
                F_showToastMessage("No exam selected","error");
            }
        } else {
            F_showToastMessage("Canceled","info");
        }
    };


    const handleManageExam=()=>{
        if(selectedExam){
            let filteredExam = exams?.find(e=> e._id === selectedExam?._id);
            setEventModalHelper(p=>({...p, type: 'EDIT'}));
            if(filteredExam && filteredExam?.examItem){
                setCurrentEvent(p=>({
                    ...p,
                    _id: filteredExam?.examItem?._id,
                    eventType: filteredExam?.examItem?.eventType,
                    creator: filteredExam?.examItem?.creator,
                    createdAt: filteredExam?.examItem?.createdAt,
                    date: filteredExam?.examItem?.date,
                    name: filteredExam?.examItem?.name,
                    durationTime: filteredExam?.examItem?.durationTime,
                    examCoefficient: filteredExam?.examItem?.examCoefficient,
                    assignedChapter: filteredExam?.examItem?.assignedChapter??null, //=> neded
                }))
            }
        }
    };


    const chaptersList = chapters?.length>0 ? chapters.map(({chapter})=><MenuItem key={chapter._id} value={chapter._id}>{chapter.name}</MenuItem>):[];
    const examsList = exams.length>0 ? exams.map(e=><FormControlLabel value={e._id}
                                                                      control={<Radio className="mr-2" style={{width: '20px', height: '20px', color: `rgba(82, 57, 112, 1)`}}/>}
                                                                      label={e.name} onChange={()=>{setSelectedExam(e)}}/>) : <p>{t("List is empty")}</p>

    return(
        <Dialog  

            PaperProps={{
             style:{borderRadius: "16px", background: theme.palette.glass.opaque, backdropFilter: "blur(20px)", maxWidth:"400px"}
             }} 
            open={eventModalHelper.isOpen}
            onClose={() => {
                setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined});
            }}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" >
                <Grid container className='d-flex justify-content-start '>
                    <Grid item xs={12}>
                        <Typography variant="h3" component="h2" style={{color:theme.palette.primary.lightViolet}}>
                            {eventModalHelper?.type === 'ADD' && t("Create New Column") }
                            {eventModalHelper?.type === 'MANAGE' && eventModalHelper.action === 'EDIT' && t("Manage") }
                            {eventModalHelper?.type === 'MANAGE' && eventModalHelper.action === 'DELETE' && t("Remove") }
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent >
                {((eventModalHelper.type === 'ADD') || (eventModalHelper.type === 'EDIT')) && (
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                required={true}
                                fullWidth={true}
                                variant="filled"
                                label={t('Exam name')}
                                name='name'
                                style={{maxWidth: '400px'}}
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentEvent.name}
                                onChange={({target:{name,value}}) =>{
                                    setCurrentEvent(p=>({...p,[name]:value}))
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl style={{maxWidth: '400px'}} margin="normal" variant="filled" fullWidth={true}>
                                <InputLabel id="demo-simple-select-label">{t('Select chapter')}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name='assignedChapter'
                                    value={currentEvent?.assignedChapter}
                                    //renderValue={p=> p.name}
                                    onChange={({target:{name,value}}) =>{
                                        setCurrentEvent(p=>({...p,[name]:value}))
                                    }}
                                >
                                    {chaptersList}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={t("Coefficient")}
                                fullWidth={true}
                                style={{maxWidth:'400px'}}
                                type={"number"}
                                variant="filled"
                                name='examCoefficient'
                                margin="normal"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{ inputProps: { min: 0, max: 20 } }}
                                value={currentEvent.examCoefficient}
                                onInput={({target:{name,value}}) => {
                                    const re = /[0-9]+/g;
                                    if(re.test(value) && value<=20 && value>=0){
                                        setCurrentEvent(p=>({...p,[name]:value}));
                                    }else{
                                        setCurrentEvent(p=>({...p,[name]:1}));
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
                {eventModalHelper.type === 'MANAGE'&&(
                    <FormControl component="fieldset" >
                        <RadioGroup
                            aria-label="exams-list"
                            defaultValue=""
                            name="radio-buttons-group"
                        >
                            {examsList}
                        </RadioGroup>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions className="d-flex  space-between justify-content-between m-3">
                <Button variant="contained" size="small" color="secondary" className="justify-content-start"
                    onClick={() => setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined})}
                >{t("Dismiss")}</Button>
                {(selectedExam && (eventModalHelper.type === 'MANAGE' && eventModalHelper.action === 'EDIT'))&& (
                    <>
                        <Button size="small" variant="contained" color="primary"
                                onClick={handleManageExam}
                        >{t("Manage")}</Button>
  
                    </>
                )}
                {(selectedExam && (eventModalHelper.type === 'MANAGE' && eventModalHelper.action === 'DELETE'))&& (
                    <>

                        <Button variant="contained" size="small" color="inherit"
                            onClick={removeExam}
                            >{t("Remove")}
                        </Button>
                    </>
                )}
                {((eventModalHelper.type === 'ADD') || (eventModalHelper.type === 'EDIT')) && (
                    <Button size="small" variant="contained" color="primary" 
                            disabled={false}
                            onClick={save}
                    >{t("Save")}</Button>
                )}
            </DialogActions>
        </Dialog>
    )
}