import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'cloud';

//******** MyLibrary - user *************
const getUserPrivateContent = (userId) =>{
    // Get all user private content
    return eliaAPI.get(`${API_ROUTE}/private/${userId}`);
}
const getUserPublicContent = (userId) =>{
    // Get all user public content
    return eliaAPI.get(`${API_ROUTE}/public/${userId}`);
}
const getUserCoCreatedContent = (userId) =>{
    // Get all user CoCreated content
    return eliaAPI.get(`${API_ROUTE}/cocreated/${userId}`);
}

//********** Librarian ************
// Librarian get awaiting content
const getAwaitingContent = () =>{
    // Get awaiting content
    return eliaAPI.get(`${API_ROUTE}/awaiting`);
}

const getAllContent = () =>{
    // Get awaiting content
    return eliaAPI.get(`${API_ROUTE}/all`);
}

// Librarian accept or reject content
const  manageContentStatus = (content) =>{
    // Get awaiting content
    return eliaAPI.put(`${API_ROUTE}/manage-content-status`, {content});
}


const getStorageInfo =(content)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve({
                "data": {
                    size: 20.8,
                    unit: "GB",
                    used: 5.6,
                }
            })
        },300)
    })
};

const functions = {
    getUserPublicContent,
    getUserPrivateContent,
    getUserCoCreatedContent,
    getAwaitingContent,
    getAllContent,
    manageContentStatus,
    getStorageInfo,
};

export default functions;
