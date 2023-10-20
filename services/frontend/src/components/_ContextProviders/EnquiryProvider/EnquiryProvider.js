import React, {useContext, createContext, useState, useReducer} from "react";
import {now} from "moment";

const EnquiryContext = createContext(undefined);
const enquiryReducerActionType={
    'INIT': 'INIT',
    'NEW_ENQUIRY':'NEW_ENQUIRY',
    'BASIC_UPDATE': 'BASIC_UPDATE',
    'UPDATE_TRAINEES': 'UPDATE_TRAINEES',
}
const initialCourseState = {
    status: 'New',
    name: "",
    company:{},
    contact:{},
    architect: '', // actually moduleManager
    digitalCode: '',
    certificationSession: '',
    startDate: new Date(now()).toISOString(),
    endDate: new Date(now()).toISOString(),
    estimatedStartDate: 0,
    additionalQuestion:'',
    traineesCount: 0,
    traineesLimit: 0,
    timeFormat: 'weekends',
    trainees:[],
}

const enquiryReducer=(enState, action)=>{
    switch (action.type){
        case enquiryReducerActionType.NEW_ENQUIRY:{
            return {...initialCourseState};
        }
        case enquiryReducerActionType.INIT:{
            return action.payload;
        }
        case enquiryReducerActionType.BASIC_UPDATE:{
            if(action.payload.field){
                return {...enState,[action.payload.field]:action.payload.value}
            }else if(action.payload.fields){
                return {...enState, [action.payload.fields[0]]: {...enState[action.payload.fields[0]], [action.payload.fields[1]] : action.payload.value} };
            }else{
                return enState;
            }
        }
        case enquiryReducerActionType.UPDATE_TRAINEES:{
            if(action.payload.type === 'REMOVE'){
                let traineesList = enState.trainees.filter(tr => tr._id !== action.payload.traineeId);
                return {...enState, trainees: traineesList}
            }else if(action.payload.type === 'ADD'){
                // if( less students than enquiry limit allows)
                if(action.payload.traineesLimit > enState.trainees.length){
                    let newTrainee ={
                        _id: action.payload.trainee._id,
                        name: action.payload.trainee.name,
                        surname: action.payload.trainee.surname,
                    }
                    return {...enState, trainees: [...enState?.trainees,newTrainee]}
                }
            }else{
                return enState;
            }
        }

        default:
            return enState;
    }
}

export function EnquiryProvider({children}){
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, enquiryId: 'NEW'})
    const [currentEnquiry, enquiryDispatch] = useReducer(enquiryReducer, initialCourseState);

    return(
        <EnquiryContext.Provider
            value={{
                currentEnquiry,
                enquiryDispatch,
                enquiryReducerActionType,

                editFormHelper,
                setEditFormHelper,
            }}
        >
            {children}
        </EnquiryContext.Provider>
    )
}

export const useEnquiryContext=()=> useContext(EnquiryContext);