const mongoose = require("mongoose");
const ContentRecommendationSchema = require("./content_recommendation.model");
const ChapterRecommendationSchema = require("./chapter_recommendation.model");
const TrainingModuleRecommendationSchema = require("./training_module_recommendation.model");
const Result = require("./result.model");
const ScopeSchema = require("./scope.model");
const UserSettingsSchema = require("./user_settings.model");
const UserDetailsSchema = require("./user_details.model");
const UserCertificatesSchema = require("./user_certificates.model");
const UserReportsSchema = require("./user_reports.model");
const Ecosystem = require("./ecosystem.model")
const Group = require("./group.model")
const RolePermissionsMapping = require("./rolePermissionsMapping.model")
const tasker = require('../utils/tasker/tasker');
const { ecosystem } = require(".");
const {braincoreTestsIds} = require("../utils/braincoreTestsIds");
const Team = require("./team.model");
const CognitiveTraitModel = require("./cognitiveTrait.model");


const cognitiveUtils = require("../utils/cognitive");

const { off } = require("process");

const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  surname: {type: String, required: true},
  username: {
    type: String,
    required: 'Username is required',
    unique: true,
    validate: [/^\S*$/, 'Please fill a valid username'],
  },
  email: {type: String, trim: true, unique: true, sparse: true}, // unique if not null
  password: {type: String, required: true},
  otherPassword: {
    password: {type: String },
    addedBy: {type: String },
    date: {type: Date },
  },
  settings: {type: UserSettingsSchema, default: {}},
  details: {type: UserDetailsSchema, default: {}},
  certificates: [{type: UserCertificatesSchema, default: {}}],
  reports: [{type: UserReportsSchema, default: {}}],
  // Reference to creator of this user
  creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  sessionProgress: [{ // tracker
    _id: false,
    certificationSessionId: {type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"},
    latestChapterId: {type: mongoose.Schema.Types.ObjectId, ref: "Chapter"},
    latestContentId: {type: mongoose.Schema.Types.ObjectId, ref: "Content"}
  }],
  sessionContentProgress: [{ // tracker
    _id: false,
    certificationSessionId: {type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"},
    contentId: {type: mongoose.Schema.Types.ObjectId, ref: "Content"},
    status: {type: String, required: true, default: "TODO", enum: ['TODO', 'ONGOING', 'DONE']},

  }],
  companies: [{type: mongoose.Schema.Types.ObjectId, ref: "Company"}],
  groups: {type: mongoose.Schema.Types.ObjectId, ref: "Group"},
  enabledTeams: [{type: mongoose.Schema.Types.ObjectId, ref: 'team'}], // permission to access these teams added in sentinel
  lastRecommendationsUpdate: {type: Date, default: Date.now},
  contentRecommendations: [ ContentRecommendationSchema ],
  chapterRecommendations: [ ChapterRecommendationSchema ],
  trainingModuleRecommendations: [ TrainingModuleRecommendationSchema ],
  internships: [{
    _id: false,
    internship: {type: mongoose.Schema.Types.ObjectId, ref: "Internship"},
    status: {type: Boolean, default: false},
  }],
  scopes: [ ScopeSchema ],
  rootFolder: {type: mongoose.Schema.Types.ObjectId, ref: "Folder"},
  isDeleted: {type: Boolean, default: false},
  // Demo user - used for marketing purposes
  isDemo: {type: Boolean, default: false},
  otp: Number,
  otpExpireAt: Date,
  teams: {type: [mongoose.Schema.Types.ObjectId], ref: "team"},
  brainCoreTest: {
    registerDate: Date,
    completionDate: Date,
    status: {
      type: String,
      enum: ["Completed", "Not Completed", "Request sent"],
    },
    reminderEmailSent: Boolean,
    requestDate: Date
  }
  }, { timestamps: true }
)

// Do not find users with isDeleted set to true
UserSchema.pre(/^find/, function(next) {this.where({isDeleted: false});next()});
UserSchema.methods.isAdmin = function() { return this.getScopes().includes("all:all:all")};
UserSchema.methods.isEcoManager = function() { return this.settings.role === "EcoManager" };
UserSchema.methods.isCloudManager = function() { return this.settings.role === "CloudManager" };
UserSchema.methods.isNetworkManager = function() { return this.settings.role === "NetworkManager" };
UserSchema.methods.isModuleManager = function() { return this.settings.role === "ModuleManager" };
UserSchema.methods.isCognitiveCenterUser = function() { return this.settings.role === "Other" && this.settings.roleMaster};
UserSchema.methods.isAssistant = function() { return this.settings.role === "Assistant" };
UserSchema.methods.isLibrarian = function() { return this.settings.role === "Librarian" };
UserSchema.methods.isArchitect = function() { return this.settings.role === "Architect" };
UserSchema.methods.isTrainer = function() { return this.settings.role === "Trainer" };
UserSchema.methods.isTrainee = function() { return this.settings.role === "Trainee" };
UserSchema.methods.isExaminer = function() { return (this.settings.role === "Trainer" && this.settings.selfRegistered)};
UserSchema.methods.isTrainingManager = function() { return this.settings.role === "TrainingManager" };
UserSchema.methods.isInspector = function() { return this.settings.role === "Inspector" };
UserSchema.methods.isParent = function() { return this.settings.role === "Parent" };
UserSchema.methods.isCoordinator = function() { return this.settings.role === "Coordinator" };
UserSchema.methods.isParentOf = function(uId) { 
  if (this.settings.role === "Parent") {
    return this.details.children.some(child=>child.equals(uId))
  }
  return false
};

UserSchema.methods.getLanguage = function() {
  return this.settings.language
};

UserSchema.methods.getPassword = function() {
  return this.password
};

UserSchema.methods.getGroups = async function() {
  if (this.settings.role === "Trainee"){
    return await Group.find({trainees: { $elemMatch: {$eq: this._id} }}).exec()
  } else return []
};

UserSchema.methods.getPermissions = async function() {
  let initPermissions = {
    home: { access: false, edit: false },
    admin_auth: { access: false, edit: false },
    admin_teamsAccess: { access: false, edit: false },
    admin_credits: { access: false, edit: false },
    mt_teams: { access: false, edit: false },
    mt_bcTestReg: { access: false, edit: false },
    mt_results: { access: false, edit: false },
    mt_statistics: { access: false, edit: false },
    mu_users: { access: false, edit: false },
    mu_bcTestReg: { access: false, edit: false },
    myProjects: { access: false, edit: false },
    myDiary: { access: false, edit: false },
    bcCoach: { access: false, edit: false },
    bcTrainer: { access: false, edit: false },
    ms_myResults: { access: false, edit: false }, // My Space - My Results
    ms_virtualCoach: { access: false, edit: false }, // My Space - Virtual Coach
    ms_myResources: { access: false, edit: false }, // My Space - My Resources
  }
  if (this.settings?.roleMaster){
    let userPermissionsMap = await RolePermissionsMapping.findOne({roleMaster: this.settings.roleMaster})
    .populate('permissions').lean().exec()
    if(!userPermissionsMap) return initPermissions
    
    userPermissionsMap.permissions.forEach(permission => {
      switch (permission.moduleName) {
        case "Home": {
            initPermissions.home.access = permission.access
            initPermissions.home.edit = permission.edit
            initPermissions.home.status = permission.status
        }
        break;
        case "Admin - Authorization": {
            initPermissions.admin_auth.access = permission.access
            initPermissions.admin_auth.edit = permission.edit
            initPermissions.admin_auth.status = permission.status
        }
        break;
        case "Admin - Teams Access": {
          initPermissions.admin_teamsAccess.access = permission.access
          initPermissions.admin_teamsAccess.edit = permission.edit
          initPermissions.admin_teamsAccess.status = permission.status
        }
        break;
        case "Admin - Credits": {
          initPermissions.admin_credits.access = permission.access
          initPermissions.admin_credits.edit = permission.edit
          initPermissions.admin_credits.status = permission.status
        }
        break;
        case "My Teams - Teams": {
            initPermissions.mt_teams.access = permission.access
            initPermissions.mt_teams.edit = permission.edit
            initPermissions.mt_teams.status = permission.status
        }
        break;
        case "My Teams - BC Test Registrations": {
            initPermissions.mt_bcTestReg.access = permission.access
            initPermissions.mt_bcTestReg.edit = permission.edit
            initPermissions.mt_bcTestReg.status = permission.status
        }
        break;
        case "My Teams - Results": {
            initPermissions.mt_results.access = permission.access
            initPermissions.mt_results.edit = permission.edit
            initPermissions.mt_results.status = permission.status
        }
        break;
        case "My Teams - Statistics": {
          initPermissions.mt_statistics.access = permission.access
          initPermissions.mt_statistics.edit = permission.edit
          initPermissions.mt_statistics.status = permission.status
        }
        break;
        case "My Users - Users": {
            initPermissions.mu_users.access = permission.access
            initPermissions.mu_users.edit = permission.edit
            initPermissions.mu_users.status = permission.status
        }
        break;
        case "My Users - BC Test Registrations": {
            initPermissions.mu_bcTestReg.access = permission.access
            initPermissions.mu_bcTestReg.edit = permission.edit
            initPermissions.mu_bcTestReg.status = permission.status
        }
        break;
        case "My Projects": {
            initPermissions.myProjects.access = permission.access
            initPermissions.myProjects.edit = permission.edit
            initPermissions.myProjects.status = permission.status
        }
        break;
        case "My Diary": {
            initPermissions.myDiary.access = permission.access
            initPermissions.myDiary.edit = permission.edit
            initPermissions.myDiary.status = permission.status
        }
        break;
        case "My Trainings - BrainCore Coach": {
            initPermissions.bcCoach.access = permission.access
            initPermissions.bcCoach.edit = permission.edit
            initPermissions.bcCoach.status = permission.status
        }
        break;
        case "My Trainings - BrainCore Trainer": {
            initPermissions.bcTrainer.access = permission.access
            initPermissions.bcTrainer.edit = permission.edit
            initPermissions.bcTrainer.status = permission.status
        }
        break;
        case "My Space - My Results": {
          initPermissions.ms_myResults.access = permission.access
          initPermissions.ms_myResults.edit = permission.edit
          initPermissions.ms_myResults.status = permission.status
        }
        break;
        case "My Space - Virtual Coach": {
          initPermissions.ms_virtualCoach.access = permission.access
          initPermissions.ms_virtualCoach.edit = permission.edit
          initPermissions.ms_virtualCoach.status = permission.status
        }
        break;
        case "My Space - My Resources": {
          initPermissions.ms_myResources.access = permission.access
          initPermissions.ms_myResources.edit = permission.edit
          initPermissions.ms_myResources.status = permission.status
        }
        break;
        default: 
            // skip
        break;
      }
    })
    return initPermissions

  } else {
    return initPermissions
  }

}

UserSchema.methods.getEnabledTeams = async function() {
  const teams = await Team.find({_id: {$in: this.enabledTeams || []}});
  return teams;
}


// Check if resuls were fully processed  
const areResultsProcessed = (results) => {
  return (results && results.traits)
}

// Load the NAD/QNAD traits descriptions for the selected user and selected result
// resultId - id of selected result
// readerType - type of user for which the tip will be displayed
// lang - language of tips
UserSchema.methods.getNADTraits = async function (resultId, readerType, lang = 'en') {
  var user = this;
  var LANG = lang.toUpperCase()
  var userId = user._id
  var result = await Result.findOne({ _id: resultId, user: userId }).exec()
  if (!areResultsProcessed(result)) return null; // No results, return `null`
  else { // Result exist


    // Find lowest and highest NAD value
    let lowest = 'communication-strategy';
    let highest = 'communication-strategy';
    for (let traitName of ['cooperation', 'self-activation', 'self-confidence', 'regularity']) {
      if (result.traits[traitName].normalizedValue < result.traits[lowest].normalizedValue) lowest = traitName
      if (result.traits[traitName].normalizedValue > result.traits[highest].normalizedValue) highest = traitName
    }

    // Prepare response
    let response = {};

    // Default to student or employee
    if (!readerType) readerType =  cognitiveUtils.getReaderType(result.data)
    let ageGroup = cognitiveUtils.getAgeGroup(readerType, result.data)

    for (const [traitName, trait] of Object.entries(result.traits)) {

      // Find in db
      let traitDocument = await CognitiveTraitModel.findOne({key: traitName, readerType: readerType,  ageGroup: ageGroup.toString()})
      // If didnt found for specific ageGroup, try to find universal
      if (!traitDocument) traitDocument = await CognitiveTraitModel.findOne({key: traitName, readerType: readerType, $or: [{ageGroup:  { $exists: false }},{ageGroup: ''}]})
      // If not found - skip this trait
      if (!traitDocument) continue


      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // Transform data from `traitDocument` into old form (action-1, part-1 etc) 
      // In the future it would be the best to send object based on the database schema(actions: [], descriptions: [] etc)
      response[traitName] = {
        'abbreviation': traitDocument.abbreviation[LANG], 
        'short-name': traitDocument.shortName[LANG],
        'level': trait.level,
        'normalizedValue': Number(trait.normalizedValue?.toFixed(1)), 
        'minValue': Number(trait.min?.toFixed(1)),
        'maxValue': Number(trait.max?.toFixed(1))
      }
      if (traitName=='current-performance-indicator'){
        response[traitName].normalizedValue = Number(Math.round(trait.normalizedValue))
      }

      if (['current-performance-indicator', 'self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].includes(traitName))


        response[traitName] = {
          ...response[traitName],
          'short-description':traitDocument.shortDescription[LANG],
          'main-definition': traitDocument.mainDefinition[LANG],
          'part-1': traitDocument.descriptions[`level_${trait.level}`][LANG][0],
          'part-2': traitDocument.descriptions[`level_${trait.level}`][LANG][1],
          'part-3': traitDocument.descriptions[`level_${trait.level}`][LANG][2],
          'action-1': traitDocument.actions[`level_${trait.level}`][LANG][0]
        }

        for (let [index,effect] of traitDocument.neurobiologicalEffects[LANG].entries()){
          response[traitName][`neurobiological-effect-${index+1}`] = effect
        }


      if (traitName == lowest) {
        response[traitName]['lowest'] = traitDocument.actions['lowest'][LANG]
        response[traitName]['lowest-definition'] = traitDocument.lowestDefinition[LANG]
      }
      if (traitName == highest) {
        response[traitName]['highest'] = traitDocument.highestDefinition[LANG]
        response[traitName]['highest-definition'] = traitDocument.actions['highest'][LANG]
      }

    }




    return response

  }

}



// Load the opportunities for the selected user
// if user does not have BrainCore results it will return emply array
// if you need to get the opporunities regardless of results
// use cognitiveUtils.prepareOpportunities
// ##################################################################
// - readerType - type of user for which opportunities will be displayed
// - lang - language of tips
// - areaKeys - array of keys of area of development for which opportunities will be loaded. This parameter is optional and it is used only whe user manualy selects the area of development in the virtual coach
// - maxLevel <int> in range <1,5> - the maximum level of the value for which opportunities should be fetched 
//          For example when set to 5(max), it will fetch the opportunities even for areas which have high(lvl 4) and very high values(lvl 5)
//          If set to 1, it will only give opportunities for areas which are very low
UserSchema.methods.getOpportunities = async function (readerType, lang = 'en', areaKeys, maxLevel) {
    var user = this;
    var latestResults = await cognitiveUtils.getLatestBrainCoreResultForUser(user._id)
    if (!latestResults) return [];
    let opportunities = await cognitiveUtils.prepareOpportunities(latestResults, readerType, lang, areaKeys, maxLevel)


    // // Order opportunities based on the feedback
    // // 1. First there will be opportunities with no feedback from the user himself. 
    // //    They will be sorted based on the feedback from other people from the highest to the lowest value
    // //    This means that user will first see the opportunities which other people think he has.
    // let opportunitiesWithNoMyFeedback = opportunities.filter(o => (o.myConfirmationFeedback == null))
    // opportunitiesWithNoMyFeedback.sort((o1, o2) => { return o2.othersConfirmationFeedback - o1.othersConfirmationFeedback })
    // // 2. Then there will be opprotunities which has feedback from the user himself
    // //    a) First  there will be opportunities which has the lowes absolute value of the use's feedback, eg: 1, then 2, 3 etc. 
    // //       So if the user answered the same question many times and if he was consistant/confident,
    // //       it is not likely that he will see this opportunitiy again.
    // //     b) Then they will be sorted based on the feedback from other people from the highest to the lowest value
    // let opportunitiesWithMyFeedback = opportunities.filter(o => (o.myConfirmationFeedback != null))
    // opportunitiesWithMyFeedback.sort((o1, o2) => {
    //   return Math.abs(o1.myConfirmationFeedback) - Math.abs(o2.myConfirmationFeedback) || o2.othersConfirmationFeedback - o1.othersConfirmationFeedback
    // })

    // let opportunitiesToReturn = opportunitiesWithNoMyFeedback.concat(opportunitiesWithMyFeedback)


    opportunities.sort((a, b) => { return new Date(a.confirmedAt || 0) - new Date(b.confirmedAt || 0) })
    opportunitiesToReturn = opportunities.map(o => { return { _id: o._id, key: o.key, solutions: o.solutions, type: o.type, imageUrl: o.imageUrl, typeText: o.type, text: o.text, area: {key: o.area.key, name: o.area.name} } })
    return opportunitiesToReturn;
  
}

// Load all identified opportunities for the selected user
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
UserSchema.methods.getIdentifiedOpportunities = async function (readerType, lang = 'en') {
  var user = this;
  var userId = user._id

  var results = await Result.find({ user: userId, 'content': { $in: braincoreTestsIds }, traits: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()

  if (!results || !results.length) return []; // No processed results, no opportunities
  else { // Results exist
    var latestResults = results[0]
    let opportunities = await cognitiveUtils.prepareOpportunities(latestResults, readerType, lang, undefined, 5)
    opportunities = opportunities.filter(o => { return o.myConfirmationFeedback && o.myConfirmationFeedback > 0 })
    opportunities.sort((a, b) => { return new Date(b.confirmedAt || 0) - new Date(a.confirmedAt || 0) })

    let opportunitiesToReturn = opportunities.map(o => { return { _id: o._id, imageUrl: o.imageUrl, type: o.type, typeText: o.type, text: o.text, confirmedAt: o.confirmedAt, favourite: o.favourite??false } })
    return opportunitiesToReturn
  }
}

// Load the list of favourite resources for the selected user
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
UserSchema.methods.getFavouriteResources = async function (readerType, lang = 'en') {
  var user = this;
  var userId = user._id

  var results = await Result.find({ user: userId, 'content': { $in: braincoreTestsIds }, traits: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()

  if (!results || !results.length) return []; // No processed results, no opportunities
  else { // Results exist
    var latestResults = results[0]
    let opportunities = await cognitiveUtils.prepareOpportunities(latestResults, readerType, lang, undefined, 5)
    opportunities = opportunities.filter(o => { return o.favourite }).map(o => { return { _id: o._id, imageUrl: o.imageUrl, type: o.type, typeText: o.type, text: o.text, favourite: o.favourite??false } })

    let areas = await cognitiveUtils.prepareAreas(latestResults, readerType, lang)
    areas = areas.filter(a => { return a.favourite }).map(a=>{return {_id: a._id, imageUrl: a.imageUrl, type: a.type, typeText: a.type, text: a.name, favourite: a.favourite??false}})

    
    let tips = await cognitiveUtils.prepareTips(latestResults, readerType, lang)
    tips = tips.filter(t => { return t.favourite }).map(t=>{return {_id: t._id, introduction: t.introduction, text: t.text, reasoning: t.reasoning, favourite: t.favourite??false}})

    var collections = await cognitiveUtils.getAssignedCognitiveCollections(user, readerType, lang)
    collections = collections.filter(c => { return c.favourite })

    return {areas, opportunities, tips, collections}
  }

}

// Load the get details for opportunity card for the selected user
// opportunityKey - unique key of the opportunity
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
UserSchema.methods.getDetailsForOpportunityCard = async function (opportunityKey, readerType, lang = 'en') {
  var user = this;
  var userId = user._id

  var results = await Result.find({ user: userId, 'content': { $in: braincoreTestsIds }, traits: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()

  if (!results || !results.length) return {}; // No processed results, no opportunities
  else { // Results exist
    var latestResults = results[0]
    let opportunities = await cognitiveUtils.prepareOpportunities(latestResults, readerType, lang, undefined, 5)
    let opportunity = opportunities.find(o=>{return o._id.toString()==opportunityKey.toString()})

    return opportunity
  }

}

// Load the get details for area of development card for the selected user
// areaKey - key of the area of development - from 1 to 5
// type - type of user for which opportunities will be displayed
// lang - language of tips
UserSchema.methods.getDetailsForAreaOfDevelopmentCard = async function (areaKey, readerType, lang = 'en') {
  var user = this;
  var userId = user._id

  var results = await Result.find({ user: userId, 'content': { $in: braincoreTestsIds }, traits: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()

  if (!results || !results.length) return {}; // No processed results, no opportunities
  else { // Results exist
    var latestResults = results[0]
    let areas = await cognitiveUtils.prepareAreas(latestResults, readerType, lang)
    let area = areas.find(a=>{return a.key.toString()==areaKey.toString()})
    delete area.opportunities

    return area
  }

}

// Common function used to parse and process body with feedback
// obj - object to which feedback will be assigned eg. tip,opportunity,trait
// feedback - body with feedback
// from - id of user from who the feedback was provided
const assignFeedback = (obj, feedback, from) => {
  // Create empty object for storing feedback
  if (!obj.feedback) obj.feedback = {}
  if (!obj.feedback[from]) obj.feedback[from] = {}

  if (Object.hasOwn(feedback, 'confirmed')) {
    let key = 'confirmed'
    // Value which will be used to modify current feedback
    let value = feedback[key] ? 1 : -1
    // If not exists or is not intiger transform to 0
    if (!Number.isInteger(obj.feedback[from][key])) obj.feedback[from][key] = 0
    // Modify current feedback value
    // If it was negative, and now it was confirmed, set it to +1
    if (value>0 && obj.feedback[from][key]<=0) obj.feedback[from][key] = 1
     // If it was positive, and now it was discarded, set it to -1
    else if (value<0 && obj.feedback[from][key]>=0) obj.feedback[from][key] = -1
    else obj.feedback[from][key] += value// else incremeny/decrement value

    // Save date to sort from the newest to oldest 
    obj.feedback[from]['confirmedAt'] = new Date()
  }
  if (Object.hasOwn(feedback, 'useful')) {
    let key = 'useful'
    // Value which will be used to modify current feedback
    let value = feedback[key] ? 1 : -1
    // If not exists or is not intiger transform to 0
    if (!Number.isInteger(obj.feedback[from][key])) obj.feedback[from][key] = 0
    // Modify current feedback value
    // If it was negative, and now it was useful, set it to +1
    if (value>0 && obj.feedback[from][key]<=0) obj.feedback[from][key] = 1
    // If it was useful, and now it was discarded, set it to -1
    else if (value<0 && obj.feedback[from][key]>=0) obj.feedback[from][key] = -1
    else obj.feedback[from][key] += value
  }
  // Just boolean
  if (Object.hasOwn(feedback, 'favourite')) {
    let key = 'favourite'
    obj.feedback[from][key] = feedback[key]
  }
}

// Save feedback for tip in the latest result of selected user
UserSchema.methods.feedbackForTip = async function (feedback, from) {
  var user = this;
  var results = await Result.find({ user: user._id, 'content': { $in: braincoreTestsIds }, tips: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()
  if (!results || !results.length) return { message: "Results not found" } // No results
  else { // Results exist
    var latestResults = results[0]

    var index = latestResults.tips.findIndex(o => o._id == feedback._id)
    if (index < 0) return { message: "Tip not found" } // No results
    else {
      let tip = latestResults.tips[index]
      assignFeedback(tip, feedback, from)
      latestResults.tips[index] = tip
      latestResults.markModified('tips');
      await latestResults.save();
    }
  }

  return { message: "Feedback saved" }
}


// Save feedback for opportunity in the latest result of selected user
UserSchema.methods.feedbackForOpportunity = async function (feedback, from) {
  var user = this;

  var results = await Result.find({ user: user._id, 'content': { $in: braincoreTestsIds }, tips: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()
  if (!results || !results.length) return {status: 404, message: "Results not found" } // No results
  else { // Results exist
    var latestResults = results[0]

    var index = latestResults.opportunities.findIndex(o => o._id == feedback._id)
    let opportunity = {}
    if (index < 0){
      opportunity = {_id: feedback._id}
      latestResults.opportunities.push(opportunity)
      //return {status: 404, message: "Opportunity not found" } // No results
    }
    else {
      opportunity = latestResults.opportunities[index]
    }

    assignFeedback(opportunity, feedback, from)
    latestResults.opportunities[index] = opportunity
    latestResults.markModified('opportunities');
    await latestResults.save();

  }

  return { status: 200, message: "Feedback saved" }
}

// Save feedback for area of development in the latest result of selected user
UserSchema.methods.feedbackForArea = async function (feedback, from) {
  var user = this;

  var results = await Result.find({ user: user._id, 'content': { $in: braincoreTestsIds }, tips: { $exists: true, $ne: [] } })
    .sort({ createdAt: 'desc' })
    .exec()
  if (!results || !results.length) return {status: 404, message: "Results not found" }// No results
  else { // Results exist
    var latestResults = results[0]

    // Areas are just NAD traits, find matchin name
    let areasNames = ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity']
    let index = feedback._id - 1
    let areaName = areasNames[index]
    var trait = latestResults.traits[areaName]
    if (!trait) return { status: 404, message: "Area of development not found" }
    else {
      assignFeedback(trait, feedback, from)
      latestResults.traits[areaName] = trait
      latestResults.markModified('traits');
      await latestResults.save();
    }
  }

  return { status: 200, message: "Feedback saved" }
}


// Load the cognitive tip for the selected user.
// Each tip have _id and 3 parts: introduction, text, reasoning which can be loaded in language of currently logged in user
// The tip is being updated once for 14 days (maxTimeForTip) and it's based on the latest BrainCore test results. 
// In case there is no more tips or tips do not exists for the user, the null response will be returned
// readerType - type of user for which the tip will be displayed
// lang - language of tips
UserSchema.methods.getTip = async function(readerType, lang='en') {
  // Check if user has finished BrainCore test
  var user = this;
  
  var results = await Result.find({ user: user._id, 'content': { $in: braincoreTestsIds},  tips: { $exists: true, $ne: [] }})
  .sort({ createdAt: 'desc'})
  .exec()


  console.log("Latest Results Count", results.length)
  if (!results || !results.length) return null; // No results, return `null` as a tip
  
  // updating user tips moved to cron job in task-executer service
  //Results and tips exists and tips are up-to-date 
  const dayInMiliseconds = 1000*60*60*24;
  const maxTimeForTip = 7 * dayInMiliseconds; 

  const latestResults = results[0];

  // Default to student or employee
  if (!readerType) readerType = cognitiveUtils.getReaderType(latestResults.data)
  let userTips = await cognitiveUtils.prepareTips(latestResults, readerType, lang)

  const oldUserTips = latestResults.tips.filter(tip => { return (tip.displayDate != undefined)});
  if (!oldUserTips.length) return userTips[0]; // if no oldUserTips
  const latestTip = oldUserTips.sort((a, b) => a.displayDate > b.displayDate).slice(-1)[0];
  const timeOfLatestTip = (new Date()) - latestTip.displayDate;

  let tip = userTips.find(t=>{return t._id==latestTip._id.toString()})

  // if current tip is outdated
  if (timeOfLatestTip > maxTimeForTip) return tip

  return tip;
  
};

UserSchema.methods.getScopes = function() {
  // By default Universal BrainElem Training Center
  let scopes = this.scopes.map(scope => scope.name)
  let uniqScopes = [...new Set(scopes)]
  return uniqScopes
}
UserSchema.methods.getEcosystemId = function() { // () => {} JS ES6 function notation doesn't work (`this` is missing) 
  if (this.settings.role == "EcoManager"){
    let scope = this.scopes.find(element => element.name.includes('ecosystems:all:'))
    return scope? scope.name.split(":").pop():false
  } else if (['CloudManager','NetworkManager'].includes(this.settings.role)) {
    let scope = this.scopes.find(element => element.name.includes('ecosystems:read:'))
    return scope? scope.name.split(":").pop():false
  } else return false
};

UserSchema.methods.getSubscriptionId = function() { // () => {} JS ES6 function notation doesn't work (`this` is missing) 
  if (this.settings.role == "NetworkManager"){
    let scope = this.scopes.find(element => element.name.includes('subscriptions:all:'))
    return scope? scope.name.split(":").pop():false
  } else if (["ModuleManager","Assistant"].includes(this.settings.role)) {
    let scope = this.scopes.find(element => element.name.includes('subscriptions:read:'))
    return scope? scope.name.split(":").pop():false
  } else return false
};


UserSchema.methods.getEcosystems = async function() {
  let scopes = this.getScopes();
  let allEcosystems = await Ecosystem.find({}, {_id: 1, name: 1, subscriptions: 1})
  let allowedEcosystems = [];
  allEcosystems.forEach((ecosystem) => {
    if (scopes.some((scope)=>["all:all:all", `ecosystems:read:all`, `ecosystems:all:all`,
    `ecosystems:all:${ecosystem._id}`, `ecosystems:read:${ecosystem._id}`].includes(scope))) allowedEcosystems.push(ecosystem);
  });
  if (this.isEcoManager()) return allowedEcosystems.filter(x=>scopes.includes(`ecosystems:all:`+x._id))
  else return allowedEcosystems;
};

UserSchema.methods.getSubscriptions = async function() {
  let allowedSubscriptions = [];
  // Indirect scopes, based on parent elements(ecosystem)
  let allowedEcosystems = await this.getEcosystems()
  allowedEcosystems.forEach((e) => {
    e.subscriptions?.forEach(s => allowedSubscriptions.push(s))
  })
  // Direct scopes
  let scopes = this.getScopes();
  let allEcosystems = await Ecosystem.find({}, {'subscriptions._id': 1, 'subscriptions.name': 1, 'subscriptions.modules': 1})
  let allSubscriptions = allEcosystems.reduce((all, { subscriptions }) => [...all, ...subscriptions], [])
  allSubscriptions.forEach((subscription) => {
    if (allowedSubscriptions.map(s=>s._id).some(id=>id.equals(subscription._id))) return// duplicate
    if (scopes.some((scope)=>["all:all:all", `subscriptions:read:all`, `subscriptions:all:all`,
    `subscriptions:all:${subscription._id}`, `subscriptions:read:${subscription._id}`].includes(scope))) allowedSubscriptions.push(subscription);
  });
  if (this.isNetworkManager()) return allowedSubscriptions.filter(x=>scopes.includes(`subscriptions:all:`+x._id))
  else return allowedSubscriptions;
};

UserSchema.methods.getModules = async function() {
  var allowedModules = []
  // Indirect scopes, based on parent elements(subscription)
  let allowedSubscriptions =  await this.getSubscriptions()
  allowedSubscriptions.forEach((s) => {
    s.modules?.forEach(m => allowedModules.push(m))
  })
  // Direct scopes
  let scopes = this.getScopes();
  let allEcosystems = await Ecosystem.find({}, {"subscriptions.modules._id": 1, "subscriptions.modules.name": 1, "subscriptions.modules.isActive": 1, "subscriptions.modules.moduleType": 1})
  let allSubscriptions = await allEcosystems.reduce((all, { subscriptions }) => [...all, ...subscriptions], [])
  let allModules = await allSubscriptions.reduce((all, { modules }) => [...all, ...modules], []).filter(m=>m.isActive)
  for (const module of allModules) {
    if (allowedModules.map(m=>m._id).some(id=>id.equals(module._id))) continue// duplicate
    if (scopes.some((scope)=>["all:all:all", `modules:read:all`, `modules:all:all`,
                    `modules:all:${module._id}`, `modules:read:${module._id}`].includes(scope))) allowedModules.push(module);

  }
  // if (this.settings.selfRegistered && (this.isTrainer()||this.isTrainee())) allowedModules = allowedModules.filter(x=>x.moduleType==="TRAINING")
  if (this.isTrainee() || this.isTrainer() || this.isCognitiveCenterUser()) return allowedModules.filter(x=> scopes.includes(`modules:all:`+x._id) || scopes.includes(`modules:read:`+x._id));
  if (this.isModuleManager() || this.isAssistant()) return allowedModules.filter(x=>scopes.includes(`modules:all:`+x._id))
  else return allowedModules;
};

UserSchema.methods.getModulesIds = async function() {
  return (await this.getModules()).map(m => m._id)
};

UserSchema.methods.getTrainingModules = async function(modules=[]) { // all modules from a subscription
  let tms = []
  if (modules.length == 0) { // if no modules are passed, get all modules from the user's subscriptions
    let scopes = this.getScopes();
    let neededScopes = scopes.filter(x=>x.match('modules:all:') || x.match('modules:read:'))
    let modulesIds = neededScopes.map(x=>x.split(":").pop())
    if (modulesIds.length > 0) { // if the user has modules scopes
      let ecosystem = await Ecosystem.findOne({ "subscriptions.modules._id": { $in: modulesIds } }, { "subscriptions.modules": 1 }).lean()
      let subscription = ecosystem?.subscriptions.find(s => s.modules.some(m => modules.includes(m._id)))
      tms = subscription?.modules.filter(m => m.moduleType == "TRAINING")||[]
    } else { // get the moduels of the first subscription
      let ecosystem = await Ecosystem.findOne({ "subscriptions.modules.moduleType": "TRAINING" }, { "subscriptions.modules": 1 }).lean()
      let subscription = ecosystem?.subscriptions.find(s => s.modules.some(m => m.moduleType == "TRAINING"))
      tms = subscription?.modules.filter(m => m.moduleType == "TRAINING")||[]
    }
  } else { // if modules are passed, filter them, get one and find the subscription
    let modulesIds = modules.map(m => m._id)
    let ecosystem = await Ecosystem.findOne({ "subscriptions.modules._id": { $in: modulesIds } }, { "subscriptions.modules": 1 }).lean()
    let subscription = ecosystem?.subscriptions.find(s => s.modules.some(m => modulesIds.includes(m._id)))
    tms = subscription?.modules.filter(m => m.moduleType == "TRAINING")||[]
  }
  return [...modules, ...tms.filter(m => !modules.map(m => m._id).includes(m._id))]
};

UserSchema.methods.detectModule = async function(moduleId = null) {
  let modules = [];
  // If moduleId is not null
  if (moduleId) {
    const moduleIds = await this.getModulesIds();
    // if moduleId is not in allowed moduleids-list of the user return null
    if (!moduleIds.find(id => id.equals(moduleId))) return [];
    // moduleId is valid
    // Get ecosystem with moduleId
    const ecosystem = await Ecosystem.findOne({"subscriptions.modules._id" : moduleId});
    // Return moduleType
    const moduleObj = (ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId));
    modules.push(moduleObj);
  } else {
    // If moduleId is null
    // get the scopes with module
    const moduleScopes = this.scopes.filter(scope => scope.name.includes("modules:") && !scope.name.match("modules:free"));
    // if no modules scope found
    if (!moduleScopes || !moduleScopes.length) return [];
    const moduleIds = moduleScopes.map(scope => scope.name.split(":").pop());
    const ecosystems = await Ecosystem.find({"subscriptions.modules._id": {$in: moduleIds}});
    moduleIds.forEach(moduleId => {
      ecosystems.forEach(ecosystem => {
        const moduleObj = (ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId));
        if(moduleObj) modules.push(moduleObj);
      });
    })
  }
  return modules;
}

UserSchema.methods.isInTrainingCenter = function(modulesObj) {
  return modulesObj.some(obj => obj.moduleType === "TRAINING");
};

// To know the user has access to Cognitive Center or not
UserSchema.methods.isInCognitiveCenter = function(modulesObj) {
  return modulesObj.some(obj => obj.moduleType === "COGNITIVE");
}

// To know the user has access to Cognitive Center or not
UserSchema.methods.isInSchoolCenter = function(modulesObj) {
  return modulesObj.some(obj => obj.moduleType === "SCHOOL");
}

// To get the age of user
UserSchema.methods.getAge = function () {
  let age = null;
  if (this.details.dateOfBirth && isValidDate(this.details.dateOfBirth)) {
    age = calculateAge(this.details.dateOfBirth);
  }
  return age;
}

const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  /*
    If the current month and day are earlier than the month and
    day of the date of birth, it subtracts one from the age to account
    for the fact that the person has not yet had their birthday this year.
  */
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
