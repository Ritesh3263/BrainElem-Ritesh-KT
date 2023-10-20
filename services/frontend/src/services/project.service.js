import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";

const API_ROUTE = 'projects';

//Projects Api

//Projects List
const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/all`);
};

//Add Project
const add = ( newProject) => {
  console.log("inside add", newProject)
  return eliaAPI.post(`${API_ROUTE}/add`, newProject);
};

//Edit Project
const edit = (newProject) => {
  console.log("inside edit", newProject)
  return eliaAPI.put(`${API_ROUTE}/edit/${newProject._id}`,newProject);
};

//get Project
const read = (id) => {
  return eliaAPI.get(`${API_ROUTE}/read/${id}`);
};
//Delete Project
const remove = (id) => {
  return eliaAPI.delete(`${API_ROUTE}/remove/${id}`);
};

const getOpportunitiesForUsers = (data) => {
  return eliaAPI.post(`${API_ROUTE}/collections/users`, data);
};

const functions={
  readAll,
  read,
  add,
  edit,
  remove,
  getOpportunitiesForUsers,
};

export default functions;