import {eliaAPI} from "./axiosSettings/axiosSettings";
import {now} from "moment";

const API_ROUTE = 'formats';

const readAll = () => {
    return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const readAllExceptInit = () => {
    return eliaAPI.get(`${API_ROUTE}/readAllExceptInit`);
};

const read = (formatId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${formatId}`);
};

const add = (format) => {
    return eliaAPI.post(`${API_ROUTE}/add`, format);
  };

const update = (format) => {
    return eliaAPI.put(`${API_ROUTE}/update/${format._id}`, format);
};

const remove = (formatId) => {
    return eliaAPI.delete(`${API_ROUTE}/delete/${formatId}`);
};

const functions = {
    add,
    read,
    readAll,
    readAllExceptInit,
    update,
    remove,
};

export default functions;
