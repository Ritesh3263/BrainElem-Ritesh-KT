import React, {useContext, createContext, useState, useReducer} from "react";
import {now} from "moment";

const CoursePathContext = createContext(undefined);

const coursePathActionType={
    INIT: 'INIT',
    NEW_TRAINING_PATH: 'NEW_TRAINING_PATH',
    BASIC_UPDATE: 'BASIC_UPDATE',
    UPDATE_CONTENTS: 'UPDATE_CONTENTS',
    UPDATE_CONTENTS_DND: 'UPDATE_CONTENTS_DND',
    SET_CERTIFICATE: 'SET_CERTIFICATE',
}

const initialCoursePathState = {
    name: "",
    description: "",
    creator: "",
    image: null,
    level: "",
    module: "",
    type: "",
    category:{},
    courses:[],
    internships:[],
}

const coursePathReducer=(trpState, action)=>{
    switch (action.type){
        case coursePathActionType.NEW_TRAINING_PATH:{
            return {...initialCoursePathState, ...action.payload};
        }
        case coursePathActionType.INIT:{
            return action.payload;
        }
        case coursePathActionType.BASIC_UPDATE:{
            return {...trpState, [action.payload.field]: action.payload.value}
        }
        case coursePathActionType.UPDATE_CONTENTS:{
            if(action.payload.type === 'ADD'){
                return {...trpState, courses: [...trpState.courses, action.payload.course]};
            }else if(action.payload.type === 'REMOVE'){
                let coursesList = trpState.courses.filter(con=> con._id !== action.payload.courseId);
                return {...trpState, courses: coursesList}
            }
            break;
        }
        case coursePathActionType.UPDATE_INTERNSHIPS:{
            if(action.payload.type === 'ADD'){
                return {...trpState, internships: [...trpState.internships, action.payload.internship]};
            }else if(action.payload.type === 'REMOVE'){
                let internshipsList = trpState.internships.filter(int=> int !== action.payload.internshipId);
                return {...trpState, internships: internshipsList}
            }
            break;
        }
        case coursePathActionType.UPDATE_CONTENTS_DND:{
            return {...trpState, courses: action.payload};
        }
        case coursePathActionType.SET_CERTIFICATE:{
            return {...trpState, certificate: action.payload};
        }
        default:
            return trpState;
    }
};

export function CoursePathProvider({children}){

    const [currentCoursePath, coursePathDispatch] = useReducer(coursePathReducer, initialCoursePathState);

    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, coursePathId: 'NEW'})

    return(
        <CoursePathContext.Provider
            value={{
                coursePathActionType,
                currentCoursePath,
                coursePathDispatch,

                editFormHelper,
                setEditFormHelper,
            }}
        >{children}</CoursePathContext.Provider>
    )
}

export const useCoursePathContext=()=>useContext(CoursePathContext);