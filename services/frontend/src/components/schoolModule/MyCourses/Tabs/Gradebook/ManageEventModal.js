import React, {useState} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {now} from "moment";
import MenuItem from "@material-ui/core/MenuItem";

const initialEventState={
    addedFromGradebook: true,
    eventType: "Exam",
    name: "",
    note: "",
    examCoefficient: 1,
    date: new Date(now()).toISOString(),
    allDay: false,
    assignedCourse:  undefined,
    assignedChapter: undefined,
    assignedContent: null,
    durationTime: "00:45",
    urlToEvent: "",
}

const ManageEventModal=(props)=> {
    const{
        eventModalHelper,
        setEventModalHelper,
        exams,
    }=props;
    const {t} = useTranslation();
    const [currentEvent, setCurrentEvent] = useState(initialEventState);
    const [selectedExam, setSelectedExam] = useState(undefined);
    const [chapters, setChapters] = useState([]);

    const save=()=>{setEventModalHelper(p=>({...p, type: 'PREVIEW', isOpen: false}))}
    const remove=()=>{setEventModalHelper(p=>({...p, type: 'PREVIEW', isOpen: false}))}

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

    const examsList = exams.length>0 ? exams.map(e=><FormControlLabel value={e._id} control={<Radio className="mr-2" style={{width: '20px', height: '20px', color: `rgba(82, 57, 112, 1)`}}/>}
                                                                      label={e.name} onChange={()=>{setSelectedExam(e)}}/>) : <p>{t("List is empty")}</p>;
    const chaptersList = chapters?.length>0 ? chapters.map(({chapter})=><MenuItem key={chapter._id} value={chapter._id}>{chapter.name}</MenuItem>):[];

     return (
         <Dialog
             open={eventModalHelper.isOpen}
             onClose={() => {
                 setEventModalHelper({isOpen: false, type: 'ADD', assignedModel: undefined});
             }}
             maxWidth={"md"}
             fullWidth={true}
             aria-labelledby="alert-dialog-title"
             aria-describedby="alert-dialog-description"
         >
             <DialogTitle id="alert-dialog-title" >
                 <Grid container className='d-flex justify-content-start '>
                     <Grid item xs={12}>
                         <Typography variant="h3" component="h3" className="text-left" style={{fontSize:"26px"}}>
                             {eventModalHelper?.type === 'ADD' && t("Create new") }
                             {eventModalHelper?.type === 'MANAGE' && eventModalHelper.action === 'EDIT' && t("Manage") }
                             {eventModalHelper?.type === 'MANAGE' && eventModalHelper.action === 'DELETE' && t("Remove") }
                         </Typography>
                     </Grid>
                 </Grid>
             </DialogTitle>
             <DialogContent className="pl-5">
                 {((eventModalHelper.type === 'ADD') || (eventModalHelper.type === 'EDIT')) && (
                     <Grid container spacing={1}>
                         <Grid item xs={4}>
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
                         <Grid item xs={4}>
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
                         <Grid item xs={4}>
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
                                 onClick={remove}
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

export default ManageEventModal;