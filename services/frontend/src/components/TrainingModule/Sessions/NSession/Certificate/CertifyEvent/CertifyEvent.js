import React, {useEffect, useState} from "react";
import {Button, Paper} from "@material-ui/core";
import {now} from "moment";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker} from "@material-ui/pickers";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import EventService from "../../../../../../services/event.service";
import Typography from "@material-ui/core/Typography";
import {EButton} from "../../../../../../styled_components";

const eventModel={
    sessionId: undefined,
    certificateId: undefined,
    name: 'Certify Event',
    date: new Date(now()).toISOString(),
    eventType: 'Certification',
    description:'',
}

export default function CertifyEvent({isOpenCertifyEventModal, setIsOpenCertifyEventModal, currentSession, sessionReducerActionsType, sessionDispatch}){
    const {t} = useTranslation();
    const [currentEvent, setCurrentEvent] = useState(eventModel);
    const {F_showToastMessage} = useMainContext();

    useEffect(()=>{
        if(isOpenCertifyEventModal.isOpen){
            if(isOpenCertifyEventModal.openType === 'ADD'){
                setCurrentEvent(p=>({...p,
                    sessionId: currentSession._id,
                    certificateId: currentSession?.certificate,
                }));
            }else if(isOpenCertifyEventModal.openType === 'PREVIEW'){
                setCurrentEvent(p=>({...currentSession?.event}));
            }
        }
    },[isOpenCertifyEventModal.isOpen])

    const save=()=>{
        if(currentEvent.sessionId && currentEvent.certificateId){
            EventService.addCerificationEvent(currentEvent).then(res=>{
                F_showToastMessage("Event was added success", "success");
                sessionDispatch({type: sessionReducerActionsType.BASIC_UPDATE,
                    payload: {field: 'event', value: currentEvent}});
            })
            console.log("currentEvent",currentEvent);
            setIsOpenCertifyEventModal({isOpen: false, openType:'PREVIEW'});

        };
    };
    return(
        <Paper elevation={10} className='p-2'>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h2" className="text-center text-justify" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {`${isOpenCertifyEventModal.openType === 'PREVIEW' ? t("Preview certify event") : t("Create certify event")}`}
                    </Typography>
                </Grid>
                <Grid item xs={12} className="d-flex flex-column align-items-center justify-content-start">
                    <TextField label={t("Event name")} margin="dense"
                               InputProps={{
                                   readOnly: isOpenCertifyEventModal.openType === 'PREVIEW',
                                   disableUnderline: false,
                               }}
                               name='name'
                               fullWidth
                               style={{maxWidth: "400px"}}
                               variant="filled"
                               required={true}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={currentEvent.name}
                               onInput={({target:{name, value}}) =>{setCurrentEvent(p=>({...p, [name]: value}))}}
                    />
                    <KeyboardDatePicker
                        InputProps={{
                            disableUnderline: false,
                        }}
                        readOnly={isOpenCertifyEventModal.openType === 'PREVIEW'}
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
                        inputVariant="filled"
                        value={currentEvent.date}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                        onChange={(date) => {
                            if (date && date._isValid) {
                                setCurrentEvent(p=>({...p, date: new Date(date).toISOString()}))
                            }
                        }}
                    />
                    <FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}
                                 error={false}
                                 variant='filled' >
                        <InputLabel id="eventType-select-label">{t("Event type")}</InputLabel>
                        <Select
                            name='eventType'
                            labelId="eventType-select-label"
                            id="eventType-select"
                            value={"Certification"}
                            readOnly={isOpenCertifyEventModal.openType === 'PREVIEW'}
                            disableUnderline={false}
                            onChange={(e) =>{}}
                        >
                            <MenuItem value="Certification">{t("Certify Event")}</MenuItem>
                        </Select>
                    </FormControl>
                    {/*<FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}*/}
                    {/*             error={false}*/}
                    {/*             variant={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer) ? 'standard' : 'filled'}>*/}
                    {/*    <InputLabel id="assignedGroup-select-label">{t("Select group")}</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        name='assignedGroup'*/}
                    {/*        labelId="assignedGroup-select-label"*/}
                    {/*        id="assignedGroup-select"*/}
                    {/*        value={currentEvent.assignedGroup}*/}
                    {/*        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer)}*/}
                    {/*        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer)}*/}
                    {/*        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}*/}
                    {/*    >*/}
                    {/*        {groupsList}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    {/*<FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}*/}
                    {/*             error={false}*/}
                    {/*             variant={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer) ? 'standard' : 'filled'}>*/}
                    {/*    <InputLabel id="assignedCourse-select-label">{t("Assign course")}</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        name='assignedCourse'*/}
                    {/*        labelId="assignedCourse-select-label"*/}
                    {/*        id="assignedCourse-select"*/}
                    {/*        value={currentEvent.assignedCourse}*/}
                    {/*        readOnly={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer)}*/}
                    {/*        disableUnderline={(isOpenSessionForm.type === 'PREVIEW' && !userPermissions.isTrainer)}*/}
                    {/*        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}*/}
                    {/*    >*/}
                    {/*        {coursesList}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    {/*<FormControl fullWidth margin="dense" required={true} style={{maxWidth: "400px"}}*/}
                    {/*             error={false}*/}
                    {/*             hidden={(userPermissions.isTrainer)}*/}
                    {/*             variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}>*/}
                    {/*    <InputLabel id="assignedTrainer-select-label">{t("Assign trainer")}</InputLabel>*/}
                    {/*    <Select*/}
                    {/*        name='assignedTrainer'*/}
                    {/*        labelId="assignedTrainer-select-label"*/}
                    {/*        id="assignedTrainer-select"*/}
                    {/*        value={currentEvent?.assignedTrainer}*/}
                    {/*        readOnly={(isOpenSessionForm.type === 'PREVIEW')}*/}
                    {/*        disableUnderline={(isOpenSessionForm.type === 'PREVIEW')}*/}
                    {/*        onChange={(e) =>updateValueHandler(e.target.name, e.target.value)}*/}
                    {/*    >*/}
                    {/*        {trainersList}*/}
                    {/*    </Select>*/}
                    {/*</FormControl>*/}
                    <TextField label={t("Description (additional info)")} margin="dense"
                               InputProps={{
                                   readOnly: isOpenCertifyEventModal.openType === 'PREVIEW',
                                   disableUnderline: false,
                               }}
                               name='description'
                               fullWidth
                               style={{maxWidth: "400px"}}
                               variant='filled'
                               required={false}
                               InputLabelProps={{
                                   shrink: true,
                               }}
                               value={currentEvent.description}
                               onInput={({target:{name, value}}) =>{setCurrentEvent(p=>({...p, [name]: value}))}}
                    />
                </Grid>
                <Grid item xs={12} className='mt-2 d-flex justify-content-between'>
                    <EButton
                        eVariant="secondary"
                        eSize="small"
                        onClick={() => {setIsOpenCertifyEventModal({isOpen: false,openType:'PREVIEW'})}}
                    >
                        {t("Dismiss")}
                    </EButton>
                    {isOpenCertifyEventModal.openType === 'ADD' && (
                        <EButton
                            eVariant='primary'
                            eSize="small"
                            onClick={save}
                        >
                            {t("Save")}
                        </EButton>
                    )}
                </Grid>
            </Grid>
        </Paper>
    )
}