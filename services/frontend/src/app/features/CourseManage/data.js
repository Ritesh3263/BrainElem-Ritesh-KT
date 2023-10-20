import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    offset: 0,
    isPending: false,
    progress: '0',
    error: null,
    item:{},
    itemDetails:{},
    sidebarHelper:{
        isOpen: false,
    },
    openItemHelper:{
        isOpenChapter: false,
        chapterIndex: null,
        chapterId: null,
        contentIndex: null,
        contentId: null,
    }
}

const slice = createSlice({
    name: 'courseManage',
    initialState,
    reducers:{
        fetch: (state, action) => {
            state.isPending = true;
        },
        fetchSuccess: (state, action) => {
            state.data = action.payload;
            if (action.payload.length > 0) {
                const marks = action.payload.flatMap(chapter=>chapter.assignedContents.map(content=>+content.isDone))
                state.progress =  (marks?.reduce((a,b)=>a+b,0)/(marks?.length||1)*100).toFixed(2); 
            }
            state.offset += action.payload.length;
            state.isPending = false;
        },
        fetchFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },
        openItemHelper: (state, { payload:{type,payload:{isOpenChapter=false,chapterId=null, chapterIndex=null, contentId=null, contentIndex=null}} }) => {
           switch (type){
               case 'CHAPTER':{
                   state.openItemHelper.isOpenChapter = isOpenChapter;
                   state.openItemHelper.chapterIndex = chapterIndex;
                   state.openItemHelper.chapterId = chapterId;
                   if(isOpenChapter && chapterId){
                       state.item = state.data[chapterIndex];
                   }else{
                       state.item = {};
                   }
                   break;
               }
               case 'CHECK_CHAPTER':{
                    state.data[chapterIndex].isDone = !state.data[chapterIndex].isDone;
                   break;
               }
               case 'CHECK_CONTENT':{
                   state.data[state.openItemHelper.chapterIndex].assignedContents[contentIndex].isDone = !state.item.assignedContents[contentIndex].isDone;
                   state.item.assignedContents[contentIndex].isDone = !state.item.assignedContents[contentIndex].isDone;
                   const marks = state.data.flatMap(chapter=>chapter.assignedContents.map(content=>+content.isDone))
                   state.progress =  (marks?.reduce((a,b)=>a+b,0)/(marks?.length||1)*100).toFixed(2); 
                   break;
               }
               case 'OPEN_CONTENT':{
                   if(state.openItemHelper.isOpenChapter){
                       state.openItemHelper.contentIndex = contentIndex;
                       state.openItemHelper.contentId = contentId;
                   }
                   break;
               }
               case 'CLOSE_CONTENT':{
                   state.openItemHelper.contentIndex = null;
                   state.openItemHelper.contentId = null;
                   break;
               }
               case 'OPEN_FROM_OUTSIDE':{
                   state.openItemHelper.isOpenChapter = isOpenChapter;
                   state.openItemHelper.chapterIndex = chapterIndex;
                   state.openItemHelper.chapterId = chapterId;
                   state.openItemHelper.contentIndex = contentIndex;
                   state.openItemHelper.contentId = contentId;
                   if(isOpenChapter && chapterId){
                       state.item = state.data[chapterIndex];
                   }else{
                       state.item = {};
                   }
                   break;
               }
               default: break;
           }
        },

        doneItem:(state,action)=>{
            //+> action creator, to add, success the -> update items isDone and progress
            state.isPending = true;
        },

        doneItemSuccess:(state,action)=>{
            state.isPending = false;
        },

        doneItemFailure:(state,{payload})=>{
            state.error = payload;
            state.isPending = false;
        },

        endCourse:(state,action)=>{
            //+> endCourse
            state.isPending = true;
        },
        endCourseSuccess:(state,action)=>{
            //+> endCourse
        },

        endCourseFailure:(state,{payload})=>{
            state.error = payload;
            state.isPending = false;
        },


        sidebarHelper:(state,{payload:{isOpen=false}})=>{
            state.sidebarHelper.isOpen = isOpen;
        },

        fromOutsideOpen:(state,{payload})=>{
            state.sidebarHelper.isOpen = true;
        },

        fetchContent: (state, action) => {
            state.isPending = true;
        },
        fetchContentSuccess: (state, action) => {
            state.itemDetails = action.payload;
            state.isPending = false;
        },
        fetchContentFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },
    }
});

const courseManageActions ={
    fetch: createAction("courseManage/fetch"),
    fetchSuccess: createAction("courseManage/fetchSuccess"),
    fetchFailure: createAction("courseManage/fetchFailure"),
    openItemHelper: createAction("courseManage/openItemHelper"),
    sidebarHelper: createAction("courseManage/sidebarHelper"),
    fromOutsideOpen: createAction("courseManage/fromOutsideOpen"),

    doneItem: createAction("courseManage/doneItem"),
    doneItemSuccess: createAction("courseManage/doneItemSuccess"),
    doneItemFailure: createAction("courseManage/doneItemFailure"),
    endCourse: createAction("courseManage/endCourse"),
    endCourseSuccess: createAction("courseManage/endCourseSuccess"),
    endCourseFailure: createAction("courseManage/endCourseFailure"),

    fetchContent: createAction("courseManage/fetchContent"),
    fetchContentSuccess: createAction("courseManage/fetchContentSuccess"),
    fetchContentFailure: createAction("courseManage/fetchContentFailure"),
}

export { courseManageActions };
export default slice.reducer;
