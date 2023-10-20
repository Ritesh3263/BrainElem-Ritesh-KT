import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import RevoCalendar from "../../../../Calendar/Calendar";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import EventSidebar from "./EventSidebar";
import EventService from "../../../../../services/event.service";
import CreateEvent from "../../../../Item/Event/Create";
import CertificationSessionService from "services/certification_session.service";
import "../SessionForm.scss"

export default function Schedule(){
    const { t } = useTranslation();
    const { F_showToastMessage,F_getHelper } = useMainContext();
    const {userPermissions, user} = F_getHelper();
    const [addEventHelper,setAddEventHelper] = useState({isOpen: false, type: undefined, date: undefined});
    const [customEvents, setCustomEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState({});
    const [assignedGroup, setAssignedGroup] = useState();
    const [errorValidator, setErrorValidator]= useState({});
    const [isConfirm, setIsConfirm] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(undefined);
    const [group, setGroup] =useState({})
    const [editEvent, setEditEvent] = useState({})
    const [currentCourseObject, setCurrentCourseObject] = useState({})
    const {
        currentSession,
        isOpenSessionForm,
    } = useSessionContext();


    useEffect(()=>{
        setErrorValidator({});
        refreshEvents();
        if (currentSession?.groups?.length > 0) {
            handleSelectGroup(currentSession.groups[0]);
        } else {
            setSelectedGroup(undefined);
        }
    },[isOpenSessionForm.sessionId,currentSession]);

    const handleSelectGroup = (group) => {
        if (group) {
            setGroup(group)
            // CertificationSessionService.newReadCourse(group?.duplicatedCoursePath.courses[0]?._id).then(res => {
            //     if (res.status === 200 && res?.data) {
            //         setCurrentCourseObject(res.data);
            //     }
            // }).catch(err => console.log(err))
            // updatedGroup.assignedCourse = currentCourseObject?._id,
            setSelectedGroup({
                eventType: "Exam",
                group: group,
                assignedGroup: group,
                assignedSession: currentSession?._id,
                assignedTrainer: user?.id,
                assignedCourse: group?.duplicatedCoursePath?.courses[0]?._id
            });
        }
    };


    const refreshEvents=()=>{
        if(isOpenSessionForm.sessionId){

             // find group where trainee belongs too
            let insideGroup = undefined; // no need to define it for trainers
            if (userPermissions.isTrainee) {
                currentSession.groups.map(x=>{
                    if(x.trainees.some(e => e._id === user.id)) {
                        insideGroup = x._id
                    }
                })
            }
            EventService.readEventsFromSession(isOpenSessionForm.sessionId,insideGroup).then(res=>{
                if(res.status === 200 && res.data?.length>0){
                    setCustomEvents(res.data.filter(event=>event.eventType !== 'Certification'));
                }
            }).catch(err=>console.log(err));
        }
    }

    const validateEvent=(event)=>{
        let error = {};
        if(!event.name){
            error.name = t('Event name is required');
        } else if(event.name.length < 3){
            error.name = t('Event name must be at least 3 characters');
        }
        if(!event.eventType){
            error.eventType = t('Event type is required');
        }
        if(!event.assignedGroup){
            error.assignedGroup = t('Assigned group is required');
        }
        if(!event.assignedCourse){
            error.assignedCourse = t('Assigned course is required');
        }
        if(!event.assignedChapter){
            error.assignedChapter = t('Assigned chapter is required');
        }
        if(!event.assignedContent){
            error.assignedContent = t('Assigned content is required');
        }
        setErrorValidator(error);
        return error;
    }

    const addEvent=async(date,data)=>{
        if(data?.type !== "addNew"){
            setSelectedGroup({
                ...data.data, 
                assignedChapter: data?.data?.assignedChapter?._id,
                assignedContent: data?.data?.assignedContent?._id
            })
        }else {
            setSelectedGroup({
                eventType: "Exam",
                group: group,
                assignedGroup: group,
                assignedSession: currentSession?._id,
                assignedTrainer: user?.id,
                assignedCourse: group?.duplicatedCoursePath?.courses[0]?._id
            });
        }
        console.log("addd event");
        setIsConfirm(false)
        setErrorValidator({});
        if(data.type === "update"){
            // setAddEventHelper({isOpen: true, type: data.type, date: date});
            if(typeof date.getMonth === "function"){
                setAddEventHelper({isOpen: true, type: data.type, date});
            } else {
                setAddEventHelper(prev=>({...prev, isOpen: true, type: data.type, date: new Date(date)}));
            }
        }else{
            if(typeof date.getMonth === 'function') setAddEventHelper(p=>({isOpen: true, type: 'ADD', date}))
            else setAddEventHelper(p=>({...p, isOpen: true, type: 'ADD'}))
        }
    };

    const updateEvent=async({type, data})=>{
        if(setIsConfirm){
            let error = validateEvent(data);
            if (Object.keys(error).length===0||type==="remove"){
                switch (type){
                    case "add":{
                        console.log("addEvent: ", data)
                        EventService.add(data).then(res=>{
                            refreshEvents();
                            setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                            F_showToastMessage("Event was added success", "success");
                            setErrorValidator({});
                        }).catch(err=>{
                            console.log("err=>",err)
                            setErrorValidator(err.response.data.message.errors);
                            F_showToastMessage("Fill empty fields", "error");
                        })
                        break;
                    }
                    case "update":{
                        console.log("updateEvent: ", data)
                        EventService.update(data).then(res=>{
                            refreshEvents();
                            setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                            F_showToastMessage("Event was updated success", "success");
                            setErrorValidator({});
                        }).catch(err=>{
                            console.log("err=>",err)
                            setErrorValidator(err.response.data.message.errors);
                            F_showToastMessage("Fill empty fields", "error");
                        })
                        break;
                    }
                    case "remove":{
                        console.log("removeEvent: ", data)
                        EventService.remove(data).then(res=>{
                            setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                            refreshEvents();
                            setErrorValidator({});
                            F_showToastMessage("Event was updated removed", "success");
                        }).catch(err=>{
                            console.log("err=>",err)
                            setErrorValidator(err.response.data.message.errors);
                            F_showToastMessage("Fill empty fields", "error");
                        })
                        break
                    }
                    default: break;
                }
            } 
            // else {
            //     let errorKeys = Object.keys(error);
            //     errorKeys.forEach(key=>{
            //         F_showToastMessage(error[key], "error");
            //     })
            // }
        }
    }

    return(
        <Grid container >
            <Grid item xs={12}>
                <Grid container >
                    <Grid item md={addEventHelper.isOpen ? 9 : 12} className="w-100" >
                       <Paper elevation={10}>
                           <RevoCalendar className="custom-calender" addEventHelper={addEventHelper} events={customEvents} addEvent={addEvent} updateEvent={updateEvent} lang={'en'} currentSession={currentSession}/>
                       </Paper>
                    </Grid>
                    {addEventHelper.isOpen && (
                        <Grid item md={addEventHelper.isOpen ? 3 : 0} className="mt-4 px-2 d-flex flex-column mb-popup">
                            <CreateEvent 
                                // data={customEvents}//event object 
                                data = {selectedGroup}
                                chapters={group?.duplicatedCoursePath?.courses[0]?.chosenChapters}
                                // contents={group?.duplicatedCoursePath?.courses[0]?.chosenChapters[0]?.chosenContents} 
                                hidden={["offline", "groups", "trainers", "sessions", "trainingModules"]}
                                trainingModules={[]}// Set empty array - those are only used for school subjects
                                onClose={()=>{setAddEventHelper(p => ({ ...p, isOpen: false })); refreshEvents()}}//Closing 
                            />
                             {/* <EventSidebar
                                addEventHelper={addEventHelper}
                                setAddEventHelper={setAddEventHelper}
                                updateEvent={updateEvent}
                                currentSession={currentSession}
                                currentEvent={currentEvent}
                                setCurrentEvent={setCurrentEvent}
                                errorValidator={errorValidator}/> */}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Grid>
    )
}