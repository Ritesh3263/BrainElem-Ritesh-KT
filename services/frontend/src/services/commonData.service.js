import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'commonData';

const readAvailableRoles = (isTrC) => {
    console.log('type here')

    let type = isTrC?'TRAINING':'COGNITIVE';
    return eliaAPI.get(`${API_ROUTE}/readAvailableRoles/${type}`);
};
const readAvailableRolesByModuleName = (type='TRAINING') => {
    console.log('type here',type)
    type= type == '' ? 'TRAINING' : type;
    return eliaAPI.get(`${API_ROUTE}/readAvailableRoles/${type}`);
};

// most popular type of event
const getPopularEventTypes = () => {
    return eliaAPI.get(`${API_ROUTE}/popular/event-types`);
};
// most popular subject
const getPopularSubjects = () => {
    return eliaAPI.get(`${API_ROUTE}/popular/subjects`);
};
// most popular level
const getPopularLevels = () => {
    return eliaAPI.get(`${API_ROUTE}/popular/levels`);
};

// most used/visited content on the platform
const getPopularContent = () => {
    return eliaAPI.get(`${API_ROUTE}/popular/content`);
}

// count programs connected to a content
const countProgramsByContent = (contentId) => {
    return eliaAPI.get(`${API_ROUTE}/count/programs/${contentId}`);
}   

//  number of assignments (exams, homeworks, sessions) and completion rate (to discuss)
const getAssignmentCount = () => {
    return eliaAPI.get(`${API_ROUTE}/count/assignment`);
}

const markCompleted = (category,categoryId,value,userId) => {
    if (userId) return eliaAPI.put(`${API_ROUTE}/markCompleted/${userId}`, {category,categoryId,value});
    else return eliaAPI.put(`${API_ROUTE}/markCompleted`, {category,categoryId,value});
}

const getPeriod = (periodId) => {
    return eliaAPI.get(`${API_ROUTE}/period/${periodId}`);
}

const getAllPeriods = () => {
    return eliaAPI.get(`${API_ROUTE}/allPeriods`);
}

const functions = {
    readAvailableRoles,
    getPopularEventTypes,
    getPopularSubjects,
    getPopularLevels,
    getPopularContent, // on the platform
    countProgramsByContent,
    getAssignmentCount,
    markCompleted,
    getPeriod,
    getAllPeriods,
    readAvailableRolesByModuleName,

};

export default functions;