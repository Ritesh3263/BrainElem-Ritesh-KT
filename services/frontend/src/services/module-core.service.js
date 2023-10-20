import {now} from "moment";
import {eliaAPI} from "./axiosSettings/axiosSettings";
import TeamService from "services/team.service"
const API_ROUTE = 'module-core';


// Earlier update methode
const updateModuleCore = (moduleCoreId, moduleCoreData) => {
  return eliaAPI.put(`${API_ROUTE}/update/${moduleCoreId}`, moduleCoreData);
};

/****************************************************************************************
 * Read module setup *
 ***************************************************************************************/
const readModuleCore = (moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/read/${moduleId}`);
};

/****************************************************************************************
 * School year *
 ***************************************************************************************/
const addMSAcademicYear = (data, moduleCoreId) => {
  return eliaAPI.put(`${API_ROUTE}/addMSAcademicYear/${moduleCoreId}`, data);
};

const updateMSAcademicYear = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSAcademicYear/${data._id}`, data);
};

const removeMSAcademicYear = (data) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSAcademicYear/${data._id}`);
};

/****************************************************************************************
 * Categories *
 ***************************************************************************************/
const addMSCategory = (moduleCoreId, data) => {
  return eliaAPI.put(`${API_ROUTE}/addMSCategory/${moduleCoreId}`, data);
};

const updateMSCategory = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSCategory/${data._id}`, data);
};

const removeMSCategory = (data) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSCategory/${data._id}`);
};

/****************************************************************************************
 * Subject *
 ***************************************************************************************/
const addMSSubject = (moduleCoreId, data) => {
  return eliaAPI.put(`${API_ROUTE}/addMSSubject/${moduleCoreId}`, data);
};

const updateMSSubject = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSSubject/${data._id}`, data);
};

const removeMSSubject = (data) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSSubject/${data._id}`);
};

/****************************************************************************************
 * Class *
 ***************************************************************************************/
const addMSClasses = (data) => {
  return eliaAPI.put(`${API_ROUTE}/addMSClasses`, {data});
};

const updateMSClass = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSClass/${data._id}`,data);
};

const removeMSClass = (classId) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSClass/${classId}`);
};

const readGroupsByTraineeId = (traineeId) => {
  return eliaAPI.get(`${API_ROUTE}/readGroupsByTraineeId/${traineeId}`);
};

const editChaptersInProgram = (data) => {
  return eliaAPI.put(`${API_ROUTE}/editChaptersInProgram`,data);
};

const readAllClassManagers =(moduleId)=>{
  return eliaAPI.get(`${API_ROUTE}/readAllClassManagers/${moduleId}`);
}
const readAllModuleTrainers = (moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/readAllModuleTrainers/${moduleId}`);
};

const readAllTrainees =(moduleId)=>{
  return eliaAPI.get(`${API_ROUTE}/readAllModuleTrainees/${moduleId}`);
};

/****************************************************************************************
 * Scale *
 ***************************************************************************************/
// -> Atention: modify only: customGradingScales [CUSTOM]
// -> defaultGradingScales: is a blueprint [DEFAULT model
// on the basis of which you can create your own grading scale
const addMSScale = (moduleCoreId, data) => {
  // console.log("moduleCoreId",moduleCoreId)
  // console.log("moduleCoreId",data)
  return eliaAPI.put(`${API_ROUTE}/addMSScale/${moduleCoreId}`, data);
};

const getAllGradingScalesForModule = (moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/${moduleId}/grading-scales`);
}

const updateMSScale = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSScale/${data._id}`, data);
};

const removeMSScale = (data) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSScale/${data._id}`);
};

/****************************************************************************************
 * Curriculum *
 ***************************************************************************************/
 const readCurriculumsByYear = (yearId, moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/readCurriculumsByYear/${yearId}/${moduleId}`);
};

 const readCurriculumsByModule = () => {
  return eliaAPI.get(`${API_ROUTE}/readCurriculumsByModule`);
};

const addMSCurriculum = (moduleCoreId, data) => {
  return eliaAPI.put(`${API_ROUTE}/addMSCurriculum/${moduleCoreId}`, data);
};

const updateMSCurriculum = (data) => {
  return eliaAPI.put(`${API_ROUTE}/updateMSCurriculum/${data._id}`, data);
};

const removeMSCurriculum = (data) => {
  return eliaAPI.delete(`${API_ROUTE}/removeMSCurriculum/${data._id}`);
};

const resetCurriculum = (trainingPathId,trainingModuleId=null) => {
  return eliaAPI.put(`${API_ROUTE}/resetCurriculum`, {trainingPathId,trainingModuleId});
}

const saveContentOrder = (data) => {
  return eliaAPI.put(`${API_ROUTE}/saveContentOrder`, data);
}


//Permision Api
//Permision List
const readAllPermision = () => {
  return eliaAPI.get(`permissions`);
};


//get permission
const readPermision = (id) => {
  return eliaAPI.get(`permissions/${id}`);
};

//Add Permission
const addPermission = ( newPermission) => {
  return eliaAPI.post(`permissions/`,  newPermission );
};

//Edit Permission
const editPermission = (newPermission) => {
  return eliaAPI.patch(`permissions/${newPermission._id}`, newPermission
);
};

//Delete Permission
const deletePermission = (id) => {
  return eliaAPI.delete(`permissions/${id}`);
};



//Roles Api
//Roles List
const readAllRoles = () => {
  return eliaAPI.get(`rolemasters`);
};

//Add Role
const addRole = ( newRole) => {
  return eliaAPI.post(`rolemasters`, newRole);
};

//Edit Role
const editRole = (role,id) => {
  return eliaAPI.patch(`rolemasters/${id}`,role
);
};

//get role
const readRole = (id) => {
  return eliaAPI.get(`rolemasters/${id}`);
};
//Delete Role
const deleteRole = (id) => {
  return eliaAPI.delete(`rolemasters/${id}`);
};

// Users list
const readAllModuleUsers = (moduleId) => {
  return eliaAPI.get(`${API_ROUTE}/read-all-module-users/${moduleId}`);
};

//one-item form
const addModuleUser = (moduleId, newUser) => {
  return eliaAPI.put(`${API_ROUTE}/add-user/${moduleId}`, { newUser });
};

const updateModuleUser = (updatedUser) => {
    return eliaAPI.put(`${API_ROUTE}/update-user/${updatedUser._id}`, {updatedUser,}
  );
};


async function readAllTeams() {
  var availableTeamsResponse = await TeamService.readAllTeam()
  var availableTeams = availableTeamsResponse?.data?.data ?? []
  return availableTeams

}


async function assignTeamIds(users) {
  // Find _id for all teams
  // in case the team does not exits, create it
  var availableTeams = await readAllTeams()
  for (var index = 0; index < users.length; index++) {

    if (users[index].teamName) {
      let team = availableTeams.find(t => t.name == users[index].teamName)
      if (!team) {// Does not exits - create
        await TeamService.addTeam({ name: users[index].teamName })
        console.log("Created team ", users[index].teamName)
        availableTeams = await readAllTeams()
        team = availableTeams.find(t => t.name == users[index].teamName)
      }
      users[index].teams = [team?._id]
    }
  }

  return users
};

const uploadUsersFromCsv = async (usersFromCsv,rows) => {
  var avRoles=rows.map((rw)=>rw._id);
  // Assign requested teams
  usersFromCsv = await assignTeamIds(usersFromCsv)
  let users = usersFromCsv.map(u=>{
    var defaultRoleMaster=rows.find((rl)=>rl.name==u.roleMaster)
    return {
      name: u.name,
      surname: u.surname,
      username: u.username,//+(Math.random() + 1).toString(36).substring(7),// FOR TESTING
      password: u.password, 
      email: u.email,//+(Math.random() + 1).toString(36).substring(7),// FOR TESTING
      settings: {
        role: u.role,
        roleMaster: u.roleMaster,
        defaultRoleMaster:defaultRoleMaster?._id,
        availableRoleMasters:avRoles,
        language: u.language? u.language.toLowerCase(): undefined,
        isActive: u.isActive.toLowerCase()=="true" ? true : false,
        // gender: u.gender, // ?? no use
      },
      details: {
        phone: u.phone,
        street: u.street,
        Building: u.Building,
        city: u.city,
        postCode: u.postCode,
        country: u.country,
        dateOfBirth: u.dateOfBirthForReq,
      },
      teams: u.teams??[]
      // isSelected: u.isSelected, // no use here
    }
  })

  console.log("structured users from csv", users);

  return eliaAPI.post(`${API_ROUTE}/addUsersFromCsv`, users);
};

/****************************************************************************************
 * Grades *
 ***************************************************************************************/

 const getProgramGrades = (trainingModuleId) => {
  return eliaAPI.get(`${API_ROUTE}/getProgramGrades/${trainingModuleId}`);
};

const getSubjectGradesInClass = (groupId, trainingModuleIds) => {
  return eliaAPI.put(`${API_ROUTE}/getSubjectGradesInClass/${groupId}`, trainingModuleIds);
};

const getSubjectsInClass = (groupId,periodId) => {
  return eliaAPI.get(`${API_ROUTE}/getSubjectsInClass/${groupId}/${periodId}`);
};

const getTraineesInClassWithExamList = (trainingModuleId) => {
  return eliaAPI.get(`${API_ROUTE}/getTraineesInClassWithExamList/${trainingModuleId}`);
};

const removeModuleUser = (moduleId, userId)=>{
  return eliaAPI.put(`${API_ROUTE}/remove-user/${userId}`);
}

const countContentsInModule = () => {
  return eliaAPI.get(`${API_ROUTE}/countContentsInModule`);
};

//---------------------------------------------------------------------

const getTrainingModuleFromOtherPrograms = (trainingModuleId) => {
  return eliaAPI.get(`${API_ROUTE}/getTrainingModuleFromOtherPrograms/${trainingModuleId}`);
}

const getMinmax = () => {
  return eliaAPI.get(`${API_ROUTE}/getMinmax`);
}

const functions={
  // Read module-setup:
  readModuleCore,

  // Earlier method: update all module (->rebuild)
  updateModuleCore,

  // School-year
  updateMSAcademicYear,
  addMSAcademicYear,
  removeMSAcademicYear,

  // Category
  addMSCategory,
  updateMSCategory,
  removeMSCategory,

  // Subject
  addMSSubject,
  updateMSSubject,
  removeMSSubject,

  // Class
  addMSClasses,
  updateMSClass,
  removeMSClass,
  readGroupsByTraineeId,
  editChaptersInProgram,

  // Class - architect part:
  readAllClassManagers,
  readAllModuleTrainers,
  readAllTrainees,

  // Scale
  getAllGradingScalesForModule,
  addMSScale,
  updateMSScale,
  removeMSScale,

  // Curriculum
  readCurriculumsByYear,
  readCurriculumsByModule,
  addMSCurriculum,
  updateMSCurriculum,
  removeMSCurriculum,
  resetCurriculum,
  saveContentOrder,

  // Module-users
  readAllModuleUsers,
  addModuleUser,
  removeModuleUser,
  updateModuleUser,
  uploadUsersFromCsv,

  // Grades
  getMinmax,
  getProgramGrades,
  getSubjectGradesInClass,
  getSubjectsInClass,
  getTraineesInClassWithExamList,

  // Stats
  countContentsInModule,

  // Other programs
  getTrainingModuleFromOtherPrograms,

  //Roles
  readAllRoles,
  addRole,
  editRole,
  deleteRole,
  readRole,
  //Permissions
  readAllPermision,
  addPermission,
  editPermission,
  deletePermission,
  readPermision
};

export default functions;