import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'subscriptions';

const getSubscriptions = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const update = (id, name, description, modules, owner) => {
  return eliaAPI.put(
    `${API_ROUTE}/update/${id}`,
    { _id: id, name, description, modules, owner, });
};

const remove = (subscriptionId) => { 
  return eliaAPI.delete(`${API_ROUTE}/remove/${subscriptionId}`);
};

const add = (ecosystemId, name, description, modules, owner ) => {
  return eliaAPI.post(`${API_ROUTE}/add/${ecosystemId}`,{ name, description, modules, owner, });
};

const getAllSubscriptionOwners = (ecosystemId)=>{
  return eliaAPI.get(`${API_ROUTE}/get-owners/${ecosystemId}`);
}

const getAllFreeSubscriptionOwners = (subscriptionId)=>{
  return eliaAPI.get(`${API_ROUTE}/get-free-owners/${subscriptionId}`);
}

const getSubscriptionOwner = (subscriptionId) => {
  return eliaAPI.get(`${API_ROUTE}/get-subscription-owner/${subscriptionId}`);
};


const addSubscriptionsOwner = async (data, ecosystemId) => {
  let newOwner ={
      name: data.name,
      surname: data.surname,
      username: data.username,
      password: data.password,
      isActive: data.isActive,
      details: {
        displayName: data.displayName,
        phone: data.phone,
        street: data.street,
        buildNr: data.buildNr,
        postcode: data.postcode,
        city: data.city,
        country: data.country,
        dateOfBirth: data.dateOfBirth,
        description: data.description,
      },
      settings: {
        role: "NetworkManager",
      }
  }
  if (data.email) newOwner.email = data.email

  return eliaAPI.post(`${API_ROUTE}/add-owner/${ecosystemId}`, {newOwner});
};

const removeSubscriptionsOwner = async (uId)=>{
  return eliaAPI.delete(`${API_ROUTE}/remove-owner/${uId}`);
}

const updateSubscriptionsOwner = async (userId, data)=>{
    let newOwner ={
        email: data.email,
        username: data.username,
        name: data.name,
        surname: data.surname,
        // password: data.password,
        isActive: data.isActive,
        details: {
            fullName: data.fullName,
            displayName: data.displayName,
            phone: data.phone,
            street: data.street,
            buildNr: data.buildNr,
            postcode: data.postcode,
            city: data.city,
            country: data.country,
            dateOfBirth: data.dateOfBirth,
            description: data.description,
        }
    }
    return eliaAPI.put(`${API_ROUTE}/update-owner/${userId}`, {newOwner});
}

const functions ={
    getSubscriptions,
    update,
    remove,
    add,
    getAllFreeSubscriptionOwners,
    getAllSubscriptionOwners,
    getSubscriptionOwner,
    addSubscriptionsOwner,
    removeSubscriptionsOwner,
    updateSubscriptionsOwner,
}
export default functions;
