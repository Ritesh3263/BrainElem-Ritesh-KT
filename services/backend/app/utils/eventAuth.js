const db = require('../models')
const { isTrainerFromGroup, isUserFromGroup } = require("./groupAuth")
const { isTrainerAndGroupFromSession } = require("./certificationSessionAuth")

//Check if event already has results
exports.haveResults = async (userId, eventId) => {
    return await db.result.exists({'event': eventId, 'user': userId})
}
// Check if user can read `event`
exports.canOverviewEvent = async (userId, eventId, moduleId) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    let event = await db.event.findById(eventId).populate('assignedContent').catch((err) => false);
    //##################################################################
    // If administrator
    if (user.isAdmin()) return {status: true};
    // #################################################################
    // If group associated with event belongs to the module
    let moduleCore = await db.moduleCore.findOne({moduleId: moduleId})
    if (moduleCore?.groups?.indexOf(event.assignedGroup) >= 0 ) return {status: true}


    // If can examinate then he should also be able to overview the content inside
    if (this.canExamineEvent(userId, moduleId, eventId)) return {status: true}

    if (await isUserFromGroup(user.id, event.assignedGroup)) return {status: true};
    if (await isTrainerAndGroupFromSession(user.id, event.assignedGroup)) return {status: true};    

    // Default
    return {status: false};
}

// Check if user can read `event`
exports.canDisplayEvent = async (userId, eventId, moduleId) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    let event = await db.event.findById(eventId).populate('assignedContent').catch((err) => false);
    if (!user || !event) return {status: false, message: "NOT_FOUND"};
    if (user.isAdmin()) return {status: true};
    // Always allow if user has one of the following roles and module is correct 
    if (user.isEcoManager() || user.isCloudManager() || user.isNetworkManager()  || user.isModuleManager() || user.isAssistant() || user.isLibrarian() || user.isArchitect() || user.isInspector()){
        if (event.assignedContent.module?.equals(moduleId)) return {status: true};
    }
    // Check if event was not already executed
    if (event.assignedContent?.contentType === "TEST" 
        && await this.haveResults(userId, eventId)
        && !(event.allowExtraAttemptFor.includes(userId))
        ) return {status: false, message: "ALREADY_TAKEN"}


    // If have extra attempt ignore start and end dates
    if (!event.allowExtraAttemptFor.includes(userId)){
        // Check if date is correct
        let startDate = event.date
        if (Date.now() < startDate){
            return {status: false, message: "NOT_YET_STARTED"}
        }
        if (event.endDate && Date.now() > event.endDate){
            return {status: false, message: "ALREADY_FINISHED"}
        }
        // Old events had no endDate - default to 24 houres
        if (!event.endDate && Date.now() > startDate.setDate(startDate.getDate() + 1)){
            return {status: false, message: "ALREADY_FINISHED"}
        }
    }


    if (await isUserFromGroup(user.id, event.assignedGroup)) return {status: true};    
    if (await isTrainerAndGroupFromSession(user.id, event.assignedGroup)) return {status: true};    

    // Default
    return {status: false, message: "NOT_ALLOWED"};
}

// Check if user can examine Event
exports.canExamineEvent = async (userId, moduleId, eventId) => {
    let event = await db.event.findById(eventId).catch((err) => false);
    // #################################################################
    // If user can read group associated with event
    if (event?.creator && event.creator.equals(userId)) return true;
    if (event?.assignedTrainer && event.assignedTrainer.equals(userId)) return true;
    if (event?.assignedGroup){
        if (await isTrainerFromGroup(userId, event.assignedGroup)) return true
        else if (await isTrainerAndGroupFromSession(userId, event.assignedGroup)) return true
        else return false
    } 
    else return false
}