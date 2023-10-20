import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'subject_session';

const readAll = () => {
    return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const read = (subjectSessionId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${subjectSessionId}`);
};

const add = (subjectSession) => {
    return eliaAPI.post(`${API_ROUTE}/add`, subjectSession);
};

const update = (subjectSession) => {
    return eliaAPI.put(`${API_ROUTE}/update/${subjectSession._id}`, subjectSession);
};

const remove = (subjectSessionId) => {
    return eliaAPI.delete(`${API_ROUTE}/delete/${subjectSessionId}`);
};

const getPeriod = (periodId) => {
    return eliaAPI.get(`${API_ROUTE}/getPeriod/${periodId}`);
};

const mirrorTrainingModule = (source, target) => {
    // source = chapterId (first ever found, as they are unique for every TrainingPath)
    // target = trainingModuleId
    return eliaAPI.put(`${API_ROUTE}/mirrorTrainingModule`, {source, target});
}

const updateImage = (subjectSessionId, imageId) => {
    return eliaAPI.put(`${API_ROUTE}/updateImage/${subjectSessionId}`, {imageId});
}

const functions = {
    add,
    read,
    readAll,
    update,
    remove,
    mirrorTrainingModule,
    getPeriod,
    updateImage
};

export default functions;
