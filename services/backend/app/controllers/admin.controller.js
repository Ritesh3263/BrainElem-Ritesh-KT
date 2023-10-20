const tasker = require('../utils/tasker/tasker')
const Event = require("../models/event.model");
const Result = require("../models/result.model");
const mongoose = require("mongoose");
const db = require("../models");
const User = require('../models/user.model');
const SubjectSessions = require('../models/subject_session.model');
const Content = require("../models/content.model");
var ObjectId = require('mongodb').ObjectID;
const {adultTestsIds, braincoreTestsIds} = require("../utils/braincoreTestsIds");

const utils = require("../utils/database");
const cognitiveUtils = require("../utils/cognitive");

/**
 * @openapi
 * /api/v1/admin/tasks/mail/{mailId}:
 *   get:
 *     description: Schedule sending email with provided mailId
 *     tags:
 *       - _admin 
 *     parameters:
 *       - name: mailId
 *         in: path
 *         required: true
 *         type: string
 *         description: id of the mail to be scheduled for sending
 *     responses:
 *       200:
 *         description: Mail was scheduled successfully.
 */
exports.sendMail = async (req, res) => {
    tasker.addTask({task: "SEND_MAIL", mailId: req.params.mailId}, 'mails', (error) =>{
        if (error) res.status(500).send({ message: error })
        else res.status(200).json({message: "Mail was scheduled successfully"});
    })
};

/**
 * @openapi
 * /api/v1/admin/tasks/tips/{userId}:
 *   get:
 *     description: Schedule tips detection for user
 *     tags:
 *       - _admin 
 *     parameters:
 *       - name: mailId
 *         in: path
 *         required: true
 *         type: string
 *         description: id of the user to schedule assigning tips
 *     responses:
 *       200:
 *         description: Tips were scheduled successfully.
 */
exports.assignTips = async (req, res) => {
    tasker.addTask({task: "ASSIGN_TIPS", userId: req.params.userId }, 'tips',  (error) => {
        if (error) res.status(500).send({ message: error })
        else res.status(200).json({message: "Tips were scheduled successfully"});
    })
};

exports.addEventId = async (req, res) => {
  let results = await Result.find({event: {$exists: false}})
    results.forEach(async r=>{
      let event = await Event.findOne({assignedContent: r.content})
      r.event = event?._id
      r.save()
    })
    res.status(200).json({ message: "Updated successfully" });
}
exports.displayListOfAllContent = async (req, res) => {
  let contents = await Content.find({$and : [
    { newerVersion : {$exists: false}},
    { owner: {$exists: true} },
    { module: "611aaea2d26a784c58421d3b" }, // NEMESIS 
    { title: {$exists: true} },
    { chapter: {$exists: true} },
    { trainingModule: {$exists: true} },
    { origin: {$exists: false} },
    ]},
    ).select("-_id title createdAt")
    .populate({path: "owner", select: 'name surname -_id'})
    .populate({path: "chapter", select: 'name -_id'})
    .populate({path: "trainingModule", select: 'name -_id'}).sort({ createdAt: -1 });

    const util = require('util')
    console.log(util.inspect(contents, { maxArrayLength: null }))

}
exports.changePasswords = async (req, res) => {
    // change passwors of all users to Testing123!
    await db.user.updateMany({},{$set:{"password": "$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei"}})
    res.status(200).json({ message: "Updated successfully" });
}

exports.publishGrades = async (req, res) => {
  // change all results before 20.08.2022 to published (to show them in the history gradebook)
  await db.result.updateMany({createdAt: {$lte: new Date('2022-08-25T21:01:51.986Z')}},{$set:{"published": "true"}})
  res.status(200).json({ message: "Updated successfully" });
}

// Get database models
exports.getDatabaseModels = async (req, res) => {
  let modelNames = mongoose.modelNames()
  res.status(200).json({ modelNames: modelNames });
}

// Prepere database diagram to dipslay 
exports.getDatabaseDiagram = async (req, res) => {

  
  function extractDataForDiagram(schema, name) {
    
    let models = ''
    // Fields
    let references = ``
    let fields = ``

    for (let [fieldName, field] of Object.entries(schema.paths)) {
      if (field.Constructor?.schema){
        let nestedReferenceName = fieldName+"-schema"
        references += `\n\t${name} }o--|{ ${nestedReferenceName} : "${name}.${fieldName + "-->" + nestedReferenceName}"`
        models += extractDataForDiagram(field.Constructor?.schema, nestedReferenceName)
      }


      // Dots and underscores are invalid syntax for `mermaid`
      if (!fieldName.includes('.') && Array.from(fieldName)[0] != "_") {

        let fieldLine = `\n \t\t${field.instance} ${fieldName}`
        if (field.options?.enum?.length) {
          fieldLine += `"${field.options?.enum}"`
        }
        fields += fieldLine
      }

      // References
      let referenceName = undefined
      if (field.instance == "Array" && field?.caster?.options?.ref) referenceName = field.caster.options.ref
      else if (field.instance == "ObjectID") referenceName = field.options.ref

      if (referenceName) {
        references += `\n\t${name} }o--|{ ${referenceName} : "${name}.${fieldName + "-->" + referenceName}"`
      }


    }
    // Format element
    let model = ``
    model += references
    model +=`\n\t${name} {${fields}\n\t}`
    models+=model

    return models 
  }


  var diagram = `erDiagram`
  let modelNames = req.query?.modelNames?.length ?  req.query.modelNames : mongoose.modelNames()
  for (let [index, modelName] of modelNames.entries()) {
    // Load model
    let model = mongoose.model(modelName)
    let data = extractDataForDiagram(model.schema, modelName)
    // Add data to diagram
    diagram += data

  }
  //console.log(diagram)

  res.status(200).json({ diagram: diagram.replaceAll('\t', '  ') });

};

exports.removeDatabase = async (req, res) => {
  db.academicYearRef?.deleteMany().exec()
  db.book?.deleteMany().exec()
  db.categoryRef?.deleteMany().exec()
  db.certificate?.deleteMany().exec()
  db.certificationSession?.deleteMany().exec()
  db.chapter?.deleteMany().exec()
  db.company?.deleteMany().exec()
  db.competence?.deleteMany().exec()
  db.competenceBlock?.deleteMany().exec()
  db.content?.deleteMany().exec()
  db.contentFile?.deleteMany().exec()
  db.contentImage?.deleteMany().exec()
  db.courseImage?.deleteMany().exec()
  db.coursePathImage?.deleteMany().exec()
  db.course?.deleteMany().exec()
  db.ecosystem?.deleteMany().exec()
  db.event?.deleteMany().exec()
  db.examinate?.deleteMany().exec()
  db.gradingScaleRef?.deleteMany().exec()
  db.group?.deleteMany().exec()
  db.interest?.deleteMany().exec()
  db.internship?.deleteMany().exec()
  db.enquiry?.deleteMany().exec()
  db.subjectSession?.deleteMany().exec()
  db.softSkillsTemplate?.deleteMany().exec()
  db.softSkill?.deleteMany().exec()
  db.course?.deleteMany().exec()
  db.coursePath?.deleteMany().exec()
  db.log?.deleteMany().exec()
  db.mail?.deleteMany().exec()
  // db.module?.deleteMany().exec()
  db.moduleCore?.deleteMany().exec()
  db.report?.deleteMany().exec()
  db.result?.deleteMany().exec()
  db.rolePermissionRef?.deleteMany().exec()
  db.softSkillsTemplate?.deleteMany().exec()
  db.subinterest?.deleteMany().exec()
  db.tip?.deleteMany().exec()
  db.trainingModule?.deleteMany().exec()
  db.team?.deleteMany().exec()
  db.trainingPath?.deleteMany().exec()
  db.user?.deleteMany().exec()
  db.project?.deleteMany().exec()
  db.permissions?.deleteMany().exec()
  db.roleMaster?.deleteMany().exec()
  db.rolePermissionsMapping?.deleteMany().exec()

  //remove data from search-engine
  db.certificationSession.esTruncate();
  db.content.esTruncate();

  res.status(200).json({ message: "Deleted successfully" })
  
}

exports.addEvents = async (req, res) => {
}

exports.addResults = async (req, res) => {
}

exports.removeOldResults = async (req, res) =>{
}

exports.updateLevels = async (req, res) =>{
  let userLevels = [
    { _id: '611ab0aed26a78469b421e4c', level: '10B' },
    { _id: '611ba3cb33fb477938066ac2', level: '11B' },
    { _id: '6123a180f231b2b40994445d', level: '8' },
    { _id: '6123a180f231b20b7294445e', level: '7' },
    { _id: '6123a180f231b2823994445f', level: '8' },
    { _id: '6123a180f231b22393944460', level: '8' },
    { _id: '6123a180f231b21ba0944461', level: '9A' },
    { _id: '6123a180f231b2ebf3944462', level: '7' },
    { _id: '6123a180f231b256f6944463', level: '9A' },
    { _id: '6123a180f231b235e9944464', level: '9A' },
    { _id: '6123a180f231b2ff11944465', level: '8' },
    { _id: '6123a180f231b25b67944466', level: '8' },
    { _id: '6123a180f231b243da944467', level: '9B' },
    { _id: '6123a180f231b24d9e944468', level: '9B' },
    { _id: '6123a180f231b2dfbe944469', level: '9B' },
    { _id: '6123a181f231b2e5e694446a', level: '9B' },
    { _id: '6123a181f231b2131d94446b', level: '9B' },
    { _id: '6123a181f231b2b70d94446c', level: '9B' },
    { _id: '6123a181f231b272fb94446d', level: '9B' },
    { _id: '6123a181f231b217c494446e', level: '9B' },
    { _id: '6123a181f231b2bcc994446f', level: '9B' },
    { _id: '6123a181f231b28470944470', level: '9B' },
    { _id: '6123a181f231b22c98944471', level: '9B' },
    { _id: '6123a181f231b2da75944472', level: '9B' },
    { _id: '6123a181f231b21d46944473', level: '9B' },
    { _id: '6123a181f231b2d964944474', level: '9B' },
    { _id: '6123a181f231b2a0de944475', level: '9B' },
    { _id: '6123a181f231b265db944476', level: '9B' },
    { _id: '6123a181f231b24966944477', level: '9B' },
    { _id: '6123a181f231b26ec7944478', level: '9B' },
    { _id: '6123a181f231b25032944479', level: '9B' },
    { _id: '6123a181f231b27b4f94447a', level: '10B' },
    { _id: '6123a181f231b285d594447b', level: '10B' },
    { _id: '6123a181f231b2109b94447c', level: '10B' },
    { _id: '6123a181f231b2e3dd94447d', level: '10B' },
    { _id: '6123a181f231b29a8994447e', level: '10B' },
    { _id: '6123a181f231b2b7e394447f', level: '10B' },
    { _id: '6123a181f231b28867944480', level: '10B' },
    { _id: '6123a181f231b27ccc944481', level: '10B' },
    { _id: '6123a181f231b221d9944482', level: '11B' },
    { _id: '6123a181f231b241a0944483', level: '10B' },
    { _id: '6123a181f231b28a3f944484', level: '10B' },
    { _id: '6123a181f231b26059944485', level: '10B' },
    { _id: '6123a181f231b281e7944486', level: '10B' },
    { _id: '6123a181f231b26713944487', level: '10B' },
    { _id: '6123a181f231b205ff944488', level: '10B' },
    { _id: '6123a494f231b2c758945486', level: '10B' },
    { _id: '6123a494f231b21306945487', level: '10B' },
    { _id: '6123a494f231b2406b945488', level: '11B' },
    { _id: '6123a494f231b21e0e945489', level: '11B' },
    { _id: '6123a494f231b2969294548a', level: '11B' },
    { _id: '6123a494f231b2121694548b', level: '11B' },
    { _id: '6123a494f231b2889a94548c', level: '11B' },
    { _id: '6123a494f231b22bb994548d', level: '11B' },
    { _id: '6123a494f231b24c6394548e', level: '11B' },
    { _id: '6123a494f231b2794394548f', level: '11B' },
    { _id: '6123a494f231b22001945490', level: '11B' },
    { _id: '6123a511f231b2f067945726', level: '11B' },
    { _id: '6123a511f231b292e1945727', level: '11B' },
    { _id: '6123a511f231b20464945728', level: '11B' },
    { _id: '6123a511f231b20e50945729', level: '11B' },
    { _id: '6123a511f231b21b2894572a', level: '11B' },
    { _id: '6123a511f231b2111c94572b', level: '11B' },
    { _id: '6123a511f231b221c894572c', level: '11B' },
    { _id: '6123a511f231b2077b94572d', level: '11B' },
    { _id: '6123a511f231b2f82a94572e', level: '11B' },
    { _id: '6123a511f231b2e5b994572f', level: '11B' },
    { _id: '6123a511f231b2d934945730', level: '11B' },
    { _id: '6123a511f231b2a765945731', level: '11B' },
    { _id: '6123a511f231b2cce2945732', level: '11B' },
    { _id: '6123a511f231b243a3945733', level: '11B' },
    { _id: '6123a511f231b217d5945734', level: '11B' },
    { _id: '6123a511f231b299cf945735', level: '11B' },
    { _id: '6123a511f231b2135f945736', level: '11B' },
    { _id: '6123a511f231b2190e945737', level: '11B' },
    { _id: '6123a511f231b2d6d0945738', level: '11B' },
    { _id: '6123a511f231b2f9c1945739', level: '11B' },
    { _id: '6123a511f231b2ee6994573a', level: '11B' },
    { _id: '6123a511f231b2180494573b', level: '11B' },
    { _id: '6123a511f231b2820994573c', level: '11B' },
    { _id: '6123a511f231b208d494573d', level: '11B' },
    { _id: '6123a512f231b29a4a94573e', level: '11B' },
    { _id: '6123a512f231b2617794573f', level: '11B' },
    { _id: '6123a512f231b20cb5945740', level: '11B' },
    { _id: '6123a512f231b278b6945741', level: '11B' },
    { _id: '61287e03a4a86f79d79350a9', level: '10B' },
    { _id: '61287e11a4a86f7e139353b6', level: '11B' },
    { _id: '61287e1da4a86f6f2b9356c7', level: '9A' },
    { _id: '612a020e8cdf12951d60a324', level: '9B' },
    { _id: '614dd46981b17b41a71871b9', level: '9A' },
    { _id: '6155b5f48ad875da2ec44e32', level: '8' },
    { _id: '6155b68f8ad8757f7bc454cf', level: '9B' },
  ]

  await User.bulkWrite(
    userLevels.map(u => 
      ({updateOne: {
        filter: { _id : u._id },
        update: { $set: {'settings.level': u.level} },
        upsert: false
      }})
    )
  )
  res.status(200).json("Updated levels")
}

exports.updateContentLevels = async (req, res) =>{
  let contents = await db.content.find({level: ['INTERMEDIATE','ADVANCED','BEGINNER']})
    console.warn("Number of content updated: ",contents.length)
    let data = {
      BEGINNER:contents.filter(x=>x.level=='BEGINNER').map(x=>x._id),
      INTERMEDIATE:contents.filter(x=>x.level=='INTERMEDIATE').map(x=>x._id),
      ADVANCED:contents.filter(x=>x.level=='ADVANCED').map(x=>x._id)};
    await db.content.bulkWrite(
      contents.map(u => 
        ({updateMany: {
          filter: { level : 'BEGINNER' },
          update: { $set: {level: '1'} },
          upsert: false
        }})
      )
    )
    await db.content.bulkWrite(
      contents.map(u => 
        ({updateMany: {
          filter: { level : 'INTERMEDIATE' },
          update: { $set: {level: '9A'} },
          upsert: false
        }})
      )
    )
    await db.content.bulkWrite(
      contents.map(u => 
        ({updateMany: {
          filter: { level : 'ADVANCED' },
          update: { $set: {level: '12'} },
          upsert: false
        }})
      )
    )
    console.info(data)
    res.status(200).json(data)
}

exports.insertDefaultCoefficientToExams = async (req, res) =>{
  let events = await db.event.updateMany({examCoefficient: {$exists: false}},{$set:{examCoefficient:1}})
  console.warn("Number of content updated: ",events.length)
  res.status(200).json(events)
}

exports.updateRoles = async (req, res) =>{
  let users = await db.user.updateMany( 
    { 'settings.roleName': {$exists : 1}}, 
    [{ 
      $set: { "settings.role": "$settings.roleName", "settings.availableRoles": ["$settings.roleName"], "settings.defaultRole": "$settings.roleName"},
    }]
    )
  let users_unset = await db.user.updateMany( 
    {'settings.roleName': {$exists : 1}}, 
    [{ 
      $unset: ["settings.roleName"],
    }]
    )
  let users2 = await db.user.updateMany( // 2nd iteration of updating the same fields
    { 'settings.role': {$exists : 1}}, 
    [{ 
      // $set: { "settings.defaultRole": "$settings.role"}
      $set: { "settings.availableRoles": ["$settings.role"], "settings.defaultRole": "$settings.role"},
    }]
    )
    res.status(200).json({users,users_unset,users2})
}


/**
 * @openapi
 * /api/v1/admin/migrations/{migrationName}:
 *   post:
 *     description: Executing migration based on the name provided in URL parameter
 *     tags:
 *       - _admin 
 *     parameters:
 *       - name: migrationName
 *         in: path
 *         required: true
 *         type: string
 *         description: Name of the migration to run
 *         example: runTextExtractionForAllFiles
 *     responses:
 *       200:
 *         description: Scheduled text extraction for 10 files.
 */
exports.runMigration = async (req, res) => {
  if (req.params.migrationName === "runTextExtractionForAllFiles") {
    let files = await db.contentFile.find({})
    files.forEach(file => {
      tasker.addTask({ task: "EXTRACT_TEXT_FROM_FILE", fileId: file._id }, 'text-extracting', (error) => {
        if (error) console.log(error)
      })
    })
    res.status(200).json({ message: `Scheduled text extraction for ${files.length} files.` });
  }
  else if (req.params.migrationName === "updateContentPageElements") {
    let contents = await db.content.find({})
     
    for (var i = 0; i < contents.length; i++) {
      var content = contents[i];
      console.log('Updating', content._id)

      for (var j = 0; j < content.pages.length; j++) {
        var page = content.pages[j];
        for (var k = 0; k < page.elements.length; k++) {
          var element = page.elements[k]
          let file = await db.contentFile.findOne({ 'fileName': element.fileName }).catch(err => console.log(err))
          if (file){
            console.log('-> file', file._id)
            element.file = file._id;
            element.fileName = undefined;
            element.fileOriginalName = undefined;
            element.fileTextExtracted = undefined;
          }
          if (element.testId){
            element.test = ObjectId(element.testId);
            console.log('-> test', element.testId)
            element.testName = undefined;
            element.testId = undefined;
          }
        }
      }
      await content.save()
    }
    res.status(200).json({ message: `Updated successfully ${contents.length} contents` });
  }
  else if (req.params.migrationName === "processResults") {
    let results = await db.result.find({ 'content': { $in: braincoreTestsIds } }, { data: 0 })
      .sort({ updatedAt: 'desc' })
    results.forEach(result => {
        tasker.addTask({ task: "PROCESS_RESULTS", resultId: result._id }, 'results', (err) => {
          if (err) console.error(err);
        })
    })
    res.status(200).json({ message: `Scheduled processing for ${results.length} results.` });
  }
  else if (req.params.migrationName === "processNewResults") {
    let results = await db.result.find({ 'content': { $in: braincoreTestsIds }, $or: [{ traits: { $exists: false } }, { traits: {} }] }, { data: 0 })
      .sort({ updatedAt: 'desc' })
    results.forEach(result => {
      tasker.addTask({ task: "PROCESS_RESULTS", resultId: result._id }, 'results', (err) => {
        if (err) console.error(err);
      })
    })
    res.status(200).json({ message: `Scheduled processing for ${results.length} results.` });
  }
  else if (req.params.migrationName === "toEnglish") {
    await db.user.updateMany({}, { $set: { "settings.language": "en", "settings.origin":"en_GB" } }).catch(err => console.log(err))
    res.status(200).json({ message: `Set detault language to English for all users.` });
  }
  else if (req.params.migrationName === "fillInterest") {
    // if details.subinterests is empty, fill it with details.subinterests
    await db.user.updateMany(
      { $or: [
        { 'details.subinterests': { $exists: false } },
        { 'details.subinterests': { $size: 0 } }
        // { $exists: false }, { $exists: true, "details.subinterests":[]}
      ] 
      }, 
      { $set: { "details.subinterests": [69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83] } } // well-being
      ).catch(err => console.log(err))
      
    res.status(200).json({ message: `Set detault interest to 'well-being' for all users.` });
  }
  else if (req.params.migrationName === "manageTrainersChapters") {
    let groups = await db.group.find({}).populate({ 
      path: 'program.duplicatedTrainingPath', 
      populate: { path: 'trainingModules.chosenChapters.chapter', select: 'origin' },
    }).lean().exec()
    // let groupTree = 
    groups.forEach(group => {
      // group: group._id,
      // dtps: 
      group.program.forEach(program => {
        // dtp: program.duplicatedTrainingPath._id,
        // trainingModules: 
        program.duplicatedTrainingPath.trainingModules.forEach(tm => {
          // tm: tm.originalTrainingModule,
          // chapters: 
          let trainer = program.assignment.find(a=>a.trainingModule.equals(tm.originalTrainingModule))?.trainers?.[0]||null
          if(trainer) {
            tm.chosenChapters.filter(_=>_.chapter).forEach(async chapter => {
              let chapters = chapter.chosenContents.map(content => content.content)
              if (chapters.length > 0) {
                let kk = await db.chapter.updateOne({ _id: chapter.chapter.origin }, 
                  { $addToSet: { 
                    otherContentsByTrainers: {
                      contents: chapters,
                      trainingModule: tm.originalTrainingModule,
                      trainer: trainer
                    }
                  }}
                
                ).catch(err => console.log(err))
                console.log("chapter update: ",kk)
                // ch: chapter.chapter._id,
                // origin: chapter.chapter.origin,
                // // contents: chapter.chosenContents.map(content => content.content),
                // body: {
                  //   contents: chapter.chosenContents.map(content => content.content),
                  //   trainingModule: tm.originalTrainingModule,
                  //   trainer: program.assignment.find(a=>a.trainingModule==tm.originalTrainingModule)?.trainers[0]||null
                  // }
                } else {
                  console.log("No content for this chapter: ", chapter.chapter._id)
                }
            })
          } else {
            console.log("No trainer found for this tm: ", tm.originalTrainingModule)
          }
        })
      })
    })
    res.status(200).json({ message: `Updated successfully!!` });
  }
  else if (req.params.migrationName === "fixTypo_BEGGINER") {
    await db.certificationSession.updateMany({level: "BEGGINER"}, {$set: {level: "BEGINNER"}})
    res.status(200).json({ message: `Fixed BEGGINER level` });
  }
  else if (req.params.migrationName === "add_deleted_courses") {
    // add deleted course with periodId = 62fb99e6f0877d0009cec877
    let courses = [
      {_id:"63051e07d39acc0009efeb88", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeaf1", createdAt: "2022-08-23T18:35:51.924Z", updatedAt: "2022-08-23T18:35:51.924Z"},
      {_id:"63051e07d39acc0009efeb8a", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeb0d", createdAt: "2022-08-23T18:35:51.925Z", updatedAt: "2022-08-23T18:35:51.925Z"},
      {_id:"63051e07d39acc0009efeb8c", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeb1d", createdAt: "2022-08-23T18:35:51.926Z", updatedAt: "2022-08-23T18:35:51.926Z"},
      {_id:"63051e07d39acc0009efeb8e", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeb43", createdAt: "2022-08-23T18:35:51.926Z", updatedAt: "2022-08-23T18:35:51.926Z"},
      {_id:"63051e07d39acc0009efeb90", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeb3b", createdAt: "2022-08-23T18:35:51.927Z", updatedAt: "2022-08-23T18:35:51.927Z"},
      {_id:"63051e07d39acc0009efeb92", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeaf9", createdAt: "2022-08-23T18:35:51.928Z", updatedAt: "2022-08-23T18:35:51.928Z"},
      {_id:"63051e07d39acc0009efeb94", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeae1", createdAt: "2022-08-23T18:35:51.929Z", updatedAt: "2022-08-23T18:35:51.929Z"},
      {_id:"63051e07d39acc0009efeb96", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeafd", createdAt: "2022-08-23T18:35:51.930Z", updatedAt: "2022-08-23T18:35:51.930Z"},
      {_id:"63051e07d39acc0009efeb98", group:"62fb9a0bf0877d0009ceca84", period:"62fb99e6f0877d0009cec877",trainingModule:"63051e07d39acc0009efeb31", createdAt: "2022-08-23T18:35:51.930Z", updatedAt: "2022-08-23T18:35:51.930Z"},
      {_id:"63051ee4d39acc0009f01ba3", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01b18", createdAt: "2022-08-23T18:39:32.549Z", updatedAt: "2022-08-23T18:39:32.549Z"},
      {_id:"63051ee4d39acc0009f01ba5", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01ade", createdAt: "2022-08-23T18:39:32.550Z", updatedAt: "2022-08-23T18:39:32.550Z"},
      {_id:"63051ee4d39acc0009f01ba7", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01b32", createdAt: "2022-08-23T18:39:32.551Z", updatedAt: "2022-08-23T18:39:32.551Z"},
      {_id:"63051ee4d39acc0009f01ba9", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01aee", createdAt: "2022-08-23T18:39:32.551Z", updatedAt: "2022-08-23T18:39:32.551Z"},
      {_id:"63051ee4d39acc0009f01bab", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01b40", createdAt: "2022-08-23T18:39:32.552Z", updatedAt: "2022-08-23T18:39:32.552Z"},
      {_id:"63051ee4d39acc0009f01bad", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01b08", createdAt: "2022-08-23T18:39:32.553Z", updatedAt: "2022-08-23T18:39:32.553Z"},
      {_id:"63051ee4d39acc0009f01bb1", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01af8", createdAt: "2022-08-23T18:39:32.555Z", updatedAt: "2022-08-23T18:39:32.555Z"},
      {_id:"63051ee4d39acc0009f01bb3", group:"6303ab317d6c0b000a7a9b7a", period:"62fb99e6f0877d0009cec877",trainingModule:"63051ee4d39acc0009f01b2c", createdAt: "2022-08-23T18:39:32.556Z", updatedAt: "2022-08-23T18:39:32.556Z"},
      {_id:"630520fed39acc0009f06f48", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06da6", createdAt: "2022-08-23T18:48:30.752Z", updatedAt: "2022-08-23T18:48:30.752Z"},
      {_id:"630520fed39acc0009f06f4a", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d3a", createdAt: "2022-08-23T18:48:30.753Z", updatedAt: "2022-08-23T18:48:30.753Z"},
      {_id:"630520fed39acc0009f06f4c", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d2c", createdAt: "2022-08-23T18:48:30.753Z", updatedAt: "2022-08-23T18:48:30.753Z"},
      {_id:"630520fed39acc0009f06f4e", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d46", createdAt: "2022-08-23T18:48:30.754Z", updatedAt: "2022-08-23T18:48:30.754Z"},
      {_id:"630520fed39acc0009f06f50", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d4e", createdAt: "2022-08-23T18:48:30.755Z", updatedAt: "2022-08-23T18:48:30.755Z"},
      {_id:"630520fed39acc0009f06f52", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d72", createdAt: "2022-08-23T18:48:30.755Z", updatedAt: "2022-08-23T18:48:30.755Z"},
      {_id:"630520fed39acc0009f06f54", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d60", createdAt: "2022-08-23T18:48:30.756Z", updatedAt: "2022-08-23T18:48:30.756Z"},
      {_id:"630520fed39acc0009f06f56", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d7c", createdAt: "2022-08-23T18:48:30.756Z", updatedAt: "2022-08-23T18:48:30.756Z"},
      {_id:"630520fed39acc0009f06f58", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d86", createdAt: "2022-08-23T18:48:30.757Z", updatedAt: "2022-08-23T18:48:30.757Z"},
      {_id:"630520fed39acc0009f06f5a", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06d94", createdAt: "2022-08-23T18:48:30.758Z", updatedAt: "2022-08-23T18:48:30.758Z"},
      {_id:"630520fed39acc0009f06f5c", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06db8", createdAt: "2022-08-23T18:48:30.763Z", updatedAt: "2022-08-23T18:48:30.763Z"},
      {_id:"630520fed39acc0009f06f5e", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06dc8", createdAt: "2022-08-23T18:48:30.764Z", updatedAt: "2022-08-23T18:48:30.764Z"},
      {_id:"630520fed39acc0009f06f60", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06dd2", createdAt: "2022-08-23T18:48:30.765Z", updatedAt: "2022-08-23T18:48:30.765Z"},
      {_id:"630520fed39acc0009f06f62", group:"6303ab317d6c0b000a7a9b7c", period:"62fb99e6f0877d0009cec877",trainingModule:"630520fed39acc0009f06dde", createdAt: "2022-08-23T18:48:30.766Z", updatedAt: "2022-08-23T18:48:30.766Z"},
      {_id:"63052214d39acc0009f08b5b", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a58", createdAt: "2022-08-23T18:53:08.050Z", updatedAt: "2022-08-23T18:53:08.050Z"},
      {_id:"63052214d39acc0009f08b5d", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f089d8", createdAt: "2022-08-23T18:53:08.051Z", updatedAt: "2022-08-23T18:53:08.051Z"},
      {_id:"63052214d39acc0009f08b5f", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a1e", createdAt: "2022-08-23T18:53:08.052Z", updatedAt: "2022-08-23T18:53:08.052Z"},
      {_id:"63052214d39acc0009f08b61", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a0c", createdAt: "2022-08-23T18:53:08.052Z", updatedAt: "2022-08-23T18:53:08.052Z"},
      {_id:"63052214d39acc0009f08b63", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a3a", createdAt: "2022-08-23T18:53:08.053Z", updatedAt: "2022-08-23T18:53:08.053Z"},
      {_id:"63052214d39acc0009f08b65", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f089e4", createdAt: "2022-08-23T18:53:08.053Z", updatedAt: "2022-08-23T18:53:08.053Z"},
      {_id:"63052214d39acc0009f08b67", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a30", createdAt: "2022-08-23T18:53:08.055Z", updatedAt: "2022-08-23T18:53:08.055Z"},
      {_id:"63052214d39acc0009f08b69", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f089f6", createdAt: "2022-08-23T18:53:08.055Z", updatedAt: "2022-08-23T18:53:08.055Z"},
      {_id:"63052214d39acc0009f08b6b", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a46", createdAt: "2022-08-23T18:53:08.056Z", updatedAt: "2022-08-23T18:53:08.056Z"},
      {_id:"63052214d39acc0009f08b6d", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a02", createdAt: "2022-08-23T18:53:08.057Z", updatedAt: "2022-08-23T18:53:08.057Z"},
      {_id:"63052214d39acc0009f08b6f", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a6a", createdAt: "2022-08-23T18:53:08.062Z", updatedAt: "2022-08-23T18:53:08.062Z"},
      {_id:"63052214d39acc0009f08b71", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a7c", createdAt: "2022-08-23T18:53:08.062Z", updatedAt: "2022-08-23T18:53:08.062Z"},
      {_id:"63052214d39acc0009f08b73", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a90", createdAt: "2022-08-23T18:53:08.063Z", updatedAt: "2022-08-23T18:53:08.063Z"},
      {_id:"63052214d39acc0009f08b75", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08a9a", createdAt: "2022-08-23T18:53:08.064Z", updatedAt: "2022-08-23T18:53:08.064Z"},
      {_id:"63052214d39acc0009f08b77", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08ab2", createdAt: "2022-08-23T18:53:08.064Z", updatedAt: "2022-08-23T18:53:08.064Z"},
      {_id:"63052214d39acc0009f08b79", group:"62fb9a0bf0877d0009ceca82", period:"62fb99e6f0877d0009cec877",trainingModule:"63052213d39acc0009f08aba", createdAt: "2022-08-23T18:53:08.065Z", updatedAt: "2022-08-23T18:53:08.065Z"},
      {_id:"630522dbd39acc0009f0d1e7", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf99", createdAt: "2022-08-23T18:56:27.804Z", updatedAt: "2022-08-23T18:56:27.804Z"},
      {_id:"630522dbd39acc0009f0d1e9", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf37", createdAt: "2022-08-23T18:56:27.805Z", updatedAt: "2022-08-23T18:56:27.805Z"},
      {_id:"630522dbd39acc0009f0d1eb", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf25", createdAt: "2022-08-23T18:56:27.806Z", updatedAt: "2022-08-23T18:56:27.806Z"},
      {_id:"630522dbd39acc0009f0d1ed", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf19", createdAt: "2022-08-23T18:56:27.807Z", updatedAt: "2022-08-23T18:56:27.807Z"},
      {_id:"630522dbd39acc0009f0d1ef", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf7b", createdAt: "2022-08-23T18:56:27.809Z", updatedAt: "2022-08-23T18:56:27.809Z"},
      {_id:"630522dbd39acc0009f0d1f1", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf87", createdAt: "2022-08-23T18:56:27.810Z", updatedAt: "2022-08-23T18:56:27.810Z"},
      {_id:"630522dbd39acc0009f0d1f3", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf5f", createdAt: "2022-08-23T18:56:27.810Z", updatedAt: "2022-08-23T18:56:27.810Z"},
      {_id:"630522dbd39acc0009f0d1f5", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf71", createdAt: "2022-08-23T18:56:27.811Z", updatedAt: "2022-08-23T18:56:27.811Z"},
      {_id:"630522dbd39acc0009f0d1f7", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf4d", createdAt: "2022-08-23T18:56:27.812Z", updatedAt: "2022-08-23T18:56:27.812Z"},
      {_id:"630522dbd39acc0009f0d1f9", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cf43", createdAt: "2022-08-23T18:56:27.813Z", updatedAt: "2022-08-23T18:56:27.813Z"},
      {_id:"630522dbd39acc0009f0d1fb", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cfab", createdAt: "2022-08-23T18:56:27.817Z", updatedAt: "2022-08-23T18:56:27.817Z"},
      {_id:"630522dbd39acc0009f0d1fd", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cfbd", createdAt: "2022-08-23T18:56:27.818Z", updatedAt: "2022-08-23T18:56:27.818Z"},
      {_id:"630522dbd39acc0009f0d1ff", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cfd1", createdAt: "2022-08-23T18:56:27.819Z", updatedAt: "2022-08-23T18:56:27.819Z"},
      {_id:"630522dbd39acc0009f0d201", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cfdb", createdAt: "2022-08-23T18:56:27.820Z", updatedAt: "2022-08-23T18:56:27.820Z"},
      {_id:"630522dbd39acc0009f0d203", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cff3", createdAt: "2022-08-23T18:56:27.822Z", updatedAt: "2022-08-23T18:56:27.822Z"},
      {_id:"630522dbd39acc0009f0d205", group:"62fb9a0bf0877d0009ceca80", period:"62fb99e6f0877d0009cec877",trainingModule:"630522dbd39acc0009f0cffb", createdAt: "2022-08-23T18:56:27.822Z", updatedAt: "2022-08-23T18:56:27.822Z"},
      {_id:"630661aa896afa0009e9a7f2", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a5fc", createdAt: "2022-08-24T17:36:42.372Z", updatedAt: "2022-08-24T17:36:42.372Z"},
      {_id:"630661aa896afa0009e9a7f4", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a568", createdAt: "2022-08-24T17:36:42.373Z", updatedAt: "2022-08-24T17:36:42.373Z"},
      {_id:"630661aa896afa0009e9a7f6", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a57c", createdAt: "2022-08-24T17:36:42.374Z", updatedAt: "2022-08-24T17:36:42.374Z"},
      {_id:"630661aa896afa0009e9a7f8", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a59e", createdAt: "2022-08-24T17:36:42.375Z", updatedAt: "2022-08-24T17:36:42.375Z"},
      {_id:"630661aa896afa0009e9a7fa", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a5bc", createdAt: "2022-08-24T17:36:42.376Z", updatedAt: "2022-08-24T17:36:42.376Z"},
      {_id:"630661aa896afa0009e9a7fc", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a5a8", createdAt: "2022-08-24T17:36:42.377Z", updatedAt: "2022-08-24T17:36:42.377Z"},
      {_id:"630661aa896afa0009e9a7fe", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a58e", createdAt: "2022-08-24T17:36:42.378Z", updatedAt: "2022-08-24T17:36:42.378Z"},
      {_id:"630661aa896afa0009e9a800", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661a9896afa0009e9a5d0", createdAt: "2022-08-24T17:36:42.379Z", updatedAt: "2022-08-24T17:36:42.379Z"},
      {_id:"630661aa896afa0009e9a802", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a5e8", createdAt: "2022-08-24T17:36:42.380Z", updatedAt: "2022-08-24T17:36:42.380Z"},
      {_id:"630661aa896afa0009e9a804", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a5ee", createdAt: "2022-08-24T17:36:42.381Z", updatedAt: "2022-08-24T17:36:42.381Z"},
      {_id:"630661aa896afa0009e9a806", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a60e", createdAt: "2022-08-24T17:36:42.387Z", updatedAt: "2022-08-24T17:36:42.387Z"},
      {_id:"630661aa896afa0009e9a808", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a61c", createdAt: "2022-08-24T17:36:42.388Z", updatedAt: "2022-08-24T17:36:42.388Z"},
      {_id:"630661aa896afa0009e9a80a", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a62e", createdAt: "2022-08-24T17:36:42.389Z", updatedAt: "2022-08-24T17:36:42.389Z"},
      {_id:"630661aa896afa0009e9a80c", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a642", createdAt: "2022-08-24T17:36:42.390Z", updatedAt: "2022-08-24T17:36:42.390Z"},
      {_id:"630661aa896afa0009e9a80e", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a654", createdAt: "2022-08-24T17:36:42.391Z", updatedAt: "2022-08-24T17:36:42.391Z"},
      {_id:"630661aa896afa0009e9a810", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a660", createdAt: "2022-08-24T17:36:42.392Z", updatedAt: "2022-08-24T17:36:42.392Z"},
      {_id:"630661aa896afa0009e9a812", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a678", createdAt: "2022-08-24T17:36:42.393Z", updatedAt: "2022-08-24T17:36:42.393Z"},
      {_id:"630661aa896afa0009e9a814", group:"63066041896afa0009e98179", period:"62fb99e6f0877d0009cec877",trainingModule:"630661aa896afa0009e9a694", createdAt: "2022-08-24T17:36:42.394Z", updatedAt: "2022-08-24T17:36:42.394Z"},
      {_id:"630ded41a3157800092519de", group:"630dec08a31578000924f43d", period:"62fb99e6f0877d0009cec877",image:"630decd9a31578000925078e", trainingModule:"630ded41a3157800092519bf", createdAt: "2022-08-30T10:58:09.544Z", updatedAt: "2022-12-22T17:22:16.032Z"},
      {_id:"631f7e98e86de30009f26f92", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26dcf", createdAt: "2022-09-12T18:46:48.903Z", updatedAt: "2022-09-12T18:46:48.903Z"},
      {_id:"631f7e98e86de30009f26f94", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d55", createdAt: "2022-09-12T18:46:48.905Z", updatedAt: "2022-09-12T18:46:48.905Z"},
      {_id:"631f7e98e86de30009f26f96", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d63", createdAt: "2022-09-12T18:46:48.907Z", updatedAt: "2022-09-12T18:46:48.907Z"},
      {_id:"631f7e98e86de30009f26f98", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d77", createdAt: "2022-09-12T18:46:48.908Z", updatedAt: "2022-09-12T18:46:48.908Z"},
      {_id:"631f7e98e86de30009f26f9a", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d6f", createdAt: "2022-09-12T18:46:48.909Z", updatedAt: "2022-09-12T18:46:48.909Z"},
      {_id:"631f7e98e86de30009f26f9c", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d89", createdAt: "2022-09-12T18:46:48.910Z", updatedAt: "2022-09-12T18:46:48.910Z"},
      {_id:"631f7e98e86de30009f26f9e", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26d9b", createdAt: "2022-09-12T18:46:48.911Z", updatedAt: "2022-09-12T18:46:48.911Z"},
      {_id:"631f7e98e86de30009f26fa0", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26daf", createdAt: "2022-09-12T18:46:48.913Z", updatedAt: "2022-09-12T18:46:48.913Z"},
      {_id:"631f7e98e86de30009f26fa2", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26da5", createdAt: "2022-09-12T18:46:48.914Z", updatedAt: "2022-09-12T18:46:48.914Z"},
      {_id:"631f7e98e86de30009f26fa4", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26dbd", createdAt: "2022-09-12T18:46:48.915Z", updatedAt: "2022-09-12T18:46:48.915Z"},
      {_id:"631f7e98e86de30009f26fa6", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26de1", createdAt: "2022-09-12T18:46:48.921Z", updatedAt: "2022-09-12T18:46:48.921Z"},
      {_id:"631f7e98e86de30009f26fa8", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26df1", createdAt: "2022-09-12T18:46:48.922Z", updatedAt: "2022-09-12T18:46:48.922Z"},
      {_id:"631f7e98e86de30009f26faa", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26dfb", createdAt: "2022-09-12T18:46:48.923Z", updatedAt: "2022-09-12T18:46:48.923Z"},
      {_id:"631f7e98e86de30009f26fac", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26e07", createdAt: "2022-09-12T18:46:48.925Z", updatedAt: "2022-09-12T18:46:48.925Z"},
      {_id:"631f7e98e86de30009f26fae", group:"631f7d0fe86de30009f22f94", period:"62fb99e6f0877d0009cec877",trainingModule:"631f7e98e86de30009f26e11", createdAt: "2022-09-12T18:46:48.926Z", updatedAt: "2022-09-12T18:46:48.926Z"},      
    ]
    await SubjectSessions.insertMany(courses)
    res.status(200).json({ message: `Deleted courses are back in DB` });
  }
  else if (req.params.migrationName === "fix_duplicate_chapter") {
    // in trainingPath
    let chapterFreqAll = {}
    let duplicatedChapters = []
    let trainingPaths = await db.trainingPath.find({}, (err,tps)=>{
      if(err) console.log(err)
      else {
        tps = tps.map(tp=>{
          tp.trainingModules = tp.trainingModules.map(tm=>{
            let chapterFreq = {}
            tm.chosenChapters.forEach(chapter=>{
              if(chapterFreq[chapter.chapter]) chapterFreq[chapter.chapter]++
              else chapterFreq[chapter.chapter] = 1

              if(chapterFreqAll[chapter.chapter]) chapterFreqAll[chapter.chapter]++
              else chapterFreqAll[chapter.chapter] = 1
            })
            tm.chosenChapters = tm.chosenChapters.map(chapter=>{
              if(chapterFreq[chapter.chapter]>1) {
                duplicatedChapters.push(chapter.chapter)
                let allContents = tm.chosenChapters.filter(_=>_.chapter==chapter.chapter).map(_=>_.chosenContents).flat()
                chapter.chosenContents = allContents
                chapterFreq[chapter.chapter] = 1
              }
              return chapter
            })
            return tm
          })
          return tp
        })
        // await db.trainingPath.updateMany({},{$set: {trainingModules: tps.trainingModules}},(err,updated)=>{
        //   if(err) console.log(err)
        //   else res.status(200).json({ message: `Fixed duplicate chapters`, duplicatedChapters, chapterFreqAll, updated });
        // })
        res.status(200).json({ message: `Fixed duplicate chapters`, duplicatedChapters, chapterFreqAll, tps });
      }
    })
    console.log("trainingPaths: ",trainingPaths.map(tp=>tp._id))
  }
  else if (req.params.migrationName === "replace_same_duplicated_contents") {
    let tp = await db.trainingPath.find({origin: { $exists: true }}).lean().exec()
    let contentIds = tp.flatMap(tp=>tp.trainingModules.flatMap(tm=>tm.chosenChapters.flatMap(ch=>ch.chosenContents.map(c=>c.content))))
    // count frequency of contentIds
    let contentIdsCount = contentIds.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});
    // discard contentIds that are used only once
    // effective contentIds to be in the new training path
    // let effectiveContentIds = {}
    for (const [key, value] of Object.entries(contentIdsCount)) {
      if (value == 1) delete contentIdsCount[key];
    }
    // let test = contentIds.map(c=>contentIdsCount[c]>1?([c]:contentIdsCount[c]):null)

  
    // count total number of contents when frequency is > 1
    let total = Object.keys(contentIdsCount).reduce((acc, cur) => {
      if(contentIdsCount[cur]>1) acc += contentIdsCount[cur]
      return acc;
    }, 0);
    // get contentIds
    let contentIdsToReplace = Object.keys(contentIdsCount)
    console.log("🚀 ~ file: admin.controller.js ~ line 397 ~ exports.runMigration= ~ contentIdsToReplace", contentIdsToReplace)
    let affectedTPs = tp.filter(tp=>tp.trainingModules.some(tm=>tm.chosenChapters.some(ch=>ch.chosenContents.some(c=>contentIdsToReplace.includes(c.content.toString())))))
    // get all duplicated contents
    let duplicatedContents = await db.content.find({_id: { $in: contentIdsToReplace }}).lean().exec()
    let affected = {
      tp: affectedTPs?.length||0,
      content: duplicatedContents?.length||0,
      event: 0,
      result: 0,
      sessionProgress: 0,
      completedContent: 0,
    }
    // replace contentIds in trainingPath with a new copy of the content
    for (let i = 0; i < affectedTPs.length; i++) {
      console.log("affectedTPs[i]", i)
      var trainingPath = affectedTPs[i];
      for (let j = 0; j < trainingPath.trainingModules.length; j++) {
        console.log("trainingPath.trainingModules[j]", j)
        var trainingModule = trainingPath.trainingModules[j];
        for (let k = 0; k < trainingModule.chosenChapters.length; k++) {
          console.log("trainingModule.chosenChapters[k]", k)
          var chosenChapter = trainingModule.chosenChapters[k];
          for (let l = 0; l < chosenChapter.chosenContents.length; l++) {
            console.log("chosenChapter.chosenContents[l]", l)
            var chosenContent = chosenChapter.chosenContents[l];
            if(contentIdsToReplace.includes(chosenContent.content.toString())) {
              let proceedToCopy = contentIdsCount[chosenContent.content.toString()]>1
              if(proceedToCopy) {
                let duplicatedContent = duplicatedContents.find(dc=>dc._id.toString()==chosenContent.content.toString())
                console.log("duplicatedContent", duplicatedContent)
                if(duplicatedContent) {
                  let newContent = await db.content.create({
                    ...duplicatedContent, 
                    _id: new ObjectId(), 
                    origin: duplicatedContent.origin||duplicatedContent._id, 
                    createdAt: new Date(), 
                    updatedAt: new Date(),
                  })
                  console.log("Replacing content: ", chosenContent.content, " with ", newContent._id)
                  chosenContent.content = newContent._id
                  contentIdsCount[chosenContent.content.toString()]--
                  // update affected event
                  let updatedEvents = await db.event.updateMany({
                    assignedChapter: chosenChapter.chapter,
                    assignedContent: chosenContent.content
                  }, {
                    $set: {
                      assignedContent: newContent._id
                    }
                  })
                  affected.event += updatedEvents.nModified
                  // update affected results
                  let updatedResults = await db.result.updateMany({ $or: [
                    { content: chosenContent.content },
                    // { event: { $in: updatedEvents?.map(e=>e._id)||[] } }
                  ]}, {
                    $set: {
                      content: newContent._id
                    }
                  })
                  affected.result += updatedResults.nModified
                  // update affected userProgress in user.sessionProgress
                  let updatedUserProgress = await db.user.updateMany({
                    "sessionProgress.latestChapterId": chosenChapter.chapter,
                    "sessionProgress.latestContentId": chosenContent.content
                  }, {
                    $set: {
                      "sessionProgress.$.latestContentId": newContent._id
                    }
                  })
                  affected.sessionProgress += updatedUserProgress.nModified
                  // update affected userProgress in user.settings.completed
                  let updatedUserProgress2 = await db.user.updateMany({
                    "settings.completed.contents": chosenContent.content
                  }, {
                    $set: {
                      "settings.completed.contents.$": newContent._id
                    }
                  })
                  affected.sessionProgress += updatedUserProgress2.nModified
                }
              }
            }
          }
        }
      }
      await db.trainingPath.updateOne({_id: trainingPath._id}, trainingPath)
    }
    // res.status(200).json({ message: `Replaced ${total} duplicated contents` });
    res.status(200).json({ contentIdsCount, contentIdsToReplace , total, affectedTPs, duplicatedContents, affected });
  }
  else if (req.params.migrationName === "setModuleManagerScope") {
    // regex scope name for "moduels:"
    await db.user.updateMany(
      { 'settings.availableRoles': 'ModuleManager', 'scopes.name': { $ne: 'modules:free:free' } },
      { $push: { 'scopes': { 'name': 'modules:free:free' } } })
    res.status(200).json({ message: `Set ModuleManager scope for all module managers` });
  }
  else if (req.params.migrationName === "combineAccessedURLLogs") {
    let logs = await db.log.find({ 'action': 'active'})
    logs.forEach(log => {
      let newAccessedURLs = [];
      log.accessedURLs.forEach(accessedURL=>{
        let existing = newAccessedURLs.find(url => url.name == accessedURL.name)
        if (existing) {
          // Sum all inTime for url
          existing.inTime += accessedURL.inTime;
          // Save latest date
          if (accessedURL.date > existing.date) existing.date = accessedURL.date
        }
        else newAccessedURLs.push(accessedURL)

      })

      // Override accessedURLs with combined accessedURLs 
      log.accessedURLs = newAccessedURLs;
      log.save()
    })
    res.status(200).json({ message: `Combined accessedURL for ${logs.length} logs.` });
    
  
  }
  else if (req.params.migrationName === "setIsDeleted") {
    // set isDeleted false to users
    await db.user.updateMany(
      { isDeleted: { $exists: false } },
      { $set: { isDeleted: false } })
    res.status(200).json({ message: `Set isDeleted false to Users` });
  }
  else if (req.params.migrationName === "permissionsListChange") {
    // drop permissions table
    await db.permissions.deleteMany({});
    // drop rolemasters table
    await db.roleMaster.deleteMany({});
    // drop role permissions mappings table
    await db.rolePermissionsMapping.deleteMany({});
    await utils.createPermissions(); // permissions
    await utils.createRoleMasters(); // RoleMasters
    await utils.createRolePermissionsMappings(); // Role Permissions Mappings
    res.status(200).json({ message: `Permissions List Changes Updated`});
  }
  else if (req.params.migrationName === "addReadScopeForBrainElemTrainingCenter") {
    await db.user.updateMany(
    { 'settings.defaultRole': 'Trainee', 'scopes': {$exists : 1}, 'scopes.name': { $ne: 'modules:read:200004000080000000000000' }}, 
    { $push: { scopes: {name: "modules:read:200004000080000000000000"} } },
    )

    res.status(200).json({ message: `Updated`});
  }
  else if (req.params.migrationName === "reverseQuestions_26_05_23") {
    let results = await db.result.find({ 'content': { $in: adultTestsIds } }).sort({ updatedAt: 'desc' })
    results.forEach(result => {
      let questions_ids = ['10365', '10539', '10447', '10259', '10183']
      if (result.content == '60aaaaef2b4c80000732fdf5') questions_ids.push('10461')

      for (let quesitonId of questions_ids) {
        let oldAnswer = result.data[quesitonId]
        let newAnswer = (7 - parseInt(oldAnswer)).toString()
        console.log('Change', quesitonId, ': ', oldAnswer, '->', newAnswer)
        result.data[quesitonId] = newAnswer
      }
      result.markModified('data');
      result.save()
    })
    res.status(200).json({ message: `Reveresed ${results.length} results.` });
  }
  else if (req.params.migrationName === "team2teams") {
    // change User.team to User.teams and add the user.team value to user.teams
    let users = await db.user.find({ team: { $exists: true } }).lean().exec()
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      // user.teams = [user.team]
      // eliminate user.team filed from user completely because it is no longer in the model and set user.teams 
      await db.user.updateOne({ _id: user._id }, { $set: { teams: [user.team] } })
    }
    await db.user.updateMany({ team: { $exists: true } }, { $unset: { team: "" } }) //  this is to remove `team` field from user but can not work without keeping `team` field in user model
    res.status(200).send({ message: `Updated ${users.length} users.`, users });
  } 
  else if (req.params.migrationName === "displayListOfAllContent") {

    let contents = await Content.find({$and : [
      { newerVersion : {$exists: false}},
      { owner: {$exists: true} },
      { module: "611aaea2d26a784c58421d3b" }, // NEMESIS 
      { title: {$exists: true} },
      { chapter: {$exists: true} },
      { trainingModule: {$exists: true} },
      { origin: {$exists: false} },
      ]},
      ).select("-_id title capsule createdAt")
      .populate({path: "owner", select: 'name surname -_id'})
      .populate({path: "chapter", select: 'name -_id'})
      .populate({path: "trainingModule", select: 'name -_id'}).sort({ createdAt: -1 });
  
      // Iterate through the contents and update the 'capsule' field if it's empty or undefined
      for (const content of contents) {
        if (!content.capsule) {
          content.capsule = '-';
        }
      }
      const util = require('util')
      console.log(util.inspect(contents, { maxArrayLength: null }))
      res.status(200).send({ message: "check backend logs"});
  } else if (req.params.migrationName === "fixBrainCoreStatuses") {
    // Fix statuses for users imported from TM
    let users = await db.user.find()
    var countUsers = 0;
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let latestResult = await cognitiveUtils.getLatestBrainCoreResultForUser(user._id, { _id: 1, createdAt: 1, content: 1});
      let bcTest = { ...user.brainCoreTest }
      // If results does not exists and status is Completed - change status to awaiting
      if (!latestResult && user?.brainCoreTest?.status == 'Completed') {
        bcTest.completionDate = null
        if (bcTest.registerDate) {// If request was sent
          bcTest.status = 'Request sent'
        } else bcTest.status = 'Not Completed'
        countUsers+=1;
        user.brainCoreTest = bcTest;
        await user.save();
      }
      // If results exists and status is not Completed
      else if (latestResult && user?.brainCoreTest?.status != 'Completed') {
        // Do only if register date is missing or it is older than latest result date
        // it means that invitation was sent before user took the test
        if (!bcTest.registerDate ||
          (new Date(bcTest.registerDate) < new Date(latestResult.createdAt))) {
          bcTest.completionDate = new Date(latestResult.createdAt)
          bcTest.registerDate = new Date(latestResult.createdAt)
          bcTest.requestDate = new Date(latestResult.createdAt)
          bcTest.status = 'Completed'
          countUsers+=1;
          user.brainCoreTest = bcTest;
          await user.save();
        } else {
          // User took the test after invitation, but status for some reason is not Completed
          bcTest.status = 'Completed'
          bcTest.completionDate = new Date(latestResult.createdAt)
          countUsers+=1;
          user.brainCoreTest = bcTest;
          await user.save();
        }
      }
    }
    res.status(200).send({ message: `Updated ${countUsers} from ${users.length} users`, users });
  }


  else res.status(404).send("Could not find migration with such name.")
}