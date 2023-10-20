import React, {lazy, useEffect, useState} from "react";
import RevoCalendar from "../Calendar/Calendar";
// import EventModal from "../Calendar/helpers/EventModal";
import EventService from "../../services/event.service"
import AuthService from "../../services/auth.service";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {useTranslation} from "react-i18next";
import {FormControlLabel, FormGroup, Paper} from "@material-ui/core";
import Switch from "styled_components/Switch";
import { Col, Row } from "react-bootstrap";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from '@mui/material/Grid';

const EventModal = lazy(() => import("../Calendar/helpers/EventModal"));

export default function Schedule(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const [openDialog, setOpenDialog] = useState(false);
    const [eventType,setEventType] = useState({type:"",date:""});
    const [customEvents, setCustomEvents] = useState([]);
    const [fromContentDataForEvent, setFromContentDataForEvent] = useState(null);
    const [calendarSelectedClass, setCalendarSelectedClass]= useState('ALL');
    const [classes1, setClasses1]= useState([]);
    const [studentPreview, setStudentPreview] = useState(false)
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper} = useMainContext();
    const {user, userPermissions} = F_getHelper();
    // mock for now..
    const [revoCalendarLanguage, setRevoCalendarLanguage] = useState("en");
    const [disabled, setDisabled] = useState(null);

    useEffect(()=>{
        //let _user = AuthService.getCurrentUser();
        let user_language = i18n.language; //_user?.language??"";
        if(user_language === "pl"){
            setRevoCalendarLanguage("pl");
        }else if(user_language === "fr"){
            setRevoCalendarLanguage("fr");
        }else{
            setRevoCalendarLanguage("en");
        }
        setMyCurrentRoute("Schedule")
    },[i18n.language])

    useEffect(()=>{
        EventService.getMyClasses().then(res=>{
            if(res.data){
                if (userPermissions.isParent)
                setClasses1([res.data]);
                else
                setClasses1(res.data);
            }
        })
        assignEvents();
    },[]);

    useEffect(() => {
        EventService.getEvents().then(res=>{
            
            if(res.data){
                setDisabled(true);
            }
        })
      }, [customEvents]);

    useEffect(()=>{
        if(studentPreview){
            if (calendarSelectedClass)
            EventService.getTraineePreviewEvents(calendarSelectedClass).then(res=>{
                if(res.data){
                    setCustomEvents(res.data.filter(event=>event.eventType !== 'Certification'));
                }
            })

        } else {
            assignEvents(calendarSelectedClass)
        }
        
    },[studentPreview]);

    function assignEvents(groupId){
            setDisabled(false);
            setStudentPreview(false);
            EventService.getEvents().then(res=>{
                if(groupId === undefined || groupId === 'ALL'){
                    console.log("all")
                    setCustomEvents(res.data.filter(event=>event.eventType !== 'Certification'));
                }else{
                    console.log("byGroupId",groupId)
                    let newData3 = [];
                    newData3 = res.data.filter(i=> i.assignedGroup?._id === groupId);
                    setCustomEvents(newData3.filter(event=>event.eventType !== 'Certification'));
                }
        });
    }

    async function updateEvent({type, data}){
        switch (type){
            case "add":{
                await EventService.add(data).then(res=>{
                    F_showToastMessage(t("Event was added success"), "success");
                }).catch(error=>console.log(error))
                assignEvents();
                // setCustomEvents(p=>{
                //     let val = Object.assign([],p);
                //     val.push(data);
                //     return val;
                // })
                break;
            }
            case "update":{
                await EventService.update(data).then(res=>{
                    F_showToastMessage(t("Event was updated success"), "success");
                }).catch(error=>console.log(error))
                assignEvents();
                // setCustomEvents(p=>{
                //     let val = Object.assign([],p);
                //     const index = val.findIndex(item => item._id === data._id);
                //     val[index] = data;
                //     return val;
                // })
                break;
            }
            case "remove":{
                await EventService.remove(data).then(res=>{
                    F_showToastMessage(t("Event was updated removed"), "success");
                }).catch(error=>console.log(error))
                assignEvents();
                // setCustomEvents(p=>{
                //     let val = Object.assign([],p);
                //     val = val.filter(item=> item._id !== data);
                //     return val;
                // })
                break
            }
            default: break;
        }
    }

        const groupsList = classes1.map((item, index)=><MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>);

    async function addEvent(selectedDate, eventType){
        const setDate = async()=> {
            await setEventType({type: eventType.type, date: selectedDate.toISOString(), data: eventType.data});
        }
            setDate().then(() => setOpenDialog(true));
    }
    return(
        <Grid container>
            <Grid item xs={12}>
                <>
                    <Row >
                        <Col >
                            {userPermissions.isTrainer || userPermissions.isClassManager || userPermissions.isInspector ? (
                                <FormControl style={{minWidth:'150px', maxWidth:'400px'}} className="ml-5 my-1">
                                    <InputLabel id="demo-simple-select-label">{t("Select class")}</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={calendarSelectedClass}
                                        input={<Input/>}
                                        onChange={(e) => {
                                            setCalendarSelectedClass(e.target.value);
                                            assignEvents(e.target.value);
                                        }}
                                    >
                                        {groupsList}
                                        <MenuItem key={'ALL'} value={'ALL'}>{t('ALL')}</MenuItem>
                                    </Select>
                                </FormControl>
                            ): null}
                            {classes1.find(x=>x._id===calendarSelectedClass)?.classManager===user.id &&(
                                // <Switch name={t("Student Preview")} description={t("Show my students events in other subjects")} state={studentPreview} setState={setStudentPreview}></Switch>
                                <FormControl component="fieldset" variant="standard" className="ml-5 mt-1">
                                    <FormLabel component="legend"><small>{t("Show my students events in other subjects")}</small></FormLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch checked={studentPreview}
                                                    onChange={()=>setStudentPreview(p=>!p)}
                                                    name="Switch_show" size="small"
                                                    disabled={!disabled}
                                                    color="primary"
                                                    className="ml-2"/>}
                                        label={studentPreview ? t("On") : t("Off")}
                                    />
                                </FormControl>
                            )}
                        </Col>
                    </Row>

                    <RevoCalendar events={customEvents} addEvent={addEvent} updateEvent={updateEvent} lang={revoCalendarLanguage}/>
                    <EventModal isOpen={openDialog}
                                setOpen={setOpenDialog}
                                eventAction={updateEvent}
                                eventInfo={eventType}
                                fromContentDataForEvent={fromContentDataForEvent}
                                setFromContentDataForEvent={setFromContentDataForEvent}
                    />
                </>
            </Grid>
        </Grid>
    )
}