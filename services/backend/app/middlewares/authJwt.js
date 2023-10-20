const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const authUtils = require("../utils/auth");
const contentAuthUtils = require("../utils/contentAuth");
const groupAuthUtils = require("../utils/groupAuth");
const reportAuthUtils = require("../utils/reportAuth");
const userAuthUtils = require("../utils/userAuth");
const resultAuthUtils = require("../utils/resultAuth");
const orderAuthUtils = require("../utils/orderAuth");
const certificationSessionAuthUtils = require("../utils/certificationSessionAuth");
const eventAuthUtils = require("../utils/eventAuth");

let verifyToken = (req, res, next) => {
  // x-authorization is used by Safari as it's replacing Bearer token with with basicAuth credentials
  var auth = req.headers['x-authorization'] || req.headers.authorization
  if (auth && auth.split(' ')[0] === 'Bearer' && auth.split(' ')[1]) {
    var token = auth.split(' ')[1];
  } else {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    //console.log("Middleware->authJwt->VerifyToken ", decoded)`
    req.userId = decoded.id;
    req.role = decoded.role;
    req.roleMaster = decoded.roleMaster;
    req.selectedPeriod = decoded.selectedPeriod;
    req.scopes = decoded.scopes;

    req.moduleId = decoded.moduleId;
    if (decoded.role == "NetworkManager") req.subscriptionId = decoded.subscriptionId;
    req.ecosystemId = decoded.ecosystemId; // TODO: load real ID 
    next();
  });
};


// Used for some function which do not require token, 
// but if the token exits, they need to access the data
let verifyTokenIfExists = (req, res, next) => {
  var auth = req.headers['x-authorization'] || req.headers.authorization
  if (auth && auth.split(' ')[0] === 'Bearer' && auth.split(' ')[1]) {
    var token = auth.split(' ')[1];
  } else {
    return next()
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return next()
    }
    //console.log("Middleware->authJwt->VerifyToken ", decoded)
    req.userId = decoded.id;
    req.role = decoded.role;
    req.scopes = decoded.scopes;

    req.moduleId = decoded.moduleId;
    if (decoded.role == "NetworkManager") req.subscriptionId = decoded.subscriptionId;
    req.ecosystemId = decoded.ecosystemId; // TODO: load real ID 
    next();
  });
};

let isAdmin = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isEcoManager = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`ecosystems:all:${req.ecosystemId}`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isTrainer = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (["Trainer"].includes(req.role)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isSubscriptionOwner = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`ecosystems:all:${req.params.ecosystemId}`)) next();
  else if (req.scopes.includes(`subscriptions:all:${req.params.subscriptionId}`)) next();
  else if (req.scopes.includes(`subscriptions:all:${req.subscriptionId}`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isModuleManager = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`ecosystems:all:${req.params.ecosystemId}`)) next();
  else if (req.scopes.includes(`subscriptions:all:${req.params.subscriptionId}`)) next();
  else if (req.scopes.includes(`modules:all:${req.params.moduleId}`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isAssistant = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`ecosystems:all:${req.params.ecosystemId}`)) next();
  else if (req.scopes.includes(`subscriptions:all:${req.params.subscriptionId}`)) next();
  else if (req.scopes.includes(`modules:all:${req.params.moduleId}`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let isAssistantAllowedTo = async (userId, actions) => {
  // enclose action if string
  if (typeof actions === "string") actions = [actions];
  let user = await db.user.findOne({_id:userId}).lean();
  let permissions = user.settings.permissions?.assistant?.find(p => p.module.equals(moduleId))?.disallowed||[]
  if (permissions.some(p => actions.includes(p))) return false;
  return true;
}

let canReadAllUsers = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`users:read:all`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let canWriteAllRecommendations = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`recommendations:all:all`)) next();
  else if (req.scopes.includes(`recommendations:write:all`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var haveResults = async (req, res, next) => {
  // Only self can get content result
  if (await contentAuthUtils.haveResults(req.userId, req.params.contentId)) next();
  else return res.status(403).send({ message: "No results available" });
};

var canViewResult = async (req, res, next) => {
  // Account-based authorization
  if (await resultAuthUtils.canViewResult(req.userId, req.params.resultId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canViewResults = async (req, res, next) => {
  // Account-based authorization
  if (await resultAuthUtils.canViewResults(req.userId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canAddResult = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes?.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canAddResult(req.userId, req.params.resultId, req.body.result, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadResult = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canReadResult(req.userId, req.params.resultId, req.body)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// Reading results for the content
var canReadResults = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canReadResults(req.userId, req.params.userId, req.params.contentId, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};


var canEditResult = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canEditResult(req.userId, req.params.resultId, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canConfirmResult = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canConfirmResult(req.userId, req.params.resultId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canRemoveResult = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canRemoveResult(req.userId, req.params.resultId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canUpdateGradebook = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await resultAuthUtils.canUpdateGradebook(req.userId, req.body, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};


var canDownloadBrainCoreTestReport = async (req, res, next) => {
  // In order to download it, must provide userId and resultId
  return next()
}


var canReadUser = async (req, res, next) => {
  // Requested user
  let requestedUserId = req.params.userId || req.params.traineeId || req.userId

  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`users:read:all`)) next();
  else if (req.scopes.includes(`users:read:${req.params.userId}`)) next();
  // Account-based authorization
  else if (await userAuthUtils.canReadUser(req.userId, requestedUserId, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// Ceck if user can read other users data
var canReadUsers = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  let requestedUsers = req.body.usersIds
  if (!requestedUsers) return next();
  for (let requestedUserId of requestedUsers){
    let canRead = await userAuthUtils.canReadUser(req.userId, requestedUserId, req.moduleId)
    if (!canRead) return res.status(403).send({ message: "Not authorized" });
  }
  return next();
};

var canTrainUser = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await userAuthUtils.canTrainUser(req.userId, req.params.userId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canWriteUser = async (req, res, next) => {
  if (await authUtils.canWriteUser(req.params.userId, req.scopes, req.moduleId, req.userId, req.roleMaster)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var isTrainerFromGroup = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await groupAuthUtils.isTrainerFromGroup(req.userId, req.params.groupId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadTraineeGroupList = async (req, res, next) => {
  // Role-based authorization
  if (['Root','EcoManager','CloudManager', 'NetworkManager', 'Inspector'].includes(req.role)) next(); // TODO: check if it belongs to networks/ecosystem
  // Account-based authorization
  else if (await groupAuthUtils.canReadGroupInfoAboutTrainee(req.userId, req.params.userId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};


let canReadAllChapters = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) return next(); 
  else if(["ModuleManager","Assistant","Architect"].includes(req.role)) return next(); // just requiring role, as moduleId is checked in controller
  else {
    let user = await db.user.findById(req.userId).catch((err) => false);
    let permissions = await user.getPermissions();
    if (permissions.bcTrainer.access) return next(); // TODOJULY-review
  }
  return res.status(403).send({ message: "Not authorized" });
};

let canReadChapter = async (req, res, next) => {
  let [chapter, user] = await Promise.all([ 
    db.chapter.findById(req.params.chapterId).catch((err) => false),
    db.user.findById(req.userId).catch((err) => false),
  ]);
  let permissions = await user.getPermissions();

  if (req.scopes.includes("all:all:all")) next();
  //=> make auth bug https://gitlab.elia.academy/root/elia/-/issues/983
  else if(["Architect", "ModuleManager", "Assistant"].includes(req.role)) next();
  else if(permissions.bcTrainer.access) next(); // TODOJULY-review
  else if(["ModuleManager","Assistant","Architect", "Trainer"].includes(req.role) && await contentAuthUtils.canAccessChapterViaModule(req.params.chapterId, req.moduleId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let canAddChapter = async (req, res, next) => {
  let [trainingModule, user] = await Promise.all([ 
    db.trainingModule.findById(req.params.trainingModuleId).catch((err) => false),
    db.user.findById(req.userId).catch((err) => false),
  ]);
  let permissions = await user.getPermissions();

  if (req.scopes.includes("all:all:all")) next();
  else if(["ModuleManager","Assistant","Architect",].includes(req.role) && trainingModule.module == req.moduleId) next();
  else if(permissions.bcTrainer.access) next(); // TODOJULY-review
  else return res.status(403).send({ message: "Not authorized" });
};

let canReadAllTrainingModules = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`training_modules:read:all`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadEcosystem = async (req, res, next) => {
  if (await authUtils.canReadEcosystem(req.userId, req.params.ecosystemId, req.scopes)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadSubscription = async (req, res, next) => {
  if (await authUtils.canReadSubscription(req.userId, req.params.subscriptionId, req.scopes)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

const canWriteSubscription = async (req, res, next) => {
  if (await authUtils.canWriteSubscription(req.params.subscriptionId, req.scopes)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadModule = async (req, res, next) => {
  // Scope and account-based authorization inside this function
  if (authUtils.canReadModule(req.userId, req.params.moduleId, req.scopes)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canWriteModule = async (req, res, next) => {
  let roles = ['Root','EcoManager','CloudManager', 'NetworkManager'];
  if (roles.includes(req.role)) next(); // TODO: check if it belongs to networks/ecosystem
  else if (await authUtils.canWriteModule(req.moduleId, req.scopes)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

const canReadTrainingModule = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.role=='Trainer' && contentAuthUtils.canTeachTrainingModule(req.userId,req.params.trainingModuleId)) next();
  else if (req.role=='Architect' && contentAuthUtils.canAccessTrainingModuleViaModule(req.params.trainingModuleId, req.moduleId)) next();
  // else if (req.scopes.includes(`training_modules:read:all`)) next();
  // else if (req.scopes.includes(`training_modules:read:${req.params.trainingModuleId}`)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canWriteMeeting = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (req.scopes.includes(`groups:write:${req.body.groupId}`)) next(); // Allow if user can modify group
  else return res.status(403).send({ message: "Not authorized" });
};


var canCreateContent = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (req.scopes.includes(`content:create:all`)) next(); // Allow if user can create
  else return res.status(403).send({ message: "Not authorized" });
};

var canDisplayContent = async (req, res, next) => {
  // Scopes authorization
  if (req.scopes?.includes(`content:read:${req.params.contentId}`)) return next();
  // Account-based authorization
  let check = await contentAuthUtils.canDisplayContent(req.userId, req.params.contentId, req.moduleId)
  if (check.status) next()
  // Not allowed
  else return res.status(403).send({ message: "Not authorized: "+ check.message });

};


var canOverviewContent = async (req, res, next) => {
  // Check scope
  if (req.scopes?.includes(`content:read:${req.params.contentId}`)) next();
  // Account-based authorization
  let check = await contentAuthUtils.canOverviewContent(req.userId, req.params.contentId, req.moduleId)
  if (check.status) next()
  // Not allowed
  else return res.status(403).send({ message: "Not authorized: "+ check.message });
};

var canEditContent = async (req, res, next) => {
  // Account-based authorization
  let check = await contentAuthUtils.canEditContent(req.userId, req.params.contentId)
  if ( check.status) next()
  // Not allowed
  else return res.status(403).send({ message: "Not authorized: "+ check.message });
};

// Check if is creator or cocreator
var isContentOwnerOrCocreator = async (req, res, next) => {
  // Account-based authorization
  let check = await contentAuthUtils.isContentOwnerOrCocreator(req.userId, req.params.contentId)
  if ( check.status) next()
  // Not allowed
  else return res.status(403).send({ message: "Not authorized: "+ check.message });
};

var canExamineContent = async (req, res, next) => {
  // Account-based authorization
  if (!req.params.contentId && req.body.contentIds){
    for (let id of req.body.contentIds){
      let check = await contentAuthUtils.canExamineContent(req.userId, id, req.moduleId)
      if (!check.status) return res.status(403).send({ message: "Not authorized: "+ check.message });
    }
    next()
  }
  else if (req.params.contentId) {
    let check = await contentAuthUtils.canExamineContent(req.userId, req.params.contentId, req.moduleId)
    if ( check.status) next()
    else return res.status(403).send({ message: "Not authorized: "+ check.message });
  }
  // Not allowed
  else return res.status(403).send({ message: "Not authorized" });
};

var canManageCloud  = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); 
  else if(["EcoManager"].includes(req.role) && req.scopes.includes(`ecosystems:all:${req.params.ecosystemId}`)) next(); 
  else return res.status(403).send({ message: "Not authorized" });
}
// CERTIFICATIONS - START
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
var canCreateCertificate = async (req, res, next) => {
  let user = await db.user.findById(req.userId).catch((err) => false);
  let permissions = await user.getPermissions();
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (['Architect','ModuleManager', 'Assistant'].includes(req.role)) next();
  else if(permissions.bcTrainer.access) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadCertificate = async(req, res, next) => {
  let user = await db.user.findById(req.userId).catch((err) => false);
  let permissions = await user.getPermissions();
  let certificate = await db.certificate.findById(req.params.certificateId).catch((err) => false);
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if(['Architect','ModuleManager', 'Assistant'].includes(req.role) && certificate.existInModule(req.moduleId)) next();
  else if(permissions.bcTrainer.access && certificate.existInModule(req.moduleId)) next();
  else if(req.role === 'Trainer' && certificate.existInSessionForTrainer(req.userId)) next(); 
  else if(req.role === 'Trainee' && certificate.existInSessionForTrainee(req.userId)) next(); 
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadAllCertificates = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); //TODOJULY-review
  else if (['TrainingManager', 'Architect','ModuleManager', 'Assistant' ].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else if(req.role === 'Trainer') next(); // TODO - temporarily allowing trainers
  else {
    let user = await db.user.findById(req.userId).catch((err) => false);
    let permissions = await user.getPermissions();
    if (permissions.bcTrainer.access) next();
    else return res.status(403).send({ message: "Not authorized" });
  }
};

var canReadUserCertificates = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); 
  else if(["Architect","Trainer"].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadUserSessions = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); 
  else if(["ModuleManager","Assistant","Architect","Trainer","Parent"].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else if(["Trainee"].includes(req.role) && req.params.userId == req.userId) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadAllSessions = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); 
  else if(["Architect","Trainer"].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else return res.status(403).send({ message: "Not authorized" });
};
var canCreateSession = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (['Architect','ModuleManager', 'Assistant'].includes(req.role)) next();
  else { 
    let user = await db.user.findById(req.userId).catch((err) => false);
    let permissions = await user.getPermissions();
    if (permissions.bcTrainer.access) next();
    else return res.status(403).send({ message: "Not authorized" });
  } // TO DO - review - ADD AUTH - TO CHECK IF USER HAS "BC TRAINER" PERMISSION 
};

var canReadSession = async(req, res, next) => {
  let [session, user] = await Promise.all([
    db.certificationSession.findById(req.params.certificationSessionId).catch((err) => false),
    db.user.findById(req.userId).catch((err) => false),
  ]) 
  let permissions = await user.getPermissions();
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if(['Architect','ModuleManager', 'Assistant', 'TrainingManager'].includes(req.role) && session.existInModule(req.moduleId)) next();
  else if((req.role === 'Trainer' || req.role == 'Other' && (permissions.bcTrainer.access )) && session?.existForTrainer(req.userId)) next()
  else if(req.role === 'Trainee' || (req.role == 'Other' && permissions.bcCoach.access )){ // TODO check if BC COACH CANDIDATE is in session group
  // else if(req.role === 'Trainee' && session?.existForTrainee(req.userId)){; 
    if (await certificationSessionAuthUtils.isPaymentRequired(req.userId, session))
      return res.status(403).send({ message: "Payment required" });
    else next();
  }
  else if(req.role === 'Partner' && session?.origin) next(); 
  else if(req.role === 'Coordinator' && session?.coordinator == req.userId) next(); 
  else return res.status(403).send({ message: "Not authorized" });
};

var canEnrollForCertificationSession = async (req, res, next) => {
  let session = await db.certificationSession.findById(req.params.certificationSessionId).catch((err) => false);
  let check = await certificationSessionAuthUtils.canEnrollForCertificationSession(req.userId, session);
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (check.status) next(); 
  else return res.status(check.code).send({ message: check.message });
};

var canUnenrollFromCertificationSession = async (req, res, next) => {
  let session = await db.certificationSession.findById(req.params.certificationSessionId).catch((err) => false);
  let check = await certificationSessionAuthUtils.canUnenrollForCertificationSession(req.userId, session)
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if (check.status) next(); 
  else return res.status(check.code).send({ message: check.message });
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// CERTIFICATIONS - END
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// LIBRARY&CLOUD - START
var canReadLibrary = async(req, res, next) => {
    if (req.scopes.includes("all:all:all")) next();
    else if (req.userId) next(); // here, everyone can read library
    else return res.status(403).send({ message: "Not authorized" });
}

var canReadCloud = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (req.userId) next(); // opening/reading library is possible for everyone who is logged in
  else return res.status(403).send({ message: "Not authorized" });
}

var canReadWholeLibrary = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if(["Architect","Librarian","Inspector", "TrainingManager"].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else return res.status(403).send({ message: "Not authorized" });
}

var canReadWholeCloud = async(req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if(["CloudManager"].includes(req.role)) next(); // just requiring role, as moduleId is checked in controller
  else return res.status(403).send({ message: "Not authorized" });
}
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// LIBRARY&CLOUD - END
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// COMPANY - START
let canCreateCompany = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if(["ModuleManager", "Architect", "TrainingManager", "Partner"].includes(req.role)) next();
  else if("Assistant"==req.role && await isAssistantAllowedTo(req.userId, ["create-company"])) next();
  else return res.status(403).send({ message: "Not authorized" });
}

let canReadAllCompanies = async (req, res, next) => { // this is also used for creating a new company
  if (req.scopes.includes("all:all:all")) next();
  else if(["ModuleManager", "Assistant", "Architect", "TrainingManager", "Partner"].includes(req.role)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let canReadCompany = async (req, res, next) => {
  let company = await db.company.findById(req.params.companyId).catch((err) => false);
  if (req.scopes.includes("all:all:all")) next();
  else if(["ModuleManager","Assistant","Partner"].includes(req.role) && company.module == req.moduleId) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// COMPANY - END
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// BLOCK/COMPETENCES - START
let canReadAllBlocks = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  else if (['Architect','ModuleManager', 'Assistant'].includes(req.role)) next();
  else { // ADD: allow if user is bc trainer
    let user = await db.user.findById(req.userId).catch((err) => false);
    let permissions = await user.getPermissions();
    if (permissions.bcTrainer.access) next();
    else return res.status(403).send({ message: "Not authorized" });
  }
};

let canReadBlock = async (req, res, next) => {
  let user = await db.user.findById(req.userId).catch((err) => false);
  let permissions = await user.getPermissions();
  let block = await db.competenceBlock.findById(req.params.competenceBlockId).catch((err) => false);
  if (req.scopes.includes("all:all:all")) next();
  else if(block && ["Architect", "ModuleManager", "Assistant"].includes(req.role) && block.module == req.moduleId) next();
  else if(permissions.bcTrainer.access && block.module == req.moduleId) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let canReadAllCompetences = async (req, res, next) => {
  let user = await db.user.findById(req.userId).catch((err) => false);
  let permissions = await user.getPermissions();
  
  if (req.scopes.includes("all:all:all")) next();
  else if(["Architect", "ModuleManager", "Assistant"].includes(req.role)) next();
  else if(permissions.bcTrainer.access) next();
  else return res.status(403).send({ message: "Not authorized" });
};

let canReadCompetence = async (req, res, next) => {
  let user = await db.user.findById(req.userId).catch((err) => false);
  let permissions = await user.getPermissions();
  let competence = await db.competence.findById(req.params.competenceId).catch((err) => false);
  if (req.scopes.includes("all:all:all")) next();
  else if(["Architect", "ModuleManager", "Assistant"].includes(req.role) && competence.module == req.moduleId) next();
  else if(permissions.bcTrainer.access  && competence.module == req.moduleId) next();
  else return res.status(403).send({ message: "Not authorized" });
};
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// BLOCK/COMPETENCES - END
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// EVENTS - START

var canOverviewEvent = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) return next();
  else if (req.scopes.includes(`events:read:all`)) return next();
  else if (req.scopes.includes(`events:read:${req.params.eventId}`)) return next();
  // Account-based authorization
  let check = await eventAuthUtils.canOverviewEvent(req.userId, req.params.eventId, req.moduleId)
  if (check.status) next();
  else return res.status(403).send({ message: check.message });
};

// Can display event with associated content
// Similar to canDisplayContent
var canDisplayEvent = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`events:read:all`)) next();
  else if (req.scopes.includes(`events:read:${req.params.eventId}`)) next();
  // Account-based authorization
  let check = await eventAuthUtils.canDisplayEvent(req.userId, req.params.eventId, req.moduleId)
  if (check.status) next();
  else return res.status(403).send({ message: check.message });
};

var canExamineEvent = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  // Account-based authorization
  else if (await eventAuthUtils.canExamineEvent(req.userId, req.moduleId, req.params.eventId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};


let canUpdateEvent = async (req, res, next) => {
  let event = await db.event.findById(req.params.eventId).catch((err) => false);
  if (req.scopes.includes("all:all:all")) next();
  else if (event.creator.equals(req.userId)) next(); // creator of the event can update it
  else if (event.assignedTrainer.equals(req.userId)) next(); // assignedTrainer of the event can update it
  else if(["Architect", "ModuleManager", "Assistant"].includes(req.role) && event.creator === req.moduleId) next();
  else return res.status(403).send({ message: "Not authorized" });
};
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// EVENTS - END

var canCreateReport = (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if( (req.role === 'Trainer') || (req.role ==='TrainingManager') && groupAuthUtils.isTrainerFromGroup(req.userId, req.body.group)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canReadReport = async(req, res, next) => {
  let reportId = req.params.reportId||req.body._id;
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if(reportAuthUtils.isReporter(req.userId,req.params.userId,reportId)) next();
  else if (reportAuthUtils.canReadReport(req.userId,req.role,reportId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canUpdateReport = async(req, res, next) => {
  let reportId = req.params.reportId||req.body._id;
  if (req.scopes.includes("all:all:all")) next(); // Allow if Admin
  else if( (req.role ==='TrainingManager') && groupAuthUtils.isTrainerFromGroup(req.userId, req.body.group)) next();
  else if(reportAuthUtils.isReporter(req.userId,req.params.userId,reportId)) next();
  else if(reportAuthUtils.canUpdateReport(req.userId,req.role,reportId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

var canDeleteReport = async(req, res, next) => {
  let reportId = req.params.reportId||req.body._id;
  if (req.scopes.includes("all:all:all")) next(); // Allow only if Admin!
  else if(reportAuthUtils.isReporter(req.userId,req.params.userId,reportId)) next();
  // let report = await db.softSkillsTemplate.findById(req.params.reportId).catch((err) => false);
  // if (report.trainee.equals(req.userId)) next(); // report of self
  // else if (report.creator.equals(req.userId)) next(); // creator of the report
  // else if (req.role === 'Trainer' && report.belongsViaGroup(req.userId)) next(); 
  else return res.status(403).send({ message: "Not authorized" });
};


// Check if user can read `order`
var canReadOrder = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`orders:read:all`)) next();
  else if (req.scopes.includes(`orders:read:${req.params.orderId}`)) next();
  // Account-based authorization
  else if (await orderAuthUtils.canReadOrder(req.userId, req.params.orderId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// Check if user can read `order` with providerId
var canReadOrderWithProviderId = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`orders:read:all`)) next();
  // Account-based authorization
  else if (await orderAuthUtils.canReadOrderWithProviderId(req.userId, req.params.providerId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// Check if user can read `order` which contains certificationSessionId
var canReadOrderWithCertificationSessionId = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (req.scopes.includes(`orders:read:all`)) next();
  // Account-based authorization
  else if (await orderAuthUtils.canReadOrderWithCertificationSessionId(req.userId, req.params.certificationSessionId)) next();
  else return res.status(403).send({ message: "Not authorized" });
};

// Admin - Authorization - START
const canViewRolesPermissions = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => permission.moduleName == "Admin - Authorization" && permission.access == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
};

const canCreateProject = async (req, res, next) => {
    if (!req.moduleId) return res.status(400).send("Module is not selected.");

    var participants = []
    if (req.body.project?.cognitiveBlockCollection){
      // Find all participants
      for (let collection of req.body.project?.cognitiveBlockCollection) {
          let usersIds = collection.users.map(u=>{return u._id?u._id.toString():u.toString()})
          participants = [...new Set([...participants, ...usersIds])]
      }

      // Check if can access each of the participants
      for (let participant of participants){
        let canRead = await userAuthUtils.canReadUser(req.userId, participant, req.moduleId)
        if (!canRead) return res.status(403).send({ message: "Not authorized" });
      }
    }

    return next();

}

const canAccessProject = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  
  let project = await db.project.findOne({"_id": req.params.projectId })
  if (!project) return res.status(404).send("Not found");
  
  if (project?.creator == req.userId) next()
  else if (project.cognitiveBlockCollection.some(collection=> collection.users.includes(req.userId))) next()
  else res.status(401).send({ message: "Not authorized" });
}


const canAccessProjectCollection = async (req, res, next) => {
  let collectionId = req.params.collectionId??req.body._id
  let project = await db.project.findOne({"cognitiveBlockCollection._id": collectionId})
  if (!project) return res.status(404).send("Not found");
  // Find collection
  let collection = project.cognitiveBlockCollection.find(c=>c._id==collectionId)
  // Check permissions
  if (project?.creator == req.userId) next()
  else if (collection.users.includes(req.userId)) next()
  else res.status(401).send({ message: "Not authorized" });
}

const canAccessProjectBlock = async (req, res, next) => {
  let blockId = req.params.blockId??req.body._id

  let project = await db.project.findOne({"cognitiveBlockCollection.cognitiveBlocks._id":  blockId})
  if (!project) return res.status(404).send("Not found");

  // Find collection
  var collection;
  for (let _collection of project.cognitiveBlockCollection){
    if (collection) break
    for (let _block of _collection.cognitiveBlocks){
      if (collection) break
      if (_collection.users.includes(req.userId)) collection = _collection
    }
  }

  // Check permissions
  if (project?.creator == req.userId) next()
  else if (collection.users.includes(req.userId)) next()
  else res.status(401).send({ message: "Not authorized" });
}

const isProjectCreator = async (req, res, next) => {
  if (req.scopes.includes("all:all:all")) next();
  if (!req.moduleId) return res.status(400).send("Module is not selected.");
  
  let project = await db.project.findOne({"_id": req.params.projectId, "module": req.moduleId }, {creator: 1})
  if (!project) return res.status(404).send("Not found");
  
  // Check permissions
  if (project?.creator == req.userId) next()
  else res.status(401).send({ message: "Not authorized" });
}


const canEditRolesPermissions = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => permission.moduleName == "Admin - Authorization" && permission.edit == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
}
// Admin - Authorization - STOP

// My Teams & My Users - BC Test Registraions - START
const canViewBrainCoreTestRegistrations = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => (permission.moduleName == "My Teams - BC Test Registrations" || permission.moduleName == "My Users - BC Test Registrations") && permission.access == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
}
const canEditBrainCoreTestRegistrations = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => (permission.moduleName == "My Teams - BC Test Registrations" || permission.moduleName == "My Users - BC Test Registrations") && permission.edit == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
}
// My Teams & My Users - BC Test Registrations - STOP

// My Teams - Teams - START
const canViewMyTeams = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => (permission.moduleName == "My Teams - Teams" || permission.moduleName == "Admin - Teams Access" || permission.moduleName == "My Projects") && permission.access == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
};

const canEditMyTeams = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => permission.moduleName == "My Teams - Teams" && permission.edit == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
}

const canViewMyTeamsStatistics = async (req, res, next) => {
  // Scope-based authorization
  if (req.scopes.includes("all:all:all")) next();
  else if (['ModuleManager'].includes(req.role)) next();
  else if (req.roleMaster) {
    const map = await db.rolePermissionsMapping.findOne({roleMaster: req.roleMaster._id}).populate({path: "permissions"});
    if (!map) return res.status(401).send({ message: "Not authorized" });
    const canAccess = map.permissions && map.permissions.some(permission => permission.moduleName == "My Teams - Statistics" && permission.access == true);
    if (canAccess) next();
    else return res.status(401).send({ message: "Not authorized" })
  }
  else return res.status(401).send({ message: "Not authorized" });
};
// My Teams - Teams - STOP


const authJwt = {
  verifyToken,
  verifyTokenIfExists,
  isAdmin,
  isEcoManager,
  isTrainer,
  canReadEcosystem,
  canReadSubscription,
  canWriteSubscription,
  canReadModule,
  canWriteModule,
  isSubscriptionOwner,
  isModuleManager,
  isAssistant,
  canReadAllUsers,
  canReadUser,
  canReadUsers,
  canTrainUser,
  isTrainerFromGroup,
  canReadTraineeGroupList,
  canWriteAllRecommendations,
  // chapters - START
  canAddChapter,
  canReadAllChapters,
  canReadChapter,
  // chapters - STOP
  canReadAllTrainingModules,
  canReadTrainingModule,
  canWriteMeeting,
  canWriteUser,
  canCreateContent,
  canExamineContent,
  canDisplayContent,
  canEditContent,
  isContentOwnerOrCocreator,
  canOverviewContent,
  canViewResult,
  canReadResult,
  canReadResults,
  haveResults,
  canViewResults,
  canAddResult,
  canEditResult,
  canConfirmResult,
  canRemoveResult,
  canUpdateGradebook,
  canManageCloud, 
  // CERTIFICATIONS - START
  canCreateCertificate,
  canReadCertificate,
  canReadAllCertificates, 
  canReadUserCertificates,
  canCreateSession, 
  canReadSession, 
  canReadAllSessions, 
  canReadUserSessions,
  canEnrollForCertificationSession,
  canUnenrollFromCertificationSession,
  // CERTIFICATIONS - END
  // LIBRARY&CLOUD - START
  canReadLibrary,
  canReadCloud,
  canReadWholeLibrary,
  canReadWholeCloud,
  // LIBRARY&CLOUD - END
  // COMPANY - START
  canCreateCompany,
  canReadAllCompanies, 
  canReadCompany,
  // COMPANY - END
  // BLOCK/COMPETENCES - START
  canReadAllBlocks, 
  canReadBlock, 
  canReadAllCompetences, 
  canReadCompetence,
  // BLOCK/COMPETENCES - END
  // EVENT - START
  canOverviewEvent,
  canDisplayEvent,
  canExamineEvent,
  canUpdateEvent,
  // EVENT - END
  // Report - START
  canCreateReport,
  canReadReport,
  canUpdateReport,
  canDeleteReport,
  // Report - END
  canDownloadBrainCoreTestReport,
  // Order - START
  canReadOrder,
  canReadOrderWithProviderId,
  canReadOrderWithCertificationSessionId,
  // Order - END
  // Authorization - START
  canViewRolesPermissions,
  canEditRolesPermissions,
  // Authorization - END
  // My Teams & My Users - BC Test Registrations - START
  canViewBrainCoreTestRegistrations,
  canEditBrainCoreTestRegistrations,
  // My Teams & My Users - BC Test Registrations - STOP
  // My Teams - Teams - START
  canViewMyTeams,
  canEditMyTeams,
  canViewMyTeamsStatistics,
  // My Teams - Teams - STOp


  // Projects - START
  canCreateProject,
  canAccessProject,
  canAccessProjectCollection,
  canAccessProjectBlock,
  isProjectCreator
  // Projects STOP
};

module.exports = authJwt;
