import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'company';

const add = (company) => {
  return eliaAPI.post(`${API_ROUTE}/add`, company);
};

const readAll= () => {
  return eliaAPI.get(`${API_ROUTE}/readAll`);
};

const read = (companyId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${companyId}`);
};

const readByOwner = (ownerId) => {
  return eliaAPI.get(`${API_ROUTE}/readByOwner/${ownerId}`);
};

const update = (company) => {
  return eliaAPI.put(`${API_ROUTE}/update/${company._id}`, company);
};

const remove = (company) => {
  return eliaAPI.delete(`${API_ROUTE}/delete/${company._id}`);
};

const readAllPartnerExaminers = (partnerId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllPartnerExaminers/${partnerId}`);
};

const readAllPartnerTrainees = (partnerId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllPartnerTrainees/${partnerId}`);
};

const readAllPartnerExaminersAndTrainees = (partnerId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllPartnerExaminersAndTrainees/${partnerId}`);
};

const readPartnerExaminer = (examinerId) => {
  return eliaAPI.get(`${API_ROUTE}/readExaminer/${examinerId}`);
};


const addPartnerExaminer = (data) => {
  return eliaAPI.post(`${API_ROUTE}/addExaminer/${data.companyId}`, data.examiner);
};

const updatePartnerExaminer = (examiner, partnerId) => {
  // partner id is not necessary
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        status: 200,
        data:
            {
              message: "OK"
            }
      })
    },300)
  })
};

const removePartnerExaminer = async (examinerId, companyId) => {
  return eliaAPI.delete(`${API_ROUTE}/removeExaminer/${examinerId}/${companyId}`);
};

const uploadPartnerExaminersFromCsv = (usersFromCsv) => {
  console.log("need to provide username and pass!")
  console.log("users from csv", usersFromCsv);
  let users = usersFromCsv.map(u=>{
    return {
      name: u.name,
      surname: u.surname,
      username: u.username,
      password: u.password,
      email: u.email,
      settings: {
        role: u.role,
        language: u.language? u.language.toLowerCase(): undefined,
        isActive: 1, // assuming all selected names are active
        // gender: u.gender, // ?? no use
      },
      details: {
        phone: u.phone,
        street: u.street,
        Building: u.Building,
        city: u.city,
        postCode: u.postCode,
        country: u.country,
        dateOfBirth: u.dateOfBirth,
      },
      // isSelected: u.isSelected, // no use here
    }
  })

  console.log("structured users from csv", users);

  // return eliaAPI.post(`${API_ROUTE}/addUsersFromCsv`, users);
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      resolve({
        data: {
          message: "OK"
        }
      })
    },300)
  })
};

const functions = {
  readAll,
  add,
  read,
  readByOwner,
  update,
  remove,

  readAllPartnerExaminers,
  readAllPartnerTrainees,
  readAllPartnerExaminersAndTrainees,
  readPartnerExaminer,
  addPartnerExaminer,
  updatePartnerExaminer,
  removePartnerExaminer,
  uploadPartnerExaminersFromCsv,
};

export default functions;
