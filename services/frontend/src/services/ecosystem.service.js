import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'ecosystems';

const getEcosystems = () => {
  return eliaAPI.get(`${API_ROUTE}/all`);
};

const add = (eco) => {
  return eliaAPI.post(`${API_ROUTE}/add`, eco);
};

const update = (eco) => {
  return eliaAPI.put(`${API_ROUTE}/update/${eco._id}`, eco);
};

const remove = (id) => { 
  return eliaAPI.delete(`${API_ROUTE}/remove/${id}`);
};

const getEcosystemManagers = () => {
  return eliaAPI.get(`${API_ROUTE}/get-managers`);
};

const getOneEcosystemManager = (ecosystemId) => {
  return eliaAPI.get(`${API_ROUTE}/get-one-manager/${ecosystemId}`);
};

const getManager = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/get-manager/${userId}`);
};

const getFreeEcosystemManagers = (id) => {
  if (id) return eliaAPI.get(`${API_ROUTE}/get-free-managers/${id}`);
  else return eliaAPI.get(`${API_ROUTE}/get-free-managers`);
};

const addManager = (usr) => {
  //name, surname, username, email, password, scopes, isActive
  // Adding manager without ecosystem freeManager
  return eliaAPI.post(`${API_ROUTE}/add-manager`, usr);
};

const removeManager = (id) => { 
  return eliaAPI.delete(`${API_ROUTE}/remove-manager/${id}`);
};

const updateManager = (usr) => {
  // id, name, surname, username, email, password, isActive
  return eliaAPI.put(`${API_ROUTE}/update-manager/${usr._id}`, usr);
};

const enableCloud = (ecosystemId, cloudStatus) => {
  return eliaAPI.put(`${API_ROUTE}/enable-cloud/${ecosystemId}`, { cloudStatus: cloudStatus });
};

const functions = {
  getEcosystems,
  add,
  update,
  remove,
  getEcosystemManagers,
  getOneEcosystemManager,
  getFreeEcosystemManagers,
  getManager,
  addManager,
  updateManager,
  removeManager, 
  enableCloud
};

export default functions;