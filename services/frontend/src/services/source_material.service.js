import {eliaAPI} from "./axiosSettings/axiosSettings";
const API_ROUTE = 'source-material';

const readAll = () => {
    return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const read = (sourceMaterialId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${sourceMaterialId}`);
};

const add = (format) => {
    return eliaAPI.post(`${API_ROUTE}/add`, format);
};

const update = (sourceMaterial) => {
    return eliaAPI.put(`${API_ROUTE}/update/${sourceMaterial._id}`, sourceMaterial);
};

const remove = (sourceMaterialId) => {
    return eliaAPI.delete(`${API_ROUTE}/delete/${sourceMaterialId}`);
};




const readAllBookAuthors = () => {
    return eliaAPI.get(`${API_ROUTE}/readAllBookAuthors`);
};

const readBookAuthor = (authorId) => {
    return eliaAPI.get(`${API_ROUTE}/readBookAuthor/${authorId}`);
};

const addBookAuthor = (author) => {
    return eliaAPI.post(`${API_ROUTE}/addBookAuthor`, author);
};

const updateBookAuthor = (author) => {
    return eliaAPI.put(`${API_ROUTE}/updateBookAuthor/${author._id}`, author);
};

const removeBookAuthor = (authorId) => {
    return eliaAPI.delete(`${API_ROUTE}/deleteBookAuthor/${authorId}`);
};


const functions = {
    add,
    read,
    readAll,
    update,
    remove,

    readAllBookAuthors,
    readBookAuthor,
    addBookAuthor,
    updateBookAuthor,
    removeBookAuthor,
};

export default functions;
