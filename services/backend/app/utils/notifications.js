const tasker = require('./tasker/tasker');
const mailer = require("./mailer/mailer");
const mobileNotification = require('./mobileNotification');
const Notification = require('./../models/notification.model');
const User = require('./../models/user.model');
const { convertToSpecificTimezone } = require('./timezoneDate');

// triggeredBy - of user who triggered the notification
// baseUrl - base url which will be used to create link
// testType - Type of the test for which user will be invited: ['pedagogy', 'adult']
module.exports.sendNotifications = (users, moduleId, triggeredBy, type, notificationTo, baseUrl, testType) => {
    switch (type) {
        case 'BrainCoreRegisterConfirm':
            if (notificationTo.email) brainCoreRegisterConfirmEmailNotification(users, triggeredBy, moduleId, baseUrl, testType, (err) => {
                if (err) console.log({ message: "Registered successfully! Email not sent!", err })
            });
            if (notificationTo.push) brainCoreRegisterConfirmPushNotification(users, moduleId);
            return;
        default: return;
    }

}


// triggeredBy - of user who triggered the notification
// moduleId - module id to which user will be added
// baseUrl - base url which will be used to create link
// testType - Type of the test for which user will be invited: ['pedagogy', 'adult']
const brainCoreRegisterConfirmEmailNotification = (users, triggeredBy, moduleId, baseUrl, testType, callback) => {
    // send email notifications
    for (const user of users) {
        mailer.sendBCRegistrationConfirmationEmail(user, triggeredBy, moduleId, baseUrl, testType, callback);
    }
}

const brainCoreRegisterConfirmPushNotification = (users, module) => {
    const messages = [];
    const title = "ELiA - Brain Core Test Confirmation";
    const body = "You are requested to take Brain Core Test on or before";
    // Web and Device Notifications
    for (const user of users) {
        Notification.create({
            name: title,
            content: `${body} ${convertToSpecificTimezone(user.brainCoreTest.registerDate, user.settings.timezone)}`,
            type: "PUSH",
            module: module,
            details: {webUrl: '/myspace', mobileUrl: '/MySpace_BcTest'}
        }).then(notification => {
            User.findOneAndUpdate({_id: user._id}, { $push: {'settings.userNotifications' : {notification: notification._id}}})
            .catch(err => console.log(`Notification not updated to user - ${user._id}`))
        }).catch (err => console.log(`Notification not created user - ${user._id}`))

        if (user.settings.connectedDevices && user.settings.connectedDevices.length) {
            const deviceTokens = user.settings.connectedDevices.filter(device => device.isNotificationOn).map(d => d.deviceToken);
            deviceTokens.forEach(token => {
                messages.push({
                    data: {
                        title: title,
                        body: `${body} ${convertToSpecificTimezone(user.brainCoreTest.registerDate, user.settings.timezone)}`,
                        mobileUrl: '/MySpace_BcTest'
                    },
                    notification: {
                        sound: 'default',
                        title: title,
                        body: `${body} ${convertToSpecificTimezone(user.brainCoreTest.registerDate, user.settings.timezone)}`
                    },
                    priority: "high",
                    to: token
                })
            });
        }
    }
    console.log(`Total Messages = ${messages.length}`);
    if (messages.length) {
        const data = {
            messages: messages,
            type: 'multiple'
        }
        mobileNotification.sendPushNotification(data);
    }
}
