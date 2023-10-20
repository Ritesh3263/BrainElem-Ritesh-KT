import {eliaAPI} from "services/axiosSettings/axiosSettings";

const API_ROUTE = 'users/devices';

const getConnectedDevices = async ()=>{
    try{
        const {data} = await eliaAPI.get(`${API_ROUTE}`);
        return data;
    }catch(error){
        return error.message;
    }
}

const removeConnectedDevice = async (device)=>{
    try{
        const {data} = await eliaAPI.delete(`${API_ROUTE}/${device._id}`);
        return data;
    }catch(error){
        return error.message;
    }
}

const updateConnectedDevice = async (device)=>{
    try{
        const {data} = await eliaAPI.put(`${API_ROUTE}/${device._id}`,device);
        return data;
    }catch(error){
        return error.message;
    }
}

const userSettingsService = {
    getConnectedDevices,
    removeConnectedDevice,
    updateConnectedDevice,
}

export default userSettingsService;