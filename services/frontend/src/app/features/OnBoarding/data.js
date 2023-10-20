import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: [],
    isPending: false,
    error: null,
    item:{},
};

const slice = createSlice({
    name: 'boarding',
    initialState,
    reducers:{
        fetch: (state, action) => {
            state.isPending = true;
        },
        fetchSuccess: (state, action) => {
            state.data = action.payload;
            state.isPending = false;
        },
        fetchFailure: (state, { payload }) => {
            state.error = payload;
            state.isPending = false;
        },

        boardingHelper: (state, { payload:{type=null, item={}} }) => {
            //=>
            switch(type){
                case 'END':{
                    const itemIndex = state.data.findIndex(i=> i?._id === item?._id);
                    if(itemIndex>=0){
                        state.data[itemIndex] = item;
                        state.item = item;
                    }
                    break;
                }
                case 'OPEN':{
                    const itemIndex = state.data.findIndex(i=> i?._id === item?._id);
                    if(itemIndex>=0){
                        state.data[itemIndex] = item;
                        state.item = item;
                    }
                    break;
                }
                case 'POSTPONE':{
                    const itemIndex = state.data.findIndex(i=> i?._id === item?._id);
                    if(itemIndex>=0){
                        state.data[itemIndex] = item;
                        state.item = item;
                    }
                    break;
                }
                default: break;
            }
            window.localStorage.setItem('_boardings', JSON.stringify({
                status: 200,
                data: state.data,
            }))
        },

        setCurrentItem: (state, {payload})=>{
            state.item = payload ? payload : initialState.item;
        },

        updateItems:(state,{payload})=>{
            console.log("update", payload);
        },
    }
});

const boardingActions={
    fetch: createAction("boarding/fetch"),
    fetchSuccess: createAction("boarding/fetchSuccess"),
    fetchFailure: createAction("boarding/fetchFailure"),

    setCurrentItem: createAction("boarding/setCurrentItem"),
    boardingHelper: createAction("boarding/boardingHelper"),

    updateItems: createAction("boarding/updateItems"),
}

export {boardingActions};
export default slice.reducer;