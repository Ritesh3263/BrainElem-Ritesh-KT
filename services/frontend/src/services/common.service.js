import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'interests';

const getAllInterests = (content) => {
    return eliaAPI.get(`${API_ROUTE}`);
};


const getPopularInterests = (content) => {
    return eliaAPI.get(`${API_ROUTE}/popular`);
};

// Function used for example for hidding CognitiveSpace from trainees on production
const isDevelopment = () => {
    return window.location.hostname.includes('localhost') || window.location.hostname.includes('elia.lc') || window.location.hostname.includes('dev.elia') || window.location.hostname.includes('dev.evvo')
}

// Check i arrays have any common element
const canAccess = (user, modulesIds) => {
    if (user?.modules){
        let availableModulesIds = user?.modules.map(m=>m._id)
        if (availableModulesIds.some(id=> modulesIds.includes(id))) return true
    }
    return false
}

// Function used to check is it is educational type of module
// Used only for checking initial state
const isEduModule = (user) => {
    return (isNemesisModule(user) || isLasModule(user))
}

// Function used to check is it is educational type
// Used only for checking initial state
const isEdu = (user) => {
    const EDU_SUBDOMAINS = ['nemesis.', 'las.']
    for (let subdomain of EDU_SUBDOMAINS){// First check subdomain
        if (window.location.hostname.includes(subdomain)) return true
    }

    if (isEduModule(user)) return true;

    // Force EDU after refresh based on localstorage - usefull for development and marketing module
    if (localStorage.getItem('isEdu')=='true') return true

    else return false
}

// Check if module is one of the Marketing modules
// Make sure this function is matching the backend equivalent
const isMarketingModule = (user) => {
    const modulesIds =['647341fe4cb13b00085b6589', '647341fe4cb13b00085b658c'] 
    return canAccess(user, modulesIds)
}


// Check if user is manager of MarketingModule
const isMarketingManager = (user) => {
    return ['647341a34cb13b00085b651f'].includes(user.id)
}

// Check if module is one of the Mark's modules
// Make sure this function is matching the backend equivalent
const isMarksModule = (user) => {
    const modulesIds = ['6478992a0d8465000823c0de', '6478992a0d8465000823c0e1']
    return canAccess(user, modulesIds)
}

// Check if module is Leysin American School
// Make sure this function is matching the backend equivalent
const isLasModule = (user) => {
    const modulesIds = ['6500102ab4bd2c00085a6d97', '6500102ab4bd2c00085a6d9a']
    return canAccess(user, modulesIds)
  }
  
  // Check if module is Nemesis module
  // Make sure this function is matching the backend equivalent
const isNemesisModule = (user) => {
    const modulesIds = ['64e3a58b6c44140008df5f9f', '64e3a58b6c44140008df5fa2']
    return canAccess(user, modulesIds)
  }


const functions = {
    getAllInterests,
    getPopularInterests,
    isDevelopment,
    isEdu,
    isEduModule,
    isMarketingModule,
    isMarketingManager,
    isMarksModule
};

export default functions;
