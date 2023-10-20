const ObjectId = require("mongodb").ObjectId;
const Group = require("../models/group.model");
const ModuleCore = require("../models/module_core.model");
const db = require("../models");

exports.myLatestContents = async (req, res) => {
    let lastContents = await db.content.find({
            $or: [
                { cocreators: { $elemMatch: { $eq: req.userId } } },
                { owner: req.userId },
            ],
            origin: {$exists: false},
            // module: req.moduleId, // limit within a module?
        }, {    _id: 1, 
                title: 1, 
                contentType: 1, 
                level: 1, 
                createdAt: 1, 
                updatedAt: 1, 
                owner: 1,
                cocreators: 1,
                module: 1,
                origin: 1,
                libraryStatus: 1,
                cloudStatus: 1,
                newerVersion: 1,
            })
        .sort({ createdAt: -1 })
        .limit(100)
        .exec();
    res.status(200).json(lastContents);
} 

exports.upcomingEvents = async (req, res) => {
    let userId = req.userId;
    let group = await Group.find({trainees: { $elemMatch: {$eq: userId} }})
    let core = await ModuleCore.findOne({moduleId: req.moduleId})
    if (req.role === "Trainee"){
        let upcomingEvents = await db.event.find(
            {assignedGroup:  { $in: group.map(x => x._id)}, $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}], "date": { $gt: new Date(Date.now()) } })
            .populate([ { path: 'assignedSubject', select: 'name' },
                { path: 'assignedContent', select: 'title' },
                { path: 'assignedCourse', select: 'name' },
            ]).sort({ date: 1 }).limit(5).exec();
        res.status(200).json(upcomingEvents);
    }
    else if (req.role === "Trainer"){
        let upcomingEvents = await db.event.find(
            {$and: [{$or: [{ creator: req.userId}, { assignedTrainer: req.userId}]}, {$or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]}], "date": { $gt: new Date(Date.now()) }})
            .populate([ { path: 'assignedSubject', select: 'name' },
                { path: 'assignedContent', select: 'title' },
                { path: 'assignedCourse', select: 'name' },
            ]).sort({ date: 1 }).limit(5).exec();
        res.status(200).json(upcomingEvents);
    }
    else if (req.role === "Parent"){
        let user = await db.user.findOne({_id: req.userId});
        let groups = await Group.find({trainees: { $in: user.details.children }})
        let upcomingEvents = await db.event.find(
            {assignedGroup:  { $in: groups.map(x => x._id)}, $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}], "date": { $gt: new Date(Date.now()) }})
            .populate([ { path: 'assignedSubject', select: 'name' },
                { path: 'assignedContent', select: 'title' },
                { path: 'assignedCourse', select: 'name' },
            ]).sort({ date: 1 }).limit(5).exec();
        res.status(200).json(upcomingEvents);
    }
    else { // managers
        let upcomingEvents = await db.event.find(
            {
                date: { $gt: new Date(Date.now()) },
                assignedGroup: core?.groups, 
            }) 
            .populate([ { path: 'assignedSubject', select: 'name' },
                { path: 'assignedContent', select: 'title' },
                { path: 'assignedCourse', select: 'name' },
            ]).sort({ date: 1 }).limit(5).exec();
        res.status(200).json(upcomingEvents);
    }
}

// my latest enquiries
exports.myLatestEnquiries = async (req, res) => {
    let latestEnquiries = await db.enquiry.find({
            contact: req.userId,
            module: req.moduleId,
        })
        .populate([
            // { path: 'contact', select: 'name surname email' },
            // { path: 'trainees', select: 'name surname email' },
            { path: 'certificationSession', select: 'name' },
        ])
        .sort({ createdAt: -1 })
        .limit(5)
        .exec();
    res.status(200).json(latestEnquiries);
}

// my latest accomplishments
exports.myLatestAccomplishments = async (req, res) => {
    let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":req.moduleId}).exec()
    let moduleType = ecosystem?.subscriptions.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId)?.moduleType
    let userId = req.userId;
    if(moduleType === "TRAINING") {
        let user = await db.user.findOne({_id: userId})
            .populate([{
                path: "certificates.certificationSession",
                select: "name certificate certificationDate event",
                populate: [{
                    path: "certificate",
                    select: "name",
                }, {
                    path: "event",
                    select: "name",
                }]
            }])
            .exec();
        res.status(200).json(
            user?.certificates
                .sort((a,b) => (new Date(a.createdAt) - new Date(b.createdAt)))
                .filter((c,i)=>i<5)||[]
        );
    } else if(moduleType === "SCHOOL") {
        if (req.role === "Parent"){
            let user = await db.user.findOne({_id: req.userId});
            let latestGrades = await db.result.find({
                event:  { $exists: true },
                user: { $in: user.details.children }
            }, { data: 0 })
                .populate([{
                    path: "event", select: "name assignedSubject assignedSession",
                    populate: [{
                        path: "assignedSubject", select: "name",
                    }, {
                        path: "assignedSession", select: "name",
                    }]}]) .sort({ createdAt: -1 }).limit(5).exec();
            res.status(200).json(latestGrades);
        }
        let latestGrades = await db.result.find({
            event:  { $exists: true },
            user: userId,
        }, { data: 0 })
            .populate([{
                path: "event", select: "name assignedSubject assignedSession",
                populate: [{
                    path: "assignedSubject", select: "name",
                }, {
                    path: "assignedSession", select: "name",
                }]}]) .sort({ createdAt: -1 }).limit(5).exec();
        res.status(200).json(latestGrades);
    } else { // COGNITIVE
        res.status(200).json([]);
    }

}

// loadTopLowResults
exports.loadTopLowResults = async (req, res) => {
    let groupId = req.params.groupId;
    let trainingModuleId = req.params.trainingModuleId;
    let group = await db.group.findOne({ _id: groupId })
        .populate([{ path: "program.duplicatedTrainingPath" },])
        .exec();
    let program = group?.program?.find(p=>p.assignment.find(a=>a.trainingModule.toString() === trainingModuleId))
    let tm = program?.duplicatedTrainingPath.trainingModules.find(t=>t.originalTrainingModule.toString() === trainingModuleId)
    let contentList = tm?.chosenChapters.flatMap(c=>c.chosenContents.map(cc=>cc.content))
    let resultQuery = db.result.aggregate()
        .match({
            content: { $in: contentList },
            user: { $in: group.trainees },
        })
        .group({
            _id: "$user",
            totalPercentage: { $sum: "$percentage" },
            averagePercentage: { $avg: "$percentage" },
            totalpoints: { $sum: "$points" },
            averagepoints: { $avg: "$points" },
        })

    let topPoints = await resultQuery.sort({ totalpoints: -1 }).limit(5).exec();
    let lowPoints = await resultQuery.sort({ totalpoints: 1 }).limit(5).exec();
    // // sometime total point may differ from total percentage, then some of the followings will be useful 
    // let topResults = await resultQuery.sort({ totalPercentage: -1 }).limit(5).exec();
    // let lowResults = await resultQuery.sort({ totalPercentage: 1 }).limit(5).exec();
    // let topAverage = await resultQuery.sort({ averagePercentage: -1 }).limit(5).exec();
    // let lowAverage = await resultQuery.sort({ averagePercentage: 1 }).limit(5).exec();
    // let topAveragePoints = await resultQuery.sort({ averagepoints: -1 }).limit(5).exec();
    // let lowAveragePoints = await resultQuery.sort({ averagepoints: 1 }).limit(5).exec();
    res.status(200).json({
        top: topPoints,
        low: lowPoints,
        // topResults,
        // lowResults,
        // topAverage,
        // lowAverage,
        // topAveragePoints,
        // lowAveragePoints,
    });
}

// loadTopLowTimeSpent
exports.loadTopLowTimeSpent = async (req, res) => {
    let groupId = req.params.groupId;
    let group = await db.group.findOne({ _id: groupId }).exec();
    let logQuery = db.log.aggregate()
        .match({
            user: { $in: group?.trainees||[] },
            module: ObjectId(req.moduleId),
        })
        .group({
            _id: "$user",
            totalInTime: { $sum: "$details.timeSpent" },
            totalTime: { $sum: "$details.totalTime" },
            totalInactiveTime: { $sum: "$details.inactiveTime" },
            totalAwayTime: { $sum: "$details.awayTime" },
        })
    let topInTime = await logQuery.sort({ totalInTime: -1 }).limit(5).exec();
    let lowInTime = await logQuery.sort({ totalInTime: 1 }).limit(5).exec();
    res.status(200).json({
        top: topInTime,
        low: lowInTime,
    });
}   

// readContentDetail
exports.loadContentDetails = async (req, res) => {
    let contentId = ObjectId(req.params.contentId);
    let content = await db.content.aggregate()
        .match({ _id: contentId })
        .project({
            _id: 1,
            title: 1,
            contentType: 1,
            language: 1,
            description: 1,
            libraryStatus: 1,
            owner: 1,
            cocreators: 1,
            createdAt: 1,
        })
    res.status(200).json(content);
}

// latestActivities
exports.loadLatestActivities = async (req, res) => {
    let userId = req.userId;
    let user = await db.user.findOne({_id: userId})
    if (['ModuleManager', 'Assistant'].includes(req.role)) { 
        let activities = await db.log.find({ module: req.moduleId })
            .populate([{   
                path: "user",
                select: "name surname",
            }])
            .sort({ createdAt: -1 }).limit(30).exec();
        res.status(200).json(activities);
    }
    else if (['Architect'].includes(req.role)) {
        let activities = await db.log.find({ module: req.moduleId })
            .populate([{   
                path: "user",
                select: "name surname settings.role",
            }])
            .sort({ createdAt: -1 }).limit(30).exec();
        res.status(200).json(activities.filter(a=>!['ModuleManager','Assistant','EcoManager','CloudManager','NetworkManager','Root'].includes(a.user.settings.role))); // further adjustment may required in case of single user having multiple roles
    }
    else if (['Parent'].includes(req.role)) {
        let activities = await db.log.find({ user: { $in: user.details.children } })
            .populate([{   
                path: "user",
                select: "name surname",
            }])
            .sort({ createdAt: -1 }).limit(30).exec();
        res.status(200).json(activities);
    }
    else if (['Trainer'].includes(req.role)) {
        let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":req.moduleId})
        let moduleType = (ecosystem?.subscriptions?.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId))?.moduleType
        let groups = await db.group.find({
            $or: [
                { classManager: req.userId },
                { "program.assignment.trainers": { $elemMatch: { $eq: req.userId } } },
            ],
        }).exec();
        let trainees = groups.flatMap(g=>g.trainees);
        if (moduleType === "TRAINING"){
            let sessions = await db.certificationSession.find({ groups: { $in: groups.map(g=>g._id) } }).exec();
            trainees = [...trainees, ...sessions?.flatMap(s=>([...s.unassignedTrainees, ...s.pastTrainees]))||[]];
        }
        let activities = await db.log.find({ module: req.moduleId, user: { $in: trainees } })
            .populate([{
                path: "user",
                select: "name surname",
            }])
            .sort({ createdAt: -1 }).limit(50).exec();
        res.status(200).json(activities);
    } else { // not adjusted for other roles
        res.status(200).json([]);
    }
}

// loadCurriculum
exports.loadCurriculums = async (req, res) => {
    if (['Architect','ModuleManager','Assistant','EcoManager','CloudManager','NetworkManager','Root'].includes(req.role)) {
        let core = await db.moduleCore.findOne({ moduleId: req.moduleId })
            .populate([{
                path: "trainingPaths",
                // select: "name",
            },
            {
                path: "groups",
                select: "name",
            },])
            .exec();

        res.status(200).json(core);
    } else { // not adjusted for other roles
        res.status(200).json([]);
    }
}

// load classes
exports.loadClasses = async (req, res) => {
    let coreQuery = await db.moduleCore.findOne({ moduleId: req.moduleId })
        .populate([{ path: "groups",
            populate: [
                { path: "classManager", select: ["name","surname"] },
                { path: "academicYear", select: ["name","periods"] },
                { path: "trainees", select: ["name","surname"] },
                { path: "program.trainingPath", select: ["name"] }, // original `trainingPath` is here as reference for `duplicatedTrainingPath` 
                { path: "program.duplicatedTrainingPath", select: ["name"] }, 
                { path: "coursePath", select: ["name"] },
                { path: "duplicatedCoursePath", select: ["name"] },
            ],
            options: { sort: { updatedAt: -1 } }
        },]).lean().exec();
    if (req.params.type==="ALL") {
        let classes = coreQuery.groups
            .map((g,i)=>{
                if (i<3) g.status = "NEW";
                else g.status = "ACTIVE";
                return g;
            })
        res.status(200).json(classes);
    } else if (req.params.type==="NEW") {
        let classes = coreQuery.groups.filter((g,i)=>i<3)
            .map(g=>{
                g.status = "NEW";
                return g;
            })
        res.status(200).json(classes);
    }
}