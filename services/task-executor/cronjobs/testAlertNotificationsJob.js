const User = require("./../models/user.model");
const notifications = require("./notifications");

module.exports = async () => {
    console.log("START: Test Alert Notifications Job");
    try {
        const next2Days = new Date(new Date().setDate(new Date().getDate() + 2));
        const nextDay = new Date(new Date().setDate(new Date().getDate() + 1));
        const users = await User.find({"brainCoreTest.registerDate": {$gt: nextDay, $lte: next2Days}, "brainCoreTest.status": "Request sent", "brainCoreTest.reminderEmailSent": false}, {brainCoreTest: 1, email: 1, settings: 1}).populate([{path: "settings.connectedDevices", select: "isNotificationOn deviceToken"}]);
        console.log(`Got Reminder users = ${users.length}`);
        //await sendNotifications(users);
    } catch (err) {
        console.log("Error in Test Alert Notifications Job", err);
    }
    console.log("END: Test Alert Notifications Job");
};

const sendNotifications = async (users) => {
    const notificationTo = {
        email: true,
        push: true
    }
    notifications.sendNotifications(users, null, 'BrainCoreTestReminder', notificationTo);
    await User.updateMany({_id: {$in: users.map(user => user._id)}}, {$set: {"brainCoreTest.reminderEmailSent": true}});
}