import { eliaAPI } from "./axiosSettings/axiosSettings";

const API_ROUTE = 'credits';

// Get credits for a current user 
// moduleId - optional - id of the modue, if not provided it will use currentyl used module
const getCreditsForUser = (moduleId) => {
    let url = `${API_ROUTE}`
    return eliaAPI.get(url);
}

// Get credits for all users in module - 
// can be used to manage credits in the module
// moduleId - optional - id of the modue, if not provided it will use currentyl used module
const getCreditsForModule = (moduleId) => {
    let url = `${API_ROUTE}/modules/${moduleId}`
    return eliaAPI.get(url);
}


// Get credits requests for all users in module - 
// can be used to manage request in the module
// moduleId - optional - id of the modue, if not provided it will use currentyl used module
const getCreditsRequestsForModule = (moduleId) => {
    let url = `${API_ROUTE}/requests/modules/${moduleId}`
    return eliaAPI.get(url);
}

// Get credits for all modules
// Used by marketing manager
const getCreditsForModules = () => {
    let url = `${API_ROUTE}/modules/all`
    return eliaAPI.get(url);
}


// Transfer credits from one user to another
// from - user from which credtis will be transfered
// to - user to which credtis will be transfered
// number - number of credits to transfer
const transferCredits = (from, to, number) => {
    let data = {from, to, number}
    return eliaAPI.post(`${API_ROUTE}/transfer`, data);
}

// Accept request for credits
// from - user from which credtis will be transfered
// to - user to which credtis will be transfered
// requestId - id of accepted request
const acceptRequestForCredits = (requestId) => {
    let data = {requestId}
    return eliaAPI.post(`${API_ROUTE}/transfer`, data);
}

// Reject request for credits
// from - user from which credtis will be transfered
// to - user to which credtis will be transfered
// requestId - id of accepted request
const rejectRequestForCredits = (requestId) => {
    return eliaAPI.post(`${API_ROUTE}/requests/reject/${requestId}`);
}

// Request credits for the user
// number - number of credits to transfer
const requestCredits = (number) => {
    let data = {number}
    return eliaAPI.post(`${API_ROUTE}/request`, data);
}



const functions = {
    getCreditsForUser,
    getCreditsForModule,
    getCreditsRequestsForModule,
    getCreditsForModules,
    transferCredits,
    acceptRequestForCredits,
    rejectRequestForCredits,
    requestCredits
};


export default functions;
