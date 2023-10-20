import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";

const API_ROUTE = 'users';

const read = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${userId}`);
};

const switchUser=(reqPara)=>{
  return eliaAPI.post(`${API_ROUTE}/switch-center`,reqPara);
}

const getMyRoles = () => {
  return eliaAPI.get(`${API_ROUTE}/get-my-roles`);
};

const setRole = (role,fav) => { // fav for default
  return eliaAPI.put(`${API_ROUTE}/set-role`,{role,fav})
}

const getUserBoard = () => {
  return eliaAPI.get("user");
};

const getModeratorBoard = () => {
  return eliaAPI.get("mod");
};

const getAdminBoard = () => {
  return eliaAPI.get("admin");
};

const getGroupIds = (traineeId) =>{
  return eliaAPI.get(`getGroupIds/${traineeId}`);
}

/** interest for users **/
const getInterest = () =>{
  return eliaAPI.get("interests");
}
// Get traits for user's result
const getTraits = (userId, resultId, readerType) => {
  let lang = i18next.language || 'en'
  let url = `${API_ROUTE}/traits/${userId}/${resultId}?lang=${lang}`
  if (readerType) url = url+`&type=${readerType}`
  
  return eliaAPI.get(url);
}


// Get current tip for the user
const getTip = (userId, readerType) => {
  let lang = i18next.language || 'en'
  let url = `${API_ROUTE}/tip?lang=${lang}`;
  if (userId) url = `${API_ROUTE}/tip/${userId}?lang=${lang}`;
  if (readerType) url = url+`&type=${readerType}`
  
  return eliaAPI.get(url);
}

const getReport = (userId, reportId) =>{
  return eliaAPI.get(`${API_ROUTE}/report/${userId}/${reportId}`);
}

const getReports = (userId) =>{
  return eliaAPI.get(`${API_ROUTE}/reports/${userId}`);
}

const addReport = (userId, report) =>{
  return eliaAPI.post(`${API_ROUTE}/report/${userId}`, report);
}

const updateReport = (userId, report) =>{
  return eliaAPI.put(`${API_ROUTE}/report/${userId}`, report);
}

const removeReport = (userId, reportId) =>{
  return eliaAPI.delete(`${API_ROUTE}/report/${userId}/${reportId}`);
}

const getFaq = (type) => {
  let lang = i18next.language || 'en'
  return eliaAPI.get(`${API_ROUTE}/faq?mobile=false&lang=${lang}`);
}


const update = (userId, data) => {
  let userData ={
    email: data.email,
    username: data.username,
    password: data.password,
    settings: {isActive: data.isActive},
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
for (let prop in userData) if (!userData[prop]) delete userData[prop];
for (let prop in userData.details) if (!userData.details[prop]) delete userData.details[prop];

  return eliaAPI.put(`${API_ROUTE}/update/${userId}`, userData);
};

const updatePassword = (userId, password) => {
  return eliaAPI.put(`${API_ROUTE}/update/${userId}`, {password: password});
};

const hideFromMe = (itemName, itemId) => {
  return eliaAPI.put(`${API_ROUTE}/hide-from-me`, {itemName, itemId});
};

const countUsersInModule = () => {
  return eliaAPI.get(`${API_ROUTE}/countUsersInModule`);
};
const countPartners = () => {
  return eliaAPI.get(`${API_ROUTE}/countPartners`);
};
const countArchitects = () => {
  return eliaAPI.get(`${API_ROUTE}/countArchitects`);
};
const countTrainingManagers = () => {
  return eliaAPI.get(`${API_ROUTE}/countTrainingManagers`);
};
const countLibrarians = () => {
  return eliaAPI.get(`${API_ROUTE}/countLibrarians`);
};
const countTrainers = () => {
  return eliaAPI.get(`${API_ROUTE}/countTrainers`);
};
const countParents = () => {
  return eliaAPI.get(`${API_ROUTE}/countParents`);
};
const countInspectors = () => {
  return eliaAPI.get(`${API_ROUTE}/countInspectors`);
};
const countTrainees = () => {
  return eliaAPI.get(`${API_ROUTE}/countTrainees`);
};
const countCoordinators = () => {
  return eliaAPI.get(`${API_ROUTE}/countCoordinators`);
};

// feedback on tip suggestion
const feedback = (data) => { // userId is not required because feedback is only for the self, by the self, of the self
  // data = {
  //   type: "tip", // could be about course/teacher/module/system/etc.
  //   id: "tipId",
  //   reaction: "useful", // enum: ['useful', 'notUseful', 'neutral'] or enum: ['like', 'dislike', 'neutral']
  // };
  return eliaAPI.put(`${API_ROUTE}/feedback`, data);
}

// approveVerification
const approveVerification = (certId,check) => {
  return eliaAPI.put(`${API_ROUTE}/approve-verification`, {certId,check});
}

// approveAll
const approveAll = (userIds) => {
  return eliaAPI.put(`${API_ROUTE}/verify-all`, {userIds});
}

// getUsersCertifications
const getUsersCertifications = () => {
  return eliaAPI.get(`${API_ROUTE}/get-users-certifications`);
}




// Send email with access to the platform
const sendAccessToPlatform = (userId) => {
  return eliaAPI.post(`${API_ROUTE}/platform-access/send/${userId}`);
}
const downloadFile = async (url, onSuccess=()=>{}, onError=()=>{}) => {
  let anchor = document.createElement("a");
  document.body.appendChild(anchor);
  fetch(url)
    .then(response => {
      let header = response.headers.get('Content-Disposition')
      if (header) {
        let filename = header.split('filename=')[1]?.split(';')[0]
        if (filename) anchor.download = filename
      }
      if (response.ok) return response.blob()
      else{
        //text = await response.text()
        return response.json().then(err => { return Promise.reject(err); })

      }

    })
    .then(blobby => {
      let objectUrl = window.URL.createObjectURL(blobby);

      anchor.href = objectUrl;
      anchor.target = '_blank';
      anchor.click();
      onSuccess()
      window.URL.revokeObjectURL(objectUrl);
    }).catch((error) => {
      return onError(error)
    });
}
// Download and open cognitive report
const openCognitiveReport = async (userId, resultId, onSuccess, onError) => {
  // No axios - manaully set path
  let url = `/api/v1/${API_ROUTE}/cognitive-report/download/${userId}/${resultId}?lang=${i18next.language}`
  return await downloadFile(url, onSuccess, onError)

}

// Send email with access to cognitive PDF report 
const sendCognitiveReport = (userId, resultId) => {
  return eliaAPI.post(`${API_ROUTE}/cognitive-report/send/${userId}/${resultId}`);
}

// Download PDF with results from old BrainCore server
const downloadOldCognitiveReport = async (userId, resultId, template, role, onSuccess, onError) => {
    // No axios - manaully set path
    let url = `/api/v1/${API_ROUTE}/old-cognitive-report/download/${userId}/${resultId}?lang=${i18next.language}&role=${role}&template=${template}`
    return await downloadFile(url, onSuccess, onError)
};

const functions = {
  read,
  getTip,
  getTraits,
  getReport,
  getReports,
  addReport,
  updateReport,
  removeReport,
  getUserBoard,
  getModeratorBoard,
  getMyRoles,
  setRole,
  getAdminBoard,
  update,
  updatePassword,
  getInterest,
  getGroupIds,
  hideFromMe,
  // stats
  countUsersInModule,
  countPartners,
  countArchitects,
  countTrainingManagers,
  countLibrarians,
  countTrainers,
  countParents,
  countInspectors,
  countTrainees,
  countCoordinators,
  feedback,
  approveVerification,
  approveAll,
  getUsersCertifications,
  getFaq,
  switchUser,

  sendAccessToPlatform,
  openCognitiveReport,
  downloadOldCognitiveReport,
  sendCognitiveReport
}

export default functions;