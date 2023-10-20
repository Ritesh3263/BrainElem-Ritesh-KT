const db = require('../models')
const cognitiveUtils = require("./cognitive");

// Get dynamic BrainCore status for team
// Parameters:
// team - team object
exports.getBrainCoreStatusForTeam = async (teamId) => {
    let team = await db.team.findById(teamId).populate([{path:"trainee", select: "brainCoreTest"}]);
    let status = {};

    // Count
    let completed = team.trainee.filter(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status === "Completed");
    let requestSent = team.trainee.filter(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status === "Request sent");
    let notCompleted = team.trainee.filter(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status === "Not Completed");
    let noTestTaken = team.trainee.filter(user => !user.brainCoreTest || !user.brainCoreTest.status);
    status.completed = completed.length;
    status.requestSent = requestSent.length;
    status.notCompleted = notCompleted.length;
    status.noTestTaken = noTestTaken.length;

    // Set status
    if (completed.length==team.trainee.length) status.status = "Completed";
    else if (notCompleted.length==team.trainee.length) status.status = "Not Completed";
    else if (status.noTestTaken>0) {status.status = undefined}
    else if (status.requestSent>0) status.status = "Request sent";
    else if (notCompleted.length>0) status.status = "Not Completed";


    // Return object
    return status

}
