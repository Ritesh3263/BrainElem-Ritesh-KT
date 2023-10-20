const User = require("./../models/user.model");
const Team = require("./../models/team.model");
const notifications = require("./notifications");
module.exports = async () => {
    console.log("START: Update Test Status Job");
    try {
        const now = new Date();
        const users = await User.find({"brainCoreTest.registerDate": {$lte: now}, "brainCoreTest.status": "Request sent"}, {brainCoreTest: 1, email: 1, settings: 1}).populate([{path: "settings.connectedDevices", select: "isNotificationOn deviceToken"}]);
        console.log(`Got Not Completed users = ${users.length}`);
        const userIds = users.map(user => user._id);
        const updateUsers = await User.updateMany({_id: {$in: userIds}}, {$set: {"brainCoreTest.status": "Not Completed"}});
        const teams = await Team.find({status: {$ne: "deleted"}}).populate([{path: "trainee", select: "brainCoreTest settings email"}]);
        const teamIds = [];
        for (const team of teams) {
            const teamUsers = team.trainee;
            let isSentRequestExists = teamUsers.some(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status == "Request sent");
            let isNotCompletedExists = teamUsers.some(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status == "Not Completed");
            // let allCompleted = teamUsers.every(user => user.brainCoreTest && user.brainCoreTest.status && user.brainCoreTest.status == "Completed");
            if (!isSentRequestExists && isNotCompletedExists) {
                teamIds.push(team._id)
            }
        }
        const updateTeams = await Team.updateMany({_id: {$in: teamIds}}, {$set: {"brainCoreTest.status": "Not Completed"}});
        //sendNotifications(users);
    } catch (err) {
        console.log("Error in update test status job", err);
    }
    console.log("END: Update Test Status Job");
};

const sendNotifications = (users) => {
    const notificationTo = {
        email: true,
        push: true
    }
    notifications.sendNotifications(users, null, 'BrainCoreTestMissed', notificationTo);
};