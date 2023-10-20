const fs = require('fs');
const Content = require("../models/content.model");
const Result = require("../models/result.model");
const ContentFile = require("../models/content_file.model");
const ContentImage = require("../models/content_image.model");
const db = require("../models");
const User = db.user;
const Chapter = require("../models/chapter.model");
const ObjectId = require("mongodb").ObjectId;
const resultUtils = require("../utils/result");
const contentAuthUtils = require("../utils/contentAuth");
const ResultUtils = require("../utils/result")
const { getRawQueryForContent } = require("../utils/searchEngine");
const Group = require('../models/group.model');
const tasker = require('../utils/tasker/tasker')
const extract = require('extract-zip');
const { user } = require('../models');
const {braincoreTestsIds} = require("../utils/braincoreTestsIds");

/**
 * @openapi
 * /api/v1/contents/:
 *   get:
 *     description: Get all contents from database, which are avaliable for the user. It is used to load contents in `Explore`
 *     tags:
 *      - _contents
 *     parameters:
 *       - name: contentCategory
 *         in: query
 *         required: true
 *         type: string
 *         default: owned
 *         enum:
 *          - owned-recent
 *          - owned
 *          - cocreated
 *          - cocreated-recent
 *          - taken
 *          - taken-recent
 *         description: |
 *            The category of requested content can be one of the following
 *             - owned - Content which belongs to the user,
 *             - owned-recent - Content which belongs to the user and has been created recentyly
 *             - cocreated - Content which can be cocreated by the user,
 *             - cocreated-recent - Content which can be cocreated by the user and has been created recentyly,
 *             - taken -  Content which has been taken by the user,
 *             - taken-recent -  Content which has been recently taken by the user.
 *       - name: contentType
 *         in: query
 *         required: false
 *         type: string
 *         default: ALL
 *         enum:
 *          - ALL
 *          - TEST
 *          - PRESENTATION
 *          - ASSET
 *         description: The type of the content.
 *     responses:
 *       200:
 *         description: List of contents
 */
exports.getContents = async (req, res) => {
  const contentType = req.query.contentType;
  const contentCategory = req.query.contentCategory;

  var searchOptions = { "archivedByLibrarian": false};
  searchOptions._id = {$nin: braincoreTestsIds}
  var limit = null;// Do not limit by default;
  let sortField = 'createdAt'
  // Type
  if (contentType.toUpperCase() == "TEST") searchOptions.contentType = "TEST";
  else if (contentType.toUpperCase() == "PRESENTATION") searchOptions.contentType = "PRESENTATION";
  else if (contentType.toUpperCase() == "ASSET") searchOptions.contentType = "ASSET";

  // Category
  if (contentCategory == "owned") {
    searchOptions.owner = req.userId;
  } else if (contentCategory == "taken-recent") {
    searchOptions.attendees = { $elemMatch: { _id: req.userId } }; 
    delete searchOptions.origin 
    delete   searchOptions._id
    //searchOptions.contentType = {$ne: 'ASSET'}
  } else if (contentCategory == "owned-recent") {
    searchOptions.owner = req.userId;
    // When accepted - hide source //////
    //searchOptions["$or"] = [{libraryStatus: {$ne: 'ACCEPTED'}}]
    
    
    sortField = 'updatedAt'
    limit = 8;
  } else if (contentCategory == "cocreated-recent") {
    searchOptions.cocreators = req.userId;


    // When accepted - hide source //////
    //searchOptions["$or"] = [{libraryStatus: {$ne: 'ACCEPTED'}}]


    limit = 8;
    sortField = 'updatedAt'
  } else if (contentCategory == "cocreated") {
    searchOptions.cocreators = req.userId;
    //searchOptions["$or"] = [{libraryStatus: {$ne: 'ACCEPTED'}}]
  } else {
    res.status(404).json({ message: 'Content category must be one of the following: owned, cocreated, taken.' });
    return;
  }

  let sortObject = {};
  sortObject[sortField] = -1
  let contents = await Content.find(searchOptions, { 'pages.elements.answers': 0, 'pages.elements.title': 0, 'pages.elements.correctAnswer': 0,'pages.elements.choices': 0 })
    .populate({ path: "trainingModule" })
    .populate({ path: "owner", select: ['name', 'surname'] })
    .sort(sortObject)
    .limit(limit)

  let modified = []
  for (let content of contents) {
    modified.push({
      ...content.toObject(),
      canEdit: (await contentAuthUtils.canEditContent(req.userId, content._id, req.moduleId)).status
    })
  }


  if (contentCategory == "taken-recent"){
    for (let [index,content] of modified.entries()){
      // Find attendee
      let attendee = content.attendees.find(a=>a._id==req.userId)
      // Set time of last activity
      modified[index].lastActive = new Date(attendee.lastActive)

      // Calculate progress
      let progress  = 0;
      var numberOfPages = content.pages.length
      // If each element is a page - calculate number of elements
      if (content.questionsOnPageMode == 'questionPerPage'){
        numberOfPages = 0;
        for (let p of content.pages){
          numberOfPages += p?.elements?.length??0
        } 
        
      }
      if (numberOfPages) progress = 100*((attendee.currentPageNumber??0)/numberOfPages)
      if (progress==100) progress = 90//100 only for finished
      // If 100 check if results exists
      let resultExists = await Result.exists({user: req.userId, content: content._id})
      if (resultExists) progress = 100
      


      modified[index].progress = progress
    }
    modified.sort((a,b)=>b.lastActive - a.lastActive)
    // Limit to 8 contents
    modified = modified.slice(0, 4)
  }

  res.status(200).json(modified);
};


/**
 * @openapi
 * /api/v1/contents/:
 *   post:
 *     description: | 
 *       Add new content based on data from request body.
 *       Object must follow all the rules from ContentSchema, 
 *       otherwise the validation errors will be returned when saving to database. 
 *     tags:
 *      - _contents
 *     parameters:
 *       - name: content
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - contentType
 *           properties:
 *             content:
 *                type: object
 *                properties:
 *                  title:
 *                     type: string
 *                     example: 'Example of title'
 *                  contentType:
 *                     type: string
 *                     example: TEST
 *                  pages:
 *                     type: array
 *                     items: 
 *                       type: object
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Created successfully
 *            contentId:
 *              type: string
 *              example: <_id>
 */
exports.add = async (req, res) => { // Action for adding single content 
  let content = new Content(req.body.content)

  if (content.sendToCloud) {
    content.cloudStatus = "AWAITING"
    content.libraryStatus = "AWAITING"
    content.sendToLibrary = true;
  } else content.libraryStatus = content.sendToLibrary ? "AWAITING" : "PRIVATE"
    
  content.owner = req.userId;
  // Overide existing timestamps
  content.createdAt = undefined
  content.updatedAt = undefined

  // temporarily push all contents to chapter // TODOJULY
  await Chapter.findOneAndUpdate( 
    { _id: content.chapter },
    { $push: { "assignedContent": content._id } },
    { runValidators: true })

  // For some users(self-registered/root) moduleId is set to 0
  if (req.moduleId) content.module = req.moduleId;

  // Restore async saving to handle errors in proper way
  // using content.save() was always returning 200 regardless of saving process
  content.save(function (err, content) {
    if (err) res.status(500).send({ message: err });
    else res.status(200).json({ message: "Created successfully", contentId: content._id }); 
    // no need anymore to add content to "assignedContent" in chapters, as it's done once librarian approves it
  });
};


/**
 * @openapi
 * /api/v1/contents/{contentId}:
 *   put:
 *     description: | 
 *       Edit existing content based on data from request body.
 *       Object must follow all the rules from ContentSchema, 
 *       otherwise the validation errors will be returned when saving to database. 
 *     tags:
 *      - _contents
 *     parameters:
 *       - name: contentId
 *         in: path
 *         required: true
 *         type: string
 *         description: Id of content to edit
 *       - name: content
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *                type: object
 *                properties:
 *                  title:
 *                     type: string
 *                     example: 'New title'
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Updated successfully
 *            contentId:
 *              type: string
 *              example: <id>
 */
exports.edit = async (req, res) => { // Action for editing single content
  var content = { ...req.body.content }

  // `_id` should be passed in `req.params.contentId`, 
  // for some reason it was replaced with `content._id`...
  // I will leave it here, just in case.
  let oldContentId = req.params.contentId??content._id 
  let existingContent = await db.content.findById(oldContentId).select('libraryStatus cloudStatus edition')
  let cs = existingContent.cloudStatus, ls = existingContent.libraryStatus

  
  //check if content was accepted previously
  if ((cs && cs === "ACCEPTED")|| (ls && ls === "ACCEPTED")) {
    // Create duplicate of content
    var newContentId = new ObjectId();
    content = new Content({ ...req.body.content })
    content._id = newContentId

    // increase edition counter
    content.edition = existingContent.edition||1 + 1
    
    // Set statuses
    if (content.sendToCloud) {
      content.cloudStatus = "AWAITING"
      content.libraryStatus = "AWAITING"
      content.sendToLibrary = true;
    } else content.libraryStatus = content.sendToLibrary ? "AWAITING" : "PRIVATE"

    // Saving duplicate of content
    await content.save()

    // Update originan/source content
    let oldContent = await Content.findOneAndUpdate({ _id: oldContentId }, 
      { $set: {
        newerVersion: newContentId,
      }}, 
      { runValidators: true, returnOriginal: false }) 
    // Reindex in elasticsearch
    oldContent.index();
    // Send response
    res.status(200).json({ message: "Updated successfully", contentId: newContentId });
    return;
  }

  // Set statuses
  if (content.sendToCloud) {
    content.cloudStatus = "AWAITING"
    content.libraryStatus = "AWAITING"
    content.sendToLibrary = true;
  } else content.libraryStatus = content.sendToLibrary ? "AWAITING" : "PRIVATE"


  // update `chapter` by removing old content ID from there 
  await Chapter.findOneAndUpdate(
    { "assignedContent": content._id },
    { $pull: { "assignedContent": content._id } },
    { multi: true, runValidators: true }
  );

  // temporarily push all contents to chapter // 
  await Chapter.findOneAndUpdate(
    { _id: content.chapter },
    { $addToSet: { assignedContent: content._id } },
    { runValidators: true }
  );

  // Update content
  let newContent = await Content.findOneAndUpdate({ "_id": oldContentId }, content, { runValidators: true, returnOriginal: false })
  newContent.index();// Reindex in elasticsearch
  // Send response
  res.status(200).json({ message: "Updated successfully", contentId: newContent._id });
};

// Locking all elemets - will be hidden from trainees
exports.lockAllElements = async (req, res) => {
  Content.findById(req.params.contentId, (err, content) => {
    if (err) res.status(500).send({ message: err });
    else if (!content) res.status(404).send({ message: "Content not found" });
    else {
      // Lock elements
      content.pages.forEach(page => {
        page.elements.forEach(element => {
          element.locked = true;
        })
      })
      content.save({timestamps: false}, (err) => {
        if (err) res.status(500).send({ message: err });
        res.status(200).json({ message: "Elements unlocked successfully" });
      })
    }
  })
};

// Unlocking all elemets - will be visible to trainees
exports.unlockAllElements = async (req, res) => {
  Content.findById(req.params.contentId, (err, content) => {
    if (err) res.status(500).send({ message: err });
    else if (!content) res.status(404).send({ message: "Content not found" });
    else {
      // Unlock elements
      content.pages.forEach(page => {
        page.elements.forEach(element => {
          element.locked = false;
        })
      })
      content.save({timestamps: false}, (err) => {
        if (err) res.status(500).send({ message: err });
        res.status(200).json({ message: "Elements unlocked successfully" });
      })
    }
  })
};

// Locking the elemet - will be hidden from trainees
exports.lockElement = async (req, res) => {
  Content.findById(req.params.contentId, (err, content) => {
    if (err) res.status(500).send({ message: err });
    else if (!content) res.status(404).send({ message: "Content not found" });
    else {

      // Lock element
      let found = content.pages.some(page => {
        let element = page.elements.find(element => element.name == req.params.elementName)
        if (element){
          element.locked = true;
          return true
        }else return false;
      })
      if (!found) return res.status(404).send({ message: "Element not found" });
      
      content.save({timestamps: false}, (err) => {
        if (err) res.status(500).send({ message: err });
        res.status(200).json({ message: "Elements unlocked successfully" });
      })
    }
  })
};
// Unlocking the elemet - will be visible to trainees
exports.unlockElement = async (req, res) => {
  Content.findById(req.params.contentId, (err, content) => {
    if (err) res.status(500).send({ message: err });
    else if (!content) res.status(404).send({ message: "Content not found" });
    else {
      // Unlock element
      let found = content.pages.some(page => {
        let element = page.elements.find(element => element.name == req.params.elementName)
        if (element){
          element.locked = false;
          return true
        }else return false;
      })
      if (!found) return res.status(404).send({ message: "Element not found" });

      content.save({timestamps: false}, (err) => {
        if (err) res.status(500).send({ message: err });
        res.status(200).json({ message: "Elements unlocked successfully" });
      })
    }
  })
};

exports.delete = async (req, res) => { // Action for deleting single content
  let content = await Content.findOneAndDelete({ "_id": req.params.contentId });
  content.unIndex();// Reindex in elasticsearch
  res.status(200).json({ message: "Deleted successfully" });
};

exports.getAllLevels = async (req, res) => {
  res.status(200).json(await Content.schema.path('level').enumValues); // get enum array/values from model
};

exports.uploadFile = async (req, res) => { // Action for uploading files

  let cFile = { fileName: req.file.filename, fileOriginalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size }
  let file = await ContentFile.create(cFile)
  tasker.addTask({ task: "EXTRACT_TEXT_FROM_FILE", fileId: file._id }, 'text-extracting', (error) => {
    if (error) console.error("Could not schedule EXTRACT_TEXT_FROM_FILE")
  })
  res.status(200).json(file);
};

exports.getFileDetails = async (req, res) => { // Action for reading file details
  let file = await ContentFile.findOne({ '_id': req.params.fileId })
  if (!file) res.status(404).send({ message: "File not found." });
  else res.status(200).json(file);
}

exports.downloadFile = async (req, res) => { // Action for downloading files
  let file = await ContentFile.findOne({ '_id': req.params.fileId })
  if (!file) res.status(404).send({ message: "File not found." });
  else {
    console.log('Downloadinig file',file.fileName, file.mimeType)
    if (['application/zip','application/x-zip-compressed'].includes(file.mimeType)){
      let extratedZipPath = `/app/public/tmp/scorm/${file.fileName}`
      if (!fs.existsSync(extratedZipPath)){ // If does not exits
        fs.mkdirSync(extratedZipPath, { recursive: true })// Create directory
        await extract('/app/public/content/files/' + file.fileName, { dir: extratedZipPath })//Extract files
      }
      // Zip was already extracted
      // Check if it's SCORM
      let indexExits = fs.existsSync(`${extratedZipPath}/index.html`)
      if (indexExits){
        res.redirect(`/api/v1/static/scorm/${file.fileName}`);
        return;
      }
    }
    res.setHeader('Content-disposition', `inline; filename=${encodeURIComponent(file.fileName)}`);
    res.setHeader('Content-originalname', encodeURIComponent(file.fileOriginalName));
    res.setHeader('Content-type', file.mimeType);

    res.sendFile('/app/public/content/files/' + file.fileName);
  }
};

exports.uploadImage = async (req, res) => { // Action for uploading files
  let cImage = { fileName: req.file.filename, fileOriginalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size }
  let image = await ContentImage.create(cImage)
  res.status(200).json(image);
};


function findBestMatchingImage(tags) {
  var interestsNames = {};
  var insterestsString = '';
  tags.forEach(tag => {
    let interestName;
    if (tag.interest) interestName = tag.interest.name.toLowerCase();
    else interestName = tag.parent.toLowerCase()

    if (interestName in interestsNames) interestsNames[interestName] += 1;
    else {
      insterestsString += interestName;
      interestsNames[interestName] = 1;
    }
  })

  let sortedInterestsNames = Object.keys(interestsNames).sort(function (a, b) { return interestsNames[b] - interestsNames[a] })
  var category = "general-knowledge"//Default
  if (sortedInterestsNames.length) category = sortedInterestsNames[0].replace(/ /g, '-');
  var categoryFiles = fs.readdirSync(`/app/public/content/images/categories/`);
  categoryFiles = categoryFiles.filter(name => { return name.startsWith(category) })
  let number = (insterestsString.replace(/ /g, '').replace(/ *\([^)]*\) */g, "").length % categoryFiles.length)
  let fileName = categoryFiles[number];
  return fileName;

}

exports.findBestMatchingImageUrl = async (req, res) => { // Action for finding image
  let fileName = findBestMatchingImage(req.body.tags);
  res.status(200).json(`/api/v1/contents/categories/images/${fileName}/download/`)
}


exports.downloadImage = async (req, res) => { // Action for downloading image
  if (req.params.contentId){
    let content = await Content.findById(req.params.contentId).populate({"path": "tags", 'populate': {"path": "interest"}})
      if (!content) res.status(404).send({ message: "Content not found." });
      else if (!content.image) {
        let fileName = findBestMatchingImage(content.tags);
        let filePath = `/app/public/content/images/categories/${fileName}`
        res.sendFile(filePath);
      } else {
        let image = await ContentImage.findById(content.image)
        if (!image) res.status(404).send({ message: "Image not found." });
        else res.sendFile(`/app/public/content/images/${image.fileName}`);
      }
  } else if (req.params.imageId){
    let image = await ContentImage.findById(req.params.imageId)
    if (!image) res.status(404).send({ message: "Image not found." });
    else res.sendFile(`/app/public/content/images/${image.fileName}`);
  } else if (req.params.imageName){
    let fileName = req.params.imageName.replace('..', '').replace('./', '');
    let filePath = `/app/public/content/images/categories/${fileName}`
    res.sendFile(filePath, {dotfiles: 'deny'});
  }
  else res.status(404).send({ message: "Image not found." });
}

exports.getImageDetails = async (req, res) => { // Action for downloading image
  let image = await ContentImage.findById(req.params.imageId)
  if (!image) res.status(404).send({ message: "Image not found." });
  else res.status(200).json(image)
};

exports.getContent = async (req, res) => { // Get content from database
  let content = await Content.findOne({ '_id': req.params.contentId })
    .populate({ path: "owner", select: ['_id', 'email', 'name', 'surname', 'settings'] })
    .populate({ path: "books" })
    .populate({path: "tags", select: 'name'})
    .populate({ path: "chapter", select: ['name'] })
    .populate({ path: "trainingModule", select: ['name'] })
    .populate({'path': 'gradingScale', 'select': ['passPercentage', 'grades']})
  if (!content) res.status(404).send({ message: "Content not found." });
  else { 
    let results = await Result.find({ 'content': req.params.contentId, event: { $exists:false },  $and: [{'user': req.userId}, {'user': {$ne: undefined}}] }, { "_id": 1, "createdAt": 1, "event": 1 }).sort('-createdAt')
    
    // If grading scale is not assigned to a content
    // Find deafult gradingScale in the module
    // This is usefull for PRESENTATION in groupExamintationViewForQuestions
    let gradingScale = content.gradingScale
    if (!gradingScale && req.moduleId){
      let moduleCore = await db.moduleCore.findOne({moduleId: req.moduleId}).populate(['defaultGradingScale', 'gradingScales']).exec()
      gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
    }
    
    // Transform into object
    content = content.toObject()

    // Transform choices to list of objects
    // SurveJS is inconsistence and allows to types of choices
    // ['a','b] and [{text: 'a', value: 0},{text: 'b', value: 1}]
    // We transform it to the second format 
    for (let [pageIndex, page] of content?.pages?.entries()) {
      if (page.elements) {
        for (let [elementIndex, element] of page?.elements?.entries()) {
          if (element.choices && element.type == 'radiogroup') {
            for (let [choiceIndex, choice] of element.choices?.entries()) {
              if (typeof choice === 'string' || choice instanceof String) {
                content.pages[pageIndex].elements[elementIndex].choices[choiceIndex] = {text: choice, value: choice}
              }
            }

          }
        }
      }
    }


    let response = {
      ...content,
      gradingScale: gradingScale,
      canExamine: (await contentAuthUtils.canExamineContent(req.userId, req.params.contentId, req.moduleId)).status,
      canEdit: (await contentAuthUtils.canEditContent(req.userId, req.params.contentId, req.moduleId)).status,
      results
    }

    //###########################################
    // Find tm and chapter for content which is inside program/trainig-path
    if (content.origin){// If content has origin - Try to find training-path containing this content
      let tp = await db.trainingPath.findOne({ "trainingModules.chosenChapters.chosenContents.content": content._id}).populate([{path: "trainingModules.originalTrainingModule", select:['name','origin','chapters']},{path: "trainingModules.chosenChapters.chapter", select:['name','origin']}]).lean()
      if (tp){// If such training-path exists find group which has it assigned
        let group = await db.group.findOne({ "program.duplicatedTrainingPath": tp._id }).lean()
        if (group){// If group exists - find proper program inside this group
          let program = group.program.find(p=>p.duplicatedTrainingPath.equals(tp._id))
          response['program'] = program;
          // Find training-module and chapter for content
          var programTrainingModule, programChapter;
          tp.trainingModules.some(tm=>{
            return tm.chosenChapters.some(ch=>{
              return ch.chosenContents.some(c=>{
                if (c.content.equals(content._id)){
                  response['programTrainingModule'] = tm;
                  response['programChapter'] = ch;
                  return  true
                }
                return false
              })
            })
          })
        }
      }
    }//############################################

    res.status(200).json(response);
  }
};
exports.isContentUsedInSession = async (req, res) => { // Get content from database
  let isUsed = await db.trainingPath.exists({ "trainingModules.chosenChapters.chosenContents.content": req.params.contentId });
  res.status(200).json({isUsed});
};

// Get all event data for group Examination view
exports.readForExamination = async (req, res) => {
  let contentId = req.params.contentId
  let content = await Content.findById(contentId)
  .populate({ path: "chapter", select: ['name'] })
  .populate({ path: "trainingModule", select: ['name'] })
  .populate({ path: "gradingScale"})

  let usersIds = [];
  let users = []
  let conditions = {content: contentId, event: { $exists:false }}
  if (req.params.groupId){ 
    let group = await Group.findById(req.params.groupId).exec()
    if (!group) res.status(404).send({ message: "Group not found." });
    usersIds=group.trainees;
  }else{
    let results = await Result.find(conditions, {user: 1}).sort('-createdAt').exec()
    results.forEach(r=>{if (!usersIds.includes(r.user)) usersIds.push(r.user)})
  }

  users = await User.find({_id:  { $in: usersIds}})
  
  let stats = await resultUtils.getStats(users, req.moduleId, content._id)
  // If grading scale is not assigned to a content
  // Find deafult gradingScale in the module
  // This is usefull for PRESENTATION in groupExamintationViewForQuestions
  let gradingScale = content.gradingScale
  if (!gradingScale){
    let moduleCore = await db.moduleCore.findOne({moduleId: req.moduleId}).populate(['defaultGradingScale', 'gradingScales']).exec()
    gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
  }
  var output = {
    content: {...content.toObject(), gradingScale: gradingScale},
    stats: stats
  }

  return res.status(200).json(output);

}

exports.getContentOverview = async (req, res) => {
  // Get overview of content from database
  let content = await Content.findOne({ '_id': req.params.contentId })
    .populate({ path: "owner", select: ['_id', 'email', 'name', 'surname', 'settings'] })
    .populate({ path: "cocreators" })
    .populate({ path: "tags" })
    .populate({'path': 'gradingScale', 'select': ['passPercentage', 'grades']})
    .populate({ path: "chapter", select: ['name'] })
    .populate({ path: "trainingModule", select: ['name'] })
  if (!content) res.status(404).send({ message: "Content not found." });
  else {
    let results = await Result.find({ 'content': req.params.contentId, event: { $exists:false }, $and: [{'user': req.userId}, {'user': {$ne: undefined}}] }, { "_id": 1, "createdAt": 1, "event": 1 }).sort('-createdAt')
    
    // Remove all elements from content
    // Can't be done for the moment as it's used to display results
    // 
    // let emptyPages = content.pages.map(page=>{
    //   let emptyElements = page.elements.map(element=>{return {type: element.type, subtype: element.subtype}})
    //   return {...page.toObject(), elements: emptyElements};
    // })
    // let emptyContent = {...content.toObject(), pages: emptyPages}

    // If grading scale is not assigned to a content
    // Find deafult gradingScale in the module
    // This is usefull for PRESENTATION in groupExamintationViewForQuestions
    let gradingScale = content.gradingScale
    if (!gradingScale && req.moduleId){
      let moduleCore = await db.moduleCore.findOne({moduleId: req.moduleId}).populate(['defaultGradingScale', 'gradingScales']).exec()
      gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
    }

    let response = {
      ...content.toObject(),
      gradingScale: gradingScale,
      canDisplay: (await contentAuthUtils.canDisplayContent(req.userId, req.params.contentId, req.moduleId)).status,
      canExamine: (await contentAuthUtils.canExamineContent(req.userId, req.params.contentId, req.moduleId)).status,
      canEdit: (await contentAuthUtils.canEditContent(req.userId, req.params.contentId, req.moduleId)).status,
      results,
    }
    res.status(200).json(response);
  }
};


/**
 * @openapi
 * /api/v1/contents/suggest:
 *   get:
 *     description: | 
 *       Suggest contents names with ElasticSearch. It may be used for autocomplete function in search bar. It's almost the same as search function, but only titles are returned.
 *     tags:
 *      - _contents
 *     parameters:
 *       - name: query
 *         in: query
 *         type: string
 *         description: Term used to find contents
 *       - name: contentType
 *         in: query
 *         type: string
 *         enum:
 *          - TEST
 *          - PRESENTATION
 *          - ASSET
 *         description: The type of the content. When not provided it will return all types.
 *       - name: from
 *         in: query
 *         type: intiger
 *         default: 0
 *         description: The from parameter defines the number of hits to skip, defaulting to 0.
 *       - name: size
 *         in: query
 *         type: intiger
 *         default: 15
 *         description: The size parameter is the maximum number of hits to return.
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          example: {hits: {hits: [ _index: "contents", _source: {"title": "BrainCore test"}]}}
 */
exports.suggest = async (req, res) => {
  let from=req.query.from??0
  let size = req.query.size??15
  let rawQuery = await getRawQueryForContent(req.query.query, req.userId, req.query.contentType, false, undefined, from, size)
  await Content.esSearch(rawQuery, async function (err, results) {
    if (err) res.status(500).send({ message: err });
    else{
      results.hits.hits = results.hits.hits.map(h=>{return {...h, _source: {title: h._source.title, contentType: h._source.contentType}}})
      res.status(200).json(results);
    } 
  });
};

/**
 * @openapi
 * /api/v1/contents/search:
 *   get:
 *     description: | 
 *       Search for contents with ElasticSearch. 
 *       It will search using all indexed informations including title, description, tags, all elements and attached files.
 *     tags:
 *      - _contents
 *     parameters:
 *       - name: query
 *         in: query
 *         type: string
 *         description: Term used to find contents
 *       - name: contentType
 *         in: query
 *         type: string
 *         enum:
 *          - TEST
 *          - PRESENTATION
 *          - ASSET
 *         description: The type of the content. When not provided it will return all types.
 *       - name: searchRecommended
 *         in: query
 *         type: boolean
 *         default: false
 *         description: Instead of using query, search for all available contents and then sort them using `vortical` score
 *       - name: interestId
 *         in: query
 *         type: intiger
 *         description: Additionally to query, search for all available contents which has been tagged with provided interestId 
 *       - name: from
 *         in: query
 *         type: intiger
 *         default: 0
 *         description: The from parameter defines the number of hits to skip, defaulting to 0.
 *       - name: size
 *         in: query
 *         type: intiger
 *         default: 50
 *         description: The size parameter is the maximum number of hits to return.
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          example: {hits: {hits: [ _index: "contents", _source: {"title": "BrainCore test", "description": 'Test [...]', pages: [...]}]}}
 * 
 */
exports.search = async (req, res) => {
  let from=req.query.from??0
  let size = req.query.size??50
  if (req.query.searchRecommended) size=12
  let rawQuery = await getRawQueryForContent(req.query.query, req.userId, req.query.contentType, req.query.searchRecommended, req.query.interestId, from, size)
  await Content.esSearch(rawQuery, async function (err, results) {
    if (err) res.status(500).send({ message: err });
    else{
      if (req.query.searchRecommended == 'true'){
        //Reorder recommended contents besed on scores from contentRecommendations
        let user = await db.user.findOne({_id: req.userId});
        var orderedContentsIds = user.contentRecommendations.sort((a,b)=> a.score - b.score).map(r=>r.content)
        //results.hits.hits.forEach(a=>console.log(a._id, orderedContentsIds.indexOf(a._id)))
        results.hits.hits = results.hits.hits.sort((a, b) => orderedContentsIds.indexOf(b._id) - orderedContentsIds.indexOf(a._id)).slice(0, 12);
      }

      // Assign canEdit propery to enable edit/delate actions from Explore
      // to speedup the process we may adjust canEdit to take full objects instead of _ids
      for (let [index, hit] of results.hits.hits.entries()){
        let canEdit = (await contentAuthUtils.canEditContent(req.userId, hit._id, req.moduleId)).status
        results.hits.hits[index]._source.canEdit = canEdit
      }
      res.status(200).json(results);
    } 
  });
};

exports.allowExtraAttempt = async (req, res) => {

  let content = await Content.findOneAndUpdate({ "_id": req.params.contentId }, {"$addToSet": {"allowExtraAttemptFor": req.params.userId }}, {timestamps: false})
  if (!content) res.status(404).send({ message: "Content not found" });
  else {
    content.index();// Reindex in elasticsearch
    res.status(200).json({ message: "Updated successfully"});
  }
};

exports.disallowExtraAttempt = async (req, res) => {

  let content = await Content.findOneAndUpdate({ "_id": req.params.contentId }, {"$pull": {"allowExtraAttemptFor": req.params.userId }}, {timestamps: false})
  if (!content) res.status(404).send({ message: "Content not found" });
  else {
    content.index();// Reindex in elasticsearch
    res.status(200).json({ message: "Updated successfully", contentId: content._id });
  }
};


exports.getAcceptedContent = async (req, res) => { // Action for geting result 
  let contents = await Content.find({ origin: req.params.contentId })
  res.status(200).json(contents);
};


/**
 * @openapi
 * /api/v1/contents/braincore-tests-results/{userId}:
 *   get:
 *     description: | 
 *        Load all results(traits) for Braincore Tests(taken in all languages)
 *        By default, when userId is not provided it will return list of all the BrainCore results for the logged in user
 *        When userId is provided, it will fetch the list of all the BrainCore results for the specific trainee.
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: false
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Optional id of the trainee for which BrainCore results will be loaded. If not provided it will return list of all the BrainCore results for the logged in user
 *     responses:
 *       200:
 *          type: object
 *          description: Array with all BrainCore test results
 *          example: [{"data": {}, "traits":{}},{"data": {}, "traits":{}}]
 */
exports.getBrainCoreTestResults = async (req, res) => {
  let userId =  req.params.userId ?  req.params.userId : req.userId
  let results = await Result.find({ $and: [{'user': userId}, {'user': {$ne: undefined}}], content: { $in: braincoreTestsIds}}, {tips: 0, opportunities: 0, data: 0}).populate({path: 'user', select: ['name', 'surname']}).populate({path: 'content', select: ['title']}).sort("-createdAt")


  // Check if access to full results was purchased 
  var resultsToReturn = []
  for (let result of results){
    let resultToReturn = result.toObject()
    resultToReturn.hasAccessToFullReport = await ResultUtils.hasAccessToFullReport(userId, result._id)
    resultsToReturn.push(resultToReturn)
  }

  for (let result of results){
    if (!result.profiles || !result.traits)
      tasker.addTask({task: "PROCESS_RESULTS", resultId: result._id }, 'results',  (err) => {
        if (err) console.error(err);
      })
  }
  res.status(200).json(resultsToReturn);
};

exports.getHighestContentCreator = async (req, res) => {
  let contents = await Content.aggregate()
    .match({ origin: {$exists: false}})
    .project({'owner': 1, 'origin': 1})
    .group({
      _id: '$owner',
      count: { $sum: 1 },
      list: { $push: '$title' }
    })
    .sort({ count: -1 })
    .limit(3)
    .exec() 

  let correspondingOwners = await User.find({ _id: { $in: contents.map(x=>x._id) } }, { _id: 1, name: 1, surname: 1, email: 1, 'settings.role': 1, 'settings.defaultRole': 1, 'settings.availableRoles': 1, })
  let response = contents.map(x=>{
    return {
      ...x,
      owner: correspondingOwners.find(y=>y._id.equals(x._id))
    }
  })
  res.status(200).json(response);
}

exports.getNumberOfNewContentsPerTime = async (req, res) => {
  let groupBy = { year: { $year: "$createdAt" } }
  switch (req.params.basis) {
      case 'day':
      case 'daily':
          groupBy.month = { $month: "$createdAt" }
          groupBy.day = { $dayOfMonth: "$createdAt" }
          break;
      case 'week':
      case 'weekly':
          groupBy.month = { $month: "$createdAt" }
          groupBy.week = { $week: "$createdAt" }
          break;
      case 'month':
      case 'monthly':
          groupBy.month = { $month: "$createdAt" }
          break;
      case 'year':
      case 'yearly':
      case 'annual':
      case 'annualy':
          break;
      case 'weekday':
      default:
          groupBy = { weekDay: { $dayOfWeek: "$createdAt" } }
          break;
  }
  let numberOfNewContentsPerTime = await Content.aggregate()
    .match({ origin: {$exists: false} })
    .project({'createdAt': 1})
    .group({
      _id: groupBy,
      count: { $sum: 1 }
    })
    .sort({ _id: 1 })
    .exec() 

  res.status(200).json(numberOfNewContentsPerTime);
}

exports.countContentAcceptedByLibrarian = async (req, res) => {
  let userId = req.params.userId? req.params.userId : req.userId;
  let ownerMatch = { owner: userId }
  let coCreatorMatch = {cocreators: { $elemMatch: { $eq: userId } } };
  let count = await db.content.countDocuments({ $or: [ownerMatch, coCreatorMatch], origin: {$exists:1} }) // TODO-review: to also check "cocreators" field
  res.status(200).json({count})
}

// countCreatedMaterials
exports.countCreatedMaterials = async (req, res) => {
  let countCreatedMaterials = await Content.aggregate()
    .match({ origin: {$exists: false}, module: req.moduleId })
    .group({
      _id: '$owner',
      count: { $sum: 1 },
    })
    .sort({ count: -1 })
    .limit(5)
    .exec() 

  let core = await db.moduleCore
    .findOne({ moduleId: req.moduleId }, { groups: 1 })
    .populate({
      path: 'groups',
    })
    .exec() 

  let trainers = core.groups.flatMap(x=>x.program.flatMap(y=>y.assignment.flatMap(z=>z.trainers)))
  let trainees = core.groups.flatMap(x=>x.trainees) 
  let totalMaterials= countCreatedMaterials.reduce((acc, cur)=>acc+cur.count, 0)
  let totalTrainerMaterials= countCreatedMaterials.filter(x=>trainers.includes(x._id)).reduce((acc, cur)=>acc+cur.count, 0)
  let totalTraineeMaterials= countCreatedMaterials.filter(x=>trainees.includes(x._id)).reduce((acc, cur)=>acc+cur.count, 0)

  res.status(200).json({
    totalMaterials,
    totalTrainerMaterials,
    totalTraineeMaterials,
    totalOtherMaterials: totalMaterials - totalTrainerMaterials - totalTraineeMaterials,
    topCreators: countCreatedMaterials
  })
}

  exports.countTests = async (req, res) => {
    let userId = req.params.userId? req.params.userId : req.userId;
    let count = await db.content.countDocuments({ 
      $or: [{
        owner: userId},{
        cocreators: { $elemMatch: { $eq: userId } },
      }], 
      origin: {$exists:0},
      contentType: "TEST"
    })
    res.status(200).json({count})
  }

  exports.countLessons = async (req, res) => {
    let userId = req.params.userId? req.params.userId : req.userId;
    let count = await db.content.countDocuments({ 
      $or: [{
        owner: userId},{
        cocreators: { $elemMatch: { $eq: userId } },
      }], 
      origin: {$exists:0}, 
      contentType: "PRESENTATION"
    })
    res.status(200).json({count})
  }

// changeVisibility
exports.changeVisibility = async (req, res) => {
  let contentIds = req.body.contentIds;
  let groupId = req.params.groupId;
  let value = req.body.value;


  if (req.params.contentId) { // change visibility of just 1 content 
    contentIds = [req.params.contentId];
  }
  else { // changing visibility in whole program
    value = !value; // as when changing visibility in whole program value is reversed 
  }
  for (let i = 0; i < contentIds.length; i++) {
    const content = await db.content.findById(contentIds[i]).select('hiddenInGroups visibleInGroups');

    if (value === true) { // if trainer hides content 
      if (groupId && !content.hiddenInGroups.includes(groupId)) {
        content.hiddenInGroups.push(groupId);
      }
      if (content.visibleInGroups) {
        const index = content.visibleInGroups.indexOf(groupId);
        if (index > -1) {
          content.visibleInGroups.splice(index, 1);
        }
      }
    } else { // if trainer unHide content 
      if (content.visibleInGroups) {

        if (groupId && !content.visibleInGroups.includes(groupId)) {
          content.visibleInGroups.push(groupId);
        }
      } else {
        content.visibleInGroups = [groupId];
      }
      if (content.hiddenInGroups) {
        const index = content.hiddenInGroups.indexOf(groupId);
        if (index > -1) {
          content.hiddenInGroups.splice(index, 1);
        }
      }
    }
    // Update the content with the new visibility settings
    await db.content.updateOne({ _id: contentIds[i] }, { $set: {visibleInGroups: content.visibleInGroups, hiddenInGroups: content.hiddenInGroups } }, { runValidators: true }).exec();
  }

  if (contentIds.length === 1) {
    res.status(200).json({ message: `Changed visibility of the content` });
  } else {
    res.status(200).json({ message: `Changed visibility of the contents` });
  }
}

exports.assignContentToGroup = async (req, res) => {
  // params.data = {classId: '', subjectId: '', chapterId: '', contentId:''}

  // for School center
  let group = await db.group.findById(req.body.classId).exec()
  let program = group?.program.find(x=>x.assignment.find(y=>y.trainingModule.equals(req.body.subjectId)))||null
  // add contentId to trainingpath.trainingModules[].chosenChapters[].chosenContents[] = {content:contentId}
  let trainingPath = await db.trainingPath.findById(program.duplicatedTrainingPath)
    .exec((err, trainingPath)=>{
      if (err) return res.status(400).send({ message: 'Error in finding trainingPath' })
      let trainingModule = trainingPath.trainingModules.find(x=>x.originalTrainingModule.equals(req.body.subjectId))
      let chosenChapter = trainingModule.chosenChapters.find(x=>x.chapter.equals(req.body.chapterId))
      if (chosenChapter.chosenContents.find(x=>x.content.equals(req.body.contentId))) {
        return res.status(400).send({ message: 'Content already assigned to this chapter' })
      } else {
        chosenChapter.chosenContents.push({content: req.body.contentId})
        trainingPath.save((err, trainingPath)=>{
          if (err) return res.status(400).send({ message: 'Error in saving trainingPath' })
          return res.status(200).json({ message: 'Content assigned to this chapter' })
        })
      }
    })
}