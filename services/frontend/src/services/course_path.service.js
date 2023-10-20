import {eliaAPI} from "./axiosSettings/axiosSettings";
import {now} from "moment";

const API_ROUTE = 'coursePaths';

const readAll= () => {
    return eliaAPI.get(`${API_ROUTE}/all`);
};

const read= (coursePathId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${coursePathId}`);
};

const readWithDetails= (coursePathId) => {
    return eliaAPI.get(`${API_ROUTE}/readWithDetails/${coursePathId}`);
};

const create = (coursePath) =>{
    return eliaAPI.post(`${API_ROUTE}/create`, coursePath);
};

const remove = (coursePathId) =>{
    return eliaAPI.delete(`${API_ROUTE}/remove/${coursePathId}`);
}

const update = (coursePath) =>{
    return eliaAPI.put(`${API_ROUTE}/update/${coursePath._id}`, coursePath);
}
const uploadImage = (formData) => {
    return eliaAPI.post(`${API_ROUTE}/images/upload`, formData);
}
const getImageUrl=(img)=>{
    if(img?._id){
        // if we have image object with id
        return `/api/v1/coursePaths/images/${img?._id}/download`;
    }else if(img === 'DEFAULT'){
        return `/api/v1/contents/categories/images/general-knowledge-1.jpg/download/`;
    }else if(img){
        // only for now we have only id
        return `/api/v1/coursePaths/images/${img}/download`;
    }
    else{
        return `/api/v1/contents/categories/images/general-knowledge-1.jpg/download/`;
    }
}
const functions = {
    create,
    readAll,
    read,
    readWithDetails,
    remove,
    update,
    uploadImage,
    getImageUrl,
};

export default functions;
