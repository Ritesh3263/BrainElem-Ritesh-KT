import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'groups';

const getGroup = (groupId) => {
    // Get group by group ID
    return eliaAPI.get(`${API_ROUTE}/getGroup/${groupId}`);
}

const getTraineesSubjectsAverages = (groupId,periodId) => {
    return eliaAPI.get(`${API_ROUTE}/getTraineesSubjectsAverages/${groupId}/${periodId}`);
}

const functions = {
    getGroup,
    getTraineesSubjectsAverages,
};

export default functions;