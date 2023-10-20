import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    offset: 0,
    isPending: false,
    error: null,
    item:{},
    editFormHelper:{
        isOpen: false, openType: 'PREVIEW', activityId: null,
    },
}

const slice = createSlice({
    name: 'activity',
    initialState,
    reducers:{
        fetchActivities: (state, action) => {
            state.isPending = true;
        },
        fetchActivitiesSuccess: (state, action) => {
            state.data = action.payload;
            state.offset += action.payload.length;
            state.isPending = false;
        },
        fetchActivitiesFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },


        fetchActivity: (state, action) => {
            state.isPending = true;
        },
        fetchActivitySuccess: (state, action) => {
            state.item = action.payload;
            state.offset += action.payload.length;
            state.isPending = false;
        },
        fetchActivityFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },


        editFormActions:(state, {payload:{isOpen=false, openType="PREVIEW", itemId=null}})=>{
            state.editFormHelper = {isOpen, openType, activityId: itemId}
            // if(!isOpen){
            //     state.item = initialState.item;
            // }
        }
    }
});

const activityActions ={
    fetchActivities: createAction("activity/fetchActivities"),
    fetchActivitiesSuccess: createAction("activity/fetchActivitiesSuccess"),
    fetchActivitiesFailure: createAction("activity/fetchActivitiesFailure"),

    fetchActivity: createAction("activity/fetchActivity"),
    fetchActivitySuccess: createAction("activity/fetchActivitySuccess"),
    fetchActivityFailure: createAction("activity/fetchActivityFailure"),

    editFormActions: createAction("activity/editFormActions"),
};

export { activityActions };
export default slice.reducer;