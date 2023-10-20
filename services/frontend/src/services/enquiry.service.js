import {eliaAPI} from "./axiosSettings/axiosSettings";
import {now} from "moment";
const API_ROUTE = 'enquiry';

const add = (enquiry, sessionId) => {
  return eliaAPI.post(`${API_ROUTE}/add/${sessionId}`, enquiry);
};

const addByModuleManager = (enquiry) => {
  return eliaAPI.post(`${API_ROUTE}/addByModuleManager/`, enquiry);
};

const readAll= () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const readAllMyEnquiries= () => {
  return eliaAPI.get(`${API_ROUTE}/readAllMyEnquiries`);
};

const read = (enquiryId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${enquiryId}`);
};

const update = (enquiry) => {
  return eliaAPI.put(`${API_ROUTE}/update/${enquiry._id}`, enquiry);
};

const remove = (enquiryId) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${enquiryId}`);
};

const createSessionFromEnquiry = (enquiryId) => {
  return eliaAPI.get(`${API_ROUTE}/createSessionFromEnquiry/${enquiryId}`);
};

const readStatusList = () => {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        data: ["New", "Pending", "In developement", "Active", "Closed"],
        status: 200,
      })
    },200);
  });
};

const readFormatsList = () => {
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        data: ["weekends", "every day", "once a month", "irregularly"],
        status: 200,
      })
    },200);
  });
};

const readAllSessionTemplates= (moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllSessionTemplates/${moduleId}`);
};

const functions = {
  add,
  addByModuleManager,
  read,
  readAll,
  readAllMyEnquiries,
  update,
  remove,
  createSessionFromEnquiry,
  readStatusList,
  readFormatsList,
  readAllSessionTemplates,
};
export default functions;
