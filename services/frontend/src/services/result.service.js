import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'result';

const add = (data) => {
  return eliaAPI.post(`${API_ROUTE}/add`, data);
};

const get = (resultId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${resultId}`);
};

// Confirm result - assign it to the user
const confirm = (resultId) => {
  return eliaAPI.put(`${API_ROUTE}/confirm/${resultId}`, null);
};

// Get price for a result
const getPrice = (resultId, currencyCode) => {
  return eliaAPI.get(`${API_ROUTE}/price/${resultId}?currencyCode=${currencyCode}`, null);
};

const update = (result) => {
  return eliaAPI.put(`${API_ROUTE}/update/${result._id}`, result);
};

const remove = (result) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${result._id}`);
};


const updateGradeBookResults = (result) => {
  return eliaAPI.put(`${API_ROUTE}/updateGradeBookResults`, result);
};

const getLatestResultForUser = (userId, contentId) => {
  return eliaAPI.get(`${API_ROUTE}/latest/${userId}/${contentId}`, )
}

const getAllResultsForUser = (userId, contentId) => {
  return eliaAPI.get(`${API_ROUTE}/all/${userId}/${contentId}`, )
}

const getGroupResults = (contentId, groupId) => {
  return eliaAPI.get(`${API_ROUTE}/group/${groupId}/${contentId}`)
}

const getGrades = () => {
  return eliaAPI.get(`${API_ROUTE}/getGrades`)
}

const uploadFile = (formData) => {
  //enctype: 'multipart/form-data',
  return eliaAPI.post(`${API_ROUTE}/files/upload`, formData);
}

const getFileDetails = (fileId) => {
  //  Get file with provided id from database,if it is avaliable for the user.
  return eliaAPI.get(`${API_ROUTE}/files/${fileId}`);
}

const removeFile = (fileId) => {
  //  Remove file
  return eliaAPI.post(`${API_ROUTE}/files/remove/${fileId}`);
}

const downloadFile = (fileId, callback) => {
  //  Download file
  return eliaAPI.get(`${API_ROUTE}/files/download/${fileId}`, { responseType: 'blob' })
    .then((response) => {
      console.log(response.headers['content-originalname'])
      const file = new Blob([response.data], { type: response.headers['content-mimetype'] })
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.target = "_blank"
      link.setAttribute('download', response.headers['content-originalname']);
      document.body.appendChild(link);
      link.click();
      link.remove()
      if (callback) callback()
    });
}

const functions = {
  add,
  get,
  update,
  confirm,
  remove,
  updateGradeBookResults,
  getLatestResultForUser,
  getAllResultsForUser,
  getGroupResults,
  getGrades,
  uploadFile,
  getFileDetails,
  removeFile,
  downloadFile,
  getPrice
};

export default functions;