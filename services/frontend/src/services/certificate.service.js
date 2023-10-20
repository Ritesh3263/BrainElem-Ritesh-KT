import {now} from "moment";
import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'certificates';

////  CERTIFICATES  ////
const readAll = () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const upload = (certificate) =>{
  console.log(certificate._id);
}


const readAllGradingScales = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllGradingScales`);
};

////  TEMPLATES  ////
const readAllTemplates= () => {
  //return eliaAPI.get(`${API_ROUTE}/read`);
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        data:[
          {
            _id: "h9y786t4rfh",
            level: "-",
            title: "Classical Template",
            category: "General",
            createdAt: new Date(now()),
          }
        ]
      })
    },300)
  })
};

const readTemplate= (templateId) => {
  //return eliaAPI.get(`${API_ROUTE}/read`);
  console.log(templateId);
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        data:
          {
            _id: "h9y786t4rfh",
            createdAt: new Date(now()),
            level: "BASIC",
            title: "Title 1",
            category: "Category 1",
            formatTemplate:"Format code",
            templateFile: "file_content",
          }
      })
    },300)
  })
};

const removeTemplate = (templateId) =>{
  console.log(templateId);
}

const uploadTemplate = (template) =>{
  console.log(template._id);
}



const add = (certificate) => {
  return eliaAPI.post(`${API_ROUTE}/add`, certificate);
};

const read = (certificateId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${certificateId}`);
};

const update = (certificate) => {
  return eliaAPI.put(`${API_ROUTE}/update/${certificate._id}`, certificate);
};

const remove = (certificateId) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${certificateId}`);
};

const readAllUserCertifications= (sessionId) => { // trainees ?
  return eliaAPI.get(`${API_ROUTE}/readAllUserCertifications/${sessionId}`); // null sessionId means all trainee certifications
  // return eliaAPI.get(`${API_ROUTE}/readAllUserCertifications`);
};

const readTraineeCertifications= (sessionId, traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/readTraineeCertifications/${sessionId}/${traineeId}`);
};

const getIdOfInnerTraineeCertificate= (sessionId, traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/getIdOfInnerTraineeCertificate/${sessionId}/${traineeId}`);
};

const readUserCertification= (certificateId) => {
  return eliaAPI.get(`${API_ROUTE}/readUserCertification/${certificateId}`);
};

const readAllExaminerCertifications= () => {
  return eliaAPI.get(`${API_ROUTE}/readAllExaminerCertifications`);
};

const readCertification= (certificationId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${certificationId}`);

};

////  CERTIFICATION  ////
const readAllCertification= () => {
  //return eliaAPI.get(`${API_ROUTE}/read`);
  return new Promise((resolve, reject)=>{
      setTimeout(()=>{
          resolve({
              data:[
                  {
                      _id: "h9y786t4rfh",
                      createdAt: new Date(now()),
                      name: "Certificate name XXX",
                      assignedCompetenceBlocks:[
                          {
                              _id: "98rfujd"
                          },
                          {
                              _id: "8dewc7hg"
                          }
                      ],
                      EQFLevel: "Level 1",
                      expires: new Date(now()),
                  },
                  {
                      _id: "78erfvyre",
                      createdAt: new Date(now()),
                      name: "Certificate name 2",
                      assignedCompetenceBlocks:[
                          {
                              _id: "98rfujd"
                          },
                          {
                              _id: "8dewc7hg"
                          }
                      ],
                      EQFLevel: "Level 2",
                      expires: new Date(now()),
                  },
                  {
                      _id: "07gywhffwf",
                      createdAt: new Date(now()),
                      name: "Certificate name 3",
                      assignedCompetenceBlocks:[
                          {
                              _id: "98rfujd"
                          },
                          {
                              _id: "8dewc7hg"
                          }
                      ],
                      EQFLevel: "Level 3",
                      expires: new Date(now()),
                  }
              ]
          })
      },300)
  })
};

const removeCertification = (certificationId) =>{
  console.log(certificationId);
}

const uploadCertification = (certification) =>{
  console.log(certification._id);
}

const isCertificateInUse = (certificationId) => {
  return eliaAPI.get(`${API_ROUTE}/isCertificateInUse/${certificationId}`);
};

//===================================================================================================================

const readAllTraineesInSession = (certificationSessionId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllTraineesInSession/${certificationSessionId}`);
};

const readTraineeInSession = async (traineeId, certificationSessionId) => {
  return eliaAPI.get(`${API_ROUTE}/readTraineeInSession/${traineeId}/${certificationSessionId}`);
};

const updateTraineeDetailInSession = async (traineeId, certificationSessionId, detail) => {
  return eliaAPI.put(`${API_ROUTE}/updateTraineeDetailInSession/${traineeId}/${certificationSessionId}`, detail);
};

const updateTraineeInSession = async (traineeId, certificationSessionId, status) => {
  return eliaAPI.put(`${API_ROUTE}/updateTraineeInSession/${traineeId}/${certificationSessionId}`, status);
};

const loadExaminerList = (traineeId,sessionId) => {
  return eliaAPI.get(`${API_ROUTE}/loadExaminerList/${traineeId}/${sessionId}`);
};

const viewEvaluation = (traineeId,trainerId,sessionId) => {
  return eliaAPI.get(`${API_ROUTE}/viewEvaluation/${traineeId}/${trainerId}/${sessionId}`);
};

const certify = (traineeId,sessionId) => {
  return eliaAPI.get(`${API_ROUTE}/certify/${traineeId}/${sessionId}`);
};
const isCertified = (traineeId,sessionId) => {
  return eliaAPI.get(`${API_ROUTE}/isCertified/${traineeId}/${sessionId}`);
};
const updateEvaluationStatus = (traineeId,detailId,status) => {
  return eliaAPI.put(`${API_ROUTE}/updateEvaluationStatus/${traineeId}`, {detailId, status});
};
const updateEvaluationAdditionalComment = (traineeId,sessionId,additionalComment) => {
  return eliaAPI.put(`${API_ROUTE}/updateEvaluationAdditionalComment/${traineeId}`, {sessionId, additionalComment});
};

// Get all certification which are not yet saved on Blockchain
const readAllForBlockchain = () => {
  return eliaAPI.get(`${API_ROUTE}/readAllForBlockchain`);
};

// Certify on Blockchain
const certifyOnBlockchain = (traineeId,sessionId,networkId,contractAddress) => {
  return eliaAPI.post(`${API_ROUTE}/certifyOnBlockchain/${traineeId}/${sessionId}`, {networkId: networkId, contractAddress:contractAddress});
};

// Get all certification which are not yet saved on Blockchain
const verifyCertification = (certificationId) => {
  return eliaAPI.get(`${API_ROUTE}/verify/${certificationId}`);
};


const functions = {
  add,
  read,
  readAll,
  update,
  remove,
  upload,

  readAllGradingScales,

  readAllTemplates,
  readTemplate,
  removeTemplate,
  uploadTemplate,

  // user related
  getIdOfInnerTraineeCertificate,
  readTraineeCertifications,
  readAllUserCertifications,
  readUserCertification,
  readAllCertification,
  readCertification,
  readAllExaminerCertifications,
  isCertificateInUse,

  removeCertification,
  uploadCertification,
  readAllTraineesInSession,
  readTraineeInSession,
  updateTraineeInSession,
  updateTraineeDetailInSession,
  
  loadExaminerList,
  viewEvaluation,
  certify,
  isCertified,
  updateEvaluationStatus,
  updateEvaluationAdditionalComment,

  // Blockchain
  readAllForBlockchain,
  certifyOnBlockchain,
  //Verification
  verifyCertification
};

export default functions;
