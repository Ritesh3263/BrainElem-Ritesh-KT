import { eliaAPI } from "./axiosSettings/axiosSettings";

const API_ROUTE = 'orders';


// Get details of order by certification session ID
const getByCertificationSessionId = (certificationSessionId) => {
    return eliaAPI.get(`${API_ROUTE}/getByCertificationSessionId/${certificationSessionId}`);
};

// Get all orders with uncompleted order
const getAll = () => {
    return eliaAPI.get(`${API_ROUTE}/all`);
}

// Create new order with `providerId` from PayPal
const create = (providerId, providerItems, client, invoice, currencyCode, products) => {
    return eliaAPI.post(`${API_ROUTE}/create`, {providerId: providerId, providerItems: providerItems, client: client, invoice: invoice, currencyCode: currencyCode, products: products });
};

// Update status of existing order with `providerId`, this will connect to PayPal in backend and download the status
const updateStatus = (providerId) => {
    return eliaAPI.post(`${API_ROUTE}/updateStatus/${providerId}`);
};

const functions = {
    create,
    updateStatus,
    getByCertificationSessionId,
    getAll
};


export default functions;
