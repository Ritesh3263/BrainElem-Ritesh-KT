const db = require("../models");
const axios = require('axios');
const ObjectId = require("mongodb").ObjectId;
const Content = require("../models/content.model");
const Event = require("../models/event.model");
const Group = require("../models/group.model");
const Result = require("../models/result.model");
const User = require("../models/user.model");
const Team = require("../models/team.model");
const mailer = require("../utils/mailer/mailer");
const tasker = require('../utils/tasker/tasker')
const {braincoreTestsIds} = require("../utils/braincoreTestsIds");

const authUtils = require("../utils/auth");
const moduleUtils = require("../utils/module");
const creditUtils = require("../utils/credit");
const resultUtils = require("../utils/result");
const resultAuthUtils = require("../utils/resultAuth");
const UserSettingsSchema = require("../models/user_settings.model");


const processSpecialResults = async (resultId, contentId, userId, moduleId) => {

  // BrainCore Test
  if (braincoreTestsIds.includes(contentId.toString())) {
    const result = await Result.findById(resultId)
    const user = await User.findOne({_id: userId}, {brainCoreTest: 1, email: 1, settings: 1, teams: 1});
    
    // ##########################################################
    // CREDITS ##################################################
    // ##########################################################
    let creditsOwner;// User for who the credits will be deducted
    // If invitation was send directly by some user
    if (result.inviter) creditsOwner =  result.inviter
    // Owner of the user
    else if (user.creator) creditsOwner = user.creator
    else{// Find module manager
      let moduleManager = await User.findOne({ "scopes.name": "modules:all:" + moduleId }, "_id email")
      creditsOwner = moduleManager?._id
    }
    // Check if user still have available credits
    let haveCredits = await creditUtils.haveCredits(creditsOwner, moduleId)
    console.log('haveCreditshaveCreditshaveCreditshaveCredits', haveCredits)
    if (!haveCredits){// If no more credits block the results
      result.blockedByCredits = true
      await result.save()
    }

    await creditUtils.deductCredits(creditsOwner, moduleId)
    // ##########################################################
    // ##########################################################

    // ############################################
    // Schedule processing results ################
    // ############################################
    tasker.addTask({ task: "PROCESS_RESULTS", resultId: resultId }, 'results', (err) => {
      if (err) console.error(err);
    })
    
    // ############################################
    // UPDATE STATUS ##############################
    // ############################################
    try {
      // update bc test registraion for user and team (if user part of team).
      if (user) {
        // completion date of test
        const completionDate = result.createdAt;
        var brainCoreTest;  
        if (user.brainCoreTest && user.brainCoreTest.status) {
          brainCoreTest=user.brainCoreTest;
        }else{
          // When test is done without direct invitation
          // This may happen when user is granted acceess to the platform without test invitation
            brainCoreTest = {
              registerDate: new Date(),
              completionDate: new Date(),
              status: 'Completed',
              reminderEmailSent: false,
              requestDate: new Date()
            }
        }

          brainCoreTest.status = "Completed";
          brainCoreTest.completionDate = completionDate;
          const updateUser = await User.findOneAndUpdate({_id: user._id}, {brainCoreTest: brainCoreTest}, {new: true});
          // send completion email notification to user
          mailer.sendBCTestCompletionEmail(updateUser, (error) => {
            if (error) console.log({ message: "Could not send Email!", error })
            else console.log({message: "Email sent.", userId: updateUser._id});
          });
          // if (process.env.BACKEND_ENV == "production") {
          //   var inviter = await db.user.findById(result.inviter)
          //   if (inviter?.email && isValidEmailAddress(inviter?.email)) {
          //     console.log("Sending information to inviter about test completion")
          //     mailer.sendBCTestCompletionEmailToInviter(inviter.email, user, async (error) => { })
          //   }
          // }
      }
    } catch (err) {
      console.log("Error in updating brain core test registraion status", err);
    }
  }

}


// Check if provided email address is valid
const isValidEmailAddress = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


// Subfunction used inside `results/add` 
// It is used for handling adding results for not-logged in users
const handleResultForNotLoggedInUsers = async (req, res) => {
  var result;
  let data = req.body
  let contentId = data.result.content

  // Only results for Braincore test are supported
  if (!braincoreTestsIds.includes(contentId.toString())) return res.status(401).send({ message: 'This is not a BrainCore test' })

  let content = await Content.findById(contentId)

  // As `user` is not provided, we only have `email` propery
  let email = data.email
  if (!email || !isValidEmailAddress(email)) return res.status(400).send({ message: 'Email is missing or not valid' })

  // Check if user with this email already exists
  let user = await db.user.findOne({ email: email })
  let isNewUser = user ? false : true

  var moduleId;
  var team;


  

  if (data.invitationToken && !isNewUser && data?.moduleId){
    // Individual invitation
    moduleId = data?.moduleId
    // Check invitation token
    let isTokenValid = await authUtils.isValidTokenForBrainCoreTest(data.invitationToken, user._id, data.inviter, moduleId)
    if (!isTokenValid) return res.status(403).send({ message: 'Invitation link is no longer valid. Invalid token.'})
  }
  else if (data?.teamId){//Team invitation
    var teamId = data.teamId;
    // ID used on QR-code - It might be used for different teams
    if (teamId == '646645f28785ff0027690206') teamId = '6527f57921e9ef000957519e'
    team = await db.team.findById(teamId)
    if (!team) return res.status(403).send({ message: 'Invitation link is no longer valid. Team does not exits.' })
    moduleId = team.module
  }
  else return res.status(403).send({ message: 'Invitation link is no longer valid. No token nor team.' })


  if (!data.inviter){// Check if inviter id was provided
    if (team && (moduleUtils.isSpecialModule(moduleId) || moduleUtils.isMarksModule(moduleId))){
      // For special modules do not require inviter for team invitation
      // As we need support for old links eg. QR code
      // Find modulemanager and set him as inviter
      let moduleManager = await User.findOne({ "scopes.name": "modules:all:" + moduleId }, "_id email")
      data.inviter = moduleManager?._id
    }else return res.status(403).send({ message: 'Invitation link is no longer valid. Incorrect inviter _id.' })
  }

  // Check if inviter exists
  if (!await db.user.findById(data.inviter)){
    return res.status(403).send({ message: 'Invitation link is no longer valid. Inviter does not exists' })
  }



  // B2C(and QR CODE)
  // NEW USER ########################################################################################################
  if (isNewUser) {// #####################################################################################################
    // Set user language and origin
    let allowedLangauages = UserSettingsSchema.path('language').enumValues
    let allowedOrigins = UserSettingsSchema.path('origin').enumValues

    let language = content.language;// language of the test
    let countryCode = data.result.data['100']// Question 100 is about country
    let origin = language + '_' + countryCode

    if (!allowedOrigins.includes(origin))// If not matching exactly find origin from language
      origin = allowedOrigins.find(o => o.includes(language))

    // If language is not on the list, set to undefined and use default
    if (!allowedLangauages.includes(language)) language = undefined

    let settings = { language, origin }
    settings.role= 'Other'
    settings.availableRoles = ['Trainee']
    settings.roleMaster = '64058db74037cfa1d4085598',//Trainee
    settings.availableRoleMasters = ['64058db74037cfa1d4085598']// Trainee
    settings.defaultRole = 'Other'

    user = await authUtils.getNewUser({ email: email, username: email, name: '_', surname: '_', password: '', settings: settings })
    user.settings.isActive = false;
    user.creator = data.inviter
  }// #############################################################################################################################

  user.settings.agreedForMarketing = data?.agreedForMarketing

  // When user for invided by team link in Sentinel, 
  // he will be added automatically to this module and team
  if (team) {// Team exists
      // Find all module managers who will be informed
      let moduleId = team.module
      var moduleManagers = await User.find({ "scopes.name": "modules:all:" + moduleId }, "_id email")

      // ADDING USER TO THE MODULE ###
      // User not yet in the module
      let alreadyInModule = false
      for (scope of user.scopes) { if (scope.name.includes(moduleId)) alreadyInModule = true }

      // User already in the module
      if (alreadyInModule) {

      } else {// User not yet in module
        let moduleScopeName = `modules:read:${moduleId}`
        user.scopes = [...user.scopes, { name: moduleScopeName }]
      }

      // ADDING USER TO THE TEAM #####
      // User already in the team
      if (team.trainee?.includes(user._id)) {

      } else {//User not yet in the team - adding him
        if (user?.teams?.length){
          user.teams = [...user.teams, teamId]
        }else user.teams = [teamId]
        team.trainee = [...team.trainee, user._id]
      }

  }else{// Individual invitation for module





  }


  if (team && !isNewUser){
    // When using invitation for team
    // Create result object in database but do not assign it to the user yet
    // Only after clicking on confirmation link results will be assigned to this user.
    result = new Result({ ...req.body.result, inviter: data.inviter, user: undefined, notConfirmedUser: user._id });
  }else{// Create new user and result - instantly assigned to the user - no confirmation required
    result = new Result({ ...req.body.result, inviter: data.inviter, _id: undefined, user: user._id });
  }


  // Save in database #####################################################
  await result.save()
  await user.save()
  if (team) await team.save()

  // Process results
  processSpecialResults(result._id, content._id, user._id, moduleId)


  // MAILING @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  // Send email about test competion to the user who took the test
  // When using team invitation - request additional email confirmation
  var baseUrl =  `https://${req.hostname}`
  if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
  if (!isNewUser && team) mailer.sendResultConfirmationEmail(user, result, baseUrl, async (error) => {
    if (error) console.log('Could not send the confirmation email')
  })


  //Inform manager about test completion from team link - only production
  if (process.env.BACKEND_ENV == "production" && team && moduleManagers){
    for (let manager of moduleManagers) {
      if (manager.email && isValidEmailAddress(manager.email)) {
        console.log("Sending information to modulemanager about test completion")
        mailer.sendBCTestCompletionEmailToInviter(manager.email, user, async (error) => {})
      }
      if (teamId == '64883af7bdc8ec0008edee93'){
        mailer.sendBCTestCompletionEmailToInviter('bf@brainelem.com', user, async (error) => {})
      }
    }
  }
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

  return res.status(200).json({ message: 'Result saved' })
}



/**
  * @openapi
  * /api/v1/result/add:
  *   post:
  *     description: | 
  *        Save results after completing any type of `contents` and `events`. This also includes saving results from BrainCore tests for both logged-in and not logged-in users, 
  *        The example below is adjusted for not logged-in users who took BrainCore Adult test.
  *     tags:
  *      - _results
  *     parameters:
  *       - name: result
  *         required: false
  *         description: Result object 
  *         in: body
  *         schema:
  *           type: object
  *           properties:
  *             email:
  *               description: Email address provided only for BrainCote tests and only by users who are not logged-in. 
  *                            Activation link will be sent to this email, and it will give the user access to his results.
  *               type: string
  *               example: testing@brainelem.test
  *             result:
  *               type: object
  *               example:
  *                 content: 60bbbbef2b4c80000732fdf5
  *                 timeSpent: 0
  *                 awayTime: 0
  *                 awayCount: 0
  *                 inactiveTime: 0
  *                 inactiveCount: 0
  *                 data: {"100":"FR","9992":"2","9993":"1","9994":"3","9995":"2","9996":"1","10007":"4","10013":"4","10015":"4","10023":"3","10025":"4","10027":"3","10039":"4","10041":"4","10045":"4","10049":"3","10051":"4","10069":"3","10071":"3","10073":"4","10077":"4","10079":"3","10083":"4","10085":"3","10093":"3","10105":"4","10107":"3","10109":"3","10111":"3","10113":"4","10115":"4","10117":"4","10123":"4","10129":"4","10139":"4","10143":"4","10145":"4","10149":"4","10151":"4","10153":"4","10159":"4","10161":"3","10163":"4","10165":"4","10167":"4","10173":"4","10175":"3","10177":"3","10181":"4","10183":"3","10191":"4","10193":"4","10197":"3","10201":"4","10203":"4","10223":"4","10225":"4","10227":"3","10237":"3","10243":"3","10245":"4","10247":"3","10251":"4","10253":"4","10255":"4","10259":"3","10265":"3","10267":"3","10275":"4","10277":"3","10283":"4","10289":"3","10291":"4","10293":"4","10301":"3","10305":"3","10309":"4","10311":"3","10315":"4","10319":"4","10321":"3","10323":"4","10325":"4","10327":"4","10329":"3","10331":"4","10333":"4","10335":"4","10345":"4","10349":"4","10351":"4","10353":"3","10361":"4","10365":"4","10371":"4","10375":"4","10377":"4","10381":"4","10385":"3","10387":"4","10393":"4","10395":"4","10399":"3","10403":"4","10407":"3","10413":"4","10415":"4","10419":"4","10425":"3","10427":"4","10431":"4","10433":"3","10439":"4","10443":"4","10445":"3","10447":"3","10451":"4","10453":"3","10457":"3","10461":"4","10467":"4","10473":"4","10477":"3","10479":"4","10483":"4","10485":"3","10487":"3","10489":"3","10497":"4","10501":"4","10503":"4","10507":"4","10511":"4","10513":"4","10519":"3","10523":"4","10535":"4","10539":"4","10541":"4","10545":"4","10551":"4","10553":"4","10561":"4","10571":"3","10575":"4","10577":"1"}
  *               properties:            
  *                 content:
  *                   description: Id of associated content. Used only when `event` is not provided.
  *                   required: false
  *                   type: string
  *                 event:
  *                   description: Id of associated event. Alternative to providing `content`.
  *                   type: string
  *                   required: false
  *                 points:
  *                   description: Points calculated based on the answers in `data` object. For now it is calculated on frontend. Used for test such as exams etc.
  *                   type: number
  *                 totalPpoints:
  *                   description: Total, maxium number of points the user can get from the content. For now it is calculated on frontend. Used for test such as exams etc.
  *                   type: number
  *                 percentage:
  *                   description: Percentage of points in the ratio of totalPoints. For now it is calculated on frontend.  Used for test such as exams etc.
  *                   type: number
  *                 grade:
  *                   description: Grade calculated based on the `percentage` value and associated `gradingScale`. For now it is calculated on frontend.  Used for test such as exams etc.
  *                   type: string
  *                 timeSpent:
  *                   description: Total time in seconds spent on the content by the user.
  *                   type: number
  *                 awayTime:
  *                   description: For how long(in seconds) user was away. This means that user left to other browser tab or other program on his computer.
  *                   type: number
  *                 awayCount:
  *                   description: How many times user was away. This means that user left to other browser tab or other program on his computer.
  *                   type: number
  *                 inactiveTime:
  *                   description: For how long(in seconds) user was inactive. Inactive means that there was no mouse or keyboard activity for more than 30 second.
  *                   type: number
  *                 inactiveCount:
  *                   description: How many times user was inactive. Inactive means that there was no mouse or keyboard activity for more than 30 second.
  *                   type: number
  *                 data:
  *                   description: Result data object containing all the answers. Keys are the ids of questions and values are answers provided by user.
  *                   type: object
  *     responses:
  *       200:
  *        schema:
  *          type: object
  *          example: {"message": "Saved successfully"}
  * 
  */
exports.add = async (req, res) => {
  // ############################
  // Users who are not logged in
  if (!req.userId){
    handleResultForNotLoggedInUsers(req, res)
    return
  }
  // #######################
  // Users who are logged in
  var content;
  if (req.body.result.event) {
    var event = await Event.findById(req.body.result.event).populate({
      path: "assignedContent",
      select: ["gradingScale"],
      populate: { path: "gradingScale", select: ["passPercentage", "grades"] },
    });
    content = event.assignedContent;
  } else {
    content = await Content.findById(req.body.result.content, [
      "gradingScale", "allowExtraAttemptFor"
    ]).populate({ path: "gradingScale", select: ["passPercentage", "grades"] });

    
  }
  var result = new Result({ ...req.body.result });
  
  if (req.moduleId){// Only when moduleId is provided. For some users it's set to 0
    // load ecosystem to check if we are in TRAINING module 
    let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":req.moduleId}).exec()
    // if TRAINING autopublish result
    if((ecosystem?.subscriptions.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId))?.moduleType === "TRAINING") {
      result.published = true;
      result.publishedAt = Date.now();
    }
  }
  // If no user in body, use current user
  result.user =  req.body.result.user ?  req.body.result.user : req.userId;
  
  try { 
    await result.save() 
  } catch (error){
    res.status(500).send(error);
  }

  // Extra processing, eg. for BrainCore tests
  if (content?._id) processSpecialResults(result._id, content._id, result.user, req.moduleId)

  if (event){//event
    if (event.allowExtraAttemptFor.some((uid)=>uid.equals(result.user))) {
      let foundEvent = await Event.findOneAndUpdate({ _id: event._id }, { $pull: { allowExtraAttemptFor: result.user } })
      if (!foundEvent) res.status(404).send({ message: "Event not found" });
      else {
        res.status(200).json({ message: "Created successfully", resultId: result._id });
      }
    } else res.status(200).json({ message: "Created successfully", resultId: result._id });
  }else {
    if (content?.allowExtraAttemptFor?.some((uid)=>uid.equals(result.user))) {
      let foundContent = await Content.findOneAndUpdate({ _id: content._id }, { $pull: { allowExtraAttemptFor: result.user } })
      if (!foundContent) res.status(404).send({ message: "Content not found" });
      else {
        res.status(200).json({ message: "Created successfully", resultId: result._id });
      }
    } else res.status(200).json({ message: "Created successfully", resultId: result._id });
  }
};


/**
  * @openapi
  * /api/v1/result/confirm/{resultId}:
  *   put:
  *     description: | 
  *        Confirm result and assign it to the user. This is used by not logged-in users who took  BrainCore tests after they access platform via activation link.
  *     tags:
  *      - _results
  *     parameters:
  *      - name: resultId
  *        in: path
  *        required: true
  *        type: string
  *        example: 642289e0a551e6039dbd46eb
  *        description: Id of result to be confirmed
  *     responses:
  *       200:
  *        schema:
  *          type: object
  *          example: {"message": "Result successfully confirmed and assigned to a user"}
  * 
  */
exports.confirm = async (req, res) => {
  let result = await Result.findById(req.params.resultId)

  if (!result) return res.status(404).send({ message: "Not found." });
  
  if (result.user) return res.status(200).json({ message: "Result already confirmed." });

  if (result.notConfirmedUser && req.userId==result.notConfirmedUser){
    result.user = result.notConfirmedUser
    await result.save()
    return res.status(200).json({ message: "Result successfully confirmed and assigned to a user" });
  }

  return res.status(401).send({ message: "Not allowed" });
}



/**
  * 
  * @openapi
  * /api/v1/result/price/{resultId}:
  *   get:
  *     description: |
  *       Get price for requested result
  *     tags:
  *      - _results
  *     parameters:
  *      - name: resultId
  *        in: path
  *        required: true
  *        type: string
  *        example: 642289e0a551e6039dbd46eb
  *        description: Id of result
  *      - name: currencyCode
  *        in: query
  *        required: true
  *        type: string
  *        example: EUR
  *        enum:
  *         - EUR
  *         - USD
  *         - CHF
  *         - PLN
  *        description: Currency code in 3-letters ISO 4217
  *     responses:
  *       200:
  *        description: Price for selected result
  *        schema:
  *          type: object
  *          example: {"price": 19.99}
  */
exports.getPrice = async (req, res) => {
  let price = await resultUtils.getPrice(req.params.resultId, req.query.currencyCode)
  return res.status(200).json({price: price});
}


exports.read = async (req, res) => {
  let result = await Result.findOne({ _id: req.params.resultId })
    .populate({ path: "content" })
    .populate({ path: "user", select: ["name", "surname"] })
  if (!result) res.status(404).send({ message: "Not found." });
  else res.status(200).json(result);
};

exports.readAll = async (req, res) => {
  let results = await Result.find({ module: req.moduleId })
  res.status(200).json(results);
};

exports.update = async (req, res) => {
  Result.findOneAndUpdate(
    { _id: req.params.resultId },
    { $set: req.body },
    { runValidators: true, context: 'query'},
    (err, result) => {
      if (err) res.status(500).send(err);
      else if (!result) res.status(404).send({ message: "Not found" });
      else res.status(200).json({ message: "Updated successfully" });
    }
    )
  //   // COMMENT SENDING MAILS
  // if(req.body.sendMail) {
  //   let user = await db.user.findById(result.user)
  //   let parents = await db.user.find({"details.children":user._id})
  //   let listOfParents =  parents.map(x=>x._id);
  //   let sentMailto = listOfParents.filter(x=>!result.usersWhoReceivedMail.find(y=>y.equals(x)));
  //   // if(sentMailto.length>0) {
  //   //   var baseUrl =  `https://${req.hostname}`
  //   //   if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
  //   //   sentMailto.forEach(parent=>{
  //   //     mailer.sendEmailForResultPublication(parents.find(x=>x._id.equals(parent)), baseUrl, (error) => {
  //   //       if (error) res.status(500).send({ message: error })
  //   //       else {
  //   //         result.usersWhoReceivedMail.push(parent);
  //   //         result.save()
  //   //         // res.status(200).json({message: "Updated successfully! An email was sent" });
  //   //       }
  //   //     })
  //   //   })
  //   // }
  // }
};

exports.remove = async (req, res) => {
  await Result.findByIdAndDelete(req.params.resultId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.updateGradeBookResults = async (req, res) => {
  let groupId = req.body.groupId;
  let trainingModuleId = req.body.trainingModuleId;
  // let trainingPathId = req.body.trainingPathId
  let newExams = req.body.newExams || []; // new events
  let deletedExamIds = req.body.deletedExamIds || []; // event id list
  let allResults = req.body.trainees
    .map(u => u.grades.filter(x => x.new))
    .flat()
    .map(r => ({ ...r, updatedBy: req.userId, grade: r.grade, published: true}));

  let resultIdsToBeDeleted = allResults.filter(r=>r.grade==="").map(r=>r._id)
  allResults = allResults.filter(r=>r.grade!=="")

  // create new events based on new exams/assignments
  let events = [];
  let eventIDs = [];
  newExams.forEach((ne) => {
    let eventId = new ObjectId();
    eventIDs.push(eventId);
    events.push(
      new Group({
        _id: eventId,
        name: ne.name,
        eventType: "Exam",
        assignedGroup: groupId,
        assignedSubject: trainingModuleId,
        creator: req.userId,
        date: new Date(),
      })
    );
  });

  // Delete exams
  Event.deleteMany({ _id: deletedExamIds }).exec();

  // New exams
  Event.insertMany(events);
  
  // save results // update or insert new
  let results = await Result.bulkWrite(
    allResults.map(result => ({
      updateOne: {
        filter: { _id: result._id ?? new ObjectId() },
        update: { $set: result },
        upsert: true,
      },
    }))
  );
  res.status(200).json(results);
    
  // delete results of deleted external exams
  Result.deleteMany({ $or: [ {event: deletedExamIds}, {_id: resultIdsToBeDeleted}] }).exec();
};

exports.getLatestResultForUser = async (req, res) => {
  // Action for geting result of a trainee
  let result = await Result.findOne({ content: req.params.contentId, user: req.params.userId })
    .sort("-createdAt")
    .populate({ path: "content" })
    .populate({ path: "event", select: ["date"]  })
    .populate({ path: "user", select: ["name", "surname"] })
  if (!result) res.status(404).send({ message: "Not found." });
  else res.status(200).json(result);
};

exports.getAllResultsForUser = async (req, res) => {
  // Action for geting all results of a trainee
  let results = await Result.find({ content: req.params.contentId, user: req.params.userId })
    .sort("-createdAt")
    .populate({ path: "user", select: ["name", "surname"] })


  // Assing canEdit property - for frontend view
  let modified = []
  for (let result of results) {
    modified.push({
      ...result.toObject(),
      canEdit: (await resultAuthUtils.canEditResult(req.userId, result._id, req.moduleId))
    })
  }
  
  //canEditResult
  res.status(200).json(modified);
};

// Action for geting result for all the trainees in the group
exports.getGroupResults = async (req, res) => { 
  let group = await db.group.findOne({ "_id": req.params.groupId })
  if (!group) res.status(404).send({ message: "Group not found." });
  let query = { 'content': req.params.contentId, user: { $in: group.trainees }}
  
  let results = await Result.find(query, {user: 1, createdAt: 1}).populate({path: 'user', select: ['name','surname']}).sort('-createdAt')
  res.status(200).json(results);
};

exports.getGrades = async (req, res) => {
  // Action for geting result
  var user = await db.user.findOne({_id: req.userId});
  if (user.isTrainee()) {
    let results = await Result.find({ user: req.userId }, { data: 0 })
      .sort({ updatedAt: "desc" })
      .populate([
        { path: "user", select: ["name", "surname"] },
        { path: "content",  populate: [
          { path: 'trainingModule' }]
        },
        { path: "event", populate: [
          { path: 'assignedSubject' }]
        },
      ])
    res.status(200).json(results);
  } else if (user.isParent()) {
    let results = await Result.find({ user: { $in: user.details.children } }, { data: 0 })
      .sort({ updatedAt: "desc" })
      .populate([
        { path: "user", select: ["name", "surname"] },
        { path: "content",  populate: [
          { path: 'trainingModule' }]
        },
        { path: "event",  populate: [
          { path: 'assignedSubject' }]
        },
      ])
    res.status(200).json(results);
  } else res.status(403).send({ message: "You are not allowed to see the grades" })
};

exports.uploadFile = async (req, res) => { // Action for uploading files
  let file = await db.resultFile.create({ 
    fileName: req.file.filename, 
    fileOriginalName: req.file.originalname, 
    mimeType: req.file.mimetype, 
    size: req.file.size, 
    uploadedBy: req.userId 
  });
  res.status(200).json(file);
};

exports.getFileDetails = async (req, res) => { // Action for reading file details
  let file = await db.resultFile.findOne({ '_id': req.params.fileId })
  if (!file) res.status(404).send({ message: "File not found." });
  else res.status(200).json(file);
}

exports.removeFile = async (req, res) => { // Action for removing files
  let file = await db.resultFile.findOne({ '_id': req.params.fileId, uploadedBy: req.userId })
  file.remove()
  res.status(200).json(file);
}

exports.downloadFile = async (req, res) => { // Action for downloading files
  let file = await db.resultFile.findOne({ '_id': req.params.fileId })
  if (!file) res.status(404).send({ message: "File not found." });
  else {
    res.setHeader('Content-disposition', `inline; filename=${encodeURIComponent(file.fileName)}`);
    res.setHeader('Content-originalname', encodeURIComponent(file.fileOriginalName));
    res.setHeader('Content-type', file.mimeType);
    res.sendFile('/app/public/result/files/' + file.fileName);
  }
};