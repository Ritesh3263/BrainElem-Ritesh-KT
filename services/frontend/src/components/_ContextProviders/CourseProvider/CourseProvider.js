import React, {useContext, createContext, useState, useReducer} from "react";

const CourseContext = createContext(undefined);
const courseReducerActionType={
    'INIT': 'INIT',
    'NEW_COURSE': 'NEW_COURSE',
    'BASIC_UPDATE': 'BASIC_UPDATE',
    'CHAPTERS_UPDATE': 'CHAPTERS_UPDATE',
    'UPDATE_CHAPTERS_DND': 'UPDATE_CHAPTERS_DND',
    'CONTENTS_UPDATE': 'CONTENTS_UPDATE',
    'UPDATE_CONTENTS_DND': 'UPDATE_CONTENTS_DND',
}
const initialCourseState = {
    name: '',
    category: '',
    description: '',
    level: '',
    type: '',
    image: undefined,
    module: undefined,
    creator: undefined,
    chosenChapters:[],
}

const courseReducer=(coState, action)=>{
    switch (action.type){
        case courseReducerActionType.NEW_COURSE:{
            return {...initialCourseState, ...action.payload};
        }
        case courseReducerActionType.INIT:{
            return action.payload;
        }
        case courseReducerActionType.BASIC_UPDATE:{
            return {...coState, [action.payload.field]: action.payload.value}
        }
        case courseReducerActionType.CHAPTERS_UPDATE:{
            if(action.payload.type === 'ADD'){
                let newChapter = {
                    chapter:{
                        _id: action.payload.newChap._id,
                        name: action.payload.newChap.name,
                        durationTime: action.payload.newChap.durationTime,
                    },
                    chosenContents:[],
                }
                return {...coState, chosenChapters: [...coState.chosenChapters, newChapter]};
            }else if(action.payload.type === 'REMOVE'){
                let filtered = coState.chosenChapters.filter(ch=> ch?.chapter?._id !== action.payload.chapterId);
                return {...coState, chosenChapters: filtered};
            }
            return coState;
        }
        case courseReducerActionType.UPDATE_CHAPTERS_DND:{
            return {...coState, chosenChapters: action.payload}
        }
        case courseReducerActionType.CONTENTS_UPDATE:{
            let updatedChapters = Object.assign([],coState.chosenChapters);
            if(action.payload.type === 'ADD'){
                if(coState.chosenChapters[action.payload.currentChapterIndex].chapter._id === action.payload.chapterId){
                    let cont = {content:{...action.payload.content}}
                    updatedChapters[action.payload.currentChapterIndex].chosenContents.push(cont);
                }
            }else if(action.payload.type === 'REMOVE'){
                if(coState.chosenChapters[action.payload.currentChapterIndex].chapter._id === action.payload.chapterId){
                    updatedChapters[action.payload.currentChapterIndex].chosenContents =
                        updatedChapters[action.payload.currentChapterIndex]
                        .chosenContents.filter(({content})=>content._id !== action.payload.contentId);
                }
            }
            return {...coState, chosenChapters: updatedChapters}
        }
        case courseReducerActionType.UPDATE_CONTENTS_DND:{
            let updatedChapters = Object.assign([],coState.chosenChapters);
            if(coState.chosenChapters[action.payload.currentChapterIndex].chapter._id === action.payload.chapterId){
                updatedChapters[action.payload.currentChapterIndex].chosenContents = action.payload.items;
            }
            return {...coState, chosenChapters: updatedChapters}
        }
        default:
            return coState;
    }
}

export function CourseProvider({children}){
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, courseId: 'NEW'})
    const [currentCourse, courseDispatch] = useReducer(courseReducer, initialCourseState);
    const [isOpenEditChapterForm, setIsOpenEditChapterForm]=useState({isOpen: false, chapterId: undefined});
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState({});
    const [currentChapterIndex, setCurrentChapterIndex] = useState(undefined);

    const [currentTrainingModule, setCurrentTrainingModule]=useState({});
    const [currentTrainingModuleIndex, setCurrentTrainingModuleIndex]=useState(undefined);

    const [trainingModules, setTrainingModules] = useState([]);

    const [contents, setContents] = useState([]);

    return(
        <CourseContext.Provider
            value={{
                courseReducerActionType,
                editFormHelper,
                setEditFormHelper,

                currentTrainingModule,
                setCurrentTrainingModule,

                currentTrainingModuleIndex,
                setCurrentTrainingModuleIndex,

                currentCourse,
                courseDispatch,

                isOpenEditChapterForm,
                setIsOpenEditChapterForm,

                chapters,
                setChapters,

                currentChapter,
                setCurrentChapter,

                currentChapterIndex,
                setCurrentChapterIndex,

                trainingModules,
                setTrainingModules,

                contents,
                setContents,
            }}
        >
            {children}
        </CourseContext.Provider>
    )
}

export const useCourseContext=()=> useContext(CourseContext);