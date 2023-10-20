import { eliaAPI } from "./axiosSettings/axiosSettings";

const API_ROUTE = 'blockchain';

// Get all contracts from blockchain service
const getContracts = (fileName) => {
    return eliaAPI.get(`${API_ROUTE}/contracts`);
};

// Add new network for selected contract
const addNetwork = (contractName, data) => {
    return eliaAPI.post(`${API_ROUTE}/contracts/${contractName}/networks`, data);
};

const functions = {
    getContracts,
    addNetwork
}

export default functions;
