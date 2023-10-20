const User = require("./../models/user.model");
const Result = require('./../models/result.model');
const notifications = require("./notifications");

const { braincoreTestsIds } = require('./../utils/brainCoreTestIds');

module.exports = async () => {
    console.log("START: Quick Tip Notification Job");
    try {
        const notificationUsers = [];
        const users = await User.find({isDeleted: false}, {email: 1, settings: 1}).populate([{path: "settings.connectedDevices", select: "isNotificationOn deviceToken"}]);
        console.log(`Total Users = ${users.length}`);
        for (const user of users) {
            const latestResults = await Result.findOne({ user: user._id, 'content': { $in: braincoreTestsIds},  tips: { $exists: true, $ne: [] }})
            .sort({ createdAt: -1})
            // No results
            if (!latestResults) continue;
            console.log(`Latest result exists for user = ${user._id}, result = ${latestResults._id}`);
            //Results and tips exists and tips are up-to-date 
            const dayInMiliseconds = 1000*60*60*24;
            const maxTimeForTip = 7 * dayInMiliseconds;
            
            const oldUserTips = latestResults.tips.filter(tip => { return (tip.displayDate != undefined)})
            const newUserTips = latestResults.tips.filter(tip => { return (tip.displayDate == undefined)})

            let currentUserTip = null;

            if (!oldUserTips.length && newUserTips.length){ // First run
                currentUserTip = newUserTips[0];
                currentUserTip.displayDate =  new Date();

                // consider this user
                notificationUsers.push(user);
            } else if (newUserTips.length){ // There are still tips which were not displayed
                const latestTip = oldUserTips.sort((a, b) => a.displayDate > b.displayDate).slice(-1)[0]
                const timeOfLatestTip = (new Date()) - latestTip.displayDate;
                if (timeOfLatestTip > maxTimeForTip){ // Current tip is outdated
                    currentUserTip = newUserTips[0]; 
                    currentUserTip.displayDate =  new Date();

                    // consider this user
                    notificationUsers.push(user);
                }
                else { // Latest tip is still active
                  // currentUserTip = latestTip;
                }
            } else { // There is no new tips
                // currentUserTip = oldUserTips[0];
                // if (currentUserTip) {
                //  let timeOfLatestTip = (new Date()) - currentUserTip.displayDate;
                //  if (timeOfLatestTip > maxTimeForTip) return null
                // }else return null;
            }
            if (currentUserTip) {
                console.log(`New User Tip set = ${currentUserTip._id}`);
            }
            latestResults.markModified('tips');
            const update = await latestResults.save();
        }
        if (notificationUsers.length) {
            sendNotifications(notificationUsers);
        }
    } catch (err) {
        console.log("Error in quick tip notification job", err);
    }
    console.log('END: Quick Tip Notification Job');
}

// send push notifications only
const sendNotifications = (users) => {
    const notificationTo = {
        email: false,
        push: true
    }
    notifications.sendNotifications(users, null, 'QuickTip', notificationTo);
};