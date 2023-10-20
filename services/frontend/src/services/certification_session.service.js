import {eliaAPI} from "./axiosSettings/axiosSettings";
import {now} from "moment";

const API_ROUTE = 'certification_session';

const add = (certificationSession) => {
  return eliaAPI.post(`${API_ROUTE}/add`, certificationSession);
};

const read = (certificationSessionId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${certificationSessionId}`);
};

// Get overview details, less information than newRead
const getCertificationSessionOverview=(sessionId)=>{
  return eliaAPI.get(`${API_ROUTE}/overview/${sessionId}`);
}
// new Sessions actions (03.12.2021- Karol)
const newRead=(sessionId)=>{
  return eliaAPI.get(`${API_ROUTE}/newRead/${sessionId}`);
}
// public
const newReadPublic=(sessionId)=>{
  return eliaAPI.get(`${API_ROUTE}/newReadPublic/${sessionId}`);
}

const readAllTraineesFromTemplate=(certificationSessionId)=>{
  return eliaAPI.get(`${API_ROUTE}/readAllTraineesFromTemplate/${certificationSessionId}`);
}

const newReadCourse=(courseId)=>{
  return eliaAPI.get(`${API_ROUTE}/newReadCourse/${courseId}`);
}


// TO UNCOMMENT, done
const newUpdateCourse = (course) =>{
  return eliaAPI.put(`courses/updateFromSession/${course._id}`, course);
}



// TO COMMENT, done
// const newUpdateCourse=(course)=>{
//   //return eliaAPI.put(`${API_ROUTE}/newUpdateCourse/${course}`);
//   return new Promise((resolve, reject)=>{
//     setTimeout(()=>{
//       resolve({
//         data : course,
//         status: 200,
//       })
//     },300)
//   })
// }

const newGetContent=(contentId)=>{
  return eliaAPI.get(`${API_ROUTE}/newGetContent/${contentId}`);
}

const getAllTrainingManagers=()=>{
  return eliaAPI.get(`${API_ROUTE}/getAllTrainingManagers`);
}

const getAllTrainingManagersByModule=()=>{
  return eliaAPI.get(`${API_ROUTE}/getAllTrainingManagersByModule`);
}

const readAllCoordinators=()=>{
  return eliaAPI.get(`${API_ROUTE}/readAllCoordinators`);
}

const newGetReportsByTraineeId=(traineeId)=>{
  return eliaAPI.get(`${API_ROUTE}/newGetReportsByTraineeId/${traineeId}`);
}

const newAdd=(newSession)=>{
  console.log("need to adjust data according to model",newSession)
  return eliaAPI.post(`${API_ROUTE}/newAdd`,newSession);
}

const newUpdate=(updatedSession)=>{
  console.log("updatedSession >>",updatedSession)
  return eliaAPI.put(`${API_ROUTE}/update/${updatedSession._id}`, updatedSession);
}

const newRemove=(sessionId)=>{
  console.log("removeSession-id >>",sessionId)
  return eliaAPI.delete(`${API_ROUTE}/delete/${sessionId}`);
}

/////////////////////////////////////////////////////////////////////////////////


const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const readAllTemplateSessions = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllTemplateSessions`);
};

const readAllUserSessions = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllUserSessions`);
};

const readAllUserSessionsWithoutCompany = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllUserSessionsWithoutCompany`);
};

const readAllArchivedSessions = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllArchivedSessions`);
};

const readAllArchivedSessionsWithoutCompany = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllArchivedSessionsWithoutCompany`);
};

const readAllUserSessionsInCertificate = (certificationId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllUserSessionsInCertificate/${certificationId}`);
};

const readTraineeSessions = (traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/readTraineeSessions/${traineeId}`);
};

const countFinishedSessions = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/countFinishedSessions/${userId}`);
};

const countReceivedCertifications = (userId) => {
  return eliaAPI.get(`${API_ROUTE}/countReceivedCertifications`);
};

const update = (certificationSession) => {
  return eliaAPI.put(`${API_ROUTE}/update/${certificationSession._id}`, certificationSession);
};

const archive = (certificationSessionId) => {
  return eliaAPI.put(`${API_ROUTE}/archive/${certificationSessionId}`);
};

const restore = (certificationSessionId) => {
  return eliaAPI.put(`${API_ROUTE}/restore/${certificationSessionId}`);
};

const remove = (certificationSession) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${certificationSession._id}`);
};

const readUserTrackers = (userId, certificationSessionId) => {
  return eliaAPI.get(`${API_ROUTE}/readUserTrackers/${userId}/${certificationSessionId}`);
};

const saveUserTracker = (certificationSessionId, chapterId, contentId) => { // only a trainee can access it
  return eliaAPI.put(`${API_ROUTE}/saveUserTracker/${certificationSessionId}/${chapterId}/${contentId}`);
};
const readUserContentProgress = (userId, contentId, certificationSessionId) => { 
  return eliaAPI.get(`${API_ROUTE}/readUserContentProgress/${userId}/${contentId}/${certificationSessionId}`);
};
const readAllContentProgressOfUserInSession = (userId, certificationSessionId) => { 
  return eliaAPI.get(`${API_ROUTE}/readAllContentProgressOfUserInSession/${userId}/${certificationSessionId}`);
};
const saveContentProgress = (contentId, status) => { 
  return eliaAPI.put(`${API_ROUTE}/saveContentProgress/${contentId}`, status);
};

const takeCourse = (certificationSessionId) => {
  return eliaAPI.get(`${API_ROUTE}/takeCourse/${certificationSessionId}`);
};

const unenroll = (certificationSessionId) => {
  return eliaAPI.post(`${API_ROUTE}/unenroll/${certificationSessionId}`);
};

const readAllTraineeSessions = (traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllTraineeSessions/${traineeId}`);
};
 
const issueInternship = (certificationSessionId, userId) => {
  return eliaAPI.get(`${API_ROUTE}/issueInternship/${certificationSessionId}/${userId}`);
};

const issueCertificate = (certificationSessionId, userId) => {
  return eliaAPI.get(`${API_ROUTE}/issueInternship/${certificationSessionId}/${userId}`);
};

// get sessions for explore page
const getSessionsForExplore = (categoryId, searchQuery) => {
  if(categoryId) return eliaAPI.get(`${API_ROUTE}/getSessionsForExplore`,{params:{categoryId}});
  else if(searchQuery) return eliaAPI.get(`${API_ROUTE}/getSessionsForExplore`,{params:{searchQuery}});
  else return eliaAPI.get(`${API_ROUTE}/getSessionsForExplore`);
};

const getMostPopularSessions = () => {
  return eliaAPI.get(`${API_ROUTE}/getMostPopularSessions`);
};


const functions = {
  newRead,
  newReadPublic,
  newAdd,
  newUpdate,
  newRemove,
  newReadCourse,
  newUpdateCourse,
  newGetContent,
  readAllCoordinators,
  newGetReportsByTraineeId,

  add,
  read,
  readAll,
  readAllTemplateSessions, 
  readAllUserSessions, 
  readAllUserSessionsWithoutCompany, 
  readAllArchivedSessions,
  readAllArchivedSessionsWithoutCompany,
  readAllUserSessionsInCertificate,
  readTraineeSessions,
  readAllTraineesFromTemplate,
  update,
  remove,
  archive,
  restore,

  readUserTrackers,
  saveUserTracker,

  readUserContentProgress,
  readAllContentProgressOfUserInSession,
  saveContentProgress,

  takeCourse,
  unenroll,
  readAllTraineeSessions,

  issueInternship, 
  issueCertificate,

  getSessionsForExplore,
  getAllTrainingManagers,
  getAllTrainingManagersByModule, 

  countFinishedSessions,
  countReceivedCertifications,

  getMostPopularSessions,
  getCertificationSessionOverview,
};

export default functions;
