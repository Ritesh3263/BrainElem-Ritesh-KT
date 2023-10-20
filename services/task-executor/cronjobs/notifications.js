const notifications = require('../tasks/notifications');
const mailer = require("./mailer");
const Notification = require('./../models/notification.model');
const User = require('./../models/user.model');
const { convertToSpecificTimezone } = require('./../utils/timezoneDate');

module.exports.sendNotifications = (users, module, type, notificationTo) => {
    switch (type) {
        case 'BrainCoreTestReminder':
            if (notificationTo.email) brainCoreTestReminderEmailNotification(users, (err) => {
                if (err) console.log({ message: "Reminder Emial not sent!", err })
            });
            if (notificationTo.push) brainCoreTestReminderPushNotification(users, module);
            return;
        case 'BrainCoreTestMissed':
            if (notificationTo.email) brainCoreTestMissedEmailNotification(users, (err) => {
                if (err) console.log({ message: "Missed Email not sent!", err })
            });
            if (notificationTo.push) brainCoreTestMissedPushNotification(users, module);
            return;
        case 'QuickTip':
            if (notificationTo.email) quickTipEmailNotification(users, (err) => {
                if (err) console.log({ message: "Quick Tip Email not sent!", err })
            });
            if (notificationTo.push) quickTipPushNotification(users, module);
            return;
        default: return;
    }

}

// Brain Core Test Reminder Email
const brainCoreTestReminderEmailNotification = (users, callback) => {
    // send email notifications
    for (const user of users) {
        mailer.sendBrainCoreTestReminderNotification(user, callback);
    }
}

// Brain Core Test Reminder Push
const brainCoreTestReminderPushNotification = (users, module = null) => {
    const messages = [];
    const title = 'BrainCore Test Reminder!';
    const body = "Please Take Test on or before";
    // Web and Device Notifications
    for (const user of users) {
        // TODO: module is missing
        Notification.create({
            name: title,
            content: `${body} ${convertToSpecificTimezone(user.brainCoreTest.registerDate, user.settings.timezone)}`,
            type: "PUSH",
            details: {webUrl: '/myspace', mobileUrl: '/MySpace_BcTest'}
        }).then(notification => {
            User.findOneAndUpdate({_id: user._id}, { $push: {'settings.userNotifications' : {notification: notification._id}}})
            .catch(err => console.log(`Notification not updated to user - ${user._id}`))
        }).catch (err => console.log(`Notification not created, user - ${user._id}`))

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
        notifications.sendPushNotification(data);
    }
}

// Brain Core Test Missed Email
const brainCoreTestMissedEmailNotification = (users, callback) => {
    // send email notifications
    for (const user of users) {
        mailer.sendBrainCoreTestMissedNotification(user, callback);
    }
}

// Brain Core Test Missed push
const brainCoreTestMissedPushNotification = (users, module = null) => {
    const messages = [];
    const title = 'BrainCore Test Notification';
    const body = "You have missed the test on";
    // Web and Device Notifications
    for (const user of users) {
        // TODO: module is missing
        Notification.create({
            name: title,
            content: `${body} ${convertToSpecificTimezone(user.brainCoreTest.registerDate, user.settings.timezone)}`,
            type: "PUSH",
            details: {webUrl: '/myspace', mobileUrl: '/MySpace_BcTest'}
        }).then(notification => {
            User.findOneAndUpdate({_id: user._id}, { $push: {'settings.userNotifications' : {notification: notification._id}}})
            .catch(err => console.log(`Notification not updated to user - ${user._id}`))
        }).catch (err => console.log(`Notification not created, user - ${user._id}`))

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
        notifications.sendPushNotification(data);
    }
}

const quickTipEmailNotification = (users, module = null) => {
    return;
}

const quickTipPushNotification = (users, module = null) => {
    const messages = [];
    const title = 'Notification';
    const body = "A new tip has been received. Please check it at your earliest convenience.";
    // Web and Device Notifications
    for (const user of users) {
        // TODO: module is missing
        Notification.create({
            name: title,
            content: `${body}`,
            type: "PUSH",
            details: {webUrl: '/myspace/?tab=0', mobileUrl: '/MySpace_MyResults_LearningTip'}
        }).then(notification => {
            User.findOneAndUpdate({_id: user._id}, { $push: {'settings.userNotifications' : {notification: notification._id}}})
            .catch(err => console.log(`Notification not updated to user - ${user._id}`))
        }).catch (err => console.log(`Notification not created, user - ${user._id}`))

        if (user.settings.connectedDevices && user.settings.connectedDevices.length) {
            const deviceTokens = user.settings.connectedDevices.filter(device => device.isNotificationOn).map(d => d.deviceToken);
            deviceTokens.forEach(token => {
                messages.push({
                    data: {
                        title: title,
                        body: `${body}`,
                        mobileUrl: '/MySpace_MyResults_LearningTip'
                    },
                    notification: {
                        sound: 'default',
                        title: title,
                        body: `${body}`
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
        notifications.sendPushNotification(data);
    }
}