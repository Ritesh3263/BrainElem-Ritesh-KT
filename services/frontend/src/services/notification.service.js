import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'notifications';

const readAll = () => {
    return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const read = (notificationId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${notificationId}`);
};

const add = (notification) => {
    return eliaAPI.post(`${API_ROUTE}/add`, notification);
};

const update = (notification) => {
    return eliaAPI.put(`${API_ROUTE}/update/${notification._id}`, notification);
};

const remove = (notificationId) => {
    return eliaAPI.delete(`${API_ROUTE}/delete/${notificationId}`);
};

//** per user **//
const readAllUserNotifications = (userId) => {
    return eliaAPI.get(`${API_ROUTE}/readAllUserNotifications/${userId}`);
};

const readUnReadUserNotifications = (userId) => {
    return eliaAPI.get(`${API_ROUTE}/readUnReadUserNotifications/${userId}`);
};

const updateUserNotifications = (userId, notificationId) => {
    return eliaAPI.put(`${API_ROUTE}/updateUserNotifications/${userId}/${notificationId}`);
};

const addUserNotification = (notification) => {
    return eliaAPI.post(`${API_ROUTE}/addUserNotification`, notification);
};

const functions = {
    add,
    read,
    readAll,
    update,
    remove,

    //* per user **//
    readAllUserNotifications,
    readUnReadUserNotifications,
    updateUserNotifications,
    addUserNotification,
};

export default functions;
