import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'algorithms';


const detectLevels = (content) => {
    return eliaAPI.post(`${API_ROUTE}/detect/levels`, { content: content });
};

const detectTrainingModules = (content, trainingModulesList) => {
    return eliaAPI.post(`${API_ROUTE}/detect/training-modules`, { content: content, trainingModulesList: trainingModulesList });
};

const detectChapters = (content, parentTrainingModule) => {
    return eliaAPI.post(`${API_ROUTE}/detect/chapters`, { content: content, parentTrainingModule: parentTrainingModule });
};

const detectCapsules = (content, parentChapter) => {
    return eliaAPI.post(`${API_ROUTE}/detect/capsules`, { content: content, parentChapter: parentChapter });
};

const getSuggestedChapters = (data) => {
    // Get list of suggested chapters names based on provided training-module names.
    return eliaAPI.post(`${API_ROUTE}/suggest/chapters`, data);
}

const getSuggestedCapsules = (data) => {
    // Get list of suggested capsules names based on provided training-module and chapters names.
    return eliaAPI.post(`${API_ROUTE}/suggest/capsules`, data);
}

const functions = {
    detectLevels,
    detectTrainingModules,
    detectChapters,
    detectCapsules,
    getSuggestedChapters,
    getSuggestedCapsules,
};

export default functions;
