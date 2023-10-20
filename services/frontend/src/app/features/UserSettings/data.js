import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    connectedDevices:[],
    isPending: false,
    error: null,
}

const slice = createSlice({
    name: 'userSettings',
    initialState,
    reducers:{
        fetchFailure:(state,{payload}) =>{
            state.error = payload;
            state.isPending = false;
        },

        fetchConnectedDevices:(state,{payload}) =>{
            state.isPending = true;
        },
        fetchConnectedDevicesSuccess:(state,{payload}) =>{
            state.isPending = false;
            state.connectedDevices = payload;
        },

        removeDevice:(state,{payload}) =>{
            state.isPending = true;
        },
        removeDeviceSuccess:(state,{payload}) =>{
            state.isPending = false;
        },

        updateDevice:(state,{payload}) =>{
            state.isPending = true;
        },
        updateDeviceSuccess:(state,{payload}) =>{
            state.isPending = false;
        }

    }
});

const userSettingsActions ={
    fetchFailure : createAction("userSettings/fetchFailure"),

    fetchConnectedDevices : createAction("userSettings/fetchConnectedDevices"),
    fetchConnectedDevicesSuccess : createAction("userSettings/fetchConnectedDevicesSuccess"),

    removeDevice : createAction("userSettings/removeDevice"),
    removeDeviceSuccess : createAction("userSettings/removeDeviceSuccess"),

    updateDevice : createAction("userSettings/updateDevice"),
    updateDeviceSuccess : createAction("userSettings/updateDeviceSuccess"),
};

export {userSettingsActions};
export default slice.reducer;