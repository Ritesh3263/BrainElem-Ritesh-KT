const Notification = require("../models/notification.model");
const User = require("../models/user.model");
const mainSocket = require('../socketio/index');
const getUsersMobile = require('../socketio/mobileNotifications');

exports.readAll = async (req, res) => {
    let notifications = await Notification.find({})
    res.status(200).json(notifications);
};

exports.read = async (req, res) => {
    let notification = await Notification.findById(req.params.notificationId)
    if (!notification) res.status(404).send({ message: "Not found" });
    else res.status(200).json(notification);
};

exports.add = async (req, res) => {
    const notification = new Notification(req.body);
    notification.save()
    res.status(200).json({message: "Created successfully", notificationId: notification._id});
};

exports.update = async (req, res) => {
    await Notification.findOneAndUpdate(
        { _id: req.params.notificationId },
        { $set: req.body },
        { runValidators: true })
    res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
    await Notification.findByIdAndDelete(req.params.notificationId)
    res.status(200).json({ message: "Deleted successfully" });
};

//** user notifications **/

exports.readAllUserNotifications = async (req, res) => {
    let user = await User.findOne({_id:req.params.userId},{name:1, surname:1, "settings.userNotifications":1})
        .populate({path: 'settings.userNotifications.notification'})
        .sort({'settings.userNotifications.isRead': 1})
        .limit(10)
    res.status(200).json(user.settings.userNotifications);
};

exports.readUnReadUserNotifications = async (req, res) => {
    let user = await User.findOne({_id:req.params.userId},{name:1, surname:1, "settings.userNotifications":1})
        .populate({path: 'settings.userNotifications.notification'}).limit(10)
    if (!user) return res.status(404).json({message: "User not found"});
    return res.status(200).json(user.settings.userNotifications.filter(x=>!x.isRead));
};

exports.updateUserNotifications = async (req, res) => {
    await User.findOneAndUpdate(
        { _id: req.params.userId, 'settings.userNotifications._id' : req.params.notificationId },
        { $set: {'settings.userNotifications.$.isRead': true} },
        { runValidators: true });

    let user = await User.findOne({_id: req.params.userId}, {name:1, surname:1, "settings.userNotifications":1})
        .populate({path: 'settings.userNotifications.notification'})
        .sort({'settings.userNotifications.isRead': 1})
        .limit(10)
    res.status(200).json(user.settings.userNotifications);
    //res.status(200).json({ message: "Updated successfully" });
};

exports.addUserNotification = async (req, res) => {
    const userId = req.body.userId;
    const notification = new Notification(req.body);
    notification.save()
    const newNotification={
        isRead: false,
        notification: notification._id,
    };
    await User.findOneAndUpdate(
        { _id: userId },
        { $push: {'settings.userNotifications' : newNotification} },
        { runValidators: true })
    const users = mainSocket.getUsers([userId]);
    users.map(usr=>{
        mainSocket.io.to(usr.socketId).emit("new_notifications",{
            type: "new_notifications",
            number: 1,
        });
    })
    res.status(200).json({ message: "Updated successfully" });
};

// Function for saving and emmiting a new notification
// params:
// - users - list of users for which notification will be saved and sent
// - notificationBody - body of the notification -for the moment it is an event :(

// Please make this function more universal if possible - from @adrihanu
// Some of the notifications will not be related to any content or event
// The name, content could be removed and repolaced by using TYPE
//  Then loading proper translations based on TYPE will be done in frontend
// Also it would be the best to move this function into utils/notification.js
exports.addUserNotification2 = (users, notificationBody, notificationType) => {
    const _notificationBody = {
        name: `New calendar event: ${notificationBody.name}`,
        content: `Assigned content: ${notificationBody.assignedContent?.title}`,
        type: notificationType??"CALENDAR_EVENT",
        module: notificationBody.assignedContent?.module,
        // I added this propery to save some additional iformation for the notificaion
        // For example I needed an event Id to open the event when user clicks on the notification
        details: {eventName: notificationBody.name, 'eventId': notificationBody._id}
    }
    const notification = new Notification(_notificationBody);
    const newNotification={
        isRead: false,
        notification: notification._id,
    };
    notification.save()
    // push to settings.userNotifications, create and push if userNotifications doesn't exist 
    User.updateMany(
        { _id: { $in: users } },
        { $push: {'settings.userNotifications' : newNotification} },
        { runValidators: true, upsert: true })
    .then(()=>{
        const _users = mainSocket.getUsers(users);
        getUsersMobile(users, notificationBody)
        _users.map(usr=>{
            mainSocket.io.to(usr.socketId).emit("new_notifications",{
                type: "new_notifications",
                number: 1,
            });
        })
    }).catch(err=>{
        console.log(err);
    })
}