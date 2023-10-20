
const db = require('../models')

// Check if user can read `report`
exports.canReadReport = async (userId, role, reportId) => {
    let report = await db.softSkillsTemplate.findById(reportId).catch((err) => false);

    if (report.trainee.equals(userId)) return true; // report of self
    else if (report.creator.equals(userId)) return true; // creator of the report
    else if (role == 'Trainer' && report.belongsViaGroup(userId)) return true; 
    // Default
    return false;
}

// Check if user can edit `report`
exports.canUpdateReport = async (userId, role, reportId) => {
    let report = await db.softSkillsTemplate.findById(reportId).catch((err) => false);

    if (report.trainee.equals(userId)) return false; // report of self
    else if (report.creator.equals(userId)) return true; // creator of the report
    else if (role == 'Trainer' && report.belongsViaGroup(userId)) return true; 
    // Default
    return false;
}

exports.isReporter = async (userId, reportedUserId, reportId) => {
    let user = await db.user.findOne({_id: reportedUserId}).catch((err) => false);
    let report = user?.reports?.id(reportId)
    if (report?.creator.equals(userId)) return true;
    else return false;
}