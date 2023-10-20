const db = require("../models");
const ObjectId = require("mongodb").ObjectId;
const RoleMaster = db.roleMaster;

// please make static db instance
const defaultRoles =[
    {roleName: "Trainee"},
    {roleName: "Trainer"},
    {roleName: "Inspector"},
    {roleName: "Librarian"},
];
const schoolRoles = [
    {roleName: "Architect"},
    {roleName: "Parent"},
];
const trainingRoles = [
    {roleName: "Assistant"},
    {roleName: "Coordinator"},
    {roleName: "TrainingManager"},
    {roleName: "Partner"},
];


exports.readAvailableRoles = async (req, res) => {
    let rolesArr = defaultRoles;
    if(req.params.type === 'TRAINING'){
        rolesArr = defaultRoles.concat(trainingRoles);
    }
    else if(req.params.type === 'SCHOOL'){
        rolesArr = defaultRoles.concat(schoolRoles);
    }
    else if (req.params.type === 'COGNITIVE') {
        if (!req.moduleId) {
            return res.status(400).json({message: `Unauthorized ModuleId = ${req.moduleId}`});
        }
        rolesArr = await getActiveRoleMasters(req.moduleId);
    }
    res.status(200).json(rolesArr);
};

// get active role masters
const getActiveRoleMasters = async (moduleId) => {
    const query = {
        status: "active",
        $or: [{module: moduleId}, {module: "ALL"}],
    }
    const roleMasters = await RoleMaster.find(query, {_id: 1, name: 1});
    return roleMasters;
};
// getPopularEventTypes
exports.getPopularEventTypes = async (req, res) => {
    let popularEventTypes = await db.event.aggregate()
        .group({_id: "$eventType", count: {$sum: 1}})
        .sort({count: -1})
        // .limit(3); // not limiting now as there are only 5 event types in total
        .exec(); 

    res.status(200).json(popularEventTypes);
};

// getPopularSubjects
exports.getPopularSubjects = async (req, res) => {
    let popularSubjects = await db.trainingPath.aggregate()
        .project({ 'trainingModules': 1 })
        .unwind('trainingModules')
        .group({ 
            _id: '$trainingModules.originalTrainingModule', 
            count: { $sum: 1 } 
        })
        .sort({ count: -1 })
        .limit(5)
        .exec(); 
        
    res.status(200).json(popularSubjects);
};

// getPopularLevels
exports.getPopularLevels = async (req, res) => {
    let popularLevels = await db.content.aggregate()
        .group({_id: "$level", count: {$sum: 1}})
        .sort({count: -1})
        .limit(3)
        .exec(); 

    res.status(200).json(popularLevels);
};

// getPopularContent
exports.getPopularContent = async (req, res) => {
    let popularContent = await db.log.aggregate()
        .project({ accessedURLs: 1, user: 1, module: 1 })
        .unwind('$accessedURLs')
        .match({ module: ObjectId(req.moduleId), 'accessedURLs.name': { $regex: /^\/overview\/[a-zA-Z0-9]*$/ } })
        .group({
            _id: '$accessedURLs.name',
            // count: { $sum: 1 }, // number of log pulses for this content // removing this because it is creating confusion log pulses and content accesses
            totalTime: { $sum: '$accessedURLs.inTime' },
        })
        .sort({ totalTime: -1 })
        .limit(5)
        .exec()

        // adding content name to the response can be a good idea in the future

    res.status(200).json(popularContent);
}

// countProgramsByContent
exports.countProgramsByContent = async (req, res) => {
    let programsByContent = await db.trainingPath.countDocuments({ 'trainingModules.chosenChapters.chosenContents.content': req.params.contentId });
    res.status(200).json({ count: programsByContent });
}

// getAssignmentCount
exports.getAssignmentCount = async (req, res) => {
    let assignmentCount = await db.event.aggregate()
        // .match({ eventType: eventType })
        .group({ _id: '$eventType', count: { $sum: 1 } })
        .exec(); 
        
    let sessionCount = await db.certificationSession.aggregate()
        .match({ module: req.moduleId })
        .group({ _id: null, count: { $sum: 1 } })
        .exec(); 

    let response = [
        ...assignmentCount,
        {
            _id: 'session',
            count: sessionCount[0].count,
        }
    ]

    res.status(200).json(response);
}

// markCompleted
exports.markCompleted = async (req, res) => {
    let userId = req.params.userId||req.userId;
    let condition = {};

    // delete following two lines after some times, this is just to remove all existing null values in there
    await db.user.updateMany({},{$pull:{"settings.completed.chapters":null}},{multi:true})
    await db.user.updateMany({},{$pull:{"settings.completed.contents":null}},{multi:true})
    
    if(req.body.categoryId){
        if(req.body.value){
            if (Array.isArray(req.body.categoryId)) condition = { $addToSet: { ['settings.completed.'+req.body.category]: { $each: req.body.categoryId } } };
            else condition = { $addToSet: { ['settings.completed.'+req.body.category]: req.body.categoryId } }
        } else {
            if (Array.isArray(req.body.categoryId)) condition = { $pullAll: { ['settings.completed.'+req.body.category]: req.body.categoryId } };
            else condition = { $pull: { ['settings.completed.'+req.body.category]: req.body.categoryId } }
        }
        await db.user.updateOne(
            { _id: ObjectId(userId) },
            condition,
            { runValidators: true }
        );
    
        res.status(200).json({ message: 'success' });
    } else res.status(202).send({ message: 'Item Id is required!' });
}

// get period 
exports.getPeriod = async (req, res) => {
    let year = await db.academicYearRef.findOne({ 'periods._id': req.params.periodId }).lean();
    let response = {
        period: year?.periods.find(p => p._id.toString() === req.params.periodId),
        name: year?.name,
    }
    res.status(200).json(response);
}

exports.getAllPeriods = async (req, res) => {
    let core = await db.moduleCore.findOne({ moduleId: req.moduleId })
     .populate('academicYears').lean();
    // let academicYears = await db.academicYearRef.find({}).sort({ startDate: -1 }).exec();
    res.status(200).json(core.academicYears);
}

