const db = require('../models')

exports.canReadGroupInfoAboutTrainee = async (userId, traineeId) => {
    //##################################################################
    // If user is trainee
    if (userId==traineeId) return true;
    //##################################################################
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // If administrator
    if (user.isAdmin()) return true;
    // if user is parent
    if (user.details.children.some(child => child.equals(traineeId))) return true;
    //##################################################################
    let groups = await db.group.find({$or: [{classManager: userId},{'program.assignment.trainers':userId}]}).catch((err) => false);
    if (groups.map(g=>g.trainees).flat().includes(traineeId)) return true;
    // #################################################################
    // Default
    return false;
}

exports.isTrainerOfTrainingModuleInGroup = async (userId, groupId, trainingModuleId) => {
    //##################################################################
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // If administrator
    if (user.isAdmin()) return true;
    //##################################################################
    // If user is a teacher in this group, and requested corresponding trainingModule
    let group = await db.group.findById(groupId).catch((err) => false);
    let assignments = group.program.map(p=>p.assignment).flat().filter(a=>a.trainingModule.equals(trainingModuleId))
    let trainers = assignments.flatMap(a=>a.trainers)
    let isHeadTrainerOfTheClass = group.classManager?.equals(userId)
    return isHeadTrainerOfTheClass||trainers.some(teacher => teacher.equals(userId))
}

exports.isClassManagerOfGroup = async (userId, groupId) => {
    //##################################################################
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // If administrator
    if (user.isAdmin()) return true;
    
    let group = await db.group.findById(groupId).catch((err) => false);
    if (user._id.equals(group.classManager)) return true 
    else return false;
}

exports.isTrainerFromGroup = async (userId, groupId) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    if (user.isAdmin()) return true;
    if (user.isTrainee()) return false; // not allowing trainee to create report
    return await db.group.exists({ _id:groupId,  $or: [{classManager: userId},{'program.assignment.trainers': userId}]})
}

exports.isUserFromGroup = async (userId, groupId) => {
    // as whoever: trainer/classmanager/trainee
    return await db.group.exists({ 
        "_id": groupId, 
        $or: [{"program.assignment.trainers":  userId}, {classManager:  userId}, {trainees:  userId}]
    })
}