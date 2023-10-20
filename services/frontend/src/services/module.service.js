import authService from "./auth.service";
import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'modules';

const add = (newModule, subscriptionId)=>{
    return eliaAPI.post(`${API_ROUTE}/add`, {
        subscriptionId, ...newModule
      });
}

const remove = (moduleId)=>{
    return eliaAPI.delete(`${API_ROUTE}/remove/${moduleId}`);
    //return eliaAPI.delete(`${API_ROUTE}/modules/remove/${moduleId}`);
}

const read =  (moduleId)=>{
    return eliaAPI.get(`${API_ROUTE}/read/${moduleId}`);
}

const importUsersFromModules = (moduleIds, roles) => {
    return eliaAPI.post(`${API_ROUTE}/import-users`, {moduleIds, roles});
}

const readAll =  (subscriptionId) => {
    return eliaAPI.get(`${API_ROUTE}/all/${subscriptionId}`);
  };

const update = (updatedModule)=>{
    return eliaAPI.put(`${API_ROUTE}/update/${updatedModule._id}`, updatedModule);
}

const getListAllModuleManagers =  (subscriptionId)=>{
    return eliaAPI.get(`${API_ROUTE}/get-managers/${subscriptionId}`);
    // return allManagersList;
}

const getListOfFreeAllModuleManagers =  (moduleId)=>{
    return eliaAPI.get(`${API_ROUTE}/get-free-managers/${moduleId}`);
    // return allManagersList;
}

const addNewModuleManger =  (data, subscriptionId)=>{
    let moduleManager ={
        username: data.username,
        name: data.name,
        surname: data.surname,
        password: data.password,
        settings: {
            isActive: data.isActive
        },
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
        }    
    }
    if (data.email) moduleManager.email = data.email

    return eliaAPI.post(`${API_ROUTE}/add-manager/${subscriptionId}`,{
        moduleManager
    });
}

const updateModuleManger =  (data)=>{
    let moduleManager ={
        username: data.username,
        name: data.name,
        surname: data.surname,
        // password: data.password,
        settings : {isActive: data.isActive, role: 'ModuleManager'},
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
          subinterests: data.subinterests,
        }
    }
    if (data.email) moduleManager.email = data.email
    
    return eliaAPI.put(`${API_ROUTE}/update-manager/${data._id}`, {
        moduleManager
    });
}

const removeModuleManger = (uId)=>{
    return eliaAPI.delete(`${API_ROUTE}/removeModuleManger/${uId}`);
}

const removeModuleFromManager = (uId)=>{
    return eliaAPI.delete(`${API_ROUTE}/removeModuleFromManager/${uId}`);
}

const getManagersInModule = (moduleId) => {
    return eliaAPI.get(`${API_ROUTE}/get-managers-in-module/${moduleId}`);
};

const getArchitectsInModule = (moduleId) => {
    return eliaAPI.get(`${API_ROUTE}/get-architects-in-module/${moduleId}`);
};

const remainingUserCountInModule = (moduleId) => {
    return eliaAPI.get(`${API_ROUTE}/get-remaining-user/${moduleId}`);
};

const getAllTrainingModules = (moduleId) => {
    // Get all TrainingModules inside module.
    return eliaAPI.get(`${API_ROUTE}/${moduleId ? moduleId+'/' : ''}training-modules`);
};

const getAllTrainers = (moduleId) => {    
    return eliaAPI.get(`${API_ROUTE}/${moduleId ? moduleId+'/' : ''}trainers`);
}

const getAllTrainersInModule = (moduleId) => {    
    return eliaAPI.get(`${API_ROUTE}/${moduleId ? moduleId+'/' : ''}trainersInModule`);
}

const getClassManagersGroups = () => {    
    return eliaAPI.get(`${API_ROUTE}/get-class-managers-groups`)
}

const getAllGroups = (moduleId) => {
    return eliaAPI.get(`${API_ROUTE}/${moduleId ? moduleId+'/' : ''}groups`);
}

const getAllGroupsForArchitect = () => {
    return eliaAPI.get(`${API_ROUTE}/getAllGroupsForArchitect`);
}

const  setCurrentModule = (module)=>{
    localStorage.setItem("currentModule", module)
}

const  getCurrentModule = () =>{
    // if moduleId not found, or multiple, pop up a window to select a module
    let currentModule = {_id: authService.getCurrentUser().moduleId}
    // let currentModule = JSON.parse(localStorage.getItem("currentModule"))

    if (!currentModule){
        // If module was not selected, take first module from the list
        if (authService.getCurrentUser().hasOwnProperty("modules")) currentModule = authService.getCurrentUser().modules[0]
        else currentModule = {_id: "000000000000000000000"} // temporary: fake id
    }

    return currentModule
}

const getModuleUsers = (moduleId=null) => {
    if (moduleId) return eliaAPI.get(`${API_ROUTE}/${moduleId}/get-module-users`);
    else return eliaAPI.get(`${API_ROUTE}/get-module-users`);
}



const functions =  {
    add,
    remove,
    read,
    importUsersFromModules,
    readAll,
    update,
    getListAllModuleManagers,
    getManagersInModule,
    getArchitectsInModule,
    addNewModuleManger,
    updateModuleManger,
    removeModuleManger,
    removeModuleFromManager, 
    getAllTrainingModules,
    remainingUserCountInModule,
    getCurrentModule,
    setCurrentModule,
    getAllTrainers,
    getAllTrainersInModule,
    getClassManagersGroups,
    getAllGroups,
    getAllGroupsForArchitect,
    getListOfFreeAllModuleManagers,
    getModuleUsers
};

export default functions;