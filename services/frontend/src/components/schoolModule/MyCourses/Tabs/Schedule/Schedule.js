import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import RevoCalendar from "components/Calendar/Calendar";
import {useDispatch, useSelector} from "react-redux";
import AddEvent from "./AddEvent";
import EventService from "services/event.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import {myCourseActions} from "app/features/MyCourses/data";

const Schedule=()=> {
    const { t } = useTranslation();
    const [addEventHelper,setAddEventHelper] = useState({isOpen: false, type: undefined, date: undefined});
    const [customEvents, setCustomEvents] = useState([]);
    const [currentEvent, setCurrentEvent] = useState({});
    const [errorValidator, setErrorValidator]= useState({});
    const {formHelper, item:{schedule}} = useSelector(s=>s.myCourses);
    const dispatch = useDispatch();
    const { F_showToastMessage} = useMainContext();

    useEffect(()=>{
        if(schedule?.events?.length>0){
            setCustomEvents(schedule.events);
        }
    },[schedule, schedule?.events]);

    const addEvent=async(date,data)=>{
        setCurrentEvent({...data.data, date});
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
        if(!event.assignedSubject){
            error.assignedSubject = t('Assigned subject is required');
        }
        if(!event.assignedChapter){
            error.assignedChapter = t('Assigned chapter is required');
        }
        if(!event.assignedContent){
            error.assignedContent = t('Assigned content is required');
        }
        if(!event.assignedTrainer){
            error.assignedTrainer = t('Assigned trainer is required');
        }
        setErrorValidator(error);
        return error;
    }

    const updateEvent=async({type, data,data:{_id}})=>{
        let error = validateEvent(data);
        if (Object.keys(error).length===0||type==="remove"){
            switch (type){
                case "add":{
                    EventService.add(data).then(res=>{
                        //refreshEvents();

                        // if(res.data.eventId){
                        //     EventService.overview(res.data.eventId).then(res2=>{
                        //         if(res2.data){
                        //            dispatch(myCourseActions.updateEvent({type:'ADD', data: res2.data}))
                        //         }
                        //     })
                        // }

                        // Reload events, homeworks, exams
                        dispatch(myCourseActions.fetchItem(formHelper.itemId));

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
                        //refreshEvents();
                        //dispatch(myCourseActions.updateEvent({type:'UPDATE', data}))

                        // Reload events, homeworks, exams
                        dispatch(myCourseActions.fetchItem(formHelper.itemId));
                        
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
                    //dispatch(myCourseActions.updateEvent({type:'REMOVE', data}))
                    EventService.remove(data).then(res=>{
                        //dispatch(myCourseActions.fetchItemDetails({ itemId: item._id, type: 'PROGRAM' }));

                        // Reload events, homeworks, exams
                        dispatch(myCourseActions.fetchItem(formHelper.itemId));
                        
                        setAddEventHelper(p=>({...p, isOpen: false, type: undefined}));
                        //refreshEvents();
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
        } else {
            let errorKeys = Object.keys(error);
            errorKeys.forEach(key=>{
                F_showToastMessage(error[key], "error");
            })
        }
    }

     return (
        <Grid container >
            <Grid item xs={12}>
                <Paper elevation={10} style={{borderRadius:'0px 0px 6px 6px'}} className='p-2'>
                    <Grid container>
                        <Grid item xs={addEventHelper.isOpen ? 8 : 12} className="mt-4" >
                            <Paper elevation={10}>
                                <RevoCalendar events={customEvents} addEvent={addEvent} updateEvent={updateEvent} lang={'en'}
                                />
                            </Paper>
                        </Grid>
                        {addEventHelper.isOpen && (
                            <Grid item xs={addEventHelper.isOpen ? 4 : 0} className="mt-4 px-2 d-flex flex-column">
                                <AddEvent addEventHelper={addEventHelper}
                                          setAddEventHelper={setAddEventHelper}
                                          currentEvent={currentEvent}
                                          setCurrentEvent={setCurrentEvent}
                                          errorValidator={errorValidator}
                                          updateEvent={updateEvent}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
     )
 }

export default Schedule;