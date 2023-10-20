const mongoose = require("mongoose");
const mongoosastic = require('mongoosastic')
const {searchengine} = require("./search-engine")
const utils = require("../utils/models")
const PageSchema = require("./page.model");
const Subinterest = require("./subinterest.model")
const Chapter = require("./chapter.model")
const TrainingModule = require("./training_module.model");


// Simplified schema - just for ElasticSearch
var UserSchema = new mongoose.Schema({
  name: String,
  surname: String,
});

const ContentSchema =  new mongoose.Schema({
 title: {type: String, es_indexed:true, es_analyzer: "autocomplete", es_search_analyzer: "default"},
 description: {type: String, es_indexed:true},
 image: {type: mongoose.Schema.Types.ObjectId, ref: 'ContentImage'},
 language: { type: String, enum: [null, 'fr', 'en', 'pl'], default: null, es_indexed: true },

 // ASSET - it is the smallest unit which can be created with ContentFactory used to build other contents
 // TEST - it must have questions and gradingScale which is used to calculate grade
 // PRESENTATION - used for displaying the non-interactive content
 // OPPORTUNITY_BLOCK - used for opportunities
 contentType: {type: String, required: [ true, 'Content type required' ], enum: ['TEST', 'PRESENTATION','ASSET','OPPORTUNITY_BLOCK'], es_indexed:true},
 pages: { type: [PageSchema], es_indexed:true},
 durationTime: {type: Number},
 maxTimeToFinish: {type: Number},
 questionsOnPageMode: {type: String, enum: ['standard', 'questionPerPage']},
 questionsOrder: {type: String, enum: ['random']},
 revealAnswers:  {type: Boolean},
 showPrevButton: {type: Boolean},
 hideFromTrainees: {type: Boolean, es_indexed:true}, // global value, for explore view
 hiddenInGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group", es_indexed: true}], // list of groups where content is hidden, ignoring `hideFromTrainees` value
 visibleInGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group", es_indexed: true}], // list of groups where content is visible, ignoring `hideFromTrainees` value

 allowMultipleAttempts: {type: Boolean, default: false},
 allowExtraAttemptFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", es_indexed: true}],
 // if a content is approved by cloud but disapproved by librarian, then it will not be available for the module
 // meaning, librarian can finally control over the contents on top of cloudManager 
 // once content is edited, we set both the status (cloudStatus, status) to "AWAITING"
 
 // Meaning of flags:
 // approved duplicat will have: sendToLibrary/sendToCloud = according to original choice, no `origin`
 // originally sent content always have: approvedByLibrarian/approvedByCloudManager = false, no `origin` 
 // libraryStatus/cloudStatus will be updated similarly in both original and approved (duplicate)

 edition: {type: Number, default: 1, es_indexed:true}, // This number increases after each edit of an accepted content
 // LIBRARY
 sendToLibrary: {type: Boolean, es_indexed:true},
 approvedByLibrarian: {type: Boolean, default: false},
 libraryStatus: {type: String, enum: ['PRIVATE', 'AWAITING','ACCEPTED','REJECTED'], es_indexed: true},
 approvedInLibraryAt: {type:Date}, // approvedInLibraryAt: {type:Date},
 rejectedInLibraryAt: {type:Date},
 archiveContentFromLibraryRequested:  {type: Boolean, default: false, es_indexed:true},// This allows owner to request archiving of the conentent from library
 archivedByLibrarian: {type: Boolean, default: false, es_indexed:true}, // after "archiveContentFromLibraryRequested" is set to true, content can be archived = hidden in the whole system
 archivedInLibraryAt: {type:Date},
 version: {type: Number, es_indexed:true}, // first acceptance, version = 1; next acceptance: version += 1; 
 // CLOUD
 sendToCloud: {type: Boolean},
 approvedByCloudManager: {type: Boolean, default: false},
 approvedInCloudAt: {type:Date},
 rejectedInCloudAt: {type:Date},
 cloudStatus: {type: String, enum: ['PRIVATE', 'AWAITING','ACCEPTED','REJECTED'], es_indexed: true},
 removeFromCloudRequested:  {type: Boolean, default: false, es_indexed:true},// This allows owner to request archiving of the conentent from cloud
 archivedByCloudManager: {type: Boolean, default: false}, // after "removeFromCloudRequested" is set to true, content can be archived = hidden in the whole system
 archivedInCloudAt: {type:Date},

 approvedContentSource: {type: mongoose.Schema.Types.ObjectId, ref: 'Content',  es_indexed: true}, // to be removed 
 newerVersion: {type: mongoose.Schema.Types.ObjectId, ref: 'Content',  es_indexed: true}, // a new version is created after editing an already approved content by librarian/cloudManager
 showProgressBar: {type: String, enum: ['bottom']},
 showQuestionNumbers: {type: String, enum: ['off', 'on']},
 showTimerPanel: {type: String, enum: ['top']},
 showTimerPanelMode: {type: String, enum: ['survey']},
 trainingModule: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule", es_schema: TrainingModule.schema, es_select: 'name' },
 chapter:  { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", es_schema: Chapter.schema, es_select: 'name' },
 capsule: {type: String, es_indexed:true},
 level:  {type: String, enum: ["1", "2", "3","4","5","6","7","8","9A","9B","10A","10B","11A","11B","12","13","14"]},
 tags:  [{ type: Number, ref: "Subinterest", es_indexed:true, es_schema: Subinterest.schema}],
 gradingScale:  { type: mongoose.Schema.Types.ObjectId, ref: "GradingScaleRef" },
 owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", es_schema: UserSchema, es_indexed: true, es_select: '_id name surname'},
 books: { type: [mongoose.Schema.Types.ObjectId], ref: "Book", es_indexed: true, default: undefined},
 cocreators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", es_indexed: true}],
 // List of AI detections which are suggested to the user
 detectedLevels: {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
 detectedTrainingModules:  {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
 detectedChapters:  {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
 detectedCapsules: {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
 
 groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group", es_indexed: true}],
 origin: {type: mongoose.Schema.Types.ObjectId, ref: 'Content',  es_indexed: true}, // if missing = not duplicated for program
 createdAt: {type:Date, es_type:'date', es_indexed: true},
 updatedAt: {type:Date, es_type:'date', es_indexed: true},
 goNextPageAutomatic: { type: Boolean, default: false }, 
 module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // mostly for librarian, so he approves only module's content // suggesting this to name as `moduleId` because "module" can't populated because "module" is not a collection
 network: { type: mongoose.Schema.Types.ObjectId, ref: "Network" }, // available throughout the netowrk!
 ecosystem: { type: mongoose.Schema.Types.ObjectId, ref: "Ecosystem" }, // for cloud manager (clould level 2)


// For tracking activity - time spent, time away etc.
// lastEmit is a date of last emmited message - it's used to prevent excessive socket traffic
attendees: {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
lastEmit: { type: Date },
}, { timestamps: true })

ContentSchema.plugin(mongoosastic, {
  esClient: searchengine,
  populate: [
    { path: 'trainingModule', select: "name" },
    { path: 'chapter', select: "name" },
    { path: 'owner  ', select: "_id name surname" },
    { path: 'tags', select: "_id name interest", populate: { path: "interest", select: "name _id" } },
    { path: 'pages.elements.file' }
  ]
})

ContentSchema.pre('remove', async function (next) {
  console.log("Removing Content", this._id)
  utils.removeScopes(this._id)
  next()
});



const Content = mongoose.model(
  "Content", ContentSchema
);



module.exports = Content;
