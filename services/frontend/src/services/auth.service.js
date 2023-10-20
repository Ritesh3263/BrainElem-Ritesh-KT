import axios from "axios";
import authHeader from "./auth-header";
import {eliaAPI} from './axiosSettings/axiosSettings';

const API_ROUTE = 'auth';


const register = (data) => {
  return eliaAPI.post(`${API_ROUTE}/signup`, data);
};

const resetPassword = (email) => {
  return eliaAPI.post(`${API_ROUTE}/resetPassword`, {email: email});
};

const changePassword = (data) => {
  return eliaAPI.post(`${API_ROUTE}/changePassword`, data);
};

const resetMyPassword = () => {
  return eliaAPI.post(`${API_ROUTE}/resetMyPassword`, {});
};

const isUsernameTaken = (username,userId) => {
  return eliaAPI.post(`${API_ROUTE}/isUsernameTaken`, {userId,username});
};

const isEmailTaken = (email) => {
  return eliaAPI.post(`${API_ROUTE}/isEmailTaken`, {email});
};

const login = (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return eliaAPI.post(`${API_ROUTE}/signin`, params)
    .then((response) => {
      if (response.data.access_token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response;
    });
};


const refreshToken = (access_token=null, selectedModuleId=null, selectedRole=null, selectedPeriod=null) => {
  //=> old: attention, axios remains here because this request passes the token quickly {K.}
  // => update: I have upadted this line and used eliaAPI as it seems to work just fine(adrian)
  return eliaAPI.post(`${API_ROUTE}/refreshToken`, {selectedModuleId,selectedRole,selectedPeriod}, {headers: authHeader(access_token)})
  .then((response) => {
    localStorage.setItem("user", JSON.stringify(response.data));
    return response;
  },
  (error) => {
    if (getCurrentUser()) logout();
    return Promise.reject(error);
  });
};

const confirmEmail = () => {
  return eliaAPI.post(`${API_ROUTE}/confirmEmail`, null);
};



const logout = async () => {
  // localStorage.removeItem("user");
  // localStorage.removeItem("PRESENTATION");
  // localStorage.removeItem("TEST");
  // Save
  let cookies_accepted = localStorage.getItem("cookies_accepted")
  await localStorage.clear(); // clear all
  if (cookies_accepted) localStorage.setItem("cookies_accepted", cookies_accepted)

};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getForceChangePassword = () => {
  if (!getCurrentUser()) return false
  return JSON.parse(localStorage.getItem("forceChangePassword"))
}

const setForceChangePassword = (value) => {
  localStorage.setItem("forceChangePassword", value)
}

const addModuleToScopes = (moduleId) => {
  let data = {moduleId: moduleId}; 
  return eliaAPI.post(`${API_ROUTE}/addModuleToScopes`, data);
};

const functions = {
  register,
  login,
  logout,
  getCurrentUser,
  refreshToken,
  confirmEmail,
  resetPassword,
  changePassword,
  resetMyPassword,
  isUsernameTaken,
  isEmailTaken,
  getForceChangePassword,
  setForceChangePassword, 
  addModuleToScopes
}

export default functions;
