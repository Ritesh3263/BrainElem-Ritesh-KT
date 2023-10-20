import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'admin';

const addEventId = () => {
    return eliaAPI.get(`${API_ROUTE}/addEventId`);
};

const changePasswords = () => {
  return eliaAPI.get(`${API_ROUTE}/changePasswords`);
};  

const publishGrades = () => {
  return eliaAPI.get(`${API_ROUTE}/publishGrades`);
};  

const addEvents = () => {
  return eliaAPI.get(`${API_ROUTE}/addEvents`);
};  

const addResults = () => {
  return eliaAPI.get(`${API_ROUTE}/addResults`);
};  

const removeOldResults = () => {
  return eliaAPI.get(`${API_ROUTE}/removeOldResults`);
};  

const removeDatabase = () => {
  return eliaAPI.get(`${API_ROUTE}/removeDatabase`);
};  

const updateLevels = () => {
  return eliaAPI.get(`${API_ROUTE}/updateLevels`);
};

const updateRoles = () => {
  return eliaAPI.get(`${API_ROUTE}/updateRoles`);
};

const UpdateContentLevels = () => {
  return eliaAPI.get(`${API_ROUTE}/updateContentLevels`);
};  

const insertDefaultCoefficientToExams = () => {
  return eliaAPI.get(`${API_ROUTE}/insertDefaultCoefficientToExams`);
};  


// Run migration with provided name on the database
const runMigration = (name) => {
  return eliaAPI.post(`${API_ROUTE}/migrations/${name}`, {});
};


const getDatabaseDiagram = (modelNames) => {
  return eliaAPI.get(`${API_ROUTE}/database/diagram`,{params: {modelNames: modelNames}});
};

const getDatabaseModels = () => {
  return eliaAPI.get(`${API_ROUTE}/database/models`);
};

const functions = {
    addEventId, 
    changePasswords, 
    publishGrades, 
    addEvents, 
    addResults, 
    removeOldResults,
    removeDatabase,
    updateRoles,
    updateLevels,
    UpdateContentLevels,
    insertDefaultCoefficientToExams,
    runMigration,
    getDatabaseModels,
    getDatabaseDiagram
};

export default functions;
