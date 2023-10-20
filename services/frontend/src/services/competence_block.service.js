import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'competence_blocks';

const add = (competenceBlock) => {
  return eliaAPI.post(`${API_ROUTE}/add`, competenceBlock);
};

const read = (competenceBlockId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${competenceBlockId}`);
};

const checkTitle = (title) => {
  return eliaAPI.put(`${API_ROUTE}/checkTitle`, title );
};

const identificationCode = (identificationCode) => {
  return eliaAPI.put(`${API_ROUTE}/identificationCode`, identificationCode );
};

const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const update = (competenceBlock) => {
  return eliaAPI.put(`${API_ROUTE}/update/${competenceBlock._id}`, competenceBlock);
};

const remove = (competenceBlockId) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${competenceBlockId}`);
};

const functions = {
  add,
  read,
  checkTitle,
  identificationCode,
  readAll,
  update,
  remove,
};

export default functions;
