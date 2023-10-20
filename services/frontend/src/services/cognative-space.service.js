import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";

const API_ROUTE = 'users';

const getAllSoltions=()=>{
    let lang = i18next.language || 'en';
    const user = getItemFromLocalStorage('user');
    return eliaAPI.get(`${API_ROUTE}/opportunities/identified/${user.id}/?lang=${lang}`);
}

const getAllCompanyMaterials=()=>{
    let lang = i18next.language || 'en';
    const user = getItemFromLocalStorage('user');
    //will change this with new api
    return eliaAPI.get(`projects/collections/assigned/?lang=${lang}`);
}

const getAllFavs=()=>{
    let lang = i18next.language || 'en';
    const user = getItemFromLocalStorage('user');
    return eliaAPI.get(`${API_ROUTE}/resources/favourites/${user.id}/?lang=${lang}`);
}

const getSolutionDetail=(id,type)=>{
    let lang = i18next.language || 'en';
    const user = getItemFromLocalStorage('user');
    return eliaAPI.get(`${API_ROUTE}/${type}/card/${user.id}/${id}/?lang=${lang}`);

}
const getProjectDetails=(id)=>{
    let lang = i18next.language || 'en';
    return eliaAPI.get(`projects/collections/card/${id}/?lang=${lang}`);
}

// Get details for congitnve block
const getBlockDetails=(id)=>{
    return eliaAPI.get(`projects/blocks/${id}`);
}

const changeStatus=(id,data)=>{
    return eliaAPI.post(`projects/blocks/progress/${id}`,data);

}
const storeFeedBack=(type,data)=>{
    const user = getItemFromLocalStorage('user');
    if(type=="material"){
        return eliaAPI.post(`projects/collections/feedback`,data);
    }else{
        return eliaAPI.post(`${API_ROUTE}/${type}/feedback/${user.id}`,data);
    }
}
function getItemFromLocalStorage(key) {
    const itemString = localStorage.getItem(key);
    const item = JSON.parse(itemString);
    return item;
  }
const functions = {
    getAllSoltions,
    getSolutionDetail,
    getItemFromLocalStorage,
    getAllFavs,
    storeFeedBack,
    getAllCompanyMaterials,
    getProjectDetails,
    changeStatus,
    getBlockDetails
}

export default functions;