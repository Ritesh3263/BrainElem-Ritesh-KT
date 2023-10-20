const db = require('../models')
const { canDisplayContent, canExamineContent } = require("./contentAuth")
const { canDisplayEvent, canExamineEvent } = require("./eventAuth")
const { isTrainerOfTrainingModuleInGroup } = require("./groupAuth")
const { isClassManagerOfGroup } = require("./groupAuth")
const { canReadUser, canTrainUser } = require("./userAuth")

// Check if user can add new result
exports.canAddResult = async (userId, resultId, result, moduleId) => {
    // TRAINING TODO
    if (moduleId){// Only when moduleId is provided. For some users it's set to 0
        let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":moduleId}).exec()
        if((ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId))?.moduleType === "TRAINING") return true; // TODO - FOR THE MOMENT ALLOWING ON ADDING IF TRAINING MODULE      
    }
    var contentId = result.content
    var eventId = result.event
    if (eventId){ // Check if user could display event for which he wants to add result
        let check = await canDisplayEvent(userId, eventId, moduleId) 
        if (check.status) return true;

        // Check if user can examinate event
        let canExamine = await canExamineEvent(userId, moduleId, eventId) 
        if (canExamine) return true;
    }
    else if (contentId) { // Check if user has access to content for which he wants to add result
        let check = await canDisplayContent(userId, contentId, moduleId) 
        if (check.status) return true;
    }

    return false;
}


// Check if user can edit existing result
exports.canReadResult = async (userId, resultId, body) => {
    let result = await db.result.findById(resultId).catch((err) => false);
    if (! await canReadUser(userId, result.user)) return false;
    return true;
}

// Check if user can read all existing results for content
exports.canReadResults = async (userId, requestedUserId, contentId, moduleId) => {
    // If user can load info about the user - he can also read his results
    // This inculdes user himself, parent and all trainers in the module 
    if (await canReadUser(userId, requestedUserId)) return true;


    // For content created by `trainee` and shared in the library
    // Allow this trainee to see others' results on the content he created
    let canExamine = await canExamineContent(userId, contentId, moduleId)
    if (canExamine.status) return true

    // By default false
    return false
}

// Check if user can edit existing result
exports.canEditResult = async (userId, resultId, moduleId) => {
    let result = await db.result.findById(resultId).catch((err) => false);

    if (result.event){ // Sometimes eventId refers to event which no longer exists
        let canExamine = await canExamineEvent(userId, moduleId, result.event)
        if (canExamine) return true
    }

    if (result.content){
        let canExamine = await canExamineContent(userId, result.content, moduleId)
        if (canExamine.status) return true
    }

    return false;
}


// Check if user can conform result so it will be assigned to him
exports.canConfirmResult = async (userId, resultId) => {
    let result = await db.result.findById(resultId).catch((err) => false);
    if (result.notConfirmedUser==userId) return true
    return false;
}

// Check if user can remove a result
exports.canRemoveResult = async (userId, resultId) => {
    let result = await db.result.findById(resultId).catch((err) => false);
    if (await canTrainUser(userId, result.user)) return true;
    return false;
}

exports.canViewResult = async (userId, resultId) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    if (user.isAdmin()) return true;
    if (user.isParentOf(result.user)) return true;
    let result = await db.result.findById(resultId).catch((err) => false);
    if (result.user.equals(userId)) return true; // result of self
    if (await canTrainUser(userId, result.user)) return true; // trainer of the test taker
    return false;
}

// Check if user can view all results
exports.canViewResults = async (userId) => { // for parent and trainee
    // actually controller function got it managed
    return true
    // let user = await db.user.findById(userId).catch((err) => false);
    // if (user.isParent()) return true;
    // if (user.isTrainee()) return true;
    // return false;
}

// Check if user can update gradebook results
exports.canUpdateGradebook = async (userId, body, moduleId) => {
    let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":moduleId}).exec()
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    if (user.isAdmin()) return true;
    if (await isTrainerOfTrainingModuleInGroup(userId, body.groupId, body.trainingModuleId)) return true;
    if (await isClassManagerOfGroup(userId, body.groupId)) return true;
    if((ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId))?.moduleType === "TRAINING") return true; // TODO - FOR THE MOMENT ALLOWING ON EDIT IF TRAINING MODULE
    return false;
}