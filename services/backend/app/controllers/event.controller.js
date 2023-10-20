const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const User = db.user;
const Group = require("../models/group.model");
const Event = require("../models/event.model");
const ModuleCore = require("../models/module_core.model");
const CertificationSession = require("../models/certification_session.model");
const TrainingPath = require("../models/training_path.model");
const Result = require("../models/result.model");
const Ecosystem = require("../models/ecosystem.model");
const AcademicYearRef = require("../models/academic_year_ref.model");
const {addUserNotification2} =  require("./notification.controller");

const resultUtils = require('../utils/result')
const eventUtils = require('../utils/event')
const eventAuthUtils = require('../utils/eventAuth')

// Function to propagate notifications about event
// params:
//    eventId - id of event for which the notification will be created
//    type - type of the notification - if not provided default value will be used in addUserNotification2
// Please move this function into utils/event.js
async function propagateEventNotification(eventId, type=undefined){
    let fullEvent = await Event.findOne({_id: eventId})
      .populate([{path: 'assignedGroup'},{path:'assignedContent'}])
    let eventRecipients = [];
    if(fullEvent?.assignedGroup?.trainees && fullEvent?.assignedTrainer && fullEvent?.creator){
      eventRecipients.push(...fullEvent.assignedGroup.trainees, fullEvent.assignedTrainer, fullEvent.creator);
      addUserNotification2(eventRecipients, fullEvent, type);
    }
}

// Get single event from database
// params:
//   eventId - id of event
exports.overview = async (req, res) => {
  Event.findById(req.params.eventId).populate([
    { path: "assignedGroup", select: "name program module trainees", populate: { path: 'trainees', select: ['_id', "name", "surname"]} },
    { path: "assignedSubject", select: "name" },
    { path: "assignedChapter", select: "name" },
    { path: "assignedContent" }
  ]).exec(
    async (err, event) => {
      if (err) res.status(500).json({ message: err });
      else if (!event) res.status(404).json({ message: "Event was not found" });
      else{ 
        let moduleId = (await event?.assignedGroup?.getModulesIds())[0]
        event = event.toObject()
        // Load default grading scale
        const [moduleCore, canExamine, results, user] = await Promise.all([
          ModuleCore.findOne({moduleId: moduleId}).populate(['defaultGradingScale', 'gradingScales']),
          eventAuthUtils.canExamineEvent(req.userId, req.moduleId, event._id),
          Result.find({ 'event': event._id, 'user': req.userId }, { "_id": 1, "createdAt": 1, "event": 1 }).sort('-createdAt'),
          User.findOne({ _id: req.userId }, { sessionContentProgress: 1 })
        ])
        
        let gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
        let progress = user.sessionContentProgress.find(p => p.contentId.toString() === event.assignedContent._id.toString());
        event.assignedContent.status = progress?.status;
        
        res.status(200).json({...event, gradingScale: gradingScale, canExamine: canExamine, results: results});
      }
    }
  )
};


// Get single event from database with associated content
// params:
//   eventId - id of event
exports.display = async (req, res) => {
  let event = await Event.findById(req.params.eventId).populate([
    { path: "assignedGroup", select: "name program module trainees", populate: { path: 'trainees', select: ['_id', "name", "surname"]} },
    { path: "assignedSubject", select: "name" },
    { path: "assignedChapter", select: "name" },
    { path: "assignedContent", populate: "owner" }
  ])
  
  // Load default grading scale 
  let moduleId = (await event?.assignedGroup?.getModulesIds())[0]
  let [user, moduleCore, results, canExamine] = await Promise.all([
    User.findOne({ _id: req.userId }, { sessionContentProgress: 1 }).lean(),
    ModuleCore.findOne({moduleId: moduleId}).populate(['defaultGradingScale', 'gradingScales']).lean(),
    Result.find({ 'event': event._id, 'user': req.userId }, { "_id": 1, "createdAt": 1, "event": 1 }).sort('-createdAt'),
    eventAuthUtils.canExamineEvent(req.userId, req.moduleId, event._id)
  ]) 
  let gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
  let progress = user.sessionContentProgress.find(p => p.contentId.toString() === event.assignedContent._id.toString());
  event = event.toObject()
  event.assignedContent.status = progress?.status;
  res.status(200).json({...event, gradingScale: gradingScale, canExamine: canExamine, results: results});

};


// Get all event data for group Examination view
exports.readForExamination = async (req, res) => {
  let eventId = req.params.eventId
  let event = await Event.findById(eventId).populate([
    { path: "assignedGroup", populate: {path: 'trainees', select: ['_id', "name", "surname"]}},
    { path: "assignedSubject", select: "name" },
    { path: "assignedChapter", select: "name"},
    { path: "assignedContent", populate: "gradingScale"}
  ])

  if (event.assignedGroup) {
    let stats = await resultUtils.getStats(event.assignedGroup.trainees, req.moduleId, event?.assignedContent?._id, event._id)
    
    // Load default grading scale 
    let moduleId = (await event?.assignedGroup?.getModulesIds())[0]
    let moduleCore = await ModuleCore.findOne({moduleId: moduleId}).populate(['defaultGradingScale', 'gradingScales']).exec()
    let gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
    var output = {
      event: {...event.toObject(), gradingScale: gradingScale},
      stats: stats
    }

    return res.status(200).json(output);
  } else {
    res.status(404).json({ message: "Not found" });
  }
}

// Allow additional attemt for event.
// This funciton was moved from content controller
exports.allowExtraAttempt = async (req, res) => {

  let event = await Event.findOneAndUpdate({ "_id": req.params.eventId }, {"$addToSet": {"allowExtraAttemptFor": req.params.userId }})
  if (!event) res.status(404).json({ message: "Event not found" });
  else {
    res.status(200).json({ message: "Updated successfully"});
  }
};

// Disallow additional attemt for event.
// This funciton was moved from content controller
exports.disallowExtraAttempt = async (req, res) => {
  let event = await Event.findOneAndUpdate({ "_id": req.params.eventId }, {"$pull": {"allowExtraAttemptFor": req.params.userId }})
  if (!event) res.status(404).json({ message: "Event not found" });
  else {
    res.status(200).json({ message: "Updated successfully", eventId: event._id });
  }
};

exports.add = async (req, res) => {
  // in case of "Homework on paper" or "Exam in class", no content assignment is required
  if(["Exam","Homework"].includes(req.body.assignedContent)) req.body.assignedContent = undefined // 
  const event = new Event(req.body);
  event.examCoefficient = event.examCoefficient || 1
  event.creator = req.userId
  if(event.assignedTrainer){
    event.assignedTrainer =  req.body.assignedTrainer;
  }
  else event.assignedTrainer = req.userId;
  // if(req.role=="Architect") event.assignedTrainer = event.assignedTrainer || req.userId
  event.save((err)=>{
    if (err) res.status(500).json({ message: err })
    propagateEventNotification(event._id);
    return res.status(200).json({message: "Created successfully", eventId: event._id});
  })

};

exports.addAlt = async (req, res) => {
  if(!event["durationTime"]){ // if not provided
    event["durationTime"] = 0
  } else if(isNaN(event["durationTime"])){ // if isn't a number (i.e. string), split it 
    let string = event["durationTime"].split(":");
    event["durationTime"] = parseInt(string[0])*60 + parseInt(string[1]);
  }

  const event = new Event(req.body);
  event.creator = req.userId
  event.assignedTrainer = req.userId;
  event.save((err)=>{
    if (err) return res.status(500).json({ message: err })
    propagateEventNotification(event._id);
    return res.status(200).json({message: "Created successfully", eventId: event._id});
  })
}

exports.addCerificationEvent = async (req, res) => {
  // in case of "Homework on paper" or "Exam in class", no content assignment is required
  const event = new Event(req.body);
  event.creator = req.userId
  event.assignedSession = req.body.sessionId
  event.save()
  await CertificationSession.findOneAndUpdate(
        { _id: req.body.sessionId },
        { $set: {event: event._id} },
        { runValidators: true })
  res.status(200).json({message: "Created successfully", eventId: event._id});

};


exports.update = async (req, res) => {
  if(["Exam","Homework"].includes(req.body.assignedContent)) req.body.assignedContent = undefined // 
  req.body.creator = req.userId
  let event = await Event.findOneAndUpdate(
    { _id: req.params.eventId },
    { $set: req.body },
    { runValidators: true })
  propagateEventNotification(event._id)
  if (req.body.assignedCourse) res.status(200).json({ message: "Updated successfully. Please refresh the page/tab." });
  else res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await Event.findByIdAndDelete(req.params.eventId)
  // event.unIndex(); // incase events are indexed for elastic search
  if (req.body.assignedCourse) res.status(200).json({ message: "Deleted successfully. Please refresh the page/tab." });
  else res.status(200).json({ message: "Deleted successfully" });
};

exports.removeByExam = async (req, res) => {
  let event = await Event.findByIdAndDelete(req.params.eventId)
  if (event) {
    await Result.deleteMany({event: req.params.eventId})
    res.status(200).json({ message: "Deleted successfully" });
  } else res.status(404).json({ message: "Not found" });
};

exports.readAll = async (req, res) => {
  let events = await Event.find({})
  res.status(200).json(events);
};

exports.getEvents = async (req, res) => {
  let userId = req.userId;
  let conditions = {$or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]};
  if (req.params.trainingModuleId) conditions.assignedSubject = req.params.trainingModuleId;

  if (req.role === "Trainee"){
    let group = await Group.find({trainees: { $elemMatch: {$eq: userId} }})
    conditions.assignedGroup = { $in: group.map(g=>g._id) }
  } else if (req.role === "Trainer"){
    conditions.creator = userId
  } else if (req.role === "Parent"){
    let user = await User.findOne({_id:userId})
    let groups = await Group.find({trainees: { $in: user.details.children }})
    conditions.assignedGroup = { $in: groups.map(g=>g._id) }
    let events = await Event.find({assignedGroup:  { $in: groups.map(x => x._id)}, $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]})
      .sort({date: 'descending'})
      .populate(
        [{ path: "assignedContent" , select: "title hideFromTrainees contentType"}, 
        { path: "assignedGroup" , select: "name trainees", populate: { path: "trainees" , select: "name"}},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])
    res.status(200).json(events.map(e=>{
        e.assignedGroup.trainees = e.assignedGroup.trainees.filter(x=>user.details.children.includes(x._id))
        return e
      })); 
  } else if (req.role==="Inspector" || req.role==="Architect"){
    let core = await ModuleCore.findOne({moduleId: req.moduleId})
    if (!core) res.status(404).json({ message: "Not found" });
    else {
      conditions.assignedGroup = { $in: core.groups }
    }
  } else if (req.role === "TrainingManager"){
    let core = await ModuleCore.findOne({moduleId: req.moduleId})
    if (!core) res.status(404).json({ message: "Not found" });
    else {
      conditions.assignedGroup = { $in: core.groups }
    }
  } else {
    res.status(404).json({ message: "Program is not defined this User Role" });
  }
  
      
  if (req.role === "Parent") { 
    // res already sent for parent
  } else {
    let events = await Event.find(conditions)
    .sort({date: 'descending'})
    .populate(
      [{ path: "assignedContent" , select: "title hideFromTrainees contentType"}, 
      { path: "assignedGroup" , select: "name"},
      { path: "assignedSubject" , select: "name"},
      { path: "assignedChapter" , select: "name"}]).limit(200);
    
    if (req.role === "Trainee") {
    }

    // Transform events to objects to enable modifications
    let modifiedEvents = [];
    for (let event of events){
      let modifiedEvent = event.toObject();
      modifiedEvents.push(modifiedEvent)
    }
    await eventUtils.assignResults(modifiedEvents, (req.role=="Trainee" ? req.userId : undefined))
    eventUtils.assignStatuses(modifiedEvents, (req.role=="Trainee" ? false : true))

    res.status(200).json(modifiedEvents);
  }
};

exports.readEventsFromAllSessions = async (req, res) => {
  let groups = await db.group.find({trainees: req.userId})
  // let sessions = await db.certificationSession.find({ groups: groups?.map(g=>g._id)})
  let sessions = await CertificationSession.find({ groups: { $in: groups.map(g=>g._id)?.flat()||[] } }) 
  let events = await db.event.find({assignedSession: sessions.map(s=>s._id)})
  .sort({date: 'descending'})
  .populate([
    { path: "assignedContent" , select: "title"}, 
    { path: "assignedSession" , select: "name"},
    { path: "assignedCourse" , select: "name"},
    { path: "assignedSubject" , select: "name"},
    { path: "assignedChapter" , select: "name"}
  ])
  res.status(200).json(events)
};

exports.readEventsFromSession = async (req, res) => {
  let currentSession = await CertificationSession.findOne({"_id":req.params.sessionId}).populate({path: "enquiry"})
  // let thisEnquiry = await Enquiry.findOne({"_id":currentSession.enquiry})
  
  let userId = req.userId;
  if (req.role === "Trainee" || await User.exists({_id: userId, availableRoleMasters: {$in: ['64a82e1136f28e0072f522fa']}})){
    let session = await CertificationSession.findById(req.params.sessionId)
    if (!session) res.status(404).json({ message: "Not found" });
    else {
      if (!session.unassignedTrainees.some(e => e == userId)){
        let events = await Event.find({ $and: [
            {addedFromGradebook:  { $exists: false }},
            {assignedGroup:  req.params.assignedGroup}, 
            {assignedSession: req.params.sessionId}, // as event having session as well!
          ]})
          .sort({date: 'descending'})
          .populate(
            [{ path: "assignedContent" , select: "title hideFromTrainees contentType"}, 
            // { path: "assignedGroup" , select: "name"},
            { path: "assignedSession" , select: "name"},
            { path: "assignedCourse" , select: "name"},
            { path: "assignedSubject" , select: "name"},
            { path: "assignedChapter" , select: "name"}])
        
        let haveResults = await db.result.find({content: {$in: events.map(e=>e.assignedContent._id)}})
        events = JSON.parse(JSON.stringify(events))
        res.status(200).json(events.map(e=>{
          e.haveResult = haveResults.some(r=>r.content.toString() == e.assignedContent._id.toString())
          return e
        }))
      } else res.status(200).json("Student not enrolled");
    } 
  } else if (req.role === "Trainer" || await User.exists({_id: userId, availableRoleMasters: {$in: ['63c8f1cb88bbc68cce0eb2ea']}})){
    let events = await Event.find({$or: [{creator: userId}, {assignedTrainer: userId}], assignedSession: req.params.sessionId, addedFromGradebook:  { $exists: false }})
      .sort({date: 'descending'})
      .populate(
        [{ path: "assignedContent" , select: "title"}, 
        { path: "assignedCourse" , select: "name"},
        { path: "assignedGroup" , select: "name"},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])
    res.status(200).json(events);
  } else if (req.role === "TrainingManager" || req.role === "Architect" ){
    let events = await Event.find({assignedSession: req.params.sessionId, addedFromGradebook:  { $exists: false }})
      .sort({date: 'descending'})
      .populate(
        [{ path: "assignedContent" , select: "title"}, 
        { path: "assignedGroup" , select: "name"},
        { path: "assignedCourse" , select: "name"},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])
     res.status(200).json(events);
  } else if (req.role === "Partner" && req.userId == currentSession.enquiry.contact){
    let events = await Event.find({assignedSession: req.params.sessionId, addedFromGradebook:  { $exists: false }})
      .sort({date: 'descending'})
      .populate(
        [{ path: "assignedContent" , select: "title"}, 
        { path: "assignedGroup" , select: "name"},
        { path: "assignedCourse" , select: "name"},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])
    res.status(200).json(events);
  } else {

  
    // check if user exist  where availableRoleMasters array includes '63c8f1cb88bbc68cce0eb2ea'
    let isBCTrainer = await User.exists({_id: userId, availableRoleMasters: {$in: ['63c8f1cb88bbc68cce0eb2ea']}})
    let isBCCoach = await User.exists({_id: userId, availableRoleMasters: {$in: ['64a82e1136f28e0072f522fa']}})

    // if (isBCTrainer || isBCCoach){ TO DO 
      let events = await Event.find({ assignedSession: req.params.sessionId, addedFromGradebook:  { $exists: false }})
      .sort({date: 'descending'})
      .populate(
        [{ path: "assignedContent" , select: "title"}, 
        { path: "assignedCourse" , select: "name"},
        { path: "assignedGroup" , select: "name"},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])
      return res.status(200).send(events);
    // }
    //return res.status(404).send({ message: "Program is not defined this User Role" });
  }
};


exports.getTraineePreviewEvents = async (req, res) => {
  let userId = req.userId;
  let groupId = req.params.groupId
  let group = await Group.findById(req.params.groupId)
  if (group.classManager.equals(userId)) {
    let events = await Event.find({assignedGroup:  groupId})
      .populate(
        [{ path: "assignedContent" , select: "title hideFromTrainees visibleInGroups hiddenInGroups contentType allowMultipleAttempts"}, 
        { path: "assignedGroup" , select: "name"},
        { path: "assignedSubject" , select: "name"},
        { path: "assignedChapter" , select: "name"}])

    events = events.filter(_=>_?.assignedContent).filter(e => {
        let shouldHide = true;
        if(e.assignedContent.visibleInGroups.find(groupId => groupId?.equals(groupId))) {
            shouldHide = true;
        }
        else if(e.assignedContent.hiddenInGroups.find(groupId => groupId.equals(groupId))) {
            shouldHide = false;
        }
        else shouldHide = !e.assignedContent.hideFromTrainees;
        return shouldHide;
    })

    let result = await Result.find({
      user: userId,
      content: {$in: events.filter(e=>e.assignedContent&&!e.assignedContent.allowMultipleAttempts).map(e=>e.assignedContent._id)}
    })
    let restrictedContentIds = result.map(r=>r.assignedContent._id.toString())
    events = events.map(e=>{
      e.restricted = restrictedContentIds.includes(e.assignedContent?._id.toString())
      return e
    })
    res.status(200).json(events);
  } else {
    res.status(404).json({ message: "You are not a classManager of this group!" });
  }
};

exports.readTrainingModulesForEvents = async (req, res) => { // adjusted for Parent, trainer, classmanager, student
  let ecosystem = await Ecosystem.findOne({"subscriptions.modules._id":req.moduleId})
  let moduleType = (ecosystem?.subscriptions?.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId))?.moduleType

  if(moduleType === "SCHOOL"){
    let group = await Group.findById(req.params.classId).populate([
      { path: "program.duplicatedTrainingPath" },
      { path: "academicYear" },
    ]).lean().exec()
    if(group){
      let currentPeriod = group.academicYear.periods.find(p=>new Date(p.startDate)<=new Date() && new Date()<=new Date(p.endDate))
      let selectedProgram = group.program.find(x=>x.period.toString()==currentPeriod?._id.toString())
      if (req.selectedPeriod) selectedProgram = group.program.find(x=>x.period.toString()==req.selectedPeriod)
      if(selectedProgram) {
        let trainingPathWithTrainers = selectedProgram.duplicatedTrainingPath
        
        trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules.map(x=>{
          x.trainers = selectedProgram.assignment.find(y=>y.trainingModule.equals(x.originalTrainingModule)).trainers
          return x
        })
        trainingPathWithTrainers.classManager = group.classManager
        if (req.role === "Trainer" && !group.classManager.equals(req.userId)) {
          trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules.filter(x=>x.trainers.find(t=>t.equals(req.userId)))
        } 
        res.status(200).json(trainingPathWithTrainers)
      } else res.status(404).json({ message: "Program is out of this academic year" });
    }
  } else if(moduleType === "TRAINING") {
    let session = await CertificationSession.findById(req.params.classId).populate("trainingPath").lean().exec() // here classId is the sessionId
    if(session){
      let trainingPathWithTrainers = session.trainingPath
      trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules.map(x=>{
        x.trainers = session.examiners
        return x
      })
      trainingPathWithTrainers.classManager = session.examiners[0]
      res.status(200).json(trainingPathWithTrainers)
    }
  }
};

exports.readTrainingModules = async (req, res) => { // adjusted for Parent, trainer, classmanager, student
  let groupId = req.params.classId;
  let periodId = req.params.periodId||req.selectedPeriod;
  let group = await Group.findById(groupId).populate("program.duplicatedTrainingPath").exec()
  if(group){
    let selectedProgram = group.program.find(x=>x.period==periodId)
    if(selectedProgram) {
      let trainingPathWithTrainers = JSON.parse(JSON.stringify(selectedProgram.duplicatedTrainingPath))
      
      trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules.map(x=>{
        x.trainers = selectedProgram.assignment.find(y=>y.trainingModule.equals(x.originalTrainingModule)).trainers
        return x
      })
      trainingPathWithTrainers.classManager = group.classManager
      if (req.role === "Trainer" && !group.classManager.equals(req.userId)) {
        trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules.filter(x=>x.trainers.includes(req.userId))
      } 
      res.status(200).json(trainingPathWithTrainers)
    }
  }
  
  let session = await CertificationSession.findById(groupId).populate("trainingPath").exec()
  if(session){
    let trainingPathWithTrainers = JSON.parse(JSON.stringify(session.trainingPath||session.coursePath))
    trainingPathWithTrainers.trainingModules = trainingPathWithTrainers.trainingModules?.map(x=>{
      x.trainers = session.examiners// todo: examiners
      return x
    })|| trainingPathWithTrainers.courses?.map(x=>{
      x.trainers = session.examiners// todo: examiners
      return x
    })
    trainingPathWithTrainers.classManager = session.trainingManager
    res.status(200).json(trainingPathWithTrainers)
  }
};
exports.getTrainingModuleFromTrainingPath = async (req, res) => {
  let trainingPath = await TrainingPath.findById(req.params.trainingPathId)
    .populate({path: "trainingModules.chosenChapters.chapter"})
  res.status(200).json(trainingPath.trainingModules)
}

exports.readChapters = async (req, res) => {
  let subjectId = req.params.subjectId;
  let loop = true
  let trainingPath = await TrainingPath.findById(req.params.trainingPathId)
    .populate({path: "trainingModules.chosenChapters.chapter"})
  trainingPath.trainingModules.every(sub => {  // modify the loop using find()
    if(sub.originalTrainingModule == subjectId) {
      res.status(200).json(sub.chosenChapters)
      loop = false
      return false
    }
    else return true
  })
  if(loop) res.status(200).json([]) // in case, the subject doesn't exist
};

exports.readContents = async (req, res) => {
  let chapterId = req.params.chapterId;
  let data = []
  let trainingPath = await TrainingPath.findById(req.params.trainingPathId)
    .populate({ path: "trainingModules.chosenChapters.chosenContents.content" })
  looping: for (let sub of trainingPath.trainingModules) {
    for (let chap of sub.chosenChapters) {
      if (chap.chapter == chapterId) {
        if (req.role === "Trainee") {
        data = chap.chosenContents.filter(c => {
          let shouldHide = true;
          if(c.content?.visibleInGroups.find(groupId => groupId?.equals(req.params.groupId))) {
              shouldHide = true;
          }
          else if(c.content?.hiddenInGroups.find(groupId => groupId.equals(req.params.groupId))) {
              shouldHide = false;
          }
          else {
            shouldHide = !c.content?.hideFromTrainees;
          }
          return shouldHide;
        })
        }
        else {
        data = chap.chosenContents
        }
        let event = await Event.find({assignedContent: data.map(x=>x.content?._id)})
        res.status(200).json(data.map(x=>{
          if (x.content) {
              x.content.existsEvent = event.find(y=>y?.assignedContent?.equals(x.content?._id)) 
          }
          return x
      }))

        break looping
      }
    }
  }
};

exports.readContentsWithGrade = async (req, res) => {
  let trainingPath = await TrainingPath.findById(req.params.trainingPathId)
    .populate({ path: "trainingModules.chosenChapters.chosenContents.content" })
  searching: for (let sub of trainingPath.trainingModules) {
    for (let chap of sub.chosenChapters) {
      if (chap.chapter.equals(req.params.chapterId)) {
        let toBeSent = JSON.parse(JSON.stringify(chap.chosenContents.filter(x=>!x.content.hideFromTrainees)))
        let events = Event.find({assignedContent: toBeSent.map(x=>x.content._id)})
        let result = await Result.find({user: req.params.traineeId}, {data:0})
        toBeSent.forEach(con =>{
          result.forEach(x => {
            if (x.content.equals(con.content?._id)) {
              con.content.grade = x.grade;
              con.content.existsEvent = events.find(y=>y?._id.equals(x._id))
            }
          })
        })
        res.status(200).json(toBeSent)
        break searching
      }
    }
  }
};

exports.getMyClasses = async (req, res) => {
  let ecosystem = await Ecosystem.findOne({"subscriptions.modules._id":req.moduleId})
  let moduleType = (ecosystem?.subscriptions?.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId))?.moduleType
  if(req.role === "Parent") {
    let user = await User.findOne({_id:req.userId}, {"details.children": 1})
    if (!user) res.status(404).json({ message: "Not found" });
    else {
      let groups = await Group.find({trainees: { $in: user.details.children } })
        .populate({path: "academicYear"})
      if (!groups) res.status(404).json({ message: "Not found" });
      else res.status(200).json({groups, children: user.details.children});
    }
  } else if (req.role === "Trainer") {
    if (moduleType==="SCHOOL") { // need periodId in this block
      var school_groups = await Group.find({ 
          $or: [{"program.assignment.trainers":  req.userId}, {classManager:  req.userId}], 
        })
        .populate({path: "academicYear"})
        .exec()
      school_groups = school_groups.map(group=>{
        let currentPeriod = group.academicYear.periods.find(p=>new Date(p.startDate)<=new Date() && new Date()<=new Date(p.endDate))
        let selectedProgram = group.program.find(x=>x.period.toString()==currentPeriod?._id.toString())
        if(req.selectedPeriod) selectedProgram = group.program.find(x=>x.period.toString()==req.selectedPeriod)
        if(selectedProgram) {
          if (group.classManager.equals(req.userId)) {
            return group
          } else {
            group.program = group.program
            .map(y=>{
              y.assignment = y.assignment.filter(z=>{
                if(z.trainers.includes(req.userId)) return true
                else return false
              })
              return y
            }).filter(x=>x.assignment.length>0)   
            return group
          }
        }
      })?.filter(x=>x?.program.length>0)
      res.status(200).json(school_groups)
    } else {
      var tc_groups = await Group.find({ $or: [{examiner: req.userId}] }).exec() // need more filtering conditions?
      let groupIds = tc_groups.map(x=>x._id.toString())

      var sessions = await CertificationSession.find({groups: { $in: groupIds }, module: req.moduleId})
        .populate({
          path: "trainingPath",
          select: "name trainingModules",
          populate: [
            { path: "trainingModules.originalTrainingModule", select: "name" },
            { path: "trainingModules.chosenChapters.chapter", select: "name" },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: "title" },
          ],
        })
      .exec()
      res.status(200).json(sessions)
    }
  }
  else if (req.role === "Trainee") {
    let groups = await Group.find({trainees:  req.userId})
      .populate({path: "academicYear"})
    res.status(200).json(groups.filter(x=>x.program?.length>0))

  }
  else if (req.role==="Inspector" || req.role==="Architect") { // to be adjusted more
    let ecosystem = await Ecosystem.findOne({ "subscriptions.modules._id": req.moduleId }, ["_id", "subscriptions.modules._id", "subscriptions.modules.core"])
     .populate({path: "subscriptions.modules.core", select: ['groups'], populate: {path: 'groups', select: ['name', '_id']} })
    if (!ecosystem) return res.status(404).json({ message: "Groups not found." });
    else {
      //Find proper subscription
      let subscription = ecosystem.subscriptions.find((subscription) => {
        return subscription.modules.some(
          (module) => module._id == req.moduleId
        );
      });
      //Find proper module
      let module = subscription.modules.find(
        (module) => module._id == req.moduleId
      );
      let groupsList = module?.core?.groups.map(x => x._id)||[]
      let groups = await Group.find({_id: { $in: groupsList }})
        .populate({path: "academicYear"})
      res.status(200).json(groups.filter(x=>x.program.length>0))
    }
  } else res.status(404).json({ message: "This user role is not adjusted!" });
};

exports.getTrainerClassesFromSessions = async (req, res) => {
  let certificationSessions = await CertificationSession.find({examiners: req.userId, module: req.moduleId})
    .populate({
        path: "trainingPath",
        select: "name trainingModules",
        populate: [
          { path: "trainingModules.originalTrainingModule", select: "name" },
          { path: "trainingModules.chosenChapters.chapter", select: "name" },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: "title" },
        ],
      })
  res.status(200).json(certificationSessions);
}

exports.getTraineeClasses = async (req, res) => {
    let groups = await Group.find({ trainees: req.params.traineeId }).exec() // the new changes in session of having groups will include 
    let sessions = await CertificationSession.find({module: req.moduleId}).populate("groups").exec() // 
    let groupsFromSessions = sessions.map(x=>x.groups.filter(y=>y.trainees.some(z=>z.equals(req.params.traineeId)))).flat() // if the tainee is accessing this function, we can use req.userId
    
    // TODO: check if the trainee is in training center, and update if condition is true
    if (groupsFromSessions.length>0) res.status(200).json(groupsFromSessions)
    else res.status(200).json(groups)
    // res.status(200).json([...groups,...groupsFromSessions])
};

exports.readGroupsByParentId = async (req, res) => {
  let parentId = req.params.parentId
  let parent = await User.findOne({_id:parentId}, {"details.children":1})
  if (!parent?.details.children?.length) res.status(404).json({ message: "No children" });
  else {
    let group = await Group.find({ trainees: { $in: parent.details.children } })
    res.status(200).json(group)
  }
};

exports.getAllExamsForTeacherViaEvent = async (req, res) => {
  let core = await ModuleCore.findOne({moduleId: req.moduleId})
  if(req.role==="Inspector" || req.role==="Architect"){
    if (!core) res.status(404).json({ message: "Not found" });
    else {
      let events = await Event.find({assignedGroup: core.groups, eventType: "Exam"})
        .sort({date: 'descending'})
        .populate([
          {path: "assignedGroup", select: "name"},
          {path: "assignedSubject", select: "name"},
          {path: "assignedChapter", select: "name"},
          {path: "assignedContent", select: "title"}, 
        ])
      res.status(200).json(events);
    }
  } else {
    let events = await Event.find({assignedGroup: core?.groups||null, $or: [{ creator: req.userId}, { assignedTrainer: req.userId}],eventType: "Exam"})
      .sort({date: 'descending'})
      .populate([
        {path: "assignedGroup", select: "name"},
        {path: "assignedSubject", select: "name"},
        {path: "assignedChapter", select: "name"},
        {path: "assignedContent", select: "title"}, 
      ])
    res.status(200).json(events);
  }
}
exports.getAllExamsForSession = async (req, res) => {

  let user = await User.findOne({ _id: req.userId })
  let permissions = await user.getPermissions()

  let query;// Query that will be used to find exams in database

  // Find session in database
  let session = await CertificationSession.findById(req.params.currentSessionId, { examiners: 1 })

  // Check if user is a examiner 
  let isExaminer = session?.examiners?.includes(req.userId)

  if (isExaminer) {
    query = { assignedSession: req.params.currentSessionId, eventType: "Exam" }
  }
  else if (permissions.bcTrainer.access) {
    query = { assignedSession: req.params.currentSessionId, $or: [{ creator: req.userId }, { assignedTrainer: req.userId }], eventType: "Exam" }
  } else if (permissions.bcCoach.access) {
    let groups = await Group.find({ trainees: { $elemMatch: { $eq: req.userId } } })
    query = { assignedSession: req.params.currentSessionId, assignedGroup: groups.map(x => x._id.toString()), eventType: "Exam" }
  } else {
    query = { assignedSession: req.params.currentSessionId, creator: req.userId, eventType: "Exam" }
  }

  if (query) {
    let events = await Event.find(query)
      .sort({ date: 'descending' })
      .populate([
        { path: "assignedGroup", select: "name" },
        { path: "assignedSubject", select: "name" },
        { path: "assignedChapter", select: "name" },
        { path: "assignedContent", select: "title" },
      ])
    res.status(200).send(events);
  } else res.status(200).send([]);
}

exports.getAllExamsForParentViaEvent = async (req, res) => {
  let parent = await User.findOne({_id: req.userId},{"details.children":1})
  if (!parent?.details.children?.length) res.status(404).json({ message: "No children" });
  else {
    let groups = await Group.find({ trainees: { $in: parent.details.children } })
    if (!groups) res.status(404).json({ message: "No Groups" });
    else {
      let events = await Event.find({assignedGroup: groups.map(x=>x._id.toString()), eventType: "Exam"})
        .sort({date: 'descending'})
        .populate([
          {path: "assignedGroup", select: "name"},
          {path: "assignedSubject", select: "name"},
          {path: "assignedChapter", select: "name"},
          {path: "assignedContent", select: "title"}, 
        ])
      res.status(200).json(events);
    }
  }
};

exports.getExamEvents = async (req, res) => {
  let event = await Event.find({creator: req.userId, eventType: "Exam"})
  res.status(200).json(event);
}

exports.getExamsListOfTrainee = async (req, res) => {
  let group = await Group.findById(req.params.groupId)
  if (!group) res.status(404).json({ message: "Not found" });
  else {
    let result = await Result.find({user: group.trainees, content: req.params.contentId}, {data:0})
      .populate({path: "user", select: "name surname"})  
    let traineesWithResult = result.map(x=>x.user._id)
    let traineesWithoutResult = group.trainees.filter(usr=>!traineesWithResult.some(r=>r.equals(usr)))
    let remainingTrainees = await db.user.find({_id: traineesWithoutResult}, {name:1, surname:1}).exec()
    remainingTrainees.forEach(user=>{
      result.push({user})
    })
    res.status(200).json(result);
  }
}
exports.getExams = async (req, res) => {
  let condition = { eventType: "Exam" }
  if (req.params.trainingModuleId) condition.assignedSubject = req.params.trainingModuleId
  if (req.role=="Trainee"){
    let groups = await Group.find({trainees: { $elemMatch: {$eq: req.userId} }})
    condition.assignedGroup = groups.map(x=>x._id.toString())
  } 
  else if(req.role=="Parent"){
    let user = await User.findOne({_id: req.userId})
    if (!user) res.status(404).json({ message: "Not found" });
    else {
      let groups = await Group.find({trainees: {$in: user.details.children} })
      condition.assignedGroup = groups.map(x=>x._id.toString())
    }
  }
  else if(req.role==="Inspector" || req.role==="Architect"){
    let core = await ModuleCore.findOne({moduleId: req.moduleId})
    if (!core) res.status(404).json({ message: "Not found" });
    else {
      condition.assignedGroup = core.groups
    }
  }
  else {
    condition.creator = req.userId
  }
  
  let events = await Event.find(condition)
    .sort({date: 'descending'})
    .populate([
      { path: "assignedGroup" , select: "name"},
      { path: "assignedSubject" , select: "name"},
      { path: "assignedChapter" , select: "name"},
      { path: "assignedContent" , select: "title hideFromTrainees contentType"}, 
    ])

  // Transform events to objects to enable modifications
  let modifiedEvents = [];
  for (let event of events){
    let modifiedEvent = event.toObject();
    modifiedEvents.push(modifiedEvent)
  }
  await eventUtils.assignResults(modifiedEvents, (req.role=="Trainee" ? req.userId : undefined))
  eventUtils.assignStatuses(modifiedEvents, (req.role=="Trainee" ? false : true))

  res.status(200).json(modifiedEvents);
}

exports.getHomeworks = async (req, res) => {
  let condition = { eventType: "Homework" }

  if (req.params.trainingModuleId) condition.assignedSubject = req.params.trainingModuleId
  if (req.role=="Trainee"){
    let groups = await Group.find({trainees: { $elemMatch: {$eq: req.userId} }})
    condition.assignedGroup = groups.map(x=>x._id.toString())
  } 
  else if(req.role=="Parent"){
    let user = await User.findOne({_id: req.userId})
    if (!user) res.status(404).json({ message: "Not found" });
    else {
      let groups = await Group.find({trainees: {$in: user.details.children} })
      condition.assignedGroup = groups.map(x=>x._id.toString())
    }
  }
  else if(req.role==="Inspector" || req.role==="Architect"){
    let core = await ModuleCore.findOne({moduleId: req.moduleId})
    if (!core) res.status(404).json({ message: "Not found" });
    else {
      condition.assignedGroup = core.groups
    }
  }
  else {
    condition.creator = req.userId
  }
  let events = await Event.find(condition)
    .sort({date: 'descending'})
    .populate([
      { path: "assignedGroup" , select: "name"},
      { path: "assignedSubject" , select: "name"},
      { path: "assignedChapter" , select: "name"},
      { path: "assignedContent" , select: "title hideFromTrainees contentType"}, 
    ])

  // Transform events to objects to enable modifications
  let modifiedEvents = [];
  for (let event of events){
    let modifiedEvent = event.toObject();
    modifiedEvents.push(modifiedEvent)
  }
  await eventUtils.assignResults(modifiedEvents, (req.role=="Trainee" ? req.userId : undefined))
  eventUtils.assignStatuses(modifiedEvents, (req.role=="Trainee" ? false : true))

  res.status(200).json(modifiedEvents);
}

exports.getTraineeEventExamByContent = async (req, res) => {
  let event = await Event.findOne(
    { eventType: "Exam", assignedContent: req.params.contentId })
    if (!event) res.status(201).json(null);
    else res.status(200).json(event._id);
}
exports.getExamListOfSubjectOldWay = async (req, res) => {
  let classId = req.params.classId
  let trainingModuleId = req.params.trainingModuleId
  let group = await Group.findById(classId).populate([
    { path: "trainees", select: 'name surname' },
    { path: "academicYear" },
  ]).exec();
  let period = group.academicYear.periods.find(p => new Date(p.startDate) <= new Date() && new Date() <= new Date(p.endDate));
  if(req.selectedPeriod) period = group.academicYear.periods.find(p => p._id.toString() == req.selectedPeriod);
  let dateOfOnGoingPeriod = period?.startDate||null;
  if(group) {
    let exams = await Event.find({assignedGroup:classId, assignedSubject: trainingModuleId, eventType: "Exam",  createdAt: { $gt: dateOfOnGoingPeriod}  })
    let results = await Result.find({user: group.trainees, event: exams.map(x=>x._id)}, {data:0})
    let traineesWithResults = group.trainees.map(trainee=>{
      var grades = results.filter(x=>x.user.equals(trainee._id))
      grades = JSON.parse(JSON.stringify(grades))
      grades = grades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1})).filter(x=>(x.published||!x.content)&&x.grade!='-')
      let list = grades.map(x=>x.event);
      let emptyGrades = exams.filter(x=> !list.find(y=>x._id.equals(y))).map(z=>{
        return(
        {
          _id: new ObjectId(),
          event: z._id,
          grade: "-",
          user: trainee._id,
        })
      })
      emptyGrades = emptyGrades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1}))
      return {
        // average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)+s),0)/(grades.length)).toFixed(2): 0,
        average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)*i.coefficient+s),0)/(grades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0,
        trainee,
        grades: [... grades, ... emptyGrades]
      }
    })
    let exams1 = exams.map(exam=>{
      if (exam.addedFromGradebook || !exam.assignedContent) return exam
      else {
        let grades = traineesWithResults.map(x=>x.grades.find(y=>exam._id.equals(y.event)))
        if (!grades.some(x=>x.published)) return {...exam._doc, hide: true}
        else return exam
      }
    })
    res.status(200).json({exams:exams1, trainees: traineesWithResults});
  } else {
    // classId is either sessionId or groupId based on situation;; here it is sessionId
    let session = await CertificationSession.findById(classId).populate([
      { path: "trainees", select: ['name', 'surname'] },
      { path: "trainingPath", populate: [
        { path: "trainingModules.chosenChapters.chosenContents.content", select: "title durationTime level contentType cocreators" },
      ]}
    ]).exec();
    if (session) {
      let exams = (session.trainingPath.trainingModules.find(tm=>tm.originalTrainingModule.equals(trainingModuleId)))?.chosenChapters.map(ch=>ch.chosenContents.map(c=>c.content).filter(x=>x?.contentType==="TEST")).flat()
      exams = exams.map(x=>({_id:x._id,name:x.title, assignedContent:x._id}))
      let results = await Result.find({user: session.trainees, content: exams.map(y=>y._id)}, {data:0})
        .populate({ path: "content" , select: "title"})
      let traineesWithResults = session.trainees.map(trainee=>{
        let grades = results.filter(x=>x.user.equals(trainee._id))
        let list = grades.map(x=>x.content);
        let emptyGrades = exams.filter(x=> !list.find(y=>y.equals(x._id))).map(z=>{
          return(
          {
            _id: new ObjectId(),
            event: z._id,
            grade: "-",
            user: trainee._id,
          })
        })
        return {
          average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)+s),0)/(grades.length)).toFixed(2): 0,
          trainee,
          grades: [... grades, ... emptyGrades]
        }
      })
      res.status(200).json({exams, trainees: traineesWithResults});
    }
  }


}

exports.getExamListOfCourse = async (req, res) => {
  let groupId = req.params.groupId
  let courseId = req.params.courseId
  let group = await Group.findById(groupId).populate([{ path: "trainees", select: ['name', 'surname'] }]).exec();
  let exams = await Event.find({assignedCourse:courseId, eventType: "Exam"})
  if (await db.course.findOne({"chosenChapters.chapter": exams.assignedChapter}, {_id:1})) {
    let results = await Result.find({user: group.trainees, event: exams.map(x=>x._id)}, {data:0})
    let traineesWithResults = group.trainees.map(trainee=>{
      var grades = results.filter(x=>x.user.equals(trainee._id))
      grades = JSON.parse(JSON.stringify(grades))
      grades = grades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1})).filter(x=>(x.published||!!!x.content)&&x.grade!='-')
      let list = grades.map(x=>x.event);
      let emptyGrades = exams.filter(x=> !list.find(y=>x._id.equals(y))).map(z=>{
        return(
        {
          _id: new ObjectId(),
          event: z._id,
          grade: "-",
          user: trainee._id,
        })
      })
      emptyGrades = emptyGrades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1}))
      return {
        // average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)+s),0)/(grades.length)).toFixed(2): 0,
        average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)*i.coefficient+s),0)/(grades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0,
        trainee,
        grades: [... grades, ... emptyGrades]
      }
    })
    res.status(200).json({exams, trainees: traineesWithResults});
  }
}
exports.getExamListOfSubject = async (req, res) => {
  let classId = req.params.classId
  let periodId = req.params.periodId||req.selectedPeriod
  let trainingModuleId = req.params.trainingModuleId
  let group = await Group.findById(classId).populate([{ path: "trainees", select: ['name', 'surname'] }]).exec();
  let academicYear = await AcademicYearRef.findOne({"periods._id": periodId}).exec()
  let period = academicYear.periods.id(periodId);
  
  if(group) {
    let exams = await Event.find({assignedGroup:classId, assignedSubject: trainingModuleId, eventType: "Exam",  date: { $gte: period.startDate, $lte: period.endDate}})
    let results = await Result.find({user: group.trainees, event: exams.map(x=>x._id), published: true}, {data:0})
    let traineesWithResults = group.trainees.map(trainee=>{
      var grades = results.filter(x=>x.user.equals(trainee._id))
      grades = JSON.parse(JSON.stringify(grades))
      grades = grades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1})).filter(x=>(x.published||!x.content)&&x.grade!='-')
      let list = grades.map(x=>x.event);
      let emptyGrades = exams.filter(x=> !list.find(y=>x._id.equals(y))).map(z=>{
        return(
        {
          _id: new ObjectId(),
          event: z._id,
          grade: "-",
          user: trainee._id,
        })
      })
      emptyGrades = emptyGrades.map(r=>({...r, coefficient: (exams.find(e=>e._id.equals(r.event)))?.examCoefficient||1}))
      return {
        // average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)+s),0)/(grades.length)).toFixed(2): 0,
        average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)*i.coefficient+s),0)/(grades.reduce((s2,i2)=>(i2.coefficient+s2),0))).toFixed(2): 0,
        trainee,
        grades: [... grades, ... emptyGrades]
      }
    })
    let exams1 = exams.map(exam=>{
      if (exam.addedFromGradebook || !exam.assignedContent) return exam
      else {
        let grades = traineesWithResults.map(x=>x.grades.find(y=>exam._id.equals(y.event)))
        if (!grades.some(x=>x.published)) return {...exam._doc, hide: true} // in some cases "hide: true" is hiding results (column in gradebook) for trainers even when grades are published.. but diplaying them for trainees/parents anyway 
        else return exam
      }
    })
    res.status(200).json({exams: exams1, trainees: traineesWithResults});
  } else {
    // classId is either sessionId or groupId based on situation;; here it is sessionId
    let session = await CertificationSession.findById(classId).populate([
      { path: "groups", 
        populate: [
          { path: "trainees",
          select: ['name', 'surname']
          }
        ]
      },
      { path: "trainingPath", populate: [
        { path: "trainingModules.chosenChapters.chosenContents.content", select: "title durationTime level contentType cocreators" },
      ]},
      {
        path: "coursePath", 
        select: "name courses", 
        populate: { 
          path: "courses", 
          populate: { 
            path: "chosenChapters.chosenContents.content", 
            select: "title durationTime level contentType cocreators"
          } 
        } 
      },
    ]).exec();
    if (session) {
      let exams = session.trainingPath?.trainingModules.find(tm=>tm.originalTrainingModule.equals(trainingModuleId))??
                  session.coursePath?.courses.find(cr=>cr.origin?.equals(trainingModuleId)||cr._id.equals(trainingModuleId)) // here in this line, courseId is disguised as trainingModuleId
      exams = exams?.chosenChapters.map(ch=>ch.chosenContents.map(c=>c.content).filter(x=>x?.contentType==="TEST")).flat()
      
      exams = exams?.map(x=>({_id:x._id,name:x.title, assignedContent:x._id}))
      let trainees = session.groups.map(g=>g.trainees).flat()
      let results = await Result.find({user: trainees, content: exams?.map(y=>y._id)}, {data:0})
        .populate({ path: "content" , select: "title"})
      let traineesWithResults = trainees.map(trainee=>{
        let grades = results.filter(x=>x.user.equals(trainee._id))
        let list = grades.map(x=>x.content);
        let emptyGrades = exams?.filter(x=> !list.find(y=>y.equals(x._id))).map(z=>{
          return(
          {
            _id: new ObjectId(),
            event: z._id,
            grade: "-",
            user: trainee._id,
          })
        })||[]
        return {
          average: grades?.length>0? Number(grades.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0||0)+s),0)/(grades.length)).toFixed(2): 0,
          trainee,
          grades: [... grades, ... emptyGrades]
        }
      })
      res.status(200).json({exams, trainees: traineesWithResults});
    }
  }
};


exports.countOnlineClasses = async (req, res) => {
  let user = req.params.userId? { creator: req.params.userId } : {creator: req.userId };
  let count = await db.event.countDocuments({ ...user, eventType: "Online Class", $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]})
  res.status(200).json({count})
}

exports.countExams = async (req, res) => {
  let user = req.params.userId? { creator: req.params.userId } : {creator: req.userId };
  let count = await db.event.countDocuments({ ...user, eventType: "Exam", $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}] })
  res.status(200).json({count})
}

exports.countHomeworks = async (req, res) => {
  let user = req.params.userId? { creator: req.params.userId } : {creator: req.userId };
  let count = await db.event.countDocuments({ ...user, eventType: "Homework", $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}] })
  res.status(200).json({count})
}

exports.countOnlineClassesInModule = async (req, res) => {
let conditions = {$or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]};
let core = await ModuleCore.findOne({moduleId: req.moduleId})
conditions.assignedGroup = { $in: core?.groups||[] }
let count = await db.event.countDocuments({ ...conditions, eventType: "Online Class" })
res.status(200).json({count})
}

exports.countExamsInModule = async (req, res) => {
let conditions = {$or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]};
let core = await ModuleCore.findOne({moduleId: req.moduleId})
conditions.assignedGroup = { $in: core?.groups||[] }
let count = await db.event.countDocuments({ ...conditions, eventType: "Exam" })
res.status(200).json({count})
}

exports.countHomeworksInModule = async (req, res) => {
let conditions = {$or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}]};
let core = await ModuleCore.findOne({moduleId: req.moduleId})
conditions.assignedGroup = { $in: core?.groups||[] }
let count = await db.event.countDocuments({ ...conditions, eventType: "Homework" })
res.status(200).json({count})
}

exports.numberOfUpcomingEvents = async (req, res) => {
  let userId = req.userId;
  if (req.role === "Trainee"){
    let group = await Group.find({trainees: { $elemMatch: {$eq: userId} }})
    let event = await Event.find({assignedGroup:  { $in: group.map(x => x._id)}, $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}], "date": { $gt: new Date(Date.now()) } })
    res.status(200).json(event)
  }
  else {
    let event = await Event.find({assignedTrainer: userId, $or: [{ addedFromGradebook:  { $exists: false }}, {addedFromGradebook: false}], "date": { $gt: new Date(Date.now()) }})
    res.status(200).json(event)
  }

}


// Start meeting(video-call) associated with requested event
// params:
//   eventId - id of event
exports.startMeeting = async (req, res) => {
  let event = await Event.findOne({_id: req.params.eventId})
  // ### 1 - CUSTOM MEETING URL ################################################################
  if (req.body.meetingUrl){
    Event.findOneAndUpdate(
      { _id: req.params.eventId },
      { $set: {meetingUrl: req.body.meetingUrl, meetingDetails: req.body.meetingDetails} },
      { runValidators: true }, (err, event) =>{
        if (err) res.status(500).json({ message: err });
        else if (!event) res.status(404).json({ message: "Event was not found" });
        else {
          propagateEventNotification(req.params.eventId, "MEETING_STARTED")
          res.status(200).json()
        }

      })
  // ### 2 - DEFAULT BIGBLUEBUTTON INTEGRATION ##################################################
  }else{ 
    let result = await eventUtils.startBigBlueButtonMeeting(req.params.eventId)
    if (result.status){
      propagateEventNotification(req.params.eventId, "MEETING_STARTED")
      res.status(200).json(result.message)
    }else res.status(result.code).json({ message: result.message });
  }
}



// End meeting(video-call) associated with requested event
// params:
//   eventId - id of event
exports.endMeeting = async (req, res) => {
  let event = await Event.findOne({_id: req.params.eventId})

  // ### 1 - CUSTOM MEETING URL ################################################################
  if (event.meetingUrl){
    Event.findOneAndUpdate(
      { _id: req.params.eventId },
      { $set: {meetingUrl: undefined, meetingDetails: undefined} },
      { runValidators: true }, (err, event) =>{
        if (err) res.status(500).json({ message: err });
        else if (!event) res.status(404).json({ message: "Event was not found" });
        else {
          res.status(200).json()
        }

      })
  // ### 2 - DEFAULT BIGBLUEBUTTON INTEGRATION ##################################################
  } else{
    let result = await eventUtils.endBigBlueButtonMeeting(req.params.eventId)
    if (result.status)
      res.status(200).json(result.message)
    else res.status(result.code).json({ message: result.message });
  }
}



// Get link for meeting(video-call) associated with requested event
// params:
//   eventId - id of event
exports.getMeetingUrl = async (req, res) => {
  let result = await eventUtils.getBigBlueButtonMeetingLink(req.params.eventId, req.moduleId, req.userId)
  if (result.status)
    res.status(200).json(result.link)
  else res.status(result.code).json({ message: result.message });
}

// Get details about meeting(video-call) associated with requested event
// params:
//   eventId - id of event
exports.getMeetingDetails = async (req, res) => {
  let result = await eventUtils.getBigBlueButtonMeetingDetails(req.params.eventId)
  if (result.status)
    res.status(200).json(result.details)
  else res.status(result.code).json({ message: result.message });
}
