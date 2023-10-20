import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'internships';


const add = (internship) => {
  return eliaAPI.post(`${API_ROUTE}/add`, internship);
};

const addCredit = (sessionId, traineeId) => {
  return eliaAPI.put(`${API_ROUTE}/addCredit/${sessionId}/${traineeId}`);
};

const read = (internshipId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${internshipId}`);
};

const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const update = (internship) => {
  return eliaAPI.put(`${API_ROUTE}/update/${internship._id}`, internship);
};

const remove = (internshipId) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${internshipId}`);
};

const readAllCompanies = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllCompanies`);
};

const functions = {
  add,
  addCredit,
  read,
  readAll,
  update,
  remove,
  readAllCompanies,
};

export default functions;
