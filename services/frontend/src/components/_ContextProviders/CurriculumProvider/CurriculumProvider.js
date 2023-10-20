import React, {useContext, createContext, useState, useReducer} from "react";

const CurriculumContext = createContext(undefined);

const initialValidatorState={
    curriculumName: false,
    levelOfCurriculum: false,
    assignedSubjects: false,
};

const initialCurriculumState ={
    name: "",
    description:"",
    type: "BLENDED",
    isPublic: true,
    level: "",
    trainingModules:[],
};

const initialStateSubjectDisplayMode ={
    mode: 'TABLE',
    subjectId: undefined,
}

const curriculumReducerActionType={
    'INIT': 'INIT',
    'NEW_CURR': 'NEW_CURR',
    'UPDATE_BASIC_DATA' : 'UPDATE_BASIC_DATA',

    'ADD_SUBJECT' : 'ADD_SUBJECT',
    'UPDATE_SUBJECT' : 'UPDATE_SUBJECT',
    'REMOVE_SUBJECT' : 'REMOVE_SUBJECT',

    'ADD_CHAPTER' : 'ADD_CHAPTER',
    'REMOVE_CHAPTER' : 'REMOVE_CHAPTER',
    'UPDATE_CHAPTERS_DND' : 'UPDATE_CHAPTERS_DND',

    'ADD_CONTENT' : 'ADD_CONTENT',
    'REMOVE_CONTENT' : 'REMOVE_CONTENT',
    'UPDATE_CONTENTS_DND' : 'UPDATE_CONTENTS_DND',
}

const curriculumReducer=(cState, action)=>{
    switch(action.type){
        case curriculumReducerActionType.INIT:{
            return action.payload;
        }
        case curriculumReducerActionType.NEW_CURR:{
            return initialCurriculumState;
        }
        case curriculumReducerActionType.UPDATE_BASIC_DATA:{
            return {...cState, [action.payload.field]: action.payload.value}
        }
        case curriculumReducerActionType.ADD_SUBJECT:{
            let newChap =[];
            action.payload.chosenChapters.map(i=>{
                newChap.push({chapter: i, chosenContents:[]})
            })
            let newData = {
                ...action.payload,
                chosenChapters: newChap,
                new: true,
            }
            return {...cState, trainingModules: [...cState.trainingModules, newData]};
        }
        case curriculumReducerActionType.REMOVE_SUBJECT:{
            let updatedTrainingModules = Object.assign([],cState.trainingModules)
            updatedTrainingModules.splice(action.payload,1);
            return {...cState, trainingModules: updatedTrainingModules};
        }
        case curriculumReducerActionType.UPDATE_SUBJECT:{
            let updatedTrainingModules = Object.assign([],cState.trainingModules)
            updatedTrainingModules[action.payload.currentTrainingModuleIndex] = {
                ...updatedTrainingModules[action.payload.currentTrainingModuleIndex],
                [action.payload.field] : action.payload.value,
            }
            return {...cState, trainingModules: updatedTrainingModules};
        }
        case curriculumReducerActionType.REMOVE_CHAPTER: {
            let updatedTrainingModules = Object.assign([], cState.trainingModules);
            updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters.splice(action.payload.chapterIndex, 1);
            return {...cState, trainingModules: updatedTrainingModules};
            //return cState;
        }
        case curriculumReducerActionType.ADD_CHAPTER: {
            let updatedTrainingModules = Object.assign([], cState.trainingModules);
            let updatedChosenChapters =  Object.assign([],cState.trainingModules[action.payload.currentTrainingModuleIndex]?.chosenChapters);
            if(action.payload.subActionType === 'ADD'){
                updatedChosenChapters.push({chapter: action.payload.newChapter, chosenContents: [], new: true});
            }else if(action.payload.subActionType === 'REMOVE'){
                updatedChosenChapters.splice(action?.payload?.baseChapterIndex,1);
            }
            updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters = updatedChosenChapters;
            return {...cState, trainingModules: updatedTrainingModules};
        }
        case curriculumReducerActionType.UPDATE_CHAPTERS_DND:{
                let updatedTrainingModules =  Object.assign([],cState.trainingModules);
                updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters = action.payload.chaptersOrder;
                return {...cState, trainingModules: updatedTrainingModules};
                //return cState;
            }
        case curriculumReducerActionType.ADD_CONTENT: {
            let updatedTrainingModules = Object.assign([], cState.trainingModules);
            let updatedChosenContents =  Object.assign([],cState.trainingModules[action.payload.currentTrainingModuleIndex]?.chosenChapters?.[action.payload.currentChapterIndex]?.chosenContents);
            updatedChosenContents.push({content: action.payload.newContent, new: true});
            if(action.payload.subActionType === 'ADD'){
                updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters[action.payload.currentChapterIndex].chosenContents = updatedChosenContents;

            }else if(action.payload.subActionType === 'REMOVE'){
                updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters[action.payload.currentChapterIndex].chosenContents.splice(action.payload.baseContentIndex,1);
            }
            return {...cState, trainingModules: updatedTrainingModules};
            //return cState;
        }
        case curriculumReducerActionType.REMOVE_CONTENT: {
            let updatedTrainingModules = Object.assign([], cState.trainingModules);
            updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters[action.payload.currentChapterIndex].chosenContents.splice(action.payload.contentIndex,1)
            return {...cState, trainingModules: updatedTrainingModules};
        }
        case curriculumReducerActionType.UPDATE_CONTENTS_DND:{
            let updatedTrainingModules =  Object.assign([],cState.trainingModules);
            updatedTrainingModules[action.payload.currentTrainingModuleIndex].chosenChapters[action.payload.currentChapterIndex].chosenContents = action.payload.contentsOrder;
            return {...cState, trainingModules: updatedTrainingModules};

        }
        default:
            return cState;
    }
}

export function CurriculumProvider({children}){
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, curriculumId: 'NEW'})
    const [currentModuleCore, setCurrentModuleCore] = useState({});
    const [basicValidators,setBasicValidators] = useState(initialValidatorState);
    const [subjectDisplayMode, setSubjectDisplayMode]=useState(initialStateSubjectDisplayMode);
    const [trainingModules, setTrainingModules]=useState([]);
    const [currentTrainingModule, setCurrentTrainingModule]=useState({});
    const [currentTrainingModuleIndex, setCurrentTrainingModuleIndex]=useState(undefined);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState({});
    const [currentChapterIndex, setCurrentChapterIndex] = useState(undefined);
    const [isOpenEditChapterForm, setIsOpenEditChapterForm]=useState({isOpen: false, chapterId: undefined});
    const [contents, setContents] = useState([]);
    const [currentCurriculum, curriculumDispatch] = useReducer(curriculumReducer,initialCurriculumState);


    return(
        <CurriculumContext.Provider
            value={{
                editFormHelper,
                setEditFormHelper,

                currentModuleCore,
                setCurrentModuleCore,

                basicValidators,
                setBasicValidators,
                initialValidatorState,

                curriculumReducerActionType,
                currentCurriculum,
                curriculumDispatch,

                subjectDisplayMode,
                setSubjectDisplayMode,
                initialStateSubjectDisplayMode,

                trainingModules,
                setTrainingModules,

                currentTrainingModule,
                setCurrentTrainingModule,

                currentTrainingModuleIndex,
                setCurrentTrainingModuleIndex,

                chapters,
                setChapters,

                currentChapter,
                setCurrentChapter,

                currentChapterIndex,
                setCurrentChapterIndex,

                isOpenEditChapterForm,
                setIsOpenEditChapterForm,

                contents,
                setContents,

            }}>
            {children}
        </CurriculumContext.Provider>
    )
}
export const useCurriculumContext=()=> useContext(CurriculumContext);