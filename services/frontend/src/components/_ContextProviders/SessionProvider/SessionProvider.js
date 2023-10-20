import React, {useContext, createContext, useState, useReducer} from "react";
import {now} from "moment";
import IdGeneratorHelper from "../../common/IdGeneratorHelper";

const SessionContext = createContext(undefined);

const sessionReducerActionsType={
    'INIT':'INIT',
    'ADD':'ADD',
    'REMOVE':'REMOVE',
    'BASIC_UPDATE':'BASIC_UPDATE',
    'UPDATE_GENERAL':'UPDATE_GENERAL',
    'UPDATE_INTERNSHIP_GENERAL':'UPDATE_INTERNSHIP_GENERAL',
    'UPDATE_INTERNSHIP_TRAINEE_STATUS':'UPDATE_INTERNSHIP_TRAINEE_STATUS',
    'CHANGE_CERTIFICATE':'CHANGE_CERTIFICATE',
    'ADD_GROUP':'ADD_GROUP',
    'TRAINEES_IN_GROUP_ACTION':'TRAINEES_IN_GROUP_ACTION',
    'TRAINEES_IN_TEAM_ACTION':'TRAINEES_IN_TEAM_ACTION',
    'REMOVE_GROUP':'REMOVE_GROUP',
    'UPDATE_EXAMINERS':'UPDATE_EXAMINERS',
    'UPDATE_INTERNSHIPS':'UPDATE_INTERNSHIPS',
};

const initialSessionState={
    name: '',
    enrollmentStartDate:new Date(now()).toISOString(),
    enrollmentEndDate:new Date(now()).toISOString(),
    startDate: new Date(now()).toISOString(),
    endDate: new Date(now()).toISOString(),
    digitalCode: 'sample data',
    traineesLimit: 1000,
    coursePath: '64b11050f472b7083848a32b',
    coordinator: null,
    format: '64a68f4c7013d1001efdcaa1',
    trainingManager: '',
    category: '64a68c9b7013d1001efdc7e9',
    isSendToCloud: true,
    isPublic: true,
    groups:[{name: "Session Group", trainees: []}],
    unassignedTrainees:[],
    event: null,
    internships:[],
    examiners:[],
    certificate: '64a68ed87013d1001efdca7a',
    gradingScale:null,
    selectedTrainees: [],
};


// todo extract to a util method because it's also used in the assignTrainee Component
const isIdPresentInTrainees = (data, idToFind) =>  {
    if (!data || !data.groups || !Array.isArray(data.groups)) {
      return false; // Invalid input data or missing groups array
    }
  
    // Loop through the groups array
    for (const group of data.groups) {
      if (!group.trainees || !Array.isArray(group.trainees)) {
        continue; // Skip this group if trainees array is missing or not an array
      }
  
      // Loop through the trainees array in the current group
      for (const trainee of group.trainees) {
        // Check if the current trainee's "_id" matches the idToFind
        if (trainee._id === idToFind) {
          return true; // Found a matching _id in trainees, return true
        }
      }
    }
  
    // If no matching _id is found in trainees, return false
    return false;
  }
const SessionReducer=(sesState, action)=>{
    switch (action.type){
        case sessionReducerActionsType.INIT:{
            if(action.payload==='EMPTY'){
                return initialSessionState;
            }else{
                delete sesState.deletedUnassignedTrainees // clear deletedUnassignedTrainees
                return {...initialSessionState, ...action.payload}
            }
        }
        case sessionReducerActionsType.ADD: {
            console.log(action.payload)
            return sesState;
        }
        case sessionReducerActionsType.REMOVE: {
            console.log(action.payload)
            return sesState;
        }
        case sessionReducerActionsType.BASIC_UPDATE: {
            console.log('BASIC_UPDATE',action.payload)
            return {...sesState, [action.payload.field]: action.payload.value};
        }
        case sessionReducerActionsType.UPDATE_INTERNSHIP_GENERAL: {
            let val = Object.assign({},sesState);
            let internshipIndex = val.internships.findIndex(intern => intern._id === action.payload.internshipId);
            if(internshipIndex>-1){
                val.internships[internshipIndex] = {...val.internships[internshipIndex], [action.payload.fieldName]: action.payload.value};
            }
            return val;
        }
        case sessionReducerActionsType.CHANGE_CERTIFICATE: {
            return {...sesState, certificate: action.payload}
        }
        case sessionReducerActionsType.ADD_GROUP: {
            let newGroup ={
                _id: IdGeneratorHelper(16),
                new:true,
                name: action.payload||`Group-${sesState.groups.length+1 || 1}`,
                courses:[],
                trainees:[],
            }
            return {...sesState, groups: [...sesState.groups, newGroup]}
        }
        case sessionReducerActionsType.UPDATE_EXAMINERS: {
            if(action.payload.type === 'ADD'){
                let newExaminer = {
                    _id: action.payload.examiner?._id,
                    name: action.payload.examiner?.name,
                    surname: action.payload.examiner?.surname,
                    settings: { role: action.payload.examiner?.settings?.role},
                    // isNewExaminer: true,
                }
                return {...sesState, examiners: [...sesState.examiners, newExaminer]};
            }else if(action.payload.type === 'REMOVE'){
                let newList = sesState.examiners.filter(e=> e._id !== action.payload.examinerId);
                return {...sesState, examiners: newList};
                // let deletedExaminers = sesState.deletedExaminers? sesState.deletedExaminers : [];
                // if (deletedExaminers.findIndex(e=> e._id === action.payload.examinerId) === -1){
                //     deletedExaminers.push(action.payload.examinerId);
                // }
                // return {...sesState, examiners: newList, deletedExaminers};
            }else{
                return sesState;
            }
        }
        case sessionReducerActionsType.TRAINEES_IN_TEAM_ACTION: {
            if(action.payload.type === 'ADD'){
                let group = sesState?.groups[action.payload.groupIndex];
                group.trainees = action.payload.trainees.map(t=>({...t, checked:true})); // now, select only once!
                return {...sesState, groups: [group]}
            } else if(action.payload.type === 'REMOVE') { // list of trainees to be removed
                let group = sesState?.groups[action.payload.groupIndex];
                group.trainees = group.trainees.filter(t=> !action.payload.trainees.includes(t._id));
                return {...sesState, groups: [group]}
            } else {
                console.log(action.payload, 'action.payload')
                return sesState;
            }

        }
        case sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION: {
            if(action.payload.type === 'REMOVE'){
                let unassignedTrainees = sesState?.groups[action.payload.groupIndex]?.trainees.find(u=>u._id === action.payload.traineeId);
                let groups = sesState?.groups;
                if (sesState){
                    if (sesState.deletedUnassignedTrainees){
                        sesState.deletedUnassignedTrainees.push(action.payload.traineeId);
                    }else{
                        sesState.deletedUnassignedTrainees = [action.payload.traineeId];
                    }
                }
                groups[action.payload.groupIndex].trainees = groups[action.payload.groupIndex]?.trainees.filter(u=>u._id !== action.payload.traineeId);
                return {...sesState, groups, unassignedTrainees: [...sesState.unassignedTrainees, unassignedTrainees] }
            }else if(action.payload.type === 'ADD'){
                let groups = sesState?.groups;
                let traineeList =[]
                action.payload.trainee.trainee.forEach((e) => {
                   const item = {...e, checked: true}
                   traineeList.push(item)
                })

                // todo - fix the adding n number of trainees bug
                if(isIdPresentInTrainees(sesState, action.payload.trainee._id)) {
                    groups[action.payload.groupIndex].trainees = groups[action.payload.groupIndex].trainees.filter((trainee) => trainee._id !== action.payload.trainee._id)
                } else{
                    groups[action.payload.groupIndex].trainees = [...groups[action.payload.groupIndex].trainees, {...action.payload.trainee, trainee: traineeList, new: true}];
                }
                // console.log(action.payload.trainee, 'sesState, action.payload.trainee._id')
                // let unassignedTrainees =  sesState?.unassignedTrainees?.filter(tr=> tr._id !== action.payload.trainee._id);

                let unassignedTrainees = sesState?.unassignedTrainees
                return {...sesState, groups, unassignedTrainees}
                
            } else if(action.payload.type === 'UPDATE_TRAINEE') {
                const groups = sesState?.groups
                groups[action.payload.groupIndex].trainees.forEach((traineeList) => {
                    traineeList.trainee.forEach((trainee) => {
                        if(trainee._id === action.payload.traineeId) {
                            trainee.checked = !trainee.checked
                        }
                    })})
                return {...sesState, groups}
            } else if(action.payload.type === 'SELECTED') {
                let groups = sesState?.groups;
                groups[action.payload.groupIndex] = {...groups[action.payload.groupIndex], selected: action.payload.selected}
                return {...sesState, groups}

            }
            return sesState;
        }
        case sessionReducerActionsType.UPDATE_INTERNSHIPS: {
            if(action.payload.type === 'REMOVE'){
                return {...sesState, internships: sesState.internships.filter(i=> i._id !== action.payload.internshipId)}
            }else if(action.payload.type === 'ADD'){
                return {...sesState, internships: [...sesState.internships,action.payload.internship]}
            }
            return sesState;
        }
        case sessionReducerActionsType.UPDATE_INTERNSHIP_TRAINEE_STATUS: {
            if(action.payload.type === 'UPDATE') {
                let newData = sesState.groups.find(i=> i._id === action.payload.groupId);
                let index1 = sesState.groups.findIndex(i=> i._id === action.payload.groupId);
                if(newData){
                    let newData2 = newData.trainees.find(tr=> tr._id === action.payload.traineeId);
                    let index2 = newData.trainees.findIndex(tr=> tr._id === action.payload.traineeId);
                    if(newData2){
                        let newData3 = newData2?.certificates.find(c => c?.certificationSession === sesState._id);
                        let index3 = newData2?.certificates.findIndex(c => c?.certificationSession === sesState._id);
                        if(newData3){
                            //return sesState.groups[index1].trainees[index2].certificates[index3].internshipStatus = true;
                            let newData4 = sesState;
                            newData4.groups[index1].trainees[index2].certificates[index3].internshipStatus = true;
                            return  newData4;
                        }
                    }
                }
            }
            return sesState;
        }
        default:
            console.log(action.payload)
            return sesState;
    }
};


export function SessionProvider({children}){
    const [isOpenSessionForm, setIsOpenSessionForm] = useState({isOpen: false, type: 'PREVIEW', sessionId: undefined, active: undefined});
    const [currentSession, sessionDispatch] = useReducer(SessionReducer,initialSessionState);

    return(
        <SessionContext.Provider
            value={{
                isOpenSessionForm,
                setIsOpenSessionForm,

                initialSessionState,
                sessionReducerActionsType,
                currentSession,
                sessionDispatch,

            }}>
            {children}
        </SessionContext.Provider>
    )
}
export const useSessionContext=()=>useContext(SessionContext);