import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'competences';

const add = (competence) => {
  return eliaAPI.post(`${API_ROUTE}/add`, competence);
};

const read = (competenceId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${competenceId}`);
};

const checkTitle = (title) => {
  return eliaAPI.put(`${API_ROUTE}/checkTitle`, title);
};

const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const update = (competence) => {
  return eliaAPI.put(`${API_ROUTE}/update/${competence._id}`, competence);
};

const remove = (competence) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${competence._id}`);
};

const functions = {
  add,
  read,
  checkTitle,
  readAll,
  update,
  remove,
};

export default functions;
