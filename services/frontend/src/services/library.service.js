import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'library';

//******** MyLibrary - user *************
const getUserPrivateContent = () =>{
    // Get all user private content
    return eliaAPI.get(`${API_ROUTE}/private`);
}
const getUserPublicContent = () =>{
    // Get all user public content
    return eliaAPI.get(`${API_ROUTE}/public`);
}
const getAllPublicContents = () =>{
    // Get all user public content
    return eliaAPI.get(`${API_ROUTE}/getAllPublicContents`);
}

const getUserCoCreatedContent = () =>{
    // Get all user CoCreated content
    return eliaAPI.get(`${API_ROUTE}/cocreated`);
}

const getMyContents = () =>{
    return eliaAPI.get(`${API_ROUTE}/my-contents`);
}

//********** Librarian ************
// Librarian get awaiting content
const getAllContent = () =>{
    // Get awaiting content
    return eliaAPI.get(`${API_ROUTE}/all`);
}

const getAwaitingContent = () =>{
    // Get awaiting content
    return eliaAPI.get(`${API_ROUTE}/awaiting`);
}

const getAcceptedContent = () =>{
    // Get accepted content
    return eliaAPI.get(`${API_ROUTE}/accepted`);
}

const getRejectedContent = () =>{
  // Get accepted content
  return eliaAPI.get(`${API_ROUTE}/rejected`);
}

const getContentToArchive = () =>{
  // Get accepted content
  return eliaAPI.get(`${API_ROUTE}/to-archive`);
}
// Librarian accept or reject content
const  manageContentStatus = (content) =>{
    // Get awaiting content
    return eliaAPI.put(`${API_ROUTE}/manage-content-status`, {content});
}

// Request archiving of the conentent from the library - such request must be accepted by librarian
// - contentId - id of content in the library
const requestArchiveOfContentFromLibrary = (contentId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/archiving/request`);
}
// Revoke archiving request of content from the library
// - contentId - id of content in the library
const revokeArchiveOfContentFromLibrary = (contentId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/archiving/revoke`);
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
const getLibraryData = () =>{
    return eliaAPI.get(`${API_ROUTE}/getLibraryData`);
}


const functions = {
    getUserPublicContent,
    getAllPublicContents, 
    getUserPrivateContent,
    getUserCoCreatedContent,
    getMyContents,
    getAllContent,
    getAwaitingContent,
    manageContentStatus,
    getStorageInfo,
    getAcceptedContent,
    getRejectedContent,
    getContentToArchive,
    getLibraryData,
    requestArchiveOfContentFromLibrary,
    revokeArchiveOfContentFromLibrary 
};

export default functions;