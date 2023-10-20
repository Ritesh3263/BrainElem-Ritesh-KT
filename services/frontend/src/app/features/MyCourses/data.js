import { createAction, createSlice, current } from "@reduxjs/toolkit";
import searchFn from "components/common/Filters/Search";
import filterFn from "components/common/Filters/Filter";
import sortFn from "components/common/Filters/Sort";
import {now} from "moment";

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const initialState = {
    data: [],
    filteredData: [],
    item:{
        schedule:{
            events:[]
        }
    },
    itemDetails:{},
    offset: 0,
    isPending: false,
    error: null,
    formHelper:{isOpen: false, itemId: null, openType:'PREVIEW'},
    programHelper:{
        mode: 'PREVIEW',
        actions:()=>{},
    },
    examHelper:{
        isOpen: false,
        openType: 'PREVIEW',
        itemId: null,
    },
    dndHelper:{
        dndChapter:{
            isActiveDnd: false,
            isOpenChapter: false,
            chapterId: null,
            chapterIndex: null,
        },
        dndContent:{
            isActiveDnd: false,
        },
    },
    chapterModalHelper:{
        isOpen: false,
    },
    contentModalHelper:{
        isOpen: false,
    },
    chapters:[],
    contents:[],
};

const slice = createSlice({
    name: "myCourses",
    initialState,
    reducers: {
        fetch: (state, action) => {
            state.isPending = true;
        },
        fetchSuccess: (state, action) => {
            const _data = action.payload;
            state.data.push(..._data);
            state.filteredData.push(..._data);
            state.offset += _data.length;
            state.isPending = false;
        },
        fetchFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },



        fetchItem: (state, action) => {
            state.isPending = true;
        },
        fetchItemSuccess: (state, action) => {
            state.item = action.payload;
            state.isPending = false;
        },


        fetchItemDetails: (state, action) => {
            state.isPending = true;
        },
        fetchItemDetailsSuccess: (state, action) => {
            state.itemDetails = action.payload;
            state.isPending = false;
        },


        setFormHelper: (state, {payload:{isOpen=false, itemId=null, openType='PREVIEW'}}) => {
            state.formHelper = {isOpen,itemId,openType};
            if(!itemId){state.item={}}
        },

        clean: (state, action) => {
            state.data = [];
            state.item = {};
            state.itemDetails = {};
            state.offset= 0;
            state.isPending= false;
            state.error= null;
            state.formHelper={isOpen: false, itemId: null, openType:'PREVIEW'};
            state.dndHelper = initialState.dndHelper;
        },

        dndAction: (state, {payload:{type,payload}}) =>{
            switch(type){
                case 'DND_CH_SWITCH':{
                    state.dndHelper = {...initialState.dndHelper,
                        dndChapter: {...initialState.dndHelper.dndChapter,
                            isActiveDnd : (state.formHelper.openType === 'EDIT') ? payload.isActiveChapter : false,
                            isOpenChapter : payload.isOpenChapter,
                            chapterId: payload.chapterId || null,
                            chapterIndex: payload.chapterIndex ?? null,
                        },
                        dndContent: {...initialState.dndHelper.dndContent,
                            isActiveDnd : (state.formHelper.openType === 'EDIT') ? payload.isActiveContent : false,
                        },
                    }
                    break;
                }
                case 'DND_CH_UP':{
                    state.itemDetails.assignedChapters = payload;
                    break;
                }
                case 'DND_C_UP':{
                    state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents = payload;
                    break;
                }
                case 'SHOW_OTHERS':{
                    state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents[payload.contentIndex].isShowOthers = payload.isChecked;
                    break;
                }
                case 'SHOW_OTHERS_ALL':{
                    state.itemDetails.assignedChapters.map(chapter => chapter.assignedContents.map(content => content.isShowOthers = payload ))
                    break;
                }
                case 'DONE_CHAPTER':{
                    state.itemDetails.assignedChapters[payload.chapterIndex].isDone = !state.itemDetails.assignedChapters[payload.chapterIndex].isDone;
                    break;
                }
                case 'DONE_CONTENT':{
                    state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents[payload.contentIndex].isDone = !state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents[payload.contentIndex].isDone;
                    break;
                }
                case 'CHANGE_CHAPTER_NAME':{
                    state.itemDetails.assignedChapters[payload.chapterIndex].name = payload.name
                    break;
                }
                case 'CHANGE_IMAGE':{
                    state.item.information.image = payload
                    break;
                }
                default: break;
            }
        },

        programAction: (state, {payload})=>{
            switch (payload.type){
                case 'TOGGLE_EDIT':{
                    state.programHelper.mode = payload.payload === 'EDIT' ? 'PREVIEW' : 'EDIT';
                    break;
                }
                case 'REMOVE_CONTENT':{
                    state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents =
                        state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents.filter(c=> c._id !== payload.payload)
                    break;
                }
                case 'ADD_CONTENT':{
                    state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents.push({});
                    break;
                }
                default: break;
            }
        },

        examAction: (state, {payload})=>{
            switch (payload.type){
                case 'OPEN':{
                    state.examHelper.isOpen = true;
                    state.examHelper.itemId = payload.itemID;
                    state.examHelper.openType = state.formHelper.openType === 'PREVIEW' ? 'PREVIEW' : 'EDIT';
                    break;
                }
                case 'CLOSE':{
                    state.examHelper.isOpen = false;
                    state.examHelper.itemId = null;
                    state.examHelper.openType = 'PREVIEW';
                    break;
                }
                default: break;
            }
        },

        filterAction: (state, {payload})=>{
           switch (payload.type){
               case 'SEARCH':{
                   // => filter only nested field values ⬇
                   state.filteredData = searchFn(payload.query, payload.data);

                   // => filter only by course name ⬇
                   // const searchRegex = new RegExp(escapeRegExp(payload.query), 'i');
                   // if(payload.data.length>0) {
                   //    state.filteredData = payload.data.filter((item) => searchRegex.test(item?.trainingModule?.name))
                   // }
                   break;
               }
               case 'FILTERS':{
                   if(payload?.filters?.length>0){
                       // payload.filters.map(f=>{
                       //     if(f?.type === 'FILTER'){
                       //         state.filteredData = filterFn(f, payload.data, payload.originalData);
                       //     }else if(f?.type === 'SORT'){
                       //        // state.filteredData = sortFn(f, payload.data, payload.originalData);
                       //     }
                       // })

                       state.filteredData = current(state.data).filter(i=> {
                           if(i?.period){
                               return i?.group?.academicYear?.periods.map(p=>{
                                   if(p._id === i?.period){
                                       if(payload?.filters[0].name === 'Future'){
                                           return new Date(p.startDate).toISOString() > new Date(now()).toISOString()
                                       }
                                       else if(payload?.filters[0].name === 'Past'){
                                           return new Date(p.endDate).toISOString() < new Date(now()).toISOString()
                                       }
                                       else if(payload?.filters[0].name === 'In progress'){
                                           return new Date(p.startDate).toISOString() >= new Date(now()).toISOString() && new Date(p.endDate).toISOString() <= new Date(now()).toISOString()
                                       }
                                   }else{
                                       return false;
                                   }
                               });
                           }
                       });
                   }else{
                       state.filteredData = state.data;
                   }
                   break;
               }
               default: break;
           }
        },

        updateEvent: (state, {payload})=>{
            switch (payload.type){
                case 'ADD':{
                    state.item?.schedule?.events?.push(payload.data)
                    break;
                }
                case 'UPDATE':{
                    state.item = {
                        ...state.item,
                        schedule: {
                            ...state.item.schedule,
                            events: state.item.schedule.events.map(e=> {
                                if(e._id === payload.data._id){
                                    return payload.data;
                                }
                                else return e;
                            })
                        }
                    }
                    break;
                }
                case 'REMOVE':{
                    state.item = {
                        ...state.item,
                        schedule: {
                            ...state.item.schedule,
                            events: state.item.schedule.events.filter(e=> e._id !== payload.data)
                        }
                    }
                    break;
                }
                default: break;
            }
        },

        chapterModalHelper:(state, {payload})=>{
            state.chapterModalHelper.isOpen = (payload === 'OPEN');
        },

        contentModalHelper:(state, {payload})=>{
            state.contentModalHelper.isOpen = (payload === 'OPEN');
        },

        fetchChapters:(state, {payload})=>{
            state.isPending = true;
        },

        fetchChaptersSuccess:(state, {payload})=>{
            state.chapters = payload.map(ch=>{
                if(!!state?.itemDetails?.assignedChapters.find(i=>i._id===ch._id)){
                    ch.isSelected = true;
                }
                return ch;
            })
            state.isPending = false;
        },

        fetchContents:(state, {payload})=>{
            state.isPending = true;
        },

        fetchContentsSuccess:(state, {payload})=>{
            if(payload.length>=0){
                state.contents = payload.filter(i => {
                    return !current(state?.itemDetails?.assignedChapters[state.dndHelper.dndChapter.chapterIndex]?.assignedContents).some(c => c._id === i._id);
                })
            }else{
                state.contents=[]
            }
            state.isPending = false;
        },

        updateChapters:(state, {payload:{type,data}})=>{

            if(type === "UPDATE"){
                let updatedList = [];
                data.filter(c=> c.isSelected)?.map(ch=>{
                    let founded = current(state?.itemDetails?.assignedChapters).find(i=>i._id===ch._id);
                    if(founded){
                        updatedList.push(founded);
                    }else{
                        updatedList.push({
                            _id: ch.chapterId,
                            name: ch.name,
                            description: ch.description,
                            durationTime: ch.durationTime,
                            type: ch.type,
                            isDone: false,
                            assignedContents: ch.assignedContents||[],
                            origin: ch.origin,
                            isSelected: true,
                            creator: ch.creator,
                        })
                    }
                });
                state.itemDetails.assignedChapters = updatedList;
            }
            else if(type === 'NEW'){
                state.itemDetails.assignedChapters.push(data);
            }
            else if(type === 'SELECT_CONTENT'){
                let index = state.contents.findIndex(c=> c._id === data.contentId);
                state.contents[index].isSelected = !data.isSelected;
                state.contents[index].new = true;
            }
            else if(type ==='ADD_CONTENT'){
                //let filtered = current(state.contents).filter(c => c?.isSelected);
                let filtered = current(state.contents).filter(c => data.some((i)=> i === c._id));
                filtered = filtered.map(c=>({...c, new: true}));
               state.itemDetails.assignedChapters[state.dndHelper.dndChapter.chapterIndex].assignedContents.push(...filtered);
            }

        }
    }
});


const myCourseActions = {
    fetch: createAction("myCourses/fetch"),
    fetchSuccess: createAction("myCourses/fetchSuccess"),
    fetchFailure: createAction("myCourses/fetchFailure"),

    fetchItem: createAction("myCourses/fetchItem"),
    fetchItemSuccess: createAction("myCourses/fetchItemSuccess"),

    fetchItemDetails: createAction("myCourses/fetchItemDetails"),
    fetchItemDetailsSuccess: createAction("myCourses/fetchItemDetailsSuccess"),

    setFormHelper: createAction("myCourses/setFormHelper"),

    clean: createAction("myCourses/clean"),

    dndAction: createAction("myCourses/dndAction"),

    programAction: createAction("myCourses/programAction"),

    examAction: createAction("myCourses/examAction"),

    filterAction: createAction("myCourses/filterAction"),

    updateEvent: createAction("myCourses/updateEvent"),

    chapterModalHelper: createAction("myCourses/chapterModalHelper"),

    contentModalHelper: createAction("myCourses/contentModalHelper"),

    fetchChapters: createAction("myCourses/fetchChapters"),
    fetchChaptersSuccess: createAction("myCourses/fetchChaptersSuccess"),

    fetchContents: createAction("myCourses/fetchContents"),
    fetchContentsSuccess: createAction("myCourses/fetchContentsSuccess"),

    updateChapters: createAction("myCourses/updateChapters"),
};

export { myCourseActions };
export default slice.reducer;
