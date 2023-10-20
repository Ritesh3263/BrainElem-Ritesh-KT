import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";

const API_ROUTE = 'folder';

//My Folder
const getRootFolder = () => {
  return eliaAPI.get(`${API_ROUTE}`);
};

//Add Folder
const createFolder = (newFolder) => {
  return eliaAPI.post(`${API_ROUTE}`, newFolder);
};

//get Folder
const getFolder = (id) => {
  return eliaAPI.get(`${API_ROUTE}/${id}`);
};

// get folder tail
const getFolderTail = (id) => {
  return eliaAPI.get(`${API_ROUTE}/${id}/tail`);
};

//Edit Folder
const editFolder = (updatedFolder) => {
  return eliaAPI.put(`${API_ROUTE}/${updatedFolder._id}`, updatedFolder);
};

//Delete Folder
const deleteFolder = (id,type,fileId=null) => {
  if(type === 'FILE') return eliaAPI.delete(`${API_ROUTE}/${id}?type=${type}&fileId=${fileId}`);
  else return eliaAPI.delete(`${API_ROUTE}/${id}?type=${type}`);
};

const addContentsToFolder = (folderId, contentIds) => {
  return eliaAPI.put(`${API_ROUTE}/${folderId}/add`, contentIds);
}


const functions={
  getRootFolder,
  createFolder,
  getFolder,
  getFolderTail,
  editFolder,
  deleteFolder,
  addContentsToFolder
};

export default functions;