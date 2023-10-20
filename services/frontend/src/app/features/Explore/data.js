import { createSlice } from "@reduxjs/toolkit";
import CustomNoRowsOverlay from "components/common/Table/CustomNoRowsOverlay";


const initialState = {
    searchQuery: '',
    contentsTaken: [],
    contentsRecommended: [],
    contentsOwned: [],
    contentsCocreated: [],

    contentsByTag: [],
    contentsByQuery: [],
}




export const exploreSlice = createSlice({
    name: 'explore',
    initialState,
    reducers:{
        setSearchQuery: (state, action) => {//Set search query
            console.log('DISPATHCH----')
            state['searchQuery'] = action.payload
        },
        setList: (state, action) => {//Set elements in the list
            state[action.payload.list] = action.payload.elements
        },
        editElement: (state, action) => {//Remove content from the list
            let index = state[action.payload.list].map(e=>e._id).indexOf(action.payload.elementId)
            if (index>=0) state[action.payload.list][index][action.payload.field] = action.payload.newValue
        },
        deleteElement: (state, action) => {//Remove content from the list
            let newList = [...state[action.payload.list]]
            let index = newList.map(e=>e._id).indexOf(action.payload.elementId)
            if (index>=0) {
                newList.splice(index,1)
                state[action.payload.list] = newList
            }

        },
    }
});


export const { setList, editElement, deleteElement, setSearchQuery } = exploreSlice.actions  ;
export default exploreSlice.reducer;
