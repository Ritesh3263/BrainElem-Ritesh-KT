import { createSlice } from "@reduxjs/toolkit";


let init = localStorage.getItem('contents')

const initialState = {
    activeIndex: 0,
    contents: init ? JSON.parse(init) : []
}




export const contentFactorySlice = createSlice({
    name: 'contentFactory',
    initialState,
    reducers:{
        add: (state, action) => {// Add new content to the list
            // Update list of contents
            let content = {...action.payload}

            // By default - empty objects have empty pages and sendToLibrary 
            if (!content?.pages) content.pages = []
            if (content?.sendToLibrary == undefined) content.sendToLibrary = true
            

            state.contents = [...state.contents, content]
            localStorage.setItem('contents',JSON.stringify(state.contents))
            // Update index
            let newIndex = state.contents.length
            state.activeIndex = newIndex
        },
        update: (state, action) => {// Add new content to the list
            // Update content on the list
            state.contents[state.activeIndex-1] = action.payload
            localStorage.setItem('contents', JSON.stringify(state.contents))
            
        },
        remove: (state, action) => {//Remove content from the list - takes index of content on the contents list
            // Update index
            let allTabs = state.contents.length+1// All contents + home tab
            let indexToRemove = action.payload+1// Content index + home tab

            if (indexToRemove <= state.activeIndex) state.activeIndex -= 1
            // Update list of contents
            let tmp = [...state.contents]
            tmp.splice(action.payload,1)
            state.contents = tmp
            localStorage.setItem('contents',JSON.stringify(state.contents))
        },
        setType: (state, action) => {// Assign content type for active content
            state.contents[state.activeIndex-1].contentType = action.payload
            localStorage.setItem('contents',JSON.stringify(state.contents))
        },
        setActiveIndex: (state, action) => {// Change active tab
            state.activeIndex = action.payload
        }
    }
});


export const { add, update, remove, setType, setActiveIndex } = contentFactorySlice.actions  ;
export default contentFactorySlice.reducer;
