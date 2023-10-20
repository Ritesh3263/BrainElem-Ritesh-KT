// const db = require("../models");
const db = require("../models");
const Ecosystem = require("../models/ecosystem.model");
const ModuleCore = require("../models/module_core.model");
const User = require("../models/user.model");
var jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

var bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;
const {braincoreTestsIds} = require("../utils/braincoreTestsIds");

// Utils
const moduleUtils = require("../utils/module");

// Signup action
const getNewUser = async (data) => {
    let newUser = data;
    const userId = new ObjectId();
    const user = new User({
        _id: userId,
        name: newUser.name,
        surname: newUser.surname,
        username: newUser.username,
        email: newUser.email,
        password: bcrypt.hashSync(newUser.password, 8),
        settings: {
            ...data?.settings??{},
            isActive: true,
            emailConfirmed: false,
            selfRegistered: true,
            origin: data?.settings?.origin??undefined,
            language: data?.settings?.language??undefined
        },
        scopes: [
            { name: "users:all:" + userId },
            { name: "content:create:all" },
            // This is not supposed to be here anymore,
            // as authorization of this scpepe was changed from what I intended at the beggining
            // We should prepare a migration to remove this scope for all self-registered users 
            // who were created in the past
            //{ name: "ecosystems:read:100000000000000000000000" },

            // This is a BrainElem Training Center _id
            // Each new user will have access to it by default
            { name: "modules:read:200004000080000000000000" }, // Default Training Center scope for Individual User
        ],

    })

    switch (data.registerType) {
        case "INDIVIDUAL":
            user.settings.role = "Trainee"
            user.settings.defaultRole = "Trainee"
            user.settings.availableRoles = ["Trainee"]

            break;
        case "TRAINER":
            user.settings.role = "Trainer"
            user.settings.defaultRole = "Trainer"
            user.settings.availableRoles = ["Trainer"]

            break;
        case "BUSINESS":
            user.settings.role = "Partner"
            user.settings.defaultRole = "Partner"
            user.settings.availableRoles = ["Partner"]
            // eslint-disable-next-line no-case-declarations
            const company = new db.company({
                _id: new ObjectId(),
                isActive: true, // new: default set to true during creation, but normally, shall change to true only when business is approved
                name: newUser.companyName,
                owner: userId,
                ownerPosition: newUser.ownerPosition,
            });
            company.save(() => { });

            break;
        default:
            user.settings.role = "Other"
            break;
    }

    return user
};

// user - user for which token will be generated
// expiresIn - for how long token will be valid in seconds - by default 24h(86400s)
var getJwtToken = (user, expiresIn=86400, selectedModuleId=null, selectedRole=null,selectedPeriod=null,selectedRoleMaster=null) => {
    // Load scopes names from database
    let scopes = user.getScopes();    
    let moduleId = selectedModuleId;
    let subscriptionId = user.getSubscriptionId();
    let ecosystemId = user.getEcosystemId();

    let tokenArray = { id: user.id, role: selectedRole||user.settings.role, scopes, moduleId, selectedPeriod,roleMaster:selectedRoleMaster||user.settings.roleMaster };
    if(subscriptionId) tokenArray.subscriptionId = subscriptionId
    if(ecosystemId) tokenArray.ecosystemId = ecosystemId
    const token = jwt.sign(tokenArray, config.secret, {
      expiresIn: expiresIn, 
    });
    
    return token
}

// Create base string for crating token to access BrainCore test
// userId - _id of invited user
// inviterId - id of inviting user 
var getTokenBaseForBraincoreTest = async (userId, inviterId, moduleId) => {
    var userResultsCount = await db.result.count({ user: userId, 'content': { $in: braincoreTestsIds } })
    var salt = userResultsCount.toString()
    var token = salt+"_"+userId.toString() +"_"+ inviterId.toString() +"_"+moduleId.toString()
    return token
}

// Genereate token to access BrainCore test
// userId - _id of invited user
// inviterId - id of inviting user 
var getTokenForBrainCoreTest = async (userId, inviterId, moduleId) => {
    let base = await getTokenBaseForBraincoreTest(userId,inviterId, moduleId)
    var token = bcrypt.hashSync(base.toString(), 8)
    console.log('base',base)
    console.log('tok', token)
    return token
}

// Check if invitation token is valid
// token - token to be checked
// userId - _id of invited user
// inviterId - id of inviting user 
var isValidTokenForBrainCoreTest = async (token, userId, inviterId, moduleId) => {
    let base = await  getTokenBaseForBraincoreTest(userId,inviterId, moduleId)
    let isValid =  bcrypt.compareSync(base, token)
    console.log(isValid)
    return isValid
}



// This function ensures that users can only connect 
// from specific subdomains dedicated for their module
// ---------------------------------------------------
// req - request object
// user - user database object
const isDomainAllowed = async (req, user) => {
    // For those special roles do not check the domain - always allow login
    if (['Root', 'EcoManager', 'NetworkManager'].includes(user.settings.role)) return true

    // Resctrict domain only for production - for development and stage allow any domain
    if (process.env.BACKEND_ENV != "production" || req.headers.host.includes('stage')) return true;

    // Check all modules
    let modulesIds = await user.getModulesIds()
    for (let moduleId of modulesIds) {
        console.log("Checking domain for module", moduleId)
        if (moduleUtils.isNemesisModule(moduleId)) {
            if (!req.headers.host.includes('nemesis')) return false
        }
        else if (moduleUtils.isLasModule(moduleId)) {
            if (!req.headers.host.includes('las')) return false
        }
    }

    return true
}

// Prepare user object which will be used on frontend
var getUserDataForFrontend = async (user, selectedModuleId=null, selectedRole=null,selectedPeriod=null,selectedRoleMaster=null) => {
    // Load scopes names from database
    const token = getJwtToken(user, undefined, selectedModuleId, selectedRole,selectedPeriod,selectedRoleMaster);
    const modulesObj = await user.detectModule(selectedModuleId);
    let isInTrainingCenter = user.isInTrainingCenter(modulesObj)
    let isInCognitiveCenter = user.isInCognitiveCenter(modulesObj);
    let isInSchoolCenter = user.isInSchoolCenter(modulesObj);
    let role = selectedRole || user.settings.role;
    let roleMaster = selectedRoleMaster || user.settings.roleMaster;
    let permissions = [];
    let enableTest = !user.brainCoreTest || !user.brainCoreTest.status || user.brainCoreTest.status == 'Request sent'; // if braincoretest object not exists then true, if braincoretest object exists and status is request sent then true.
    if (roleMaster) {
        const map = await db.rolePermissionsMapping.findOne({roleMaster: roleMaster._id}).populate([{path: "roleMaster", select: "name"},{path:"permissions", select: "moduleName access edit"}]);
        permissions = map && map.permissions || [];
        isInCognitiveCenter = isInCognitiveCenterByPermissions(permissions, isInCognitiveCenter);
        isInTrainingCenter = isInTrainingCenterByPermissions(permissions, isInTrainingCenter);
    }
    let userData = {
      id: user._id,
      moduleId: selectedModuleId,
      username: user.username,
      name: user.name,
      surname: user.surname,
      email: user.email,
      age: user.getAge(),
      phone: user.details.phone,
      scopes: user.getScopes(),
      role,
      availableRoles: user.settings.availableRoles,
      roleMaster,
      availableRoleMasters: user.settings.availableRoleMasters,
      selfRegistered: user.settings.selfRegistered,
      isInTrainingCenter,
      isInCognitiveCenter,
      isInSchoolCenter,
      isInCognitiveCenterByPermissions: isInCognitiveCenterByPermissions(permissions),
      isInTrainingCenterByPermissions: isInTrainingCenterByPermissions(permissions),

      // This will be the new way to indicate
      // that this is Educational module dedicated for Schools
      isEdu: selectedModuleId ? await moduleUtils.isEdu(selectedModuleId) : false,
      language: user.settings.language,
      origin: user.settings.origin,
      access_token: token,
      hiddens: user.settings.hide,
      prevLogin: user.settings.prevLogin,
      selectedPeriod: selectedPeriod,
      enableTest,
      permissions
    };

    // // refine roles
    // if (isInTrainingCenter) {
    //     if(!['Root','EcoManager','CloudManager','NetworkManager','ModuleManager',"Trainer","Trainee","Librarian","Inspector","Assistant",'Coordinator','TrainingManager','Partner'].includes(role)) {
    //         userData.role = user.settings.availableRoles.includes("Trainer") ? "Trainer" : user.settings.availableRoles[0]
    //     }
    // } else {
    //     if(!['Root','EcoManager','CloudManager','NetworkManager','ModuleManager',"Trainer","Trainee","Librarian","Inspector","Architect","Parent"].includes(role)) {
    //         userData.role = user.settings.availableRoles.includes("Trainer") ? "Trainer" : user.settings.availableRoles[0]
    //     }
    // }

    //Get modules&subscriptions for user
    let ecosystems = await user.getEcosystems();
    let subscriptions = await user.getSubscriptions();
    let modules = await user.getModules();

    let modulesWithAllTrainings = await user.getTrainingModules(modules); // send modules object as parameter to get remaining training modules from the same subscription // if no argument is passed, all training modules (only) will be returned
    if (roleMaster && !isInCognitiveCenterByPermissions(permissions)) {
        // If isInCognitiveCenter false
        modulesWithAllTrainings = modulesWithAllTrainings.filter(m => m.moduleType !== 'COGNITIVE');
    }
    
    if (ecosystems.length) userData["ecosystems"] = ecosystems;
    if (subscriptions.length) userData["subscriptions"] = subscriptions;
    if (modules.length) userData["modules"] = modulesWithAllTrainings;
    return userData;
}

const isInCognitiveCenterByPermissions = (permissions, isInCognitiveCenter = true) => {
    // If isInCognitiveCenter false
    if (!isInCognitiveCenter) return false;
    // if permissions empty hide sentinel
    if (!permissions.length) return false;
    const moduleList  = [
        "Home",
        "Admin - Authorization",
        "Admin - Teams Access",
        "Admin - Credits",
        "My Teams - Teams",
        "My Teams - BC Test Registrations",
        "My Teams - Results",
        "My Teams - Statistics",
        // "My Team - BC Results for Team - NAD/QNAD",
        // "My Team - BC Results for Team - strong/weak points",
        // "My Team - BC Results for Team - interpersonal dimensions",
        // "My Team - BC Results for Team - intrapersonal dimensions",
        // "My Team - BC Results for Team - emotional intelligence",
        // "My Team - BC Results for Team - cost/time report",
        "My Users - Users",
        "My Users - BC Test Registrations",
        "My Projects",
        // "My Diary",
        "My Trainings - BrainCore Trainer"
    ];
    // if permissions has atleast one of the header module then show sentinel
    if (permissions.some(obj => moduleList.includes(obj.moduleName))) {
        return true;
    }
    return false;
}

const isInTrainingCenterByPermissions = (permissions, isInTrainingCenter = true) => {
    // If isInTrainingCenter false
    if (!isInTrainingCenter) return false;
    // if permissions empty hide myspace
    if (!permissions.length) return false;
    const moduleList  = [
        "My Space - My Results",
        "My Space - Virtual Coach",
        "My Space - My Resources",
        "My Trainings - BrainCore Coach",
    ];
    // if permissions has atleast one of the header module then show sentinel
    if (permissions.some(obj => moduleList.includes(obj.moduleName))) {
        return true;
    }
    return false;
}

var getEcosystemIdFromModuleId = async (moduleId) => { // yet not used
    // Find ecosystem with only matching module inside
    let ecosystem = await Ecosystem.findOne({
        "subscriptions.modules._id": moduleId
    },
        { "_id": 1 }
    )
    return ecosystem._id
}

var getSubscriptionIdFromModuleId = async (moduleId) => {
    // Find ecosystem with only matching module inside
    let ecosystem = await Ecosystem.findOne({
        "subscriptions.modules._id": moduleId
    },
        { "subscriptions.$": 1 }
    )
    if (ecosystem) return ecosystem.subscriptions[0]._id
    return "empty"
}

var getModuleIdFromModuleCoreId = async (moduleCoreId) => {
    // Find ecosystem with only matching module inside
    let moduleCore = await ModuleCore.findOne(
        { _id: moduleCoreId },
        { "moduleId": 1 },
    )
    if (moduleCore) moduleCore.moduleId
    return "empty"
}

var getEcosystemIdFromSubscriptionId = async (subscriptionId) => {
    // Find ecosystem with only matching subscription inside
    let ecosystem = await Ecosystem.findOne({
        "subscriptions._id": subscriptionId
    },
        { "_id": 1 }
    )
    return ecosystem._id
}

var getAllSubscriptionIdsFromEcosystemId = async (ecosystemId) => {
    let res = await Ecosystem.findById(
        ecosystemId,
        { 'subscriptions._id': 1 }
    )
    return res.subscriptions.map(x => x._id)
}

var getAllModuleIdsFromSubscriptionId = async (subscriptionId) => {
    let res = await Ecosystem.findOne(
        { "subscriptions._id": subscriptionId },
        { 'subscriptions.modules.$': 1 }
    )
    return res.subscriptions[0].modules.map(x => x._id)
}

var getAllUsersFromModule = async (moduleId) => {
    const User = require("../models/user.model");
    let moduleUsers = await User.find(
        { "scopes.name": { $regex: moduleId, $options: "i" } },
        "_id"
    );
    return moduleUsers.map(x => x._id.toString());
}


var getAllUsersFromSubscription = async (subscriptionId) => {
    const User = require("../models/user.model");
    let subscriptionUsers = await User.find(
        { "scopes.name": { $regex: subscriptionId, $options: "i" } },
        "_id"
    );
    let users = subscriptionUsers.map(x => x._id.toString());
    let modules = await getAllModuleIdsFromSubscriptionId(subscriptionId);
    for await (const item of modules) {
        let modUsers = await getAllUsersFromModule(item);
        users = [...users,...modUsers]
    }
    return users;
}

var getAllUsersFromEcosystem = async (ecosystemId) => {
    const User = require("../models/user.model");
    let ecosystemUsers = await User.find(
        { "scopes.name": { $regex: ecosystemId, $options: "i" } },
        "_id"
        );
    let users = ecosystemUsers.map(x => x._id.toString());
    let subscriptions = await getAllSubscriptionIdsFromEcosystemId(ecosystemId);
    for await (const subscriptionId of subscriptions) {
        let subUsers = await getAllUsersFromSubscription(subscriptionId);
        users = [...users,...subUsers]
    }
    return users;
}

// searching for modules/networks/ecosystem managers
var findManagersByItsScope = (scopes) => {
    let managers = [];
    let index = ['ecosystems', 'subscriptions', 'modules']
    scopes.filter(x => x.match(/(ecosystems:all:|subscriptions:all:|modules:all:)/))
    .forEach(scope => {
        let indexArr = scope.split(":")
        managers.push([indexArr[2], index.indexOf(indexArr[0])])
    })
    return managers
}

var canWriteUser = async (userId, scopes, moduleId=null,loggedUserId, roleMaster=null) => {
    // Check if edited user exists or not
    let requestedUser = await User.findOne({_id: userId});
    if(!requestedUser) return false;
    // find if user is a manager of: modules/networks/ecosystem
    if (scopes.includes("all:all:all")) return true;
    else if (scopes.includes(`users:write:all`)) return true;
    else if (scopes.includes(`users:all:${userId}`)) return true;
    else if (loggedUserId==userId) return true// Allow for editing user it'self
    else if (roleMaster) {
        // if user has roleMaster and 'My Users - Users' permission with edit then allow
        const map = await db.rolePermissionsMapping.findOne({roleMaster: roleMaster._id}).populate({path: "permissions"});
        if (!map) return false;
        const canEdit = map.permissions && map.permissions.some(permission => permission.moduleName == "My Users - Users" && permission.edit == true);

        // Check if edited user belongs to the module and edit access permission
        let allowed = await requestedUser.getModules()
        if (allowed.map(m=>m._id).some(id=>id.equals(moduleId)) && canEdit) return true;
        else return false;
    }
    let foundManagers = findManagersByItsScope(scopes);
    if (foundManagers.length>0) {
        let foundUsers = [];
        for await (const manager of foundManagers) {
            if (manager[1]===0) {
                let users = await getAllUsersFromEcosystem(manager[0]);
                foundUsers = [...foundUsers,...users]
            }
            else if (manager[1]===1) {
                let users = await getAllUsersFromSubscription(manager[0]);
                foundUsers = [...foundUsers,...users]
            }
            else if (manager[1]===2) {
                let users = await getAllUsersFromModule(manager[0]);
                foundUsers = [...foundUsers,...users]
            }
        }
        // if (foundUsers.includes(userId)) return true;
        if (foundUsers.includes(userId)) {
            let loggedUser = await db.user.findOne({_id: loggedUserId}).catch((err) => false);
            if (loggedUser.isAssistant()) {
                let permissions = loggedUser.settings.permissions?.assistant?.find(p => p.module.equals(moduleId))?.disallowed||[]
                // if (permissions.some(p => ['create-user', 'update-user', 'delete-user'].includes(p))) return false;
                if (permissions.some(p => ['manage-user'].includes(p))) return false;
            } else return true;
        }
        // switch (foundManager[1]) {
        //     case 0: // ecosystems
        //         userList = await getAllUsersFromEcosystem(foundManager[0]);
        //         break;
        //     case 1: // subscriptions
        //         userList = await getAllUsersFromSubscription(foundManager[0]);
        //         break;
        //     case 2: // modules
        //         userList = await getAllUsersFromModule(foundManager[0]);
        //         break;
        //     default:
        //         return false
        // }
        // if user_id inside the list, authorize 
        // userList = userList.map(x=>x.toString()) // solved
        // if (userList.includes(userId)) return true;
    }
    return false;
};

var canReadEcosystem = async (userId, ecosystemId, scopes) => {
    // Scope based authorization - no account
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`ecosystems:read:all`)) return true; // Allow if can access all ecosystems
    else if (scopes.includes(`ecosystems:all:all`)) return true; // Allow if can do all actions in all ecosystems
    else if (scopes.includes(`ecosystems:all:${ecosystemId}`)) return true; // Allow if can do all actions in this ecosystem
    else if (scopes.includes(`ecosystems:read:${ecosystemId}`)) return true; // Allow if can access this ecosystem
    
    // Accunt based authorization - also based on scopes
    let user = await User.findOne({_id: userId});
    if(!user) return false;
    let allowed = await user.getEcosystems()
    if (allowed.map(e=>e._id).some(id=>id.equals(ecosystemId))) return true;
    return false;
};

var canReadSubscription = async (userId, subscriptionId, scopes) => {
    // Scope based authorization - no account
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`subscriptions:read:all`)) return true; // Allow if can access all subscriptions
    else if (scopes.includes(`subscriptions:all:all`)) return true; // Allow if can do all actions in all subscriptions
    else if (scopes.includes(`subscriptions:all:${subscriptionId}`)) return true; // Allow if can do all actions in this subscription
    else if (scopes.includes(`subscriptions:read:${subscriptionId}`)) return true; // Allow if can access this subscription
    
    // Accunt based authorization - also based on scopes
    let user = await User.findOne({_id: userId});
    if(!user) return false;
    let allowed = await user.getSubscriptions()
    if (allowed.map(s=>s._id).some(id=>id.equals(subscriptionId))) return true;

    // // Chcek permissions for parent 
    // let ecosystemId = await getEcosystemIdFromSubscriptionId(subscriptionId)
    // if (await canReadEcosystem(ecosystemId, scopes)) return true;

    return false;
};

var canWriteSubscription = async (subscriptionId, scopes) => {
    // Scope based authorization - no account
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`subscriptions:write:all`)) return true; // Allow if can access all subscriptions
    else if (scopes.includes(`subscriptions:all:all`)) return true; // Allow if can do all actions in all subscriptions
    else if (scopes.includes(`subscriptions:all:${subscriptionId}`)) return true; // Allow if can do all actions in this subscription
    else if (scopes.includes(`subscriptions:write:${subscriptionId}`)) return true; // Allow if can access this subscription

    // Chcek permissions for parent 
    let ecosystemId = await getEcosystemIdFromSubscriptionId(subscriptionId)
    if (await canReadEcosystem(null, ecosystemId, scopes)) return true;

    return false;
};
var canReadModule = async (userId, moduleId, scopes) => {
    // Scope based authorization - no account
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`modules:read:all`)) return true; // Allow if can access all modules
    else if (scopes.includes(`modules:all:all`)) return true; // Allow if can do all actions in all modules
    else if (scopes.includes(`modules:all:${moduleId}`)) return true; // Allow if can do all actions in this module
    else if (scopes.includes(`modules:read:${moduleId}`)) return true; // Allow if can access this module
    
    // Accunt based authorization - also based on scopes
    let user = await User.findOne({_id: userId});
    if(!user) return false;
    let allowed = await user.getModules()
    if (allowed.map(m=>m._id).some(id=>id.equals(moduleId))) return true;
    
    // // Chcek permissions for parent 
    // let ecosystemId = await getEcosystemIdFromSubscriptionId(subscriptionId)
    // if (await canReadEcosystem(ecosystemId, scopes)) return true;

    return false;
};

var canWriteModule = async (moduleId, scopes) => {
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`modules:write:all`)) return true; // Allow if can access all modules
    else if (scopes.includes(`modules:all:all`)) return true; // Allow if can do all actions in all modules
    else if (scopes.includes(`modules:all:${moduleId}`)) return true; // Allow if can do all actions in this module
    else if (scopes.includes(`modules:write:${moduleId}`)) return true; // Allow if can access this module

    // Chcek permissions for parent 
    let subscriptionId = await getSubscriptionIdFromModuleId(moduleId)
    if (subscriptionId != "empty" && await canReadSubscription(subscriptionId, scopes)) return true;

    return false;
};

var canWriteModuleCore = async (moduleCoreId, scopes) => {
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`modules:write:all`)) return true; // Allow if can access all modules
    else if (scopes.includes(`modules:all:all`)) return true; // Allow if can do all actions in all modules

    // Chcek permissions for parent 
    let moduleId = await getModuleIdFromModuleCoreId(moduleCoreId)
    if (moduleId != "empty" && await canWriteModule(moduleId, scopes)) return true;

    return false;
};

var canReadCurriculum = async (curriculumId, scopes) => {
    if (scopes.includes("all:all:all")) return true; // Allow if Admin
    else if (scopes.includes(`curriculums:read:all`)) return true; // Allow if can access all curriculums
    else if (scopes.includes(`curriculums:all:all`)) return true; // Allow if can do all actions in all curriculums
    else if (scopes.includes(`curriculums:all:${curriculumId}`)) return true; // Allow if can do all actions in this curriculum
    else if (scopes.includes(`curriculums:read:${curriculumId}`)) return true; // Allow if can access this module

    // Chcek permissions for parent 
    let subscriptionId = await getSubscriptionIdFromModuleId(moduleId)
    //TODO module parent 
    if (subscriptionId != "empty" && await canReadSubscription(subscriptionId, scopes)) return true;

    return false;
};


const authUtils = {
    getNewUser,
    getJwtToken,
    getTokenForBrainCoreTest,
    isValidTokenForBrainCoreTest,
    getUserDataForFrontend,
    canWriteUser,
    canReadModule,
    canWriteModule,
    canWriteModuleCore,
    canReadSubscription,
    canWriteSubscription,
    canReadEcosystem,
    canReadCurriculum,
    isDomainAllowed
};

module.exports = authUtils;