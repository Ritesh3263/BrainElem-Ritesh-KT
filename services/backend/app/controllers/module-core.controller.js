const ObjectId = require("mongodb").ObjectId;
const Group = require("../models/group.model");
const User = require("../models/user.model");
const Ecosystem = require("../models/ecosystem.model");
const ModuleCore = require("../models/module_core.model");
const TrainingPath = require("../models/training_path.model");
const Result = require("../models/result.model");
const TrainingModule = require("../models/training_module.model");
const Chapter = require("../models/chapter.model");
const Content = require("../models/content.model");
const SubjectSession = require("../models/subject_session.model");


const db = require("../models");
var bcrypt = require("bcryptjs");
const GradingScaleRef = require("../models/grading_scale_ref.model");
const Event = require("../models/event.model");
const AcademicYearRef = require("../models/academic_year_ref.model");
const CategoryRef = require("../models/category_ref.model");
const CertificationSession = require("../models/certification_session.model");
const Company = require("../models/company.model");
const Team = require("../models/team.model");

const moduleUtils = require("../utils/module");
const uniqBy = (arr, fn, set = new Set) => arr.filter(el => (v => !set.has(v) && set.add(v))(typeof fn === "function" ? fn(el) : el[fn])); // a function to filter unique objectIds
/////////////////  MODULE SETUP  ////////////////////

exports.readModuleCore = async (req, res) => {
  let moduleId = req.moduleId;
  let modulecore = await ModuleCore.findOne({moduleId: moduleId})
    .populate([
      {
        path: "trainingModules",
        populate: [{ path: "chapters" },{ path: "category" },{ path: "categories" }],
      },
      {
        path: "trainingPaths",
        populate: [
          { path: "assignedYear", select: ["name","periods"]},
          { path: "trainingModules.chosenChapters.chapter", select: ["name","durationTime"],
            // populate: {path: "creator", select: ["username","details"]},
          },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title","durationTime","level","contentType","cocreators"],
            // populate: {path: "cocreator", select: ["username","details"]},
          },
          {
            path: "trainingModules.originalTrainingModule", select: ["name","category","hours","estimatedTime"],
            populate: [
              { path: "category", select: ["name","description"], },
            ],
          },
        ],
      },
      { path: "categories", select: ["name","description"] },
      { path: "academicYears", select: ["name","periods"] },
      { path: "rolePermissions", select: ["name","picture","permissions"] },
      { path: "gradingScales", select: ["name","items","createdAt"] },
      { path: "defaultGradingScale", select: ["name"] },
      { path: "groups",
        populate: [
          { path: "classManager", select: ["username","name","surname","details"] },
          { path: "academicYear", select: ["name","periods"] },
          { path: "trainees", select: ["username","name","surname","details"] },
          { path: "program.trainingPath", select: ["name"] }, // original `trainingPath` is here as reference for `duplicatedTrainingPath` 
          { path: "program.duplicatedTrainingPath", select: ["name"] }, 
          { path: "program.assignment.trainingModule", select: ["name"] },
          { path: "program.assignment.trainers", select: ["username","name","surname","details"] },
        ]
      },
    ])
  if (!modulecore) res.status(404).send({ message: "Not found" });
  else res.status(200).json(modulecore);
};

exports.updateModuleCore = async (req, res) => {
  let moduleCoreId = req.params.moduleCoreId;
  var unsetScale = {};
  if(req.body.defaultGradingScale == 'empty') {
    delete req.body.defaultGradingScale;
    unsetScale = {defaultGradingScale: 1 };
  }
  let modulecore = await ModuleCore.findOneAndUpdate(
    { moduleId: moduleCoreId },
    { $set: req.body, $unset: unsetScale },
    { runValidators: true })
  if (!modulecore) res.status(404).send({ message: "Not found" });
  else res.status(200).json({ message: "Updated successfully" });
};

exports.addMSAcademicYear = async (req, res) => {
  let moduleId = req.moduleId;
  let yearId = new ObjectId();
  db.academicYearRef.insertMany([{...req.body, ...{_id: yearId}}], (err) => { if (err) {
    res.status(409).send(err);
  }})
  // db.academicYearRef.insert( {...req.body, ...{_id: yearId}} ) somehow insert many doesn't work: "insert is not a function"

  await ModuleCore.findOneAndUpdate(
    { moduleId: moduleId },
    { $push: { academicYears: yearId } },
    { runValidators: true })
  res.status(200).json({ message: "Updated successfully" });
};

exports.updateMSAcademicYear = async (req, res) => {
  await AcademicYearRef.findOneAndUpdate(
    { _id: req.params.yearId },
    { $set: req.body },
    // { arrayFilters: [ { "_id": yearId } ] },
    { runValidators: true },(err)=>{
        if(err){
          res.status(409).send(err);
        }
      })
  res.status(200).json({ message: "Updated successfully" });
};

exports.removeMSAcademicYear = async (req, res) => {
  await AcademicYearRef.findOneAndDelete({ _id: req.params.yearId })
  res.status(200).json({ message: "Deleted successfully" });
};

exports.addMSSubject = async (req, res) => {
  let moduleId = req.params.moduleId;
  let chapters = req.body.chapters;
  if(req.body.categories){
    req.body.categories.map(x=>x._id)
      // TODO , before we update the rest of the places in the code, take 1st category as main one,
        req.body.category = req.body.categories[0] 
      // possibly, finally, subject will have only one category, like in past
      // delete req.body.category; TODO: to be unblocked, after the line above is gone
  }
  const trainingModule = new TrainingModule(req.body);
  trainingModule.chapters.map(x=>x._id)
  trainingModule.module = req.moduleId;
  trainingModule.save()
  Chapter.bulkWrite(
    chapters.map((chapter) => 
      ({updateOne: {
        filter: { _id : chapter._id },
        update: { $set: chapter },
        upsert: true
      }})
    )
  )
  await ModuleCore.findOneAndUpdate(
    { moduleId: moduleId },
    { $push: { trainingModules: trainingModule._id } },
    { runValidators: true });
  res.send({ message: "Subject was saved successfully!" });
};

exports.updateMSSubject = async (req, res) => {
  let chapters = req.body.chapters;
  req.body.chapters.map(x=>x._id)

  await TrainingModule.findOneAndUpdate(
    { "_id": req.params.subjectId },
    { $set:  req.body },
    { runValidators: true })
  Chapter.bulkWrite(
    chapters.map((chapter) => 
      ({updateOne: {
        filter: { _id : chapter._id },
        update: { $set: chapter },
        upsert: true
      }})
    )
  )
  res.status(200).json({ message: "Updated successfully" });
};

exports.removeMSSubject = async (req, res) => {
  await TrainingModule.findByIdAndRemove(req.params.subjectId)
  res.send({ message: "Deleted successfully!" });
};

exports.addMSCategory = async (req, res) => {
  let moduleId = req.moduleId;
  let categoryId = new ObjectId();
  
  
  let categoryRef = new db.categoryRef({
    _id: categoryId, 
    name: req.body.name,
    module: req.moduleId,
    description: req.body.description
  });
  categoryRef.save()
  await ModuleCore.findOneAndUpdate(
    { moduleId: moduleId },
    { $push: { categories: categoryId } },
    { runValidators: true });
  res.status(200).json({ message: "Updated successfully" });
};

exports.updateMSCategory = async (req, res) => {
  req.body.module = req.moduleId;
  await CategoryRef.findOneAndUpdate(
    { "_id": req.params.categoryId },
    { $set: req.body },
    { runValidators: true });
  res.status(200).json({ message: "Updated successfully" });
};

exports.removeMSCategory = async (req, res) => {
  await CategoryRef.deleteOne({ _id: req.params.categoryId })
  res.send({ message: "Deleted successfully!" })
};

const duplicateContent = async (contentId, moduleId) => {
  let content = await Content.findById(contentId);
  let newContent = new Content({
    ...content.toObject(),
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
  


// need forEach on array, and add, each class object //
exports.addMSClasses = async (req, res) => {
  // not duplicating here because the details are empty
  let groups = []
  let groupIDs = []
  for (let i = 0; i < req.body.data; i++) {
    let groupId = new ObjectId();
    groupIDs.push(groupId)
    groups.push(new Group({ 
      _id: groupId,
      module: req.moduleId, 
      name: "New empty class",
    }))
  }
  
  Group.insertMany(groups)
  await ModuleCore.findOneAndUpdate(
    { moduleId: req.moduleId },
    { $push: { groups: { $each: groupIDs } } },
    { runValidators: true })
  res.status(200).json({ message: "Updated successfully" });
};

// reset trainingPath (i.e. curriculum) to its base state //
exports.resetTrainingPath = async (req, res) => {
  let trainingPathId = req.body.trainingPathId
  let trainingModuleId = req.body.trainingModuleId
  let tp = await TrainingPath.findById(trainingPathId)
    .populate([
      { path: 'origin',
        populate: [
          // { path: "trainingModules.originalTrainingModule" },
          { path: "trainingModules.chosenChapters.chapter" },
          { path: "trainingModules.chosenChapters.chosenContents.content" },
        ]
      }
    ]).lean().exec();
  let otp = tp.origin
  let otmContentTree = otp.trainingModules
  let tmOri = []
  let newName = null
  let originalTrainingModule = null
  if (trainingModuleId) {
    let temp = tp.trainingModules.find(x=>x.originalTrainingModule.toString() == trainingModuleId)
    newName = temp.newName
    originalTrainingModule = temp.originalTrainingModule
    otmContentTree = otmContentTree.filter(x=>x.newName == newName) // weak condition, but works for now
  } else {
    for (let i = 0; i < tp.trainingModules.length; i++) {
      tmOri.push({name: tm.newName, ori:tm.originalTrainingModule})
      let tm = otmContentTree[i]
      if (tm.originalTrainingModule) {
      }
    }
  }
  //// here, 
  //// tp is the training path we want to reset
  //// otp is the original training path 
  //// otm is the original training module
  //// dtm is the duplicate training module
  let deletedChapterIds = tp.trainingModules.flatMap(x=>x.chosenChapters.map(y=>y.chapter))
  let deletedContentIds = tp.trainingModules.flatMap(x=>x.chosenChapters.flatMap(y=>y.chosenContents.map(z=>z.content)))
  
  let newChapters = []
  let newContents = []
  
  let dtmContentTree = trainingModuleId? 
  tp.trainingModules.map(ctm=>{
    console.log("having tmId",ctm.originalTrainingModule.toString() != trainingModuleId.toString())
    console.log(trainingModuleId.toString()+" == "+ ctm.originalTrainingModule.toString())
    if (ctm.originalTrainingModule.toString() != trainingModuleId.toString()) {
      return ctm
    } else {
      let newTm = otmContentTree[0]
      return {
        ...newTm,
        originalTrainingModule: originalTrainingModule,
        chosenChapters: newTm.chosenChapters.map(och => {
          let chapId = new ObjectId()
          newChapters.push({
            ...och.chapter,
            _id: chapId,
          })
          return {
            chapter: chapId,
            chosenContents: och.chosenContents.map(occ => {
              let contentId = new ObjectId()
              newContents.push({
                ...occ.content,
                _id: contentId,
              })
              return {
                content: contentId,
              }
            })
          }
        })
      }
    }
  }):otmContentTree.map(otm => {
    let tempOri = tmOri.find(x=>x.name == otm.newName)
    return {
      ...otm,
      originalTrainingModule: tempOri.ori,
      chosenChapters: otm.chosenChapters.map(och => {
        let chapId = new ObjectId()
        newChapters.push({
          ...och.chapter,
          _id: chapId,
        })
        return {
          chapter: chapId,
          chosenContents: och.chosenContents.map(occ => {
            let contentId = new ObjectId()
            newContents.push({
              ...occ.content,
              _id: contentId,
            })
            return {
              content: contentId,
            }
          })
        }
      })
    }
  })

  TrainingPath.findOneAndUpdate(
    { "_id": trainingPathId },
    { $set: { trainingModules: dtmContentTree } },
    { runValidators: true })
  .exec(async err => {
    if (err) {
      console.log(err)
      res.status(500).send({ message: "Error" });
    } else {
      try{
        Chapter.insertMany(newChapters)
      } catch (err) {
        console.log(err)
      }
      try{
        Content.insertMany(newContents)
      } catch (err) {
        console.log(err)
      }
      try{
        Chapter.deleteMany({_id: {$in: deletedChapterIds}})
      } catch (err) {
        console.log(err)
      }
      try{
        Content.deleteMany({_id: {$in: deletedContentIds}})
      } catch (err) {
        console.log(err)
      }

      res.status(200).json({ message: "Updated successfully" });
    }
  })
};

exports.saveContentOrder = async (req, res) => {

  // subject
  let duplicatedTrainingModuleId = req.body.trainingModuleId
  // chapter management
  let allSelectedChapters = req.body.assignedChapters.filter(x=>x.isSelected)
  allSelectedChapters.map(x=>{
    if (!x._id) {
      x._id = new ObjectId()
    }
    return x
  })
  let chaptersToCreate = allSelectedChapters.filter(x=>x.isNew)
  // let currentContentIds = allSelectedChapters.flatMap(x=>x.assignedContents.map(y=>y._id))
  // content management
  let initialContents = req.body.initialContents
  // let contnetsToBeDeleted = initialContents.filter(x=>!currentContentIds.includes(x))

  let newChapters = chaptersToCreate.map((chapter,i)=>({
      ...chapter,
      otherContentsByTrainers: [{
        trainer: req.userId,
        trainingModule: duplicatedTrainingModuleId,
        contents: [],
      }],
      creator: req.userId,
      addedByTrainer: true,
  }))

  await Chapter.bulkWrite(newChapters.map(chapter=>({
    updateOne: {
      filter: { _id: chapter._id },
      update: chapter,
      upsert: true
    }
  })))


  let trainingPath = await TrainingPath.findById(req.body.trainingPathId) // duplicatedTrainingPathId
  if (!trainingPath) res.status(404).send({ message: "Not found" });
  else {
    trainingPath.trainingModules = await Promise.all(trainingPath.trainingModules.map(async x=>{
      if(x.originalTrainingModule.equals(duplicatedTrainingModuleId)){
        // const originalChapters = x.chosenChapters
        x.chosenChapters = await Promise.all(allSelectedChapters.map(async cx=>{
          // let originalChapter = originalChapters.find(ox=>ox.chapter.equals(cx._id))
          return {
            chapter: cx._id,
            chosenContents: cx.assignedContents?.length>0 ? await Promise.all(cx.assignedContents.map(async c => {
              if(c.new){
                let oldContentId = c._id
                let oldContent = await Content.findById(oldContentId).lean()
                if(!initialContents.includes(oldContentId)){
                  return {content: oldContent}
                } else return {content: c}
              } else return {content: c}
            })):[]
          }
        }))
        x.chosenChapters.map(async ch=>{
          await Chapter.findById(ch.chapter, async (err, chapter) => {
            if (err) console.error(err.message);
            else {
              let updatingIndex = chapter.otherContentsByTrainers.findIndex(x=>x.trainer.equals(req.userId))
              if(updatingIndex>-1){
                chapter.otherContentsByTrainers[updatingIndex].contents = ch.chosenContents.map(c=>c.content._id)
                chapter.otherContentsByTrainers[updatingIndex].trainingModule = duplicatedTrainingModuleId
              } else {
                chapter.otherContentsByTrainers.push({
                  trainer: req.userId,
                  trainingModule: duplicatedTrainingModuleId,
                  contents: ch.chosenContents.map(c=>c.content._id),
                })
              }
              await chapter.save()
            }
          })
        })
      // n.b. we are no longer deleting contents as we are keeping chapters and corresponding list of contents
      }
      return x
    }))
    trainingPath.save()
    res.status(200).json({ message: "Updated successfully" });
  }
  // delete unused duplicated contents
  // await Content.deleteMany({_id: contnetsToBeDeleted, origin: {$exists: true}}).exec()
};


exports.updateMSClass = async (req, res) => {
  let groupId = req.params.classId;
  let prevTrainingPaths = req.body.prevTrainingPaths

  prevTrainingPaths && prevTrainingPaths.forEach(async prevTP=>{
    if(prevTP){
      let tp = await TrainingPath.findById(prevTP)
      if (tp) {
        tp.trainingModules.forEach(async tm=>{
          if(!tm.origin){
            await TrainingModule.findByIdAndDelete(tm.originalTrainingModule, ()=>{})
            tm.chosenChapters.forEach(async ch=>{
              if(!ch.origin){
                await Chapter.findByIdAndDelete(ch.chapter, ()=>{})
                ch.chosenContents.forEach(async c=>{
                  if(!c.origin) await Content.findByIdAndDelete(c.content, ()=>{})
                })
              }
            })
          } 
        })
      }
      await TrainingPath.findByIdAndDelete(prevTP, ()=>{})
    }
  })


  let group_1 = await Group.findOneAndUpdate(
    { _id: groupId },
    { $set: req.body },
    { runValidators: true })
  if (!group_1) res.status(404).send({ message: "Not found" });
  else {
    let duplicatingTrainingPaths = []
    let duplicatingTrainingModules = []
    let duplicatingTMList = []
    let duplicatingChList = []
    let duplicatingCList = []
    let assignmentList = []
    let group = await Group.findById(groupId)
      .populate({
        path: "program.trainingPath",
        populate: [
          { path: "trainingModules.originalTrainingModule" },
          { path: "trainingModules.chosenChapters.chapter" },
          { path: "trainingModules.chosenChapters.chosenContents.content" },
        ],
      })
    let haveGoingStatus = false // to make sure only one period of the program have onGoing flag as true
    group.program.forEach(async (program) => {
      if (program.reprogram) {
        let skipTrainingPath = duplicatingTrainingPaths.includes(program.trainingPath._id)
        // let alreadyHasADupTrainingPath = 'duplicatedTrainingPath' in program // an additional check, whether to reprogram it or not!
        let newTrainingPathId = skipTrainingPath? program.trainingPath._id : new ObjectId();
        if(!skipTrainingPath) {
          duplicatingTrainingPaths.push(newTrainingPathId, program.trainingPath._id)
          const newTrainingPath = new TrainingPath({
            _id: newTrainingPathId,
            name: program.trainingPath.name,
            description: program.trainingPath.description,
            level: program.trainingPath.level,
            type: program.trainingPath.type,
            assignedYear: program.trainingPath.assignedYear,
            assignedPeriod: program.trainingPath.assignedPeriod,
            trainingModules: program.trainingPath.trainingModules,
            isPublic: program.trainingPath.isPublic,
            origin: program.trainingPath._id,
          });

          program.trainingPath.trainingModules.forEach(async (trainingModule) => {
            let skipTrainingModule = false;
            let newTrainingModuleId = skipTrainingModule? trainingModule.originalTrainingModule._id : new ObjectId();
            if(!skipTrainingModule) {
              duplicatingTMList[trainingModule.originalTrainingModule._id] = newTrainingModuleId
              duplicatingTrainingModules.push(newTrainingModuleId, trainingModule.originalTrainingModule._id) // already copied id
              const newTrainingModule = new TrainingModule({
                _id: newTrainingModuleId,
                name: trainingModule.originalTrainingModule.name,
                category: trainingModule.originalTrainingModule.category,
                module: trainingModule.originalTrainingModule.module,
                estimatedTime: trainingModule.originalTrainingModule.estimatedTime,
                hours: trainingModule.originalTrainingModule.hours,
                // chapters: trainingModule.originalTrainingModule.chapters,
                origin: trainingModule.originalTrainingModule._id,
              });
              newTrainingModule.save();
            }
  
            trainingModule.chosenChapters.forEach(async (chapter) => {
              let newChapterId = new ObjectId();
              duplicatingChList[chapter.chapter._id] = newChapterId
              const newChapter = new Chapter({
                _id: newChapterId,
                name: chapter.chapter.name,
                module: chapter.chapter.module,
                description: chapter.chapter.description,
                dependantChapters: chapter.chapter.dependantChapters,
                // assignedContent: chapter.chapter.assignedContent,
                creator: chapter.chapter.creator,
                level: chapter.chapter.level,
                type: chapter.chapter.type,
                durationTime: chapter.chapter.durationTime,
                origin: chapter.chapter._id,
              });
              newChapter.save();
  
              chapter.chosenContents.forEach(async (content) => {  
                content.content = content._id;
                // content.save()
              });
              chapter.chapter = newChapterId;
              // chapter.save()
            });
            trainingModule.originalTrainingModule = newTrainingModuleId;
            // trainingModule.save()
            
            // ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            // creating courses (SubjectSession)
            let findSubjectSession = await SubjectSession.deleteMany({group: group._id, period: program.period}) // find if SubjectSession already exist in that group and for that period, if so delete them            
            const subjectSession = new SubjectSession();
            subjectSession.group = group._id
            subjectSession.period = program.period,
            subjectSession.image = trainingModule.image,
            subjectSession.trainingModule = newTrainingModuleId
            await subjectSession.save() 
          });
          program.assignment.forEach(assign=>{
            if (duplicatingTMList[assign.trainingModule]) assign.trainingModule = duplicatingTMList[assign.trainingModule]
            assignmentList[assign.trainingModule] = assign.trainers
          })
          program.duplicatedTrainingPath = newTrainingPathId;
          program.onGoing = haveGoingStatus? false: true;
          program.reprogram = false;
          haveGoingStatus = true // todo next, replace onGoing logic with span of period, live
          // program.save()

          newTrainingPath.trainingModules = newTrainingPath.trainingModules.map(tm=>{
            if(duplicatingTMList[tm.originalTrainingModule]) tm.originalTrainingModule = duplicatingTMList[tm.originalTrainingModule]
            tm.chosenChapters = tm.chosenChapters.map(ch=>{
              if(duplicatingChList[ch.chapter]) ch.chapter = duplicatingChList[ch.chapter]
              ch.chosenContents = ch.chosenContents.map(c=>{
                if (!c.cocreators) c.cocreators = []
                c.cocreators.push(assignmentList[c.trainingModule])
                c.cocreators.flat()
                return c
              })
              return ch
            })
            return tm
          })
          newTrainingPath.save();
        }

      }
    })

    group.save()
    res.status(200).json({ message: "Updated successfully" });
  }
};

exports.editChaptersInProgram = async (req, res) => {

  // subject
  let duplicatedTrainingModuleId = req.body.trainingModuleId
  // chapter management
  let allSelectedChapters = req.body.assignedChapters.filter(x=>x.isSelected)
  let chaptersToCreate = allSelectedChapters.filter(x=>!!!x.old)
  let currentContentIds = allSelectedChapters.map(x=>x.chosenContents.map(y=>y.content)).flat()
  // content management
  let initialContents = req.body.initialContents
  let contnetsToBeDeleted = initialContents.filter(x=>!currentContentIds.includes(x))

  let newChapters = chaptersToCreate.map((chapter,i)=>({
      _id: chapter.chapter._id,
      name: chapter.chapter.name,
      description: chapter.chapter.description, 
      assignedContent: chapter.chapter._id? chapter.chapter.assignedContent: chapter.chosenContents,
      level: chapter.chapter.level,
      type: chapter.chapter.type,
      durationTime: chapter.chapter.durationTime,
      creator: chapter.chapter._id? chapter.chapter.creator: req.userId,
      addedByTrainer: true,
  }))

  Chapter.bulkWrite(
    newChapters.map((chapter) => 
      ({updateOne: {
        filter: { _id : chapter._id },
        update: { $set: chapter },
        upsert: true
      }})
    )
  )

  let trainingPath = await TrainingPath.findById(req.body.trainingPathId) // duplicatedTrainingPathId
  if (!trainingPath) res.status(404).send({ message: "Not found" });
  else {
    trainingPath.trainingModules = await Promise.all(trainingPath.trainingModules.map(async x=>{
      if(x.originalTrainingModule.equals(duplicatedTrainingModuleId)){
        x.chosenChapters = await Promise.all(allSelectedChapters.map(async cx=>({
          chapter: cx.chapter._id,
          chosenContents: await Promise.all(cx.chosenContents.map(async c=>{
            if(c.new){
              let oldContentId = c.content._id
              if(!initialContents.includes(oldContentId)){
                // let copyContent = c.content
                let copyContent = await Content.findById(c.content._id).lean().exec()
                copyContent._id = new ObjectId()
                copyContent.origin = oldContentId
                copyContent.trainingModule = req.body.trainingModuleId;
                copyContent.chapter = cx.chapter._id;
                copyContent.createdAt = new Date();
                db.content.create(copyContent, (err) => { if (err) console.error(err.message);})
                // c.content = copyContent
                return {content: copyContent}
              } else return {content: c.content}
            } else return c
          }))
        })))
      // todo: prevent deleting content which is linked to any event (do it in seperate function)
      }
      return x
    }))
    trainingPath.save()
    res.status(200).json({ message: "Updated successfully" });
  }
  // delete unused duplicated contents
  Content.deleteMany({_id: contnetsToBeDeleted, origin: {$exists: true}}).exec()
};

exports.removeMSClass = async (req, res) => {
  await ModuleCore.findOneAndUpdate(
      { moduleId: req.moduleId },
      { $pull: { 'groups': req.params.classId } },
      { runValidators: true });

  await Group.findByIdAndRemove(req.params.classId)
  res.status(200).json({ message: "Deleted successfully!" });
};

exports.readGroupsByTraineeId = async (req, res) => {
  let traineeId = ObjectId(req.params.traineeId)
  let groups = await Group.find({trainees: { $elemMatch: {$eq: traineeId} }})
  res.status(200).json(groups)
};

exports.addMSScale = async (req, res) => {
  let moduleCoreId = req.params.moduleCoreId;
  let scaleObject = req.body;
  const scaleId = new ObjectId();
  scaleObject._id = scaleId;
  
  const scale = new GradingScaleRef(scaleObject);
  scale.save()
  await ModuleCore.findOneAndUpdate(
    { moduleId: moduleCoreId },
    { $push: { gradingScales: scaleId } },
    { runValidators: true })

  res.send({ message: "Scale was saved successfully!" });
};

exports.updateMSScale = async (req, res) => {
  await GradingScaleRef.updateOne( 
    {_id: req.params.scaleId},
    {$set: req.body},
    {"runValidators": true})
  res.status(200).json({ message: "Updated successfully" });
};

exports.removeMSScale = async (req, res) => {
  let id = req.params.scaleId;
  // let modulecore = await ModuleCore.findOne({ "gradingScale.customGradingScales._id": id })
  let core = await ModuleCore.findOneAndUpdate(
    { moduleId: req.moduleId, defaultGradingScale: { $exists: false }},
    { $pull:  {"gradingScales": id} },
    { runValidators: true });
  if (!core) res.send({ message: "0" });
  else res.send({ message: "1" });
};

exports.readCurriculumsByYear = async (req, res) => {
  let modulecore = await ModuleCore.findOne({moduleId: req.params.moduleId})
  let curr = await TrainingPath.find(
    { 
      _id:  { $in: modulecore.trainingPaths}, 
      assignedYear: req.params.yearId, 
      origin: {$exists: false} 
    },
    { "trainingModules.chosenChapters": 0 })
  res.status(200).json(curr)
};

exports.readCurriculumsByModule = async (req, res) => {
  let modulecore = await ModuleCore.findOne({moduleId: req.moduleId})
  let curr = await TrainingPath.find(
    { 
      _id:  { $in: modulecore.trainingPaths}, 
      origin: {$exists: false} 
    },
    { "trainingModules.chosenChapters": 0 })
  res.status(200).json(curr)
};

exports.addMSCurriculum = async (req, res) => {
  let moduleCoreId = req.params.moduleCoreId;
  // req.body.trainingModules.map(x=>{
  //   x.image = "6079c435eb088801c7b8f8e0" // TODO load real image ID (from courses )
  // })
  let curriculumObject = req.body;
  const curriculumId = new ObjectId();
  curriculumObject._id = curriculumId;
  
  const curriculum = new TrainingPath(curriculumObject);
  curriculum.save()
  await ModuleCore.findOneAndUpdate(
    { _id: moduleCoreId },
    { $push: { trainingPaths: curriculumId } },
    { runValidators: true })
  res.send({ message: "Curriculum was saved successfully!" });
};

exports.updateMSCurriculum = async (req, res) => {
  let tp = new TrainingPath(req.body)
  await TrainingPath.findOneAndUpdate(
    { _id: req.params.curriculumId },
    { $set: tp },
    { runValidators: true });
  res.status(200).json({ message: "Updated successfully" });
};

exports.removeMSCurriculum = async (req, res) => {
  let id = req.params.curriculumId;
  await ModuleCore.findOneAndUpdate(
    { moduleId: req.moduleId },
    { $pull:  {"trainingPaths": id} },
    { runValidators: true });
  await TrainingPath.findOneAndDelete({ _id: id })
  res.send({ message: "Curriculum deleted successfully!" });
};
/////////////////// MODULE USERS //////////////////
/**
 * @openapi
 * /api/v1/module-core/read-all-module-users/{moduleId}:
 *   get:
 *     description: Get List of Module Users
 *     tags:
 *       - _Cognitive User Module
 *     responses:
 *       200:
 *         schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: "cmodulemanager"
 *         description: Success Response.
 */
exports.readAllModuleUsers = async (req, res) => {
  let moduleId = req.params.moduleId;
  let moduleUsers = await moduleUtils.getAllUsersInModule(req.userId, moduleId)
  res.status(200).json(moduleUsers);
};

exports.readAllClassManagers = async (req, res) => {
  let moduleId = req.params.moduleId;
  const matchAllScopeActions = "^modules:.*?" + moduleId + "$";
  let classManagers = await User.find({
      "scopes.name": { $regex: matchAllScopeActions, $options: "i" }, 
      "settings.availableRoles":  "Trainer"
    },
    "username name surname email createdAt details settings").populate([{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}])
  res.status(200).json(classManagers);
};

exports.readAllModuleTrainers = async (req, res) => { 
  let moduleId = req.params.moduleId;
  const matchAllScopeActions = "^modules:.*?" + moduleId + "$";
  let moduleTrainers = await User.find({ 
      "scopes.name": { $regex: matchAllScopeActions, $options: "i" }, 
      "settings.availableRoles":  "Trainer"
    }, "username name surname email createdAt details settings")
  .populate([{ path: "details.company", select: "name" },{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}])
  res.status(200).json(moduleTrainers);
};

exports.readAllModuleTrainees = async (req, res) => {
  let moduleId = req.params.moduleId;
  const matchAllScopeActions = "^modules:.*?" + moduleId + "$";
  let moduleTrainees = await User.find({
      "scopes.name": { $regex: matchAllScopeActions, $options: "i" }, 
      "settings.availableRoles":  "Trainee"
    },
    "username name surname email createdAt details settings").populate([{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}])
  res.status(200).json(moduleTrainees);
};

/**
 * @openapi
 * /api/v1/module-core/update-user/{userId}:
 *   put:
 *     description: Update module user
 *     tags:
 *       - _Cognitive User Module 
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 63b27cc52d8fb5f910d142b5
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - updatedUser
 *            properties:
 *              updatedUser:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    description: Name of the User
 *                    example: "user"
 *                  surname:
 *                    type: string
 *                    description: Surname of the User
 *                    example: "A"
 *                  username:
 *                    type: string
 *                    description: username of the User
 *                    example: "usera"
 *                  email:
 *                    type: string
 *                    description: email of the User
 *                    example: "usera@gmail.com"
 *                  otherPassword:
 *                    type: object
 *                    description: other password of the user
 *                    properties:
 *                      password:
 *                        type: string
 *                        description: other password
 *                        example: "Testing123!"
 *                      addedBy:
 *                        type: string
 *                        description: other password added by
 *                      date:
 *                        type: string
 *                        description: date of other password addition
 *                  settings:
 *                    type: object
 *                    description: user settings
 *                    properties:
 *                      isActive:
 *                        type: boolean
 *                        description: status of user
 *                        example: true
 *                      role:
 *                        type: string
 *                        description: user role
 *                        example: "Inspector"
 *                      defaultRole:
 *                        type: string
 *                        description: user defaultRole
 *                        example: "Inspector"
 *                      availableRoles:
 *                        type: array
 *                        description: user availableRoles
 *                        example: ["Inspector"]
 *                      roleMaster:
 *                        type: string
 *                        description: user role master
 *                        example: "63c8f1cb88bbc68cce0eb2ea"
 *                      defaultRoleMaster:
 *                        type: string
 *                        description: user defaultRoleMaster
 *                        example: "63c8f1cb88bbc68cce0eb2ea"
 *                      availableRoleMasters:
 *                        type: array
 *                        description: user availableRoleMasters
 *                        example: ["63c8f1cb88bbc68cce0eb2ea"]
 *                      emailConfirmed:
 *                        type: boolean
 *                        example: false
 *                      level:
 *                        type: string
 *                        example: "1"
 *                      assignedCompany:
 *                        type: string
 *                        description: Company Id
 *                  details:
 *                    type: object
 *                    description: user details
 *                    properties:
 *                      fullName:
 *                        type: string
 *                      displayName:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      street:
 *                        type: string
 *                      buildNr:
 *                        type: string
 *                      postcode:
 *                        type: string
 *                      city:
 *                        type: string
 *                      country:
 *                        type: string
 *                      dateOfBirth:
 *                        type: string
 *                      description:
 *                        type: string
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: User has been updated successfully
 *         description: Success Response.
 *       404:
 *         description: Not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Not found
 */
exports.updateUser = async (req, res) => {
  let userId = req.params.userId;
  var unsetEmail = {};
  if (!req.body.updatedUser.settings.assignedCompany) delete req.body.updatedUser.settings.assignedCompany
  if (req.body.updatedUser.password) {
    req.body.updatedUser.password = bcrypt.hashSync(req.body.updatedUser.password, 8);
  }

  if (req.body.updatedUser.otherPassword?.password.length > 7) {
    req.body.updatedUser.otherPassword.password = bcrypt.hashSync(req.body.updatedUser.otherPassword.password, 8);
    req.body.updatedUser.otherPassword.addedBy = req.userId;
    req.body.updatedUser.otherPassword.date = new Date();
  } else {
    delete req.body.updatedUser.otherPassword;
  }

  // roles recheck
  let allowedRoles = ['Librarian','Architect','Trainer','Trainee','Parent','Inspector','Coordinator','TrainingManager','Partner', 'ModuleManager','Assistant'];
  if (req.role != req.body.updatedUser.settings.role && !allowedRoles.includes(req.body.updatedUser.settings.role)) req.body.updatedUser.settings.role = 'Other'
  req.body.updatedUser.settings.defaultRole = req.body.updatedUser.settings.role;
  req.body.updatedUser.settings.availableRoles = req.body.updatedUser.settings.availableRoles.filter(role => allowedRoles.includes(role))
  req.body.updatedUser.settings.defaultRoleMaster = req.body.updatedUser.settings.roleMaster;

  // BC COACH  PERMISSION ID  
  const coachPermission = '6433beb256ad0bfabd021d7d';
  const bcTrainerPermission = '6433beb256ad0bfabd021d7e';
  const roleMasterToCheck = req.body.updatedUser.settings.availableRoleMasters;

  const foundPermissions = await db.rolePermissionsMapping.findOne({
    roleMaster: { $in: roleMasterToCheck },
    permissions: { $in: [coachPermission, bcTrainerPermission] },
  });

  if (foundPermissions?.permissions.includes(coachPermission)) {
    await db.group.findOneAndUpdate(
      { _id: '64a68fed7013d1001efdcc50' },
      { $addToSet: { trainees: userId } },
      { runValidators: true }
    )
  } 
  if (foundPermissions?.permissions.includes(bcTrainerPermission)) {
    await CertificationSession.findOneAndUpdate(
      { _id: '64a68f9f7013d1001efdcac4' },
      { $addToSet: { examiners: userId } },
      { runValidators: true }
    )
  }

  if(!req.body.updatedUser.email) {
    delete req.body.updatedUser.email;
    unsetEmail = {email: 1 };
  }

  let user = await User.findOneAndUpdate(
    { _id: userId },
    { $set: req.body.updatedUser, $unset: unsetEmail },
    { runValidators: true })
  if (!user) return res.status(404).send({ message: "Not found" });
  await Company.updateMany(
    { }, 
    { $pull: { otherUsers: user._id } },
    { runValidators: true })
  if (req.body.updatedUser.settings.assignedCompany) {
    await Company.findOneAndUpdate(
      { _id: req.body.updatedUser.settings.assignedCompany }, 
      { $addToSet: {otherUsers: user._id} },
      { runValidators: true })
  }
  return res.status(200).json({ message: "User has been updated successfully" });
};

/**
 * @openapi
 * /api/v1/module-core/add-user/{moduleId}:
 *   put:
 *     description: Create User to the module
 *     tags:
 *       - _Cognitive User Module 
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true
 *         type: string
 *         example: 333000000000000000000000
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - newUser
 *            properties:
 *              newUser:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    description: Name of the User
 *                    example: "user"
 *                  surname:
 *                    type: string
 *                    description: Surname of the User
 *                    example: "A"
 *                  username:
 *                    type: string
 *                    description: username of the User
 *                    example: "usera"
 *                  email:
 *                    type: string
 *                    description: email of the User
 *                    example: "usera@gmail.com"
 *                  password:
 *                    type: string
 *                    description: password of the user
 *                    example: "Testing123!"
 *                  otherPassword:
 *                    type: object
 *                    description: other password of the user
 *                    properties:
 *                      password:
 *                        type: string
 *                        description: other password
 *                        example: "Testing123!"
 *                      addedBy:
 *                        type: string
 *                        description: other password added by
 *                      date:
 *                        type: string
 *                        description: date of other password addition
 *                  settings:
 *                    type: object
 *                    description: user settings
 *                    properties:
 *                      isActive:
 *                        type: boolean
 *                        description: status of user
 *                        example: true
 *                      role:
 *                        type: string
 *                        description: user role
 *                        example: "Inspector"
 *                      defaultRole:
 *                        type: string
 *                        description: user defaultRole
 *                        example: "Inspector"
 *                      availableRoles:
 *                        type: array
 *                        description: user availableRoles
 *                        example: ["Inspector"]
 *                      roleMaster:
 *                        type: string
 *                        description: user role master
 *                        example: "63c8f1cb88bbc68cce0eb2ea"
 *                      defaultRoleMaster:
 *                        type: string
 *                        description: user defaultRoleMaster
 *                        example: "63c8f1cb88bbc68cce0eb2ea"
 *                      availableRoleMasters:
 *                        type: array
 *                        description: user availableRoleMasters
 *                        example: ["63c8f1cb88bbc68cce0eb2ea"]
 *                      emailConfirmed:
 *                        type: boolean
 *                        example: false
 *                      level:
 *                        type: string
 *                        example: "1"
 *                      assignedCompany:
 *                        type: string
 *                        description: Company Id
 *                  details:
 *                    type: object
 *                    description: user details
 *                    properties:
 *                      fullName:
 *                        type: string
 *                      displayName:
 *                        type: string
 *                      phone:
 *                        type: string
 *                      street:
 *                        type: string
 *                      buildNr:
 *                        type: string
 *                      postcode:
 *                        type: string
 *                      city:
 *                        type: string
 *                      country:
 *                        type: string
 *                      dateOfBirth:
 *                        type: string
 *                      description:
 *                        type: string
 *                  confirmPassword:
 *                    type: string
 *                    description: Confirm Password of user
 *                    example: "Testing123!"
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: User has been saved successfully
 *         description: Success Response.
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Not found!
 */
exports.addUser = async (req, res) => {
  let currentUsersCount = await User.countDocuments({ "scopes.name": { $regex: "^modules:.*?" + req.moduleId + "$", $options: "i" } });
  let eco = await Ecosystem.findOne({ "subscriptions.modules._id": req.moduleId })
  // User who is creating 
  let creator = await User.findOne({_id: req.userId});

  if (!eco) res.status(404).send({ message: "Ecosystem not found!" });
  else {
    let subscription = eco.subscriptions.find(sub=>sub.modules.id(req.moduleId))
    let module = subscription.modules.id(req.moduleId)
    let maxLimit = module.usersLimit - currentUsersCount

    if (maxLimit>0) {
      const userId = new ObjectId();
      let newUser = req.body.newUser;


      newUser.creator = creator._id
      // Set language to language of the creator
      console.log(' creator.settings.language',  creator.settings.language)
      if (!newUser?.settings?.language) newUser.settings.language = creator.settings.language
      if (!newUser?.settings?.origin) newUser.settings.origin = creator.settings.origin
      let allowedRoles = ['Librarian','Architect','Trainer','Trainee','Parent','Inspector','Coordinator','TrainingManager','Partner','ModuleManager','Assistant'] // all permitted roles
      
      // checking if someone is manupulating role while sending request!
      // get the array from MSUserList.js default setRoles
      const scopes = [
        { name: "users:all:" + userId },
        { name: "content:create:all" },
        { name: "modules:read:" + req.moduleId },
        { name: "modules:read:200004000080000000000000" }, // Universal Training Center
      ];
      if(!allowedRoles.includes(newUser.settings.role))  newUser.settings.role = "Other";
      // if user is not from cognitive center (dynamic roles not applicable)
      if (!newUser.settings.roleMaster) {
        newUser.settings.defaultRole = newUser.settings.role
        newUser.settings.availableRoles = newUser.settings.availableRoles.filter(role => allowedRoles.includes(role));
      } else {
        // if user is from cognitive center (dynamic roles applicable)
        newUser.settings.role = "Other";
        newUser.settings.defaultRole = "Other";
        const roleMaster = db.roleMaster.findOne({_id: newUser.settings.roleMaster, module: req.moduleId});
        if (!roleMaster) return res.status(404).json({message: "Role Master not found!"});
        newUser.settings.defaultRoleMaster = newUser.settings.roleMaster;
        newUser.settings.availableRoleMasters = [...new Set(newUser.settings.availableRoleMasters.concat(newUser.settings.roleMaster))];
        
        // BC COACH  PERMISSION ID  
        const coachPermission = '6433beb256ad0bfabd021d7d';
        const bcTrainerPermission = '6433beb256ad0bfabd021d7e';
        const roleMasterToCheck = newUser.settings.availableRoleMasters;

        const isCoachBeingCreated = await db.rolePermissionsMapping.findOne({
          roleMaster: { $in: roleMasterToCheck },
          permissions: { $in: [coachPermission] }
        });

        const isBCTrainerBeingCreated = await db.rolePermissionsMapping.findOne({
          roleMaster: { $in: roleMasterToCheck },
          permissions: { $in: [bcTrainerPermission] }
        });

        if (isCoachBeingCreated) {
          // if BrainCore Coach is being created push it to the session group
          await db.group.findOneAndUpdate(
            { _id: '64a68fed7013d1001efdcc50' },
            { $addToSet: { trainees: userId } },
            { runValidators: true }
          );
        } 
        if(isBCTrainerBeingCreated){
          await CertificationSession.findOneAndUpdate(
            { _id: '64a68f9f7013d1001efdcac4' },
            { $addToSet: { examiners: userId } },
            { runValidators: true }
          );
        }
        
      }

      if (!newUser.email) delete newUser.email
      if (!newUser.settings.assignedCompany) delete newUser.settings['assignedCompany']
      await User.create({
        _id: userId,
        name: newUser.name, 
        surname: newUser.surname,
        email: newUser.email,
        username: newUser.username,
        password: bcrypt.hashSync(newUser.password, 8),
        settings: newUser.settings,
        details: newUser.details,
        scopes: scopes,
        creator: req.userId,
      }).then(function () {
        res.status(200).json({ message: 'User has been saved successfully'});
      }, function (err) {
        if (err.toString().includes("username_1")) { 
          res.status(409).send({ message: "Adding user failed, username already exists in database."});
        } else if(err.toString().includes("email_1")){
          res.status(409).send({ message: "Adding user failed, e-mail already exists in database."});
        }else{
          res.status(409).send(err);
        }
      })
     
      if( newUser?.settings?.assignedCompany ) {
        if(newUser.settings.role === "Trainee"){
          await Company.findOneAndUpdate(
            { _id: newUser.settings.assignedCompany },
            { $push: {trainees: userId} },
            { runValidators: true })
        }
        else if(newUser.settings.role === "Trainer"){
          await Company.findOneAndUpdate(
            { _id: newUser.settings.assignedCompany },
            { $push: {examiners: userId} },
            { runValidators: true })
        }
        else if(newUser.settings.role === "Partner"){
          await Company.findOneAndUpdate(
            { _id: newUser.settings.assignedCompany },
            { $set: {owner: userId} },
            { runValidators: true })
        }
        else {
          await Company.findOneAndUpdate(
            { _id: newUser.settings.assignedCompany },
            { $push: {otherUsers: userId} },
            { runValidators: true })
        }
      }
      // res.status(200).json({ message: "User has been saved successfully!"});
    } else res.send({ message: "No user has been added! You have reached the limit of adding a new user!" });
  }
};

// exports.removeUser = async (req, res) => {
//   await User.findOneAndDelete({ _id: req.params.userId })
//   res.status(200).json({ message: "Deleted successfully" });
// };

exports.isCognitiveUser = async (user) => {
  if (!user) return false;
  const scopes = user.scopes.filter(s => s.name.match('modules:all:') || s.name.match('modules:read:'));
  const modulesIds = scopes.map(s => s.name.split(':').pop());
  // if the user does not have modules scopes
  if (!modulesIds.length) return false;
  // if user has module scopes
  const ecosystems = await Ecosystem.find({"subscriptions.modules._id": { $in: modulesIds } }, { "subscriptions.modules": 1 });
  return ecosystems.some(e => e?.subscriptions.find(s => s.modules.some(m => modulesIds.includes(m._id) && m.moduleType == "COGNITIVE")));
}

/**
 * @openapi
 * /api/v1/module-core/remove-user/{userId}:
 *   put:
 *     description: remove module user
 *     tags:
 *       - _Cognitive User Module 
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 63b27cc52d8fb5f910d142b5
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Deleted successfully
 *         description: Success Response.
 *       404:
 *         description: Not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User not found
 */
exports.removeUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.userId});
    if (!user) return res.status(404).send({ message: "User not found" });

    const isCognitiveUser = await this.isCognitiveUser(user);
    // if user is part of cognitive center then soft delete
    if (isCognitiveUser) {
      const tempMail = generateTempEmail();
      const tempUserName = generateTempUserName(user.username);
      await User.findOneAndUpdate({ _id: req.params.userId }, {isDeleted: true, email: tempMail, username: tempUserName});
      // remove from team if any
      updateTeamDependency(user);
      return res.status(200).json({ message: "Deleted successfully" });
    } else {
      // If user is not part of cognitive center
      await User.findOneAndDelete({ _id: req.params.userId });
    }
  } catch (err) {
    return res.status(500).send({ message: err });
  }
  return res.status(200).json({ message: "Deleted successfully" });
};

const updateTeamDependency = async (user) => {
  const team = await db.team.findOne({trainee: user._id}).populate([{path: "trainee", select: "brainCoreTest"}]);
  if (team) {
    // update query
    const updateQuery = {
      $pull: { trainee: user._id },
    }
    // get trainee
    let trainee = team.trainee.filter(t => t._id.toString() !== user._id.toString());
    // get latest trainee based on braincore test except deleting user
    let latestTraineeObj = trainee.sort((a, b) => a.brainCoreTest && b.brainCoreTest && a.brainCoreTest.requestDate > b.brainCoreTest.requestDate).slice(-1)[0];

    // if latest brain core test object exists then update otherwise remove it from team.
    if (latestTraineeObj && latestTraineeObj.brainCoreTest && latestTraineeObj.brainCoreTest.status) {
      updateQuery.$set = {"brainCoreTest": latestTraineeObj.brainCoreTest}
    } else {
      updateQuery.$unset = {"brainCoreTest": 1};
    }
    // remove user from team
    // unset brainCoreTest object if no trainee exists in a team
    await Team.findOneAndUpdate(
      { _id: team._id },
      updateQuery
    );
  }
}

const generateTempEmail = () => {
  return `temp_email_${Date.now()}@example.com`;
}

const generateTempUserName = (username = "username") => {
  return `${username}_${Date.now()}`;
}

// Function to get all grading scales in the module
exports.getAllGradingScalesForModule = async (req, res) => {
  let moduleId = req.params.moduleId||req.moduleId;
  let modulecore = await ModuleCore.findOne({ moduleId })
    .populate([
      { path: "gradingScales" }, 
      // { path: "defaultGradingScale" },
    ])
  res.status(200).json({
    defaultGradingScale: modulecore?.defaultGradingScale||null, 
    gradingScales: modulecore.gradingScales
  });
};

exports.getSubjectGradesInClass = async (req, res) => {
  let groupId = req.params.groupId
  let trainingModuleIds = req.body
  let group = await Group.findById(groupId)
    .populate({
      path: "program.duplicatedTrainingPath",
      populate: { path: "trainingModules.chosenChapters.chosenContents.content", select: ['contentType']}
    })
  if (!group) res.status(404).send({ message: "Group Not found" });
  else {
    let trainingModules_to_check = group.program.map(x=>x.duplicatedTrainingPath.trainingModules.filter(y=>trainingModuleIds.find(z=>z==y.originalTrainingModule))).flat()
    let content_network = trainingModules_to_check.map(tm=>({trainingModule: tm.originalTrainingModule, contents: tm.chosenChapters.map(ch=>ch.chosenContents.filter(c=>c.content.contentType=="TEST").map(c=>c.content._id)).flat()}))
    // content_network.push("2aaaaaaaaaaaaaaaaaaaaaaa");
    let grades = await Result.find({
      user: group.trainees, 
      $or: [
        { content: [...content_network.map(x=>x.contents).flat(),"2aaaaaaaaaaaaaaaaaaaaaaa"] },
        { "externalExam.trainingModule" : trainingModuleIds},
      ]
    }, "grade content user externalExam")
    let traineeIds = uniqBy(grades.map(i => i.user), id => id.toString());
    let results = traineeIds.map(x=>{
      return {
        trainee: x,
        subject: content_network.map(y=>{
          let g = grades.filter(z=>(z.user.equals(x) && (z.externalExam?.trainingModule?.equals(y.trainingModule)||y.contents?.includes(z.content) || z.content?.equals('2aaaaaaaaaaaaaaaaaaaaaaa'))))
          return {
            trainingModule: y.trainingModule,
            average: g?.length>0? Number(g.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0)+s),0)/(g.length)).toFixed(2): 0,
            total: Number(g.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0)+s),0)).toFixed(2)
          }
        })
      }
    })
    res.status(200).json(results);
  }
};

exports.getSubjectsInClass = async (req, res) => {
  let ecosystem = await Ecosystem.findOne({"subscriptions.modules._id":req.moduleId})
  let moduleType = (ecosystem?.subscriptions?.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId))?.moduleType

  let groupId = req.params.groupId
  let periodId = req.params.periodId||req.selectedPeriod
  let group = await Group.findById(groupId)
    .populate({path: "program.duplicatedTrainingPath", select: ["trainingModules.newName", "trainingModules.originalTrainingModule"] })
    .exec()
  if(group){
    let isClassManager = group.classManager.equals(req.userId)
    let program = group.program.find(w=>w.period==periodId)
    let trainingModuleIds = (req.role==="Inspector" || req.role==="Architect") ? program.assignment.map(y=>y.trainingModule).flat() : program.assignment.filter(y=>(isClassManager||y.trainers.find(z=>z.equals(req.userId)))).map(y=>y.trainingModule).flat()
    let subjects = program.duplicatedTrainingPath.trainingModules.filter(y=>trainingModuleIds.includes(y.originalTrainingModule)).map(z=>({ id: z.originalTrainingModule, name: z.newName })).flat()
    res.status(200).json(subjects);
  } else {
    let session = await CertificationSession.findById(groupId)
      .populate([
        {path: "trainingPath", select: ["trainingModules.newName", "trainingModules.originalTrainingModule"] },
        {path: "coursePath", populate: {path: "courses", select: "name origin"} },
      ])
      .exec()
    if(moduleType === "SCHOOL"){
      res.status(200).json(session.trainingPath.trainingModules.map(z=>({ id: z.originalTrainingModule, name: z.newName })));
    } else {
      res.status(200).json(session.coursePath.courses.map(z=>({ id: z.origin||z._id, name: z.name })));
    }
  }
};

// getMinmax
exports.getMinmax = async (req, res) => {
  let core = await db.moduleCore.findOne({moduleId:req.moduleId}).populate([
    {path: "gradingScales"},
    {path: "defaultGradingScale"}
  ]).lean().exec()
  let gradingScale = core?.defaultGradingScale||core?.gradingScales[0]||null
  let minmax = {
    min:gradingScale.grades[0].shortLabel, 
    max:gradingScale.grades[gradingScale.grades.length-1].shortLabel, 
    passPercentage:gradingScale.passPercentage, 
    passValue: gradingScale.grades.find(x=>x.maxPercentage == gradingScale.passPercentage).shortLabel
  }
  res.status(200).json(minmax);
}

exports.getProgramGrades = async (req, res) => {
  let trainingModuleId = req.params.trainingModuleId
  let group = await Group.findOne({ "program.assignment.trainingModule": trainingModuleId })
    .populate({
      path: "program.duplicatedTrainingPath",
      populate: { path: "trainingModules.chosenChapters.chosenContents.content", select: ['contentType']}
    })
  if (!group) res.status(404).send({ message: "Group Not found" });
  else {
    let program = group.program.find(x=>x.assignment.find(y=>y.trainingModule == trainingModuleId))
    let grades = await Result.find({
      user: group.trainees, 
      $or: [
        { content: ["2aaaaaaaaaaaaaaaaaaaaaaa",...program.duplicatedTrainingPath.trainingModules.filter(x=>x.originalTrainingModule.equals(trainingModuleId)).map(tm=>tm.chosenChapters.map(ch=>ch.chosenContents.filter(c=>c.content.contentType=="TEST").map(c=>c.content._id))).flat(2) ]},
        { "externalExam.trainingModule" : trainingModuleId},
      ]
    }, "grade content user externalExam.name externalExam.date")
    let ids = uniqBy(grades.map(i => i.user), id => id.toString());
    let average = ids.map(x=>{
      let gs = grades.filter(y=>y.user.equals(x))
      if(gs.length>0) {
        return {
          average: true,
          grade: Number(gs.reduce((s,i)=>(parseFloat(i.grade?.replace(",",".")||0)+s),0)/gs.length).toFixed(2),
          user: x,
        }
      } else {
        return {average: true, grade: 0, user: x}
      }
    })
    res.status(200).json([...grades, ...average]);
  }
};

exports.getTraineesInClassWithExamList = async (req, res) => {
  let trainingModuleId = req.params.trainingModuleId
  let group = await Group.findOne({ "program.assignment.trainingModule": trainingModuleId },
      {'trainees': 1, 'program': 1})
    .populate([
      { 
        path: "program.duplicatedTrainingPath", 
        populate: [
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title", "contentType", "trainingModule"] },
        ]
      },
      { path: "trainees", select: ['name', 'surname'] }
    ])
  if (!group) res.status(404).send({ message: "Group Not found" });
  else {
    let program = group.program.find(x=>x.assignment.find(y=>y.trainingModule == trainingModuleId))
    let contents = program.duplicatedTrainingPath.trainingModules.map(tm=>tm.chosenChapters.map(ch=>ch.chosenContents.filter(c=>c.content.contentType=="TEST").map(c=>{ return {title: c.content.title, id: c.content._id, trainingModuleId: c.content.trainingModule}}))).flat(2) 
    // console.log(contents,"contents in the middle ");
    // let externalExams = program.duplicatedTrainingPath.trainingModules.filter(x=>x.externalExams.length>0).filter(y=>y.originalTrainingModule.equals(trainingModuleId)).map(z=>z.externalExams.map(ee=>{return {...{name: ee.name, createdAt: ee.createdAt}, ...{trainingModuleId: z.originalTrainingModule}}}))[0]??[]
    let events = await Event.find({assignedGroup: group._id, assignedSubject:trainingModuleId,  eventType: ["Exam"]},{name:1, creator:1}) // why it was Homework and filtered later? context: event and content
    let eventExams = events.map(x=>({title: x.name, event: x._id, trainingModuleId: trainingModuleId, creator: x.creator})) // to be updated for classmanager case
    let result = {
      trainees: group.trainees, 
      exams: [...contents,...eventExams],
    }
    res.status(200).json(result);
  }
};

exports.addUsersFromCsv = async (req, res) => {
  let currentUsersCount = await User.countDocuments({ "scopes.name": { $regex: "^modules:.*?" + req.moduleId + "$", $options: "i" } });
  let eco = await Ecosystem.findOne({ "subscriptions.modules._id": req.moduleId })
  // User who is creating 
  let creator = await User.findOne({_id: req.userId});

  if (!eco) res.status(404).send({ message: "Not found" });
  else {
    let subscription = eco.subscriptions.find(sub=>sub.modules.id(req.moduleId))
    let module = subscription.modules.id(req.moduleId)
    let maxLimit = module.usersLimit - currentUsersCount
    let msg = (maxLimit>req.body.length)? `Users are saved successfully!` :
        `Only ${maxLimit} of ${req.body.length} users have been added successfully! You have reached the limit of adding new users!`

    if (maxLimit>0) {
      let newUsers = await Promise.all(req.body.map(async u=>{
        const userId = new ObjectId();
        u._id = userId
        u.creator = creator._id
        u.teams = u.teams
        u.password = bcrypt.hashSync(u.password, 8)

        // Set language to language of the creator
        if (!u?.settings?.language) u.settings.language = creator.settings.language
        if (!u?.settings?.origin) u.settings.origin = creator.settings.origin

        u.scopes = [{ name: "users:all:" + userId }, { name: "content:create:all" }, { name: "modules:read:" + req.moduleId }] 
        if (!['Librarian','Architect','Trainer','Trainee','Parent','Inspector','Coordinator','TrainingManager','Partner'].includes(u.settings.role))  u.settings.role = "Other"
        u.settings.defaultRole = u.settings.role
        u.settings.availableRoles = [u.settings.role]
        if (u.settings.roleMaster) {
          // Get Role Master and skip user if roleMaster invalid
          const roleMaster = await db.roleMaster.findOne({name: u.settings.roleMaster, $or: [{module: req.moduleId}, {module: "ALL"}]});
          if (!roleMaster) return null;
          u.settings.roleMaster = roleMaster._id;
          u.settings.defaultRoleMaster = roleMaster._id;
          u.settings.availableRoleMasters = [roleMaster._id];

          // BC COACH  PERMISSION ID  
          const coachPermission = '6433beb256ad0bfabd021d7d';
          const bcTrainerPermission = '6433beb256ad0bfabd021d7e';
          const roleMasterToCheck = u.settings.availableRoleMasters;

          const isCoachBeingCreated = await db.rolePermissionsMapping.findOne({
            roleMaster: { $in: roleMasterToCheck },
            permissions: { $in: [coachPermission] }
          });

          const isBCTrainerBeingCreated = await db.rolePermissionsMapping.findOne({
            roleMaster: { $in: roleMasterToCheck },
            permissions: { $in: [bcTrainerPermission] }
          });

          if (isCoachBeingCreated) {
            // if BrainCore Coach is being created push it to the session group
            await db.group.findOneAndUpdate(
              { _id: '64a68fed7013d1001efdcc50' },
              { $addToSet: { trainees: userId } },
              { runValidators: true }
            );
          } 
          if(isBCTrainerBeingCreated){
            await CertificationSession.findOneAndUpdate(
              { _id: '64a68f9f7013d1001efdcac4' },
              { $addToSet: { examiners: userId } },
              { runValidators: true }
            );
          }
        }
        return u
      }));

      // filter null records;
      newUsers = newUsers.filter(u => u);
      newUsers = newUsers.slice(0, maxLimit); // keeping only allowed number of user from the beginning
      if (!newUsers.length) return res.status(400).send({message: "Could not add any of the users" });
      msg = (newUsers.length<req.body.length) ? `Only ${newUsers.length} of ${req.body.length} users have been added successfully!`: `Users are saved successfully!`
      // Insert users into database
      db.user.insertMany(newUsers).then(async (users)=>{
        // ##############################################
        // ##### UPDATING TEAMS #########################
        // After users are saved in database
        // update teams objects and add users to the list
        for (let user of users){
          if (!user.teams) continue
          for (let teamId of user.teams){
            let team = await Team.findById(teamId)
            if (!team?.trainee?.includes(user._id)) team.trainee.push(user._id)
            await team.save()
          }
        }
        // ##### UPDATING TEAMS #########################
        // ##############################################

        res.status(200).json({ message: msg });
      }).catch(err=>{
        res.status(409).send({error: err, message: "VALIDATION_FAILED" });
      })

    }
  }
};

exports.countContentsInModule = async (req, res) => {
  let count = await Content.countDocuments({module: req.moduleId, origin: {$exists: false}})
  res.status(200).json({count});
};

// getTrainingModuleFromOtherPrograms
exports.getTrainingModuleFromOtherPrograms = async (req, res) => {
  let trainingModuleId = req.params.trainingModuleId
  // don't find TP without any chapters TODO
  let tm = await TrainingModule.findOne({ _id: trainingModuleId })
  if (!tm) res.status(404).send({ message: "Training Module Not found" });
  else {
    let trainingmodules = await TrainingModule.find({
      "origin": tm.origin,
      _id: { $ne: trainingModuleId }
    })
    let lookupIds = [tm.origin, ...trainingmodules.map(x=>x._id)]
    let tps = await TrainingPath.find({
      "trainingModules.originalTrainingModule": { $in: lookupIds },
      origin: { $exists: true }
    })
    .populate([
      { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title", "contentType"] },
      { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
    ]).lean().exec()
    let result = tps.flatMap(tp=>tp.trainingModules.map(tm=>({
      ...tm,
      chosenChapters: tm.chosenChapters.filter(_=>_?.chapter),
      curriculum: tp.name,
      name: tm.newName,
      // random 12 char string
      _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    }))).filter(x=>lookupIds.find(y=>y.equals(x.originalTrainingModule)))

    res.status(200).json(result);
  }
}