const db = require("../models");
const ObjectId = require("mongodb").ObjectId;

const contentUtils = require("../utils/content");


exports.readAll = async (req, res) => {
    if(req.role=='Trainee'){
        let groups = await db.group.find({ "trainees": req.userId }).populate('academicYear').lean().exec()
        let subjectSessions = await db.subjectSession.find({ "group": groups.map(g=>g._id) })
        .populate([
            { path: "group", populate: [
                {path: 'program.duplicatedTrainingPath'},
                {path: 'academicYear'},
            ]},
            { path: "trainingModule" },
        ])

        // hide flagged contents from trainees
        subjectSessions = subjectSessions.map(ss => {
            ss.group.program = ss.group.program.map(p => {
                if(p.duplicatedTrainingPath){
                p.duplicatedTrainingPath.trainingModules = p.duplicatedTrainingPath.trainingModules.map(tm => {
                    tm.chosenChapters = tm.chosenChapters.map(ch => {
                        ch.chosenContents = ch.chosenContents.filter(cc => !cc.content.hideFromTrainees)
                        return ch
                    })
                    return tm
                })
                return p
            }
            })
            return ss
        })
        res.status(200).json(subjectSessions);
    }
    else if(req.role=='Parent'){

        let parent = await db.user.findOne({_id: req.userId},{"details.children":1})
        let groups = await db.group.find({ trainees: { $elemMatch: { $in: parent.details.children||[] } } }).populate('academicYear').lean().exec()

        let subjectSessions = await db.subjectSession.find({ "group": groups.map(g=>g._id) })
        .populate([
            { path: "group", populate: [
                {path: 'program.duplicatedTrainingPath'},
                {path: 'academicYear'},
            ]},
            { path: "trainingModule" },
        ])

        // hide flagged contents from trainees
        subjectSessions = subjectSessions.map(ss => {
            ss.group.program = ss.group.program.map(p => {
                if(p.duplicatedTrainingPath){
                p.duplicatedTrainingPath.trainingModules = p.duplicatedTrainingPath.trainingModules.map(tm => {
                    tm.chosenChapters = tm.chosenChapters.map(ch => {
                        ch.chosenContents = ch.chosenContents.filter(cc => !cc.content.hideFromTrainees)
                        return ch
                    })
                    return tm
                })
                return p
            }
            })
            return ss
        })
        res.status(200).json(subjectSessions);
    }
    else if (req.role=='Trainer') {
        let groups = await db.group.find({ "program.assignment.trainers": req.userId }).populate('academicYear').lean().exec()
        let trainingModuleIds = []
        for (let g of groups){
            let includeAll = g.classManager == req.userId
            for (let p of g.program){
                for (let a of p.assignment){
                    if (includeAll || a.trainers.find(t=>t==req.userId)){
                        trainingModuleIds.push(a.trainingModule)
                    }
                }
            }
        }
        let subjectSessions = await db.subjectSession.find({ "trainingModule": trainingModuleIds })
            .populate([
                { path: "group", populate: [
                    {path: 'program.duplicatedTrainingPath'},
                    {path: 'academicYear'},
                ]},
                { path: "trainingModule" },
            ])
        res.status(200).json(subjectSessions);
    } else { // everything
        let subjectSessions = await db.subjectSession.find({})
            .populate([
                {path: "trainingModule"},
                { path: "group", populate: [
                    {path: 'program.duplicatedTrainingPath'},
                    {path: 'academicYear'},
                ]},
            ])
        res.status(200).json(subjectSessions);
    }
};

exports.read = async (req, res) => {
    let subjectSession = await db.subjectSession.findById(req.params.subjectSessionId)
        .populate([
            {   path: "group", 
                select: 'name trainees program level',
                populate: [
                    { path: 'trainees', select: 'name surname' },
                    { path: 'program.assignment.trainers', select: 'name surname settings.language' },
                    { path: 'academicYear'},
                ],
            },
            { path: "trainingModule", select: 'name' },
        ]).lean().exec()

    
    res.status(200).json(subjectSession);
};

exports.readTrainees = async (req, res) => {
    let subjectSession = await db.subjectSession.findById(req.params.subjectSessionId)
        .populate([
            { path: "group",
                populate: {path: 'trainees'},
                select: 'trainees',
            },
        ])
        .select('group')
    res.status(200).json(subjectSession);
};

exports.readTrainee = async (req, res) => {
    let parent = await db.user.findOne({ "details.children": req.params.userId }, {name:1, surname:1, email:1, details:1})
        .populate([
            { path: "details.children", select: 'name surname email details tips' },
        ])
    let child = parent.details.children.find(child => child._id.toString() === req.params.userId)
    let response = {
        ...child.toJSON(),
        assignedParent: parent,
        level: 'Demo Level',
        solutions:[],
    }
    res.status(200).json(response);
};

exports.add = async (req, res) => {
    const subjectSession = new db.subjectSession(req.body);
    subjectSession.save()
    res.status(200).json({message: "Created successfully", subjectSessionId: subjectSession._id});
};

exports.update = async (req, res) => {
    let subjectSession = await db.subjectSession.findOneAndUpdate(
        { _id: req.params.subjectSessionId },
        { $set: req.body },
        { runValidators: true })
    if (!subjectSession) res.status(404).send({ message: "Not found" });
    else res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
    await db.subjectSession.findByIdAndDelete(req.params.subjectSessionId)
    res.status(200).json({ message: "Deleted successfully" });
};

exports.readProgram = async (req, res) => {
    let session = await db.subjectSession.findOne({trainingModule:req.params.trainingModuleId})
    let userId = req.userId
    if(req.role=='Parent'){
        let parent = await db.user.findOne({_id:req.userId}, {"details.children":1})
        userId = parent?.details?.children
    }
    let user = await db.user.find({_id:userId}).select('settings.completed').lean()
    let tp = await db.trainingPath.findOne({ "trainingModules.originalTrainingModule": req.params.trainingModuleId }) // finding the duplicatedTrainingPath
        .populate([
            { path: "trainingModules.chosenChapters.chapter", select: 'name origin type durationTime' },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: 'title contentType hideFromTrainees hiddenInGroups visibleInGroups detectedLevels durationTime pages level' },
        ]).lean()
    let tm = tp?.trainingModules.find(tm => tm.originalTrainingModule == req.params.trainingModuleId)
    let completedChapters = user.flatMap(u=>u.settings.completed?.chapters||[])
    let completedContents = user.flatMap(u=>u.settings.completed?.contents||[])
    let response = {
        trainingPathId: tp._id,
        periodId: tp.assignedPeriod,
        trainingModuleId: req.params.trainingModuleId,
        assignedChapters: tm?.chosenChapters?.filter(ch=>ch?.chapter).map(ch => {
            let isDone = completedChapters.filter(x=>x).find(x=>x.toString() == ch.chapter._id.toString()) ? true : false
            if(req.role=='Trainee'){
                ch.chosenContents = ch.chosenContents.filter(_=>_?.content).filter(cc => {
                    let shouldHide = true;
                    if(cc.content.visibleInGroups.find(groupId => groupId?.equals(session.group))) {
                        shouldHide = true;
                    }
                    else if(cc.content.hiddenInGroups.find(groupId => groupId.equals(session.group))) {
                        shouldHide = false;
                    }
                    else shouldHide = !cc.content.hideFromTrainees;
                    return shouldHide;
                })
            }
            return {
                _id: ch.chapter._id,
                name: ch.chapter.name,
                description: ch.chapter.description,
                creator: ch.chapter.creator,
                level: ch.chapter.level,
                durationTime: ch.chapter.durationTime,
                old:true,
                origin: ch.chapter.origin,
                // add `durationTime` from content in type
                type: ch.chosenContents.reduce((s,i)=>s+i.content?.durationTime||0,0)/1000+' minutes',
                isDone,
                assignedContents: ch.chosenContents.map(c => {
                    let shouldHide = true;
                    if(c.content.visibleInGroups.find(groupId => groupId?.equals(session.group))) {
                        shouldHide = true;
                    }
                    else if(c.content.hiddenInGroups.find(groupId => groupId.equals(session.group))) {
                        shouldHide = false;
                    }
                    else shouldHide = !c.content.hideFromTrainees;
                    return {
                        _id: c.content._id,
                        title: c.content.title,
                        contentType: c.content.contentType,
                        isShowOthers: shouldHide,
                        level: c.content.level,
                        pages: contentUtils.clearElements(c.content),// Just for displayin tags/labels
                        detectedLevels: c.content.detectedLevels,
                        isDone: completedContents.find(x => x.toString() == c.content._id.toString()) ? true : false,
                    }
                }),
            }
        })||[],
        initialContents: tm?.chosenChapters?.flatMap(ch => ch.chosenContents.filter(_=>_?.content).map(c => c.content._id))||[],
    }
    res.status(200).json(response);
}

exports.anchorProgramByChapter = async (req, res) => {
    let user = await db.user.findOne({_id: req.userId}).select('settings.completed').lean()
    let tp = await db.trainingPath.findOne({ "trainingModules.chosenChapters.chapter": req.params.chapterId, origin: {$exists: true} }) // finding the duplicatedTrainingPath
        .populate([
            { path: "trainingModules.chosenChapters.chapter", select: 'name' },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: 'title contentType hideFromTrainees detectedLevels durationTime level pages' },
        ]).lean()
    let tm = tp?.trainingModules.find(tm => tm.chosenChapters.find(ch => ch.chapter._id.toString() == req.params.chapterId))
    let response = tm?.chosenChapters?.filter(ch=>ch.chapter).map(ch => {
        let isDone = user.settings.completed?.chapters?.filter(x=>x).find(x=>x.toString() == ch.chapter._id.toString()) ? true : false
        if(req.role=='Trainee'){
            ch.chosenContents = ch.chosenContents.filter(cc => !cc.content.hideFromTrainees)
        }
        return {
            _id: ch.chapter._id,
            name: ch.chapter.name,
            // add `durationTime` from content in type
            type: ch.chosenContents.reduce((s,i)=>s+i.content.durationTime||0,0)/1000+' minutes',
            isDone,
            courseIdDone : false, // whole course status ?
            trainingModule: tm?.originalTrainingModule, //=> to end course and update isDone
            assignedContents: ch.chosenContents.map(c => {
                return {
                    _id: c.content._id,
                    title: c.content.title,
                    contentType: c.content.contentType,
                    isShowOthers: !c.content.hideFromTrainees,
                    level: c.content.level,
                    pages: contentUtils.clearElements(c.content),// Just for displayin tags/labels
                    // detectedLevels: c.content.detectedLevels,
                    isDone: user.settings.completed?.contents?.find(x => x.toString() == c.content._id.toString()) ? true : false,
                }
            }),
        }
    })||[]
    res.status(200).json(response);
}

// readBaseProgram
exports.readBaseProgram = async (req, res) => {
    let user = await db.user.findOne({_id:req.userId}).select('settings.completed').lean()
    let trainingModule = await db.trainingModule.findById(req.params.trainingModuleId).lean()
    let tp = await db.trainingPath.findOne({ "trainingModules.originalTrainingModule": trainingModule.origin }) // finding the duplicatedTrainingPath
    .populate([
        { path: "trainingModules.chosenChapters.chapter", select: 'name' },
        { path: "trainingModules.chosenChapters.chosenContents.content", select: 'title contentType hideFromTrainees detectedLevels durationTime' },
    ]).lean().exec()
    let tm = tp?.trainingModules.find(tm => {
        return tm.originalTrainingModule.toString() == trainingModule.origin.toString()
    })
    let response = {
        assignedChapters: tm?.chosenChapters?.filter(ch=>ch.chapter).map(ch => {
            if(req.role=='Trainee'){
                ch.chosenContents = ch.chosenContents.filter(cc => !cc.content.hideFromTrainees)
            }
            let isDone = user.settings.completed?.chapters?.find(x => x.toString() == ch.chapter._id.toString()) ? true : false
            return {
                _id: ch.chapter._id,
                name: ch.chapter.name,
                type: ch.chosenContents.reduce((s,i)=>s+i.content.durationTime||0,0)/1000+' minutes',
                isDone,
                assignedContents: ch.chosenContents.map(c => {
                    return {
                        _id: c.content._id,
                        title: c.content.title,
                        contentType: c.content.contentType,
                        isShowOthers: !c.content.hideFromTrainees,
                        detectedLevels: c.content.detectedLevels,
                        isDone: user.settings.completed?.contents?.find(x => x.toString() == c.content._id.toString()) ? true : false,
                    }
                }),
            }
        })||[],
    }
    res.status(200).json(response);
}
const duplicateContent = async (contentId, moduleId) => {
    let chapter = await db.content.findById(contentId);
    let newContent = new db.content({
      ...chapter.toObject(),
      _id: new ObjectId(),
      module: moduleId, // keep the same module
      origin: contentId,
      sendToLibrary: false, 
      sendToCloud: false,
      groups: [], // limit result from search engine by AdH
  
    });
    newContent.save();
    return newContent;
  }
const duplicateChapter = async (chapterId, moduleId) => {
    let chapter = await db.chapter.findById(chapterId);
    let newChapter = new db.chapter({
        ...chapter.toObject(),
        _id: new ObjectId(),
        module: moduleId, // keep the same module
        origin: chapterId,
    });
    newChapter.save();
    return newChapter;
}
// mirrorTrainingModule
exports.mirrorTrainingModule = async (req, res) => {
    let sourceTP = await db.trainingPath.findOne({ "trainingModules.chosenChapters.chapter": req.body.source})
    let sourceTM = sourceTP?.trainingModules.find(tm => tm.chosenChapters.find(ch => ch.chapter.equals(req.body.source)))

    await db.trainingPath.findOne({ "trainingModules.originalTrainingModule": req.body.target},
    async (err, tp) => {
        if (err) res.status(500).send(err);
        else {
            await db.content.deleteMany({_id: {$in: tp.trainingModules.find(tm => tm.originalTrainingModule.toString() == req.body.target.toString()).chosenChapters.flatMap(ch => ch.chosenContents.map(c => c.content))}})
            await db.chapter.deleteMany({_id: {$in: tp.trainingModules.find(tm => tm.originalTrainingModule.toString() == req.body.target.toString()).chosenChapters.map(ch => ch.chapter)}})
            let newTM = {
                ...sourceTM,
                newName: sourceTM.newName,
                originalTrainingModule: req.body.target,
                chosenChapters: await Promise.all(sourceTM.chosenChapters.map(async ch => {
                    return {
                        // ...ch,
                        chapter: (await duplicateChapter(ch.chapter, req.moduleId))._id,
                        chosenContents: await Promise.all(ch.chosenContents.map(async c => {
                            return {
                                // ...c,
                                content: (await duplicateContent(c.content, req.moduleId))._id,
                            }
                        })),
                    }
                })),
            }
            let tmIndex = tp.trainingModules.findIndex(tm => tm.originalTrainingModule.toString() == req.body.target.toString())
            tp.trainingModules[tmIndex] = newTM
            tp.save();
            res.status(200).json({message: "Mirrored successfully"});
        }
    })

}

//getExamHomeworkDetails
exports.getExamHomeworkDetails = async (req, res) => {
    let group = await db.group.findById(req.body.groupId).populate({path: "trainees", select: "name surname"}).lean()
    let event = await db.event.findById(req.body.eventId)
        .populate([{
            path: "assignedContent", 
            select: "title gradingScale", 
            populate: [
                {path: "gradingScale", select: "name passPercentage"}, 
            ]},
            {path: "assignedChapter", select: "name"}
        ]).lean().exec()
    if (group?.trainees?.length >= 0) {
        let studentResults = await db.result.aggregate()
            .match({
                event: ObjectId(req.body.eventId),
                user: { $in: group.trainees.map(t => t._id) },
            })
            .lookup({
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
            })
            .unwind("user")
            .group({
                _id: "$user._id",
                name: { $first: "$user.name" },
                surname: { $first: "$user.surname" },
                resultId: { $first: "$_id" },
                grade: { $first: "$grade" },
                points: { $first: "$points" },
                percentage: { $first: "$percentage" },
                time: { $first: "$timeSpent" },
            })
            .sort({
                grade: -1,
            })
            .exec()

        let classResult = await db.result.aggregate()
            .match({
                event: ObjectId(req.body.eventId),
                user: { $in: group.trainees.map(t => t._id) },
            })
            .group({
                _id: null,
                averageGrade: { $avg: { $convert: { input: "$grade", to: "decimal", onError: 0 } } },
                averageScore: { $avg: "$points" },
                maxScore: { $max: "$points" },
                minScore: { $min: "$points" },
                averageTime: { $avg: "$timeSpent" },
                maxTime: { $max: "$timeSpent" },
                minTime: { $min: "$timeSpent" },
                contentName: { $first: "$content.title" },
                // allStudents: group.trainees.length,
                studentsTaken: { $sum: 1 },
                // studentsNotTaken: group.trainees.length - { $sum: 1 },
                studentsPassed: { $sum: { $cond: { if: { $gte: ["$grade", event.assignedContent.gradingScale.passPercentage] }, then: 1, else: 0 } } },
                // studentsNotPassed: { $sum: { $cond: { if: { $lt: ["$grade", event.assignedContent.gradingScale.passPercentage] }, then: 1, else: 0 } } },
            })
            // .lookup({
            //     from: 'users',
            //     localField: '_id',
            //     foreignField: 'user',
            //     as: 'students',
            // })
            // // .unwind('students')
            // .group({
            //     _id: '$students._id',
            //     name: { $first: '$students.name' },
            //     surname: { $first: '$students.surname' },
            //     // grade: { $first: '$averageGrade' },
            //     // points: { $first: '$averageScore' },
            //     // percentage: { $first: '$averageScore' },
            //     // time: { $first: '$averageTime' },
            // })
            .exec()
        let response = {
            classResult: {
                ...classResult[0],
                averageGrade: classResult[0].averageGrade.toString(),
                allStudents: group.trainees.length,
                studentsNotTaken: group.trainees.length - classResult[0].studentsTaken,
                // studentsPassed: 999,
                studentsNotPassed: group.trainees.length - classResult[0].studentsPassed,
            },
            class: group.name,
            name: event.assignedContent.title,
            chapter: event.assignedChapter.name,
            assignedOn: event.date,
            students: [...group.trainees.filter(t => !studentResults.find(sr => sr._id.toString() == t._id.toString())), ...studentResults],
        }
        res.status(200).json(response);
    } else {
        res.status(200).json([]);
    }
}

//readGradebook
exports.readGradebook = async (req, res) => {
    let subjectSession = await db.subjectSession.findById(req.body.subjectSessionId)
        .populate([
            {path: "group", populate: {path: "trainees", select: "name surname"}},
        ])

    let exams = await db.event.find({
        $or: [
            { assignedCourse: req.body.courseId },
            { assignedSubject: subjectSession.trainingModule },
        ],
    })

    let grades = await db.result.find({
        event: { $in: exams.map(e => e._id) },
        user: { $in: subjectSession.group.trainees.map(t => t._id) },
    }).lean().exec()

    let traineeResults = await db.result.aggregate()
        .match({
            event: { $in: exams.map(e => e._id) },
            user: { $in: subjectSession.group.trainees.map(t => t._id) },
        })
        .lookup({
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
        })
        .group({
            _id: {
                _id: "$user._id",
                name: "$user.name",
                surname: "$user.surname",
            },
            average: { $avg: "$grade" },
            max: { $max: "$grade" },
            min: { $min: "$grade" },
            count: { $sum: 1 },
        })
        .exec()

    traineeResults = traineeResults.map(er => {
        return {
            trainee: er._id,
            average: er.average,
            max: er.max,
            min: er.min,
            count: er.count,
            grades: grades.filter(g => g.user.toString() == er._id._id.toString()),
        }
    })

    let response = {
        exams,
        trainees: traineeResults,
    }
    res.status(200).json(response);
}

exports.getPeriod = async (req, res) => {
    let periodId = req.params.periodId||req.selectedPeriod
    let academicYear = await db.academicYearRef.findOne({ 'periods._id': periodId }).lean().exec()
    res.status(200).json(academicYear.periods.find(p => p._id.toString() == periodId));
}

// updateImage
exports.updateImage = async (req, res) => {
    db.subjectSession.updateOne(
        { _id: req.params.subjectSessionId },
        { $set: { image: req.body.imageId } },
        (err, subjectSession) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).json(subjectSession.image);
            }
        }
    );
};