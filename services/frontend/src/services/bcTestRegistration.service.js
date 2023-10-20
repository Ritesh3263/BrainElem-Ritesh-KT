import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'bctest';

const getBCTestUsersByModuleId = () =>{
    const user = getItemFromLocalStorage('user');
    return eliaAPI.get(`${API_ROUTE}/users/${user.moduleId}`);
 }

const getBCTestTeams = () =>{
    return eliaAPI.get(`${API_ROUTE}/teams`);
}

const getBCTestTeamsWithProgress = (userId,sessionId) =>{
    return eliaAPI.get(`${API_ROUTE}/teams-with-progress/${userId}/${sessionId}`);
}

const getBCTestTeamsWithTraits = () =>{
    return eliaAPI.get(`${API_ROUTE}/teams-traits`);
}

const bcTestRegister = (payLoad) => {
    return eliaAPI.post(`${API_ROUTE}/bctestregister`, payLoad);
}

function getItemFromLocalStorage(key) {
    const itemString = localStorage.getItem(key);
    const item = JSON.parse(itemString);
    return item;
  }
  

const functions = {
    getBCTestUsersByModuleId,
    bcTestRegister,
    getBCTestTeams,
    getBCTestTeamsWithProgress,
    getBCTestTeamsWithTraits,
    getItemFromLocalStorage
}

export default functions;