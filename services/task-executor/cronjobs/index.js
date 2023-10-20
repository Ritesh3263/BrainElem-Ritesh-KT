const cron = require("node-cron");

const testAlertNotificationsJob = require("./testAlertNotificationsJob");
const updateTestStatusJob = require("./updateTestStatusJob");
const quickTipNotificationJob = require('./quickTipNotificationJob');

module.exports.run = async () => {
    // every minute
    cron.schedule('* * * * *', testAlertNotificationsJob);
    // every minute
    cron.schedule('* * * * *', updateTestStatusJob);
    //every day 12:00 AM
    cron.schedule('0 0 * * *', quickTipNotificationJob);
};