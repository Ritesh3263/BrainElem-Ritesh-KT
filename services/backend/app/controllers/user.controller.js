const User = require("../models/user.model");
const Ecosystem = require("../models/ecosystem.model");
const Group = require("../models/group.model");

const ConnectedDevice = require("../models/connectedDevice.model");

const {isValidObjectId} = require("mongoose");
var bcrypt = require("bcryptjs");
const db = require("./../models/index");
const CognitiveFaq = require("./../models/cognitiveFaq.model");

const cognitiveUtils = require("../utils/cognitive");
const authUtils = require("../utils/auth");
const ResultUtils = require("../utils/result")

const generateResultPdf = require("../utils/pdfGeneration/generateResultPdf");

const tasker = require('../utils/tasker/tasker')
const mailer = require("../utils/mailer/mailer");

exports.get = async (req, res) => {
  let user = await User.findOne({_id:req.params.userId})
  if (!user) res.status(404).send({ message: "Not found" });
  else res.status(200).json(user);
};

/**
 * @openapi
 * /api/v1/users/read/{userId}:
 *   get:
 *     description: Read User
 *     tags:
 *       - _Cognitive User Module
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            username:
 *              type: string
 *              example: "User A"
 *         description: Success Response.
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Not found
 */
// read and get same but limiting information
exports.read = async (req, res) => {
  let user = await User.findOne({_id:req.params.userId}, {_id:1, name:1, surname:1, username:1, email:1, details:1, certificates:1, settings:1})
    .populate([{path: "details.children", select: ["name", "surname"]},{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]},{path:"teams", select: ["name"]}])
  if (!user) res.status(404).send({ message: "Not found" });
  else res.status(200).json(user);
};

exports.readAll = async (req, res) => {
  // Get list with all users' ids
  let users = await User.find({}, "_id")
  res.status(200).json(users);
};


exports.adminBoard = async (req, res) => {
  res.status(200).json("Admin Content.");
};

exports.update = async (req, res) => {
  let updateData = req.body;
  if (req.body.password) {
    updateData.password = bcrypt.hashSync(req.body.password, 8);
  }

  let user = await User.updateOne(
    { _id: req.params.userId },
    { $set: updateData },
    { runValidators: true })
  if (!user.nModified) res.status(404).send({ message: "User was not found" });
  else res.status(200).json();
};

/**
 * @openapi
 * /api/v1/users/faq:
 *   get:
 *     description: Load frequently asked questions with answers - this will be moved outside of user controller
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: mobile
 *         description: When set to true it will return FAQ for mobile application
 *         in: query
 *         type: boolean
 *         default: false
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which faq will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: All questions and answers
 *        schema:
 *          type: object
 *          example: [{"question":"What possibilities does the dashboard give me?","answer":"The set of tables and charts you have in front of you is a summary of the best Amelia knows about you :) These are information about how you learn, what you can change, develop, specific solutions and hints. We encourage you to click, try, read and learn about the dashboard functions. Most importantly, however, you should use the recommendations and focus on gaining knowledge about yourself and developing your abilities."},{"question":"What is BrainCore","answer":"BrainCore is a learning and teaching system... because it is something for those who absorb knowledge, but also something valuable for those who are educators. BrainCore consists of: a test, describing the characteristics of learning, and recommendations for the student and teacher, increasing the possibility of acquiring knowledge and developing effective action. The name itself comes from the fact that for many years we have observed people learning, conducted scientific research, learned from neuroscientists-until we finally created a system that contains the secret-the essence of the mind. Everything that will help you learn and perform better."}]
 * 
 * 
 */
exports.getFAQ = async (req, res) => {
  // To be consistant this function is implemented in this controller. 
  // In the future there will be a new controller for those cognititve functions.
  let query = {}
  //if (req.query.mobile=='true') query.mobile = true
  
  let documents = await CognitiveFaq.find(query)

  let emptyText = "Not found. Language "+req.query.lang

  let LANG = req.query.lang?.toUpperCase()
  if (!LANG) LANG = "EN"
  let response = documents.map(d=>{return {'key': d.key,'question': d.question[LANG]??emptyText, 'answer': d.answer[LANG]??emptyText, }})

  res.status(200).json(response);
};


/**
 * @openapi
 * /api/v1/users/traits/{userId}/{resultId}:
 *   get:
 *     description: | 
 *        Load NAD/QNAD traits with dynamic descriptions for the selected result of a user. Covers all traits-related descriptions in MySpace and Full Cognitive Report
 *        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *        Currently  data if formated in the old form (action-1, part-1 etc) 
 *        In the future it would be the best to just send the object based on the database schema( actions: [], descriptions: [] etc)
 *        !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user for which traits should be loadded
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 633d52065c93720025b66349
 *         description: Id of result for which traits should be loadded
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which traits will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: All traits texts for display in CS and full report 
 *        schema:
 *          type: object
 *          example: {"communication-strategy":{"short-name":"Communication strategy","level":4,"normalizedValue":3.645559507516861,"minValue":0,"maxValue":9.139106608539187,"long-name":"Communication strategy (A1)","short-description":"Extroversion and communication","long-description":"The value A1 is extroversion and communication. People with a score A1 high are talkative and full of life, trying to establish many friendships exerting influence in conversations. Talking to another person is how they learn (cognitive transfer). The efficiency in this case depends on the quality of interaction with others.","main-definition":"People around you can be a valuable source of knowledge and skills. You can learn a lot from them! Communication is important both in the real world and online! Asking questions, listening attentively, as well as revealing opinions, receiving and giving feedback can accelerate learning and development. Remember that good relationships with others can give you a lot of support.","part-1":"A student appreciates that he/she can learn from other people and that there is great potential in sharing information. ","part-2":"A student easily establishes contact and relations with various people.","part-3":"A student seems to be brave enough to make his/her opinion and views known, and easy to ask questions when he/she doesn't understand something in many situations. In some he/she avoids exposure.","neurobiological-effect-1": "Mock effect 1", "neurobiological-effect-2": "Mock effect 2","action-1":"A student should take advantage of the fact that when he/she is learning he/she can ask questions or share opinions.","lowest":["When a student focuses on his/her own work, he/she doesn't ask questions, he/she doesn't take part in discussions - he/she loses the opportunity to clarify doubts, to learn social skills, to establish relationships."],"lowest-definition":"It happens that among our characteristics we have the one trait that makes us slower, less efficient in learning and lowers our potential. You can look at this trait and consider its development in order to boost the process of your student's working and learning."},"cooperation":{"short-name":"Cooperation","level":3,"normalizedValue":4.378695083951917,"minValue":0,"maxValue":10,"long-name":"Cooperation (A2)","short-description":"Tendency to negotiate and agree on various points","long-description":"The value A2 refers to the tendency to negotiate and agree on various points of view in controversial or conflicting situations. People with a value A2 high demonstrate their ability to manage conflict situations and seek mutually beneficial solutions. This dimension shows the ability of a person to name, understand and interpret the emotions, reactions and priorities of others, even if the information is not expressed directly. It also shows the ability to detect emotional cues people with whom there is interaction, allowing to respect the views of other points. The value A2 indicates a tendency to cooperate. A person with a high score will be characterized by flexible views and beliefs, will be able to discuss and convince, but also to be convinced. During this interaction, a person with a score A2 high can receive information from other people and learn from them.","main-definition":"While working in a group, realising joint projects, you will enter into disputes, sometimes conflicts. Which attitude will you show: competition or cooperation? It is very important to understand the other person, to be open to their arguments, but also to look for solutions and to be able to negotiate.","part-1":"A student is able to recognise other people's needs, understand their position and come to an agreement in many situations. In some situations his/her own opinions, emotions and needs take over and he/she is not convincing.","part-2":"In some situations a student is able to find different solutions to a problem, but in some he/she stops at a single idea or sticks to his/her original opinion.","part-3":"During debates, discussions a student sometimes presents arguments that appeal to the other side and are open to the opinions of others. But sometimes he/she insists on his/her own or does not take part in the conversation.","neurobiological-effect-1": "Mock effect 1", "neurobiological-effect-2": "Mock effect 2","action-1":"A student should try to develop partnerships with other people. Especially in those certain situations where he/she is fighting and competing."},"self-activation":{"short-name":"Self activation","level":4,"normalizedValue":8.680973371260748,"minValue":0,"maxValue":10,"long-name":"Self activation (N1)","short-description":"Ability to direct its own actions to ensure that the goal is reached","long-description":"The value N1 indicates the ability to direct its own actions to ensure that the goal is reached. This is usually accompanied by a positive attitude and enthusiasm that help the natural process of effort. A characteristic sign of this value is a clear commitment to development and motivation. The competition is often associated with this value. People with a score N1 high is often set difficult goals and bold, feeding a need for inner satisfaction and striving to achieve high performance.","main-definition":"In development and learning it is crucial to direct one's own activities into concrete ambitious goals. Positive attitude and enthusiasm helps in making an effort regardless of the obstacles.","part-1":"A student often sets him/herself ambitious goals, and is prepared to put in the effort to achieve them despite various challenges. Independence is important to him/her.","part-2":"In many situations a student is intrinsically motivated - he/she wants to achieve something for him/herself, out of him/her own conviction. He/she stays focused on the task at hand, even when difficulties and fatigue arise. He/she may show resistance to external pressures. But in some it will help to moblize him/her again. He/she is aware how to manage him/herself.","part-3":"In many situations a student is able to bear the effort and be very persistent in achieving a goal, although sometimes he/she needs mobilisation. He/she is able to absorb a large amount of knowledge at once. Also information that is more difficult to understand, more abstract, but he/she needs time to process it. He/she is able to learn many things and for quite a long time. He/she is willing to put effort into analysing and understanding content, linking elements.","neurobiological-effect-1": "Mock effect 1", "neurobiological-effect-2": "Mock effect 2","action-1":"A student can continue to develop his/her abstract thinking skills, increase his/her ambition by reading more challenging literature, or taking courses and setting different kinds of goals.","highest":"Each person has a resource in their learning style that is a major source of their potential. Often a person arranges its activities around this resource in order to make the most of it.","highest-definition":["Ambition and a willingness to put in the effort to achieve a goal are very much responsible for a student's potential."]},"self-confidence":{"short-name":"Self confidence","level":4,"normalizedValue":8.364125844146278,"minValue":0,"maxValue":10,"long-name":"Self confidence (N2)","short-description":"Ability to understand and to name one's feelings","long-description":"The value of N2 is the ability to understand and to name his feelings, to limit the expression of negative emotional impulses in difficult situations and adapt well to the change without losing confidence . This dimension is characterized by a positive self-image. A person with a high value of N2 has a strong sense of self confidence. Risk taking expresses faith in his success and motivated to achieve ambitious goals.","main-definition":"Difficult, new, unexpected situations occur in the course of learning, work. It is very important to focus on finding solutions and persevering with constructive actions. Knowing your emotional reactions and managing your feelings helps with that.","part-1":"A student knows him/herself and his/her reactions to different situations. In many situations he/she is able to control him/herself. He/she tends to focus more on how to resolve a situation than on how he/she is experiencing it.","part-2":"In many difficult, risky situations, a student focuses on completing the task, finding a solution rather than thinking about him/herself or experiencing emotions.","part-3":"A student knows his/her worth and his/her ability to overcome various difficulties. Individual failures and successes do not greatly affect his/her overall self-image, although they may destabilise it for a while.","neurobiological-effect-1": "Mock effect 1", "neurobiological-effect-2": "Mock effect 2","action-1":"A student should use his/her ability to focus on the task at hand in difficult situations. He/she should look for several possible solutions."},"regularity":{"short-name":"Regularity","level":4,"normalizedValue":8.224644282710086,"minValue":3.1322182652090174,"maxValue":10,"long-name":"Regularity (D)","short-description":"Ability to organize space","long-description":"The D value indicates the ability to organize space (documents, law enforcement on the desk, preparing educational material) and time management (deadlines, punctuality, ahead of time required to perform the tasks). It is also to limit the random events, but especially to analyze and predict them. This dimension is the regularity, the independent, systematic organization and working methods.","main-definition":"When making an effort, allocating time, it is worth doing it in an organised manner. Planning your actions, your next steps, but also implementing your intentions and following through with your goals will make you more effective at studying. In learning, it will allow you to learn at a lower cost and will support you in remembering for longer time.","part-1":"A student plans action steps, organising and prioritising tasks in many situations.","part-2":"Keeping to agreements, resolutions, deadlines is important for a student in many situations and supports his/her effectiveness.","part-3":"In most situations a student takes care of the learning rhythm and frequency that is right for him/her. He/she is quite systematic.","neurobiological-effect-1": "Mock effect 1", "neurobiological-effect-2": "Mock effect 2","action-1":"When starting new classes, projects a student should use his/her potential to organise activities. We encourage students to learn new methods."},"current-performance-indicator":{"short-name":"QNAD","level":1,"normalizedValue":65.5169676278943,"minValue":50.33145380734489,"maxValue":80.7024814484437,"long-name":"Current performance indicator (QNAD)","short-description":"Indicates the likelihood of success as a student","long-description":" QNAD® is a value representing the Current Performance Index that indicates the likelihood of a child's success as a student - with or without additional external assistance. QNAD® indicates the child's potential to acquire knowledge and his ability to encode in memory as well as to activate long-term memory. QNAD® presents the effect of catalysts - NAD® values.","main-definition":"Learning is a complex process. It requires: assimilating information, memorising, analysing, processing, and finally using in practice. We are able to estimate to what extent you will need additional classes, exercises, individual consultations.","part-1":"It seems that a student feels more comfortable with external support. He/she should read our recommendations about developing his/her learning. We advise you to pick additional lessons and ask someone to help him/her - it will start the progress faster."}}
 * 
 * 
 */
exports.getTraitsForSelectedResult = async (req, res) => {
  // Data if formated in the old form (action-1, part-1 etc) 
  // In the future it would be the best to just send the object based on the database schema(actions: [], descriptions: [] etc)
  let user = await User.findOne({_id: req.params.userId})
  let traits = await user.getNADTraits(req.params.resultId, req.query.type, req.query.lang??'en')
  if (!traits) res.status(404).send({ message: "Not found" });
  else res.status(200).json(traits);
};




/**
 * @openapi
 * /api/v1/users/tip/{userId}:
 *   get:
 *     description: | 
 *        Load the cognitive tip for the selected user.
 *        Each tip have _id and 3 parts: introduction, text, reasoning which can be loaded in language of currently logged in user
 *        The tip is being updated once for 14 days (maxTimeForTip) and it's based on the latest BrainCore test results. 
 *        In case there is no more tips or tips do not exists for the user, the null response will be returned.
 * 
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: false
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user for which the tip should be loadded
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which the data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: Active tip 
 *        schema:
 *          type: object
 *          example: {"_id":"23_2","introduction":"To cooperate better with others","text":"Try to get involved in a group discussion.","reasoning":"Cooperation instead of involving in conflict allows us to achieve more together, and… saves time.","myConfirmationFeedback":0,"othersConfirmationFeedback":0,"favourite":false,"useful":false}
 */
exports.getActiveTip = async (req, res) => {
  // Get list of tips for the user
  let user = await User.findOne({_id: req.params.userId||req.userId})
  let tip = await user.getTip(req.query.type, req.query.lang??'en')
  res.status(200).json(tip);
};



/**
 * @openapi
 * /api/v1/users/opportunities/{userId}:
 *   get:
 *     description: | 
 *        Load opportunities(questions) based on the latest BrainCore result.
 * 
 *        It can be run in 2 different modes:
 * 
 *        - automatic - This will return opportunities for the areas of development with level: very low(1), low(2), medium(3). 
 *                      When user has only high and very high values the list will be empty.
 *        - manual - by providing areaId parameter -  This will return all opportunities for the area of development regardless of the user's values. 
 * 
 *        After providing confirmation feedback(Yes/No answers in VS), calling this action once more, will return updated list. 
 *        The opportunities for which you have just answered a question, will be always put at the end of the list.
 *        The value `totalNumber` is the number of all available opportunities for a user.
 *        
 * 
 *        Examples:
 *        - A user has 22 opportunities in general(totalNumber=22)
 *        - Fetch 15 of them
 *        - User answers `No` for 15 of them.
 *        - Fetch another 15 oppportunities (this is already a new list)
 *        - When users answers `No` for 7 of them, we finish the process because he has reached the totalNumber(22)
 * 
 *     tags:
 *      - _virtual_coach
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user for which opportunities should be loadded
 *       - name: areaId
 *         in: query
 *         required: false
 *         type: integer
 *         enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         description: | 
 *            This parameter is optional and it is used only whe user manualy selects the area of development in the virtual coach. This will return all opportunities for the area of development regardless of the user's values.
 *            
 *             Areas of development have those ids:
 *               - 1 = 'self-activation'
 *               - 2 = 'self-confidence'
 *               - 3 = 'communication-strategy'
 *               - 4 = 'cooperation'
 *               - 5 = 'regularity'
 *       - name: size
 *         in: query
 *         type: integer
 *         description: The number of opportunities to return. When not provided it will return all available opportunities for the user. Needs to be non-negative.
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which the data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: List of opportunities to display to a user. Starting with the most relevant.
 *        schema:
 *          type: object
 *          example: {totalNumber: 42, opportunities: [{"_id":"1_1_1_1", "type": "sociological",  "text":"It's hard to say that I have a specific life plan to devote myself to. I improvise my plans on a daily basis."},{"_id":"1_2_1_1", "type": "psychological",  "text":"When I lose sight of my goal, I also lose my momentum and stop pursuing my original plan."},{"_id":"1_3_1_1", "type": "development",  "text":"I don't always manage to reach my research goal, I have difficulties in achieving the set objectives."}]}
 * 
*/
exports.getOpportunities = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let requestedAreas = req.query.areaId ? [req.query.areaId] : undefined
  let limit = req.query.areaId ? 5 : 3
  let opportunities = await user.getOpportunities(req.query.type, req.query.lang??'en', requestedAreas, limit)
  let totalNumber = opportunities.length||0
  if (req.query.size) opportunities = opportunities.slice(0, parseInt(req.query.size))
  res.status(200).json({'opportunities': opportunities, 'totalNumber': totalNumber});
};

/**
 * @openapi
 * /api/v1/users/cognitive-report/data/{userId}/{resultId}:
 *   get:
 *     description: |
 *        Load all data needed for cognitive PDF report
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user for which data should be loadded
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 642289e0a551e6039dbd46eb
 *         description: Id of result for which data should be loadded
 *       - name: type
 *         in: query
 *         type: string
 *         default: employee
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: fr
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: Data for PDF report
 *        schema:
 *          type: object
 *          example: []
 * 
*/
// exports.getDataForCognitiveReport = async (req, res) => {
//   // Find user
//   let user = await db.user.findOne({_id: req.params.userId})
//   if (!user) return res.status(404).send({message: "USER_NOT_FOUND"});

//   // Find result
//   var result = await db.result.findOne({ _id:req.params.resultId, user: req.params.userId, traits: { $exists: true, $ne: [] } })
//       .populate({ path: 'user', select: ["name", "surname", "email"] })
//       .exec()
//   if (!result) return res.status(404).send({message: "RESULT_NOT_FOUND"});



//   let response = await cognitiveUtils.getDataForCognitiveReport(result, req.query.type, req.query.lang)
//   res.status(response.status).send(response.data);
// }



const getFilenameForPDFReport = (result) => {
  // Get user information
  let name = result.user.name && result.user.name !== '_' ? result.user.name : '';
  let surname = result.user.surname && result.user.surname !== '_' ? result.user.surname : '';
  let email = result.user.email || '';

  // Get date of test
  let date = new Date(result.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-');

  // Create filename
  let filename = '';
  if (name && surname) {
    filename = `BrainCore Results - ${name} ${surname} - ${date.replaceAll('-','.')}.pdf`;
  } else {
    filename = `BrainCore Results - ${email.split('@')[0]} - ${date.replaceAll('-','.')}.pdf`;
  }
  return filename
}

/**
 * @openapi
 * /api/v1/users/cognitive-report/download/{userId}/{resultId}:
 *   get:
 *     description: |
 *        Download cognitive PDF report for selected results
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user for which PDF will be generated
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 642289e0a551e6039dbd46eb
 *         description: Id of result for which PDF will be generated
 *       - name: template
 *         in: query
 *         type: string
 *         description: |
 *           Which template to use for generating the PDF report. 
 *             - hr-long - Template for HR test. Will be used by default for results coming from BrinCore Pro Test
 *             - edu-short - Short(single-page) template for EDU
 *             - edu-long - Template for EDU
 *             - edu-long-horizontal - Template for EDU with horizontal orientation. Will be used by default for results coming from BrinCore Edu Test
 *         enum:
 *         - hr-long
 *         - edu-long
 *         - edu-short
 *         - edu-long-horizontal
 *         default: hr-long 
 *       - name: type
 *         in: query
 *         type: string
 *         default: employee
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test
 *       - name: lang
 *         in: query
 *         type: string
 *         default: fr
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: PDF report
 * 
*/
exports.downloadCognitiveReport = async (req, res) => {
  // Find user
  let user = await db.user.findOne({_id: req.params.userId})
  if (!user) return res.status(404).send({message: "USER_NOT_FOUND"});

  // If language was not provided use the language from settings
  let lang = req.query.lang
  if (!lang) lang = user.settings.language

  // Find result
  var result = await db.result.findOne({ _id:req.params.resultId, user: req.params.userId})
      .populate({ path: 'user', select: ["name", "surname", "email"] })
      .exec()
  if (!result) return res.status(404).send({message: "RESULT_NOT_FOUND"});
  else if (result?.blockedByCredits) return res.status(403).send({message: "BLOCKED_BY_CREDITS"});
  else if (!result.traits) {
    tasker.addTask({ task: "PROCESS_RESULTS", resultId: result._id }, 'results', (err) => {
      if (err) console.error(err);
    })
    return res.status(404).send({message: "RESULT_NOT_PROCESSED"});
  }

  // Count how many times report was downloaded
  //if (req.userId.toString() == req.params.userId){
  result.reportDownloaded += 1;
  result.save()
  //}

  let filename = getFilenameForPDFReport(result)


  
  let fullAccess = await ResultUtils.hasAccessToFullReport(req.params.userId, req.params.resultId)

  // Generate PDF
  const response = await generateResultPdf(result, req.query.type, lang, fullAccess, req.query.template);
    // directly send the file to client
    // Set the response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    // Send the PDF to the frontend
    return res.send(response.buffer);
  // return res.status(200).json(response);
}


/**
 * @openapi
 * /api/v1/users/cognitive-report/send/{userId}/{resultId}:
 *   post:
 *     description: |
 *        Send access to cognitive PDF report to the user via email
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user who will recive an email with access
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 642289e0a551e6039dbd46eb
 *         description: Id of result for which PDF will be generated
 *     responses:
 *       200:
 *        description: Email with access sent successfully
 *        schema:
 *          type: object
 *          example: {message: "EMAIL_SENT_SUCCESSFULLY"}
 * 
*/
exports.sendCognitiveReport = async (req, res) => {
  // Find user
  let user_invited = await db.user.findOne({_id: req.params.userId})
  if (!user_invited) return res.status(404).send({message: "USER_NOT_FOUND"});

  let user_inviting = await db.user.findOne({_id: req.userId})

  // Find result
  var result = await db.result.findOne({ _id:req.params.resultId, user: req.params.userId, traits: { $exists: true, $ne: [] } })
      .exec()
  if (!result) return res.status(404).send({message: "RESULT_NOT_FOUND"});

  var baseUrl =  `https://${req.hostname}`
  if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
  mailer.sendCognitiveReport(user_invited, user_inviting, result, baseUrl,  (error) => {
    if (error) res.status(500).send({message: "COULD_NOT_SEND_EMIAL"});
    else res.status(200).json({message: "EMAIL_SENT_SUCCESSFULLY"});;
  });

}
/**
 * @openapi
 * /api/v1/users/old-cognitive-report/data/{userId}/{resultId}:
 *   get:
 *     description: |
 *        Get data for cognitive PDF report from old BrainCore server
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user for which data will be loaded
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 642289e0a551e6039dbd46eb
 *         description: Id of result for which data will be loaded
 *       - name: role
 *         in: query
 *         type: string
 *         default: parent
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         description: | 
 *           Type of the user for which data will be displayed(reader).
 *           For French only `parent` is supported
 *           For Polish - `parent`, `teacher` and `student` are supported
 *       - name: lang
 *         in: query
 *         type: string
 *         default: fr
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: PDF report
 * 
*/
exports.getDataForEduCognitiveReport = async (req, res) => {
    // Get user information
  // Find user
  let user = await db.user.findOne({_id: req.params.userId})
  if (!user) return res.status(404).send({message: "USER_NOT_FOUND"});

  // If language was not provided use the language from settings
  let lang = req.query.lang
  if (!lang) lang = user.settings.language

  // Find result
  var result = await db.result.findOne({ _id:req.params.resultId, user: req.params.userId})
      .populate({ path: 'user', select: ["name", "surname", "email"] })
      .exec()
  if (!result) return res.status(404).send({message: "RESULT_NOT_FOUND"});

  let requestData = await cognitiveUtils.prepareDataRequestForOldReport(result, user, 'text', req.query.role, req.query.lang??'en')
  let data = await cognitiveUtils.getDataForEduCognitiveReport(result, req.query.role, req.query.lang??'en', requestData)
  
  // Send the PDF to the frontend
  return res.send(data);
}


/**
 * @openapi
 * /api/v1/users/old-cognitive-report/download/{userId}/{resultId}:
 *   get:
 *     description: |
 *        Download cognitive PDF report from old BrainCore server
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user for which PDF will be generated
 *       - name: resultId
 *         in: path
 *         required: true
 *         type: string
 *         example: 642289e0a551e6039dbd46eb
 *         description: Id of result for which PDF will be generated
 *       - name: template
 *         in: query
 *         type: string
 *         description: |
 *           Which template to use to generate PDF.
 *           short - short version(first page) of the report from 2019
 *           long - the full report from 2019
 *           lpdfv2 - full report from 2020
 *         enum:
 *         - short 
 *         - long
 *         - lpdfv2
 *         default: long 
 *       - name: role
 *         in: query
 *         type: string
 *         default: parent
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         description: | 
 *           Type of the user for which data will be displayed(reader).
 *           For French only `parent` is supported
 *           For Polish - `parent`, `teacher` and `student` are supported
 *       - name: lang
 *         in: query
 *         type: string
 *         default: fr
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: PDF report
 * 
*/
exports.downloadOldCognitiveReport = async (req, res) => {
  // Get user information
  // Find user
  let user = await db.user.findOne({_id: req.params.userId})
  if (!user) return res.status(404).send({message: "USER_NOT_FOUND"});

  // If language was not provided use the language from settings
  let lang = req.query.lang
  if (!lang) lang = user.settings.language

  // Find result
  var result = await db.result.findOne({ _id:req.params.resultId, user: req.params.userId})
      .populate({ path: 'user', select: ["name", "surname", "email"] })
      .exec()
  if (!result) return res.status(404).send({message: "RESULT_NOT_FOUND"});
  else if (result?.blockedByCredits) return res.status(403).send({message: "BLOCKED_BY_CREDITS"});
  else if (!result.traits) {
    tasker.addTask({ task: "PROCESS_RESULTS", resultId: result._id }, 'results', (err) => {
      if (err) console.error(err);
    })
    return res.status(404).send({message: "RESULT_NOT_PROCESSED"});
  }

  // Count how many times report was downloaded
  if (req.userId.toString() == req.params.userId){
    result.reportDownloaded += 1;
    result.save()
  }

  let requestData = await cognitiveUtils.prepareDataRequestForOldReport(result, user, req.query.template, req.query.role, req.query.lang??'en')
  let response = await cognitiveUtils.downloadOldReport(requestData)

  let filename = getFilenameForPDFReport(result)

  // directly send the file to client
  // Set the response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  
  // Send the PDF to the frontend
  return res.send(response.buffer);
}

/**
 * @openapi
 * /api/v1/users/platform-access/send/{userId}:
 *   post:
 *     description: |
 *        Send platform access to the user via email
 *     tags:
 *      - _my_results
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: "999979999999900000000001"
 *         description: Id of user who will recive an email with access
 *     responses:
 *       200:
 *        description: Email with access sent successfully
 *        schema:
 *          type: object
 *          example: {message: "EMAIL_SENT_SUCCESSFULLY"}
 * 
*/
exports.sendAccessToPlafrorm = async (req, res) => {
  // Find user
  let user_invited = await db.user.findOne({_id: req.params.userId})
  if (!user_invited) return res.status(404).send({message: "USER_NOT_FOUND"});

  let user_inviting = await db.user.findOne({_id: req.userId})

  var baseUrl =  `https://${req.hostname}`
  if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
  mailer.sendPlatformAccess(user_invited, user_inviting, baseUrl, async (error) => {
    if (error) res.status(500).send({message: "COULD_NOT_SEND_EMIAL"});
    else {
        // Activate this user
        user_invited.settings.isActive = true;
        await user_invited.save()
        res.status(200).json({message: "EMAIL_SENT_SUCCESSFULLY"});;
    }
  });

}






/**
 * @openapi
 * /api/v1/users/opportunities/identified/{userId}:
 *   get:
 *     description: |
 *        Load list of identified opportunities for the user
 *     tags:
 *      - _resources
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user for which opportunities should be loadded
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: List of opportunities
 *        schema:
 *          type: object
 *          example: [{"_id":"1_1_1_1", "imageUrl": '', type: "sociological",  "title":"It's hard to say that I have a specific life plan to devote myself to. I improvise my plans on a daily basis."},{"_id":"1_2_1_1", "imageUrl": '', type: "sociological",  "title":"When I lose sight of my goal, I also lose my momentum and stop pursuing my original plan."},{"_id":"1_3_1_1", "imageUrl": '', type: "sociological",  "title":"I don't always manage to reach my research goal, I have difficulties in achieving the set objectives."}]
 * 
*/
exports.getListOfAllIdentifiedOpportunities = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let opportunities = await user.getIdentifiedOpportunities(req.query.type, req.query.lang??'en')
  res.status(200).json(opportunities);
}


/**
 * @openapi
 * /api/v1/users/resources/favourites/{userId}:
 *   get:
 *     description: |
 *        Load list of favourites resources: opportunities/aras/tips 
 *        of the user(added to my resources)
 *     tags:
 *      - _resources
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user for which opportunities should be loadded
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: List of opportunities
 *        schema:
 *          type: object
 *          example: ["tips": [{"_id":"3_1","introduction":"To have more impact on your  life","text":"In the next decision-making situation, try to learn one of the methods: SWOT, TOC, Decision tree.","reasoning":"The belief that you have the influence on many things in your life gives you the ability to manage emotions, weaknesses, and difficult situations.","favourite":true}], "opportunities": [{"_id":"1_2_1_1", "imageUrl": '', type: "sociological",  "title":"Title of opportunity to display", "favourite": "true"}],"areas":[{"_id":"1", "imageUrl": '', type: "reading", "title":"Title for area to display", "favourite": "true"}]]
 * 
*/
exports.getFavouriteResources = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let resources = await user.getFavouriteResources(req.query.type, req.query.lang??'en')
  res.status(200).json(resources);
}



/**
 * @openapi
 * /api/v1/users/opportunities/card/{userId}/{opportunityId}:
 *   get:
 *     description: |
 *        Load details needed for opprotunity card
 *     tags:
 *      - _resources
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user to which card will be related
 *       - name: opportunityId
 *         in: path
 *         required: true
 *         type: string
 *         example: 3_1_1_1
 *         description: Id of the opportunity
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: List of details to display in a opportunity card.
 *        schema:
 *          type: object
 *          example: {"_id":"3_1_1_1","key":"3_1_1_1","text":"You tend to withdraw and avoid interacting with people you don't know.","area":{"key":"3","name":"Mock name for area of development","material":{"title":"Mock material","url":"/content/display/60ccccef2b4c80000732fdf5"},"course":null,"externalResource":{"type":"presentation","title":"How to Talk to Strangers","url":"How to Talk to Strangers"}},"solutions":[{"text":"By increasing the frequency of your contacts. You learn to control your stress and you strengthen your self-confidence."}],"activities":[{"title":"Mock activity","url":"/content/display/60ccccef2b4c80000732fdf5"}],"imageUrl":"/img/brand/Logo.png?This_is_mock_image","type":"sociological","activity":{"title":"Mock activity","url":"/content/display/60ccccef2b4c80000732fdf5"},"myConfirmationFeedback":0,"othersConfirmationFeedback":0,"favourite":false,"useful":0}
 *
*/
exports.getDetailsForOpportunityCard = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let opportunity = await user.getDetailsForOpportunityCard(req.params.opportunityId, req.query.type, req.query.lang??'en')
  res.status(200).json(opportunity);
}

/**
 * @openapi
 * /api/v1/users/areas/card/{userId}/{areaId}:
 *   get:
 *     description: |
 *        Load details needed for area-of-development card
 *        Areas of development for now are just NAD valies: 
 *        1. 'self-activation'
 *        2. 'self-confidence'
 *        3. 'communication-strategy'
 *        4. 'cooperation'
 *        5. 'regularity'
 *     tags:
 *      - _resources
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user to which card will be related
 *       - name: areaId
 *         in: path
 *         required: true
 *         type: integer
 *         example: 1
 *         enum:
 *         - 1
 *         - 2
 *         - 3
 *         - 4
 *         - 5
 *         description: Id of the area of development from 1 to 5
 *       - name: type
 *         in: query
 *         type: string
 *         default: student
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         description: Type of the user for which the data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: List of details to display in a area-of-development card.
 *        schema:
 *          type: object
 *          example: {"_id":"3","key":"3","name":"Mock name for area of development","description":"It could be that you are shy, which affects your ability to communicate, or you don't show a desire to communicate - you don't feel the need to do so. In some cases you prefer to stay with your own thoughts, questions.","benefits":"Exchanging thoughts with other people allows you to absorb new information more easily, gain a foothold in your circle of friends and class, and verify that the assumptions you have in your head are correct. When it comes to learning, the more different memory paths you have, the better you remember messages.","impact":"Unanswered questions do not get answered! Communication is the exchange of ideas between people. If you don't ask questions, don't give your opinions you may be a person misunderstood by others. At school, you may find that you misunderstand something (or someone) and cannot verify it. Moreover, you don't give yourself the chance to learn faster.","type":"reading","materials":[{"title":"Mock material","url":"/content/display/60ccccef2b4c80000732fdf5"}],"imageUrl":"/img/brand/Logo.png?This_is_mock_image","myConfirmationFeedback":0,"othersConfirmationFeedback":0,"favourite":false,"useful":0}
 * 
*/
exports.getDetailsForAreaOfDevelopmentCard = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let area = await user.getDetailsForAreaOfDevelopmentCard(req.params.areaId, req.query.type, req.query.lang??'en')
  res.status(200).json(area);
};


/**
  * @openapi
  * /api/v1/users/tip/feedback/{userId}:
  *   post:
  *     description: | 
  *        Send feedback about the tip. This feeedback might be one of the following.
  *        1. confirmed - Marking tip as identified(NOT USED FOR NOW)
  *        2. useful - Marking tip as useful
  *        3. favourite - Marking tip as favourite(add to my resources)
  *        Only one of them should be provided in the body. This feedabck is saved inside the latest result. 
  *     tags:
  *      - _feedback
  *     parameters:
  *       - name: userId
  *         in: path
  *         required: true
  *         type: string
  *         example: 635bc5be21ab2c00ecd14c74
  *         description: Id of user to which feedaback is refering to
  *       - name: feedback
  *         in: body
  *         schema:
  *           type: object
  *           properties:
  *             _id:
  *               description: Id of the top
  *               type: integer
  *               example: 1_1
  *             confirmed:
  *               description: Was this tip confirmed or not
  *               type: boolean
  *               example: true
  *             useful:
  *               description: Was this tip useful
  *               type: boolean
  *               example: true
  *             favourite:
  *               description: Was this tip  marked as favourite
  *               type: boolean
  *               example: true
  *     responses:
  *       200:
  *        description: Response
  *        schema:
  *          type: object
  *          example: {"message": "Feedback saved"}
  * 
  */
exports.feedbackForTip = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let response = await user.feedbackForTip(req.body, req.userId.toString())
  res.status(200).json(response);
}


/**
 * @openapi
 * /api/v1/users/opportunities/feedback/{userId}:
 *   post:
 *     description: | 
 *        Send feedback about the opportunity. This feeedback might be one of the following: 
 *        1. confirmed - Answering yes/no inside VirtualCoach.
 *        2. useful - Marking card with this opportunity as useful/helpful
 *        3. favourite - Marking card with this opportunity as favourite
 *        Only one of them should be provided in the body.  This feedabck is saved inside the latest result. 
 *     tags:
 *      - _feedback
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user to which feedaback is refering to
 *       - name: feedback
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               description: Id of the opportunity
 *               type: string
 *               example: '1_1_1_1'
 *             confirmed:
 *               description: Was this opportunity confirmed or not(in virtual coach)
 *               type: boolean
 *               example: true
 *             useful:
 *               description: Was card with opportunity useful
 *               type: boolean
 *               example: true
 *             favourite:
 *               description: Was card with opportunity marked as favourite
 *               type: boolean
 *               example: true
 *     responses:
 *       200:
 *        description: Response
 *        schema:
 *          type: object
 *          example: {"message": "Feedback saved"}
 * 
*/
exports.feedbackForOpportunity = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let response = await user.feedbackForOpportunity(req.body, req.userId.toString())


  res.status(response.status).send({message: response.message});
};


/**
 * @openapi
 * /api/v1/users/areas/feedback/{userId}:
 *   post:
 *     description: |
 *        Send feedback about the area of development. This feeedback might be one of the following: 
 *        1. confirmed - Marking card with this area as identified
 *        2. useful - Marking card with this area as useful
 *        3. favourite - Marking card with this area as favourite(add to my resources)
 *        Only one of them should be provided in the body. This feedabck is saved inside traits of latest result. 
 *        
 *        Areas of development for now are just NAD valies: 
 *        1. 'self-activation'
 *        2. 'self-confidence'
 *        3. 'communication-strategy'
 *        4. 'cooperation'
 *        5. 'regularity'
 *     tags:
 *      - _feedback
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 635bc5be21ab2c00ecd14c74
 *         description: Id of user to which feedaback is refering to
 *       - name: feedback
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               description: Id of the area of development
 *               type: integer
 *               enum:
 *               - 1
 *               - 2
 *               - 3
 *               - 4
 *               - 5
 *               example: 1
 *             confirmed:
 *               description: Was this area-of-development confirmed or not
 *               type: boolean
 *               example: true
 *             useful:
 *               description: Was this card with area-of-development useful
 *               type: boolean
 *               example: true
 *             favourite:
 *               description: Was card with area of development marked as favourite
 *               type: boolean
 *               example: true
 *     responses:
 *       200:
 *        description: Response
 *        schema:
 *          type: object
 *          example: {"message": "Feedback saved"}
 * 
*/
exports.feedbackForAreaOfDevelopment = async (req, res) => {
  let user = await User.findOne({_id: req.params.userId})
  let response = await user.feedbackForArea(req.body, req.userId.toString())
  res.status(response.status).send({message: response.message});
}



/**
 * @openapi
 * /api/v1/users/traits:
 *   post:
 *     description: |
 *        Returns `traits` object with the values with descriptions for for requested traitsKeys and users.
 *        The `traits` object it created based on the latest results for selected users. It works works for single and multiple users.
 *        Additionaly `users` array is returned with basic users details and individual traits values.
 *        If some users on the list dont have results, he will exists in the users array, but his traits will be just empty objects {}.
 *
 *        Use traitsKeys, to controll what data is returned:
 *        ###### TAB 1&2 - INDICATORS + STATICTICS 
 *        - To get indicators: `["motivation", "personal-engagement"]`
 *        - To get NAD+QNAD: `["current-performance-indicator","self-activation", "self-confidence","communication-strategy","cooperation","regularity"]`
 *        - To get strong and weak points: `["strong-and-weak-points-for-current-performance-indicator","strong-and-weak-points-for-self-activation", "strong-and-weak-points-for-self-confidence","strong-and-weak-points-for-communication-strategy","strong-and-weak-points-for-cooperation","strong-and-weak-points-for-regularity"]`
 *        ###### TAB 3  - 4C VALUES  
 *        - To get 4C: `["communication", "collaboration", "creativity", "critical-thinking"]`
 *        ###### TAB 4  - SOCIAL SKILLS 
 *        Interpersonal = emotional-intelligence-in-relation-with-others
 *        Intrapersonal = emotional-intelligence-in-relation-with-oneself
 *        - To get soft skills: `["respect", "empathy", "emotional-intelligence-in-relation-with-others", "emotional-intelligence-in-relation-with-oneself"]`
 *        ###### TAB 5  - MANAGEMENT SKILLS 
 *        - To get management skills: `["leadership", "risk-taking", "stress-management", "emotional-intelligence-global"]`
 * 
 *        ###### OTHER EXAMPLES
 *        - To get interpersonal traits: `["extraversion","need-for-independence"]`
 *        - To get emotional intelligence traits: `["respect", "mediation-and-influence", "empathy", "self-control", "self-esteem", "stress-management", "sense-of-mastery", "risk-taking", "emotional-distance"]`
 *        - To get time and cost traits `["time-and-cost"]`
 *        - TODO - To get specific dimenssions: `["leadership", "risk-taking", "empathy", "respect", "stress-management"]`
 *     tags:
 *      - _team_module
 *     parameters:
 *       - name: usersIds
 *         in: body
 *         required: true
 *         description: Tratis keys and ids of the users for which data should be loadded
 *         schema:
 *           type: object
 *           properties:
 *             usersIds:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["635bc5be21ab2c00ecd14c74", "635bc5e021ab2c00ecd14ccc"]
 *             traitsKeys:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["current-performance-indicator","self-activation", "self-confidence","communication-strategy","cooperation","regularity"]
 *       - name: type
 *         in: query
 *         type: string
 *         default: team-leader
 *         enum:
 *         - student
 *         - teacher
 *         - parent
 *         - employee
 *         - leader
 *         - team-leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *       - name: lang
 *         in: query
 *         type: string
 *         default: en
 *         description: Language in (ISO 639-1 Code 2-letters). When language is not provided, English will be used
 *     responses:
 *       200:
 *        description: All requested traits values and descriptions for requested users. Also returns list of users with individual values
 *        schema:
 *          type: object
 *          example: {"traits":{"trait-name-example":{"key":"trait-name-example", "median": 5, "level":4,"normalizedValueAverage":4.39,"min":1.39,"max":5.39,"shortName":"","mainDefinition":"A value representing ....","descriptions":["Many people in the team s....."],"actions":["Taking care of the appropriate use of the team's high potential","Empowerment of the team - inclusion in decision-making processes"], "neurobiologicalEffects": [ "Mock effect 1", "Mock effect 2" ], "lowestDefinition": "", "lowestActions": [], "highestDefinition": "", "highestActions": []}}, "users":[{"_id":"635bc5be21ab2c00ecd14c74","name":"Student 1","surname":"of class 1","email":"student1","traits":{"current-performance-indicator":{"shortName":"QNAD","abbreviation":"QNAD","level":4,"normalizedValue":67,"min":67,"max":67},"self-activation":{"shortName":"Self activation","abbreviation":"N1","level":5,"normalizedValue":9.2,"min":7.7,"max":10.7},"self-confidence":{"shortName":"Self confidence","abbreviation":"N2","level":5,"normalizedValue":9.3,"min":7.8,"max":10.8},"communication-strategy":{"shortName":"Communication strategy","abbreviation":"A1","level":2,"normalizedValue":3.7,"min":2.2,"max":5.2},"cooperation":{"shortName":"Cooperation","abbreviation":"A2","level":2,"normalizedValue":4.1,"min":2.6,"max":5.6},"regularity":{"shortName":"Regularity","abbreviation":"D","level":5,"normalizedValue":8.2,"min":6.7,"max":9.7}}},{"_id":"635bc5e021ab2c00ecd14ccc","name":"Student 2","surname":"of class 1","email":"student2","traits":{"current-performance-indicator":{},"self-activation":{},"self-confidence":{},"communication-strategy":{},"cooperation":{},"regularity":{}}}]}
 * 
 * 
 */
exports.getTraits = async (req, res) => { 

  let results = await cognitiveUtils.getLatestBrainCoreResultsForUsers(req.body.usersIds)
  if (!results || !results.length) {
    return res.status(404).json({message: "No Results"});
  }
  let traits = await cognitiveUtils.getTraits(
    results,
    req.body.traitsKeys,
    req.query.type, 
    req.query.lang??'en'
  )

  let dbUsers = await User.find({_id:req.body.usersIds}, {name: 1, surname: 1, email: 1})
  let users = await cognitiveUtils.getUsersWithTraits(
    dbUsers,
    results,
    req.body.traitsKeys,
    req.query.type, 
    req.query.lang??'en'
  )
  
  return res.status(200).json({traits: traits, users: users});
};


exports.getReport = async (req, res) => {
  let user = await User.findOne({_id:req.params.userId})
    .populate([
      {path: "reports.creator", select: ["name", "surname"]},
      {path: "reports.softSkillsTemplate", populate: {path: "softSkills"}},
      {path: "reports.softSkills._id"},
    ])
  res.status(200).json(user.reports?.id(req.params.reportId));
};

exports.getReports = async (req, res) => {
  let user = await User.findOne({_id:req.params.userId})
    .populate([
      {path: "reports.creator", select: ["name", "surname"]},
      {path: "reports.softSkillsTemplate", select: ["name"]},
      {path: "reports.softSkills._id"},
    ])
  res.status(200).json(user.reports);
};

exports.addReport = async (req, res) => {
  req.body.creator = req.userId;
  let user = await User.updateOne(
    { _id: req.params.userId },
    { $push: {reports: req.body} },
    { runValidators: true })
  if (!user) res.status(404).send({ message: "User was not found" });
  else res.status(200).json("Report added");
};

exports.updateReport = async (req, res) => {
  // TODO: protection; check with creator while updating
  let user = await User.findOne({_id:req.params.userId})
  if (!user) res.status(404).send({ message: "User was not found" });
  else {
    let index = user.reports.indexOf(user.reports.id(req.body._id))
    user.reports[index] = req.body;
    user.save()
      res.status(200).json("Report updated");
  }
};

exports.removeReport = async (req, res) => {
  let user = await User.findOne({_id:req.params.userId})
  
  user.reports?.id(req.params.reportId).remove();
  user.save();
  res.status(200).json("Report removed");
};

exports.getGroupIds = async (req, res) => {
  // Get list group ids
  let groups = await Group.find({trainees: { $elemMatch: {$eq: req.params.userId} }})
  res.status(200).json(groups);
};

// get available roles from user_settings
exports.getMyRoles = async (req, res) => {
  let user = await User.findOne({_id: req.userId});
  let settings = JSON.parse(JSON.stringify(user.settings));
  res.status(200).json(settings.availableRoles);
}

exports.setRole = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  let settings = JSON.parse(JSON.stringify(user.settings));

  // If requested role `Trainee` but it is not yet in available roles
  // Then add this role  
  if (req.body.role=="Trainee" && !user.settings.availableRoles.includes("Trainee")){
    console.log('Adding TRAINEE ROLE!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    settings.availableRoles.push('Trainee')
  }

  if (settings.availableRoles?.some(x=>x==req.body.role) && settings.availableRoles?.some(x=>x==req.body.fav||settings.defaultRole)) { // validation
    settings.role = req.body.role;
    settings.defaultRole = req.body.fav||settings.defaultRole; // main role
    user.settings = settings;
    user.save()
    return res.status(200).json({ message: "Updated successfully" });
  }
  // check if a string is valid MongoDB ObjectId for roleMaster
  if (isValidObjectId(req.body.role)) {
    const roleMaster = await db.roleMaster.findOne({_id: req.body.role, status: {$ne: "deleted"}, $or: [{module: req.moduleId}, {module: "ALL"}]});
    if (roleMaster) {
      if (!user.settings.availableRoleMasters.find(id => String(id) == req.body.role)) {
        settings.availableRoleMasters.push(req.body.role);
      }
      settings.roleMaster = req.body.role;
      settings.defaultRoleMaster = req.body.fav || settings.defaultRoleMaster || req.body.role;
      user.settings = settings;
      user.save();
      return res.status(200).json({ message: "Updated successfully" });
    }
  }
  return res.status(500).send({ message: "Role not available" });
}

// approveVerification
exports.approveVerification = async (req, res) => {
  let user = await User.findOneAndUpdate({"certificates._id": req.body.certId}, {$set: {"certificates.$.moduleManagerAproval": req.body.check, "certificates.$.moduleManagerAprovalDate": Date.now()}}, {new: true})
  if (!user) res.status(404).send({ message: "User was not found" });
  else res.status(200).json(user);
};

// approveAll
exports.approveAll = async (req, res) => {
  User.find({_id: { $in: req.body.userIds }},
    async (err, users) => {
    if (err) res.status(500).send({ message: err });
    else {
      let count = 0
      let updatedUsers = users.map(user => {
        user.certificates = user.certificates.map(cert => {
          if(cert.status && !cert.moduleManagerAproval) {
            count++
            cert.moduleManagerAproval = true
            cert.moduleManagerAprovalDate = Date.now()
          }
          return cert
        })
        return user
      })
      
      await User.bulkWrite(
        updatedUsers.map(u => 
          ({updateOne: {
            filter: { _id : u._id },
            update: { $set: {certificates: u.certificates} },
            upsert: false
          }})
        )
      )

      res.status(200).json({message: `All verification requests have been approved! (affected: ${count})`, count: count});
    }
  })
};

// getUsersCertifications
exports.getUsersCertifications = async (req, res) => {
  let users = await User.find(
    {"scopes.name": { $regex: `^modules:.*?${req.moduleId}$`, $options: "i" }}, 
    "name surname certificates")
  res.status(200).json(users);
};

exports.hideFromMe = async (req, res) => {
  // // currently not in use
  // let itemLocation = "settings.hide";
  // switch (req.body.itemName) {
  //   case "course":
  //   case "Course":
  //     itemLocation = itemLocation + ".courses";
  //     break;
  //   // case "___":
  //   //   break;
  //   // case "____":
  //   //   break;
  //   default:
  //     itemLocation = itemLocation + ".others"; // bypass 
  // }

  let user = await User.findOneAndUpdate({_id: req.userId}, 
    {$addToSet: {"settings.hide.courses": req.body.itemId}}, 
    {runValidators: true, new: true})
    res.status(200).json(user.settings.hide);
}

exports.countUsersInModule = async (req, res) => {
  let count = await User.countDocuments({ "scopes.name": 'modules:read:'+req.moduleId})
  count =+ 1; // + 1, as there is one module manager with different scopes
  res.status(200).json(count.toString());
};

exports.countUsersInModule = async (req, res) => {
  let count = await User.countDocuments({ "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};

exports.countPartners = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Partner', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countArchitects = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Architect', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countTrainingManagers = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'TrainingManager', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countLibrarians = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Librarian', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countTrainers = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Trainer', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countParents = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Parent', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countInspectors = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Inspector', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countTrainees = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Trainee', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};
exports.countCoordinators = async (req, res) => {
  let count = await User.countDocuments({"settings.availableRoles": 'Coordinator', "scopes.name": 'modules:read:'+req.moduleId})
  res.status(200).json(count.toString());
};

// record user feedback 
exports.feedback = async (req, res) => {
  let feedback = null;
  if (req.body.type=='tip') {
    feedback = {'settings.feedback.tips': {
      tip: req.body.id,
      reaction: req.body.reaction,
      date: new Date(),
    }}
  }
  if (feedback) {
    User.updateOne(
      {_id: req.userId}, 
      {$push: feedback},
    )
    res.status(200).json({ message: "Feedback recorded" });
  } else res.status(204).send({ message: "Feedback not recorded" });
}


//=> User's devices
exports.getDevices = async (req,res) =>{
    const user = await User.findOne({_id: req.userId})?.
    select('settings.connectedDevices')?.
    populate({path: 'settings.connectedDevices'})
  res.status(200).json({ data: user.settings.connectedDevices || []});
}

exports.updateDevice = async (req,res) =>{
  await ConnectedDevice.findByIdAndUpdate(req.params.deviceId,{
    isNotificationOn: req.body.isNotificationOn,
  })
  res.status(200).json({ data: "ok"});
}

exports.removeDevice = async (req,res) =>{
  await ConnectedDevice.findByIdAndRemove(req.params.deviceId);
  await User.findOneAndUpdate({_id:req.userId},{$pull:{'settings.connectedDevices': req.params.deviceId}});
  res.status(200).json({ data: "ok"});
}

/**
 * @openapi
 * /api/v1/users/switch-center:
 *   post:
 *     description: Switch CC to TC and vice versa
 *     tags:
 *       - _Cognitive User Module 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - moduleId
 *            properties:
 *              moduleId:
 *                type: string
 *                description: ModuleId to switch
 *                example: "200004000080000000000000"
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            access_token:
 *              type: string
 *              description: Access token(JWT) used for authorization
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Unauthorization)
 */
// switch Centers
exports.switchCenter = async (req, res) => {
  if (!req.moduleId) {
    return res.status(400).json({message: "Unauthorization"});
  }
  if (!req.body.moduleId || req.moduleId.toString() == req.body.moduleId.toString()) {
    return res.status(400).json({message: "ModuleId is required/same"});
  }
  const moduleId = req.moduleId;
  const user = await User.findOne({_id: req.userId}).populate([{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}]);
  if (!user) {
    return res.status(404).json({message: "USER_NOT_FOUND"});
  }
  // get current user module scopes
  const allModulesObj = await user.detectModule();
  // get current module details
  const currentModuleObj = allModulesObj.find(obj => obj._id.toString() == moduleId.toString());
  if (!currentModuleObj) {
    return res.status(400).json({message: "Unauthorization"});
  }
  // get switching module details
  const switchingModule = allModulesObj.find(obj => obj._id.toString() == req.body.moduleId.toString());
  if (!switchingModule) {
    return res.status(400).json({message: "Unauthorized switching module"});
  }
  // If current user is in CC and has TC scope then switch from CC to TC
  if (currentModuleObj.moduleType === "COGNITIVE" && switchingModule.moduleType === "TRAINING") {

    let switchRole = 'Trainee';
    if (currentModuleObj.associatedModule && currentModuleObj.associatedModule.toString() === switchingModule._id.toString()) {
      /* switch from CC to associated TC
        -> set role as ModuleManager if availableRoles has ModuleManager
        -> set role as Trainer if availableRoles has Trainer or roleMaster is Trainer
        -> set role as TrainingManager if availableRoles has TrainingManager or roleMaster is TrainingManager
        -> set role as Trainee if availableRole has Trainee or roleMaster is not Trainer and TrainingManager
        -> add role to availableRoles if not exists
        -> set defaultRole as role
      */
      if (user.settings.availableRoles.includes('ModuleManager')) {
        switchRole = 'ModuleManager';
      } else if (user.settings.availableRoles.includes('TrainingManager' || user.settings.roleMaster && user.settings.roleMaster.name === 'TrainingManager')) {
        switchRole = 'TrainingManager';
      } else if (user.settings.availableRoles.includes('Trainer') || user.settings.roleMaster && user.settings.roleMaster.name === 'Trainer') {
        switchRole = 'Trainer';
      }
    } else {
      /* switch from CC to Universal TC or other TC
        -> set role as Trainee
        -> add Trainee to availableRoles if not exists
        -> set defaultRole as Trainee
      */
     switchRole = 'Trainee';
    }
    const tcModuleId = req.body.moduleId;
    user.settings.role = switchRole;
    user.settings.defaultRole = switchRole;
    if (!user.settings.availableRoles.includes(switchRole)) {
      user.settings.availableRoles.push(switchRole)
    }
    await user.save();
    const userData = await authUtils.getUserDataForFrontend(user,tcModuleId,user.settings.defaultRole,null,user.settings.defaultRoleMaster);
    return res.status(200).json(userData);
  }
  // If current user is in TC and has CC scope then switch from TC to CC
  if (currentModuleObj.moduleType === "TRAINING" && switchingModule.moduleType === "COGNITIVE") {

    if (currentModuleObj.associatedModule && currentModuleObj.associatedModule.toString() === switchingModule._id.toString()) {
      /* Switch from TC to associated CC
        -> set role as Other
        -> set defaultRole as Other
        -> set roleMaster as Default Role Id if roleMaster not exists
        -> add Default Role Id to availableRoleMasters if not exists
        -> set defaultRoleMaster as roleMaster
      */
    } else {
      /* switch from TC to CC
        -> set role as Other
        -> set defaultRole as Other
        -> set roleMaster as Default Role Id
        -> add Default Role Id to availableRoleMasters if not exists
        -> set defaultRoleMaster as Default Role Id
      */
    }
    // get CC id: from request body
    const previousRole = user.settings.role;
    const ccModuleId = req.body.moduleId;
    const defaultRoleId = '63c8f1cb88bbc68cce0eb2ea';
    user.settings.role = 'Other';
    user.settings.defaultRole = 'Other';
    if (!user.settings.roleMaster) {
      user.settings.roleMaster = defaultRoleId;
      user.settings.defaultRoleMaster = defaultRoleId;
      if (!user.settings.availableRoleMasters.find(role => role.toString() == defaultRoleId)) {
        user.settings.availableRoleMasters.push(defaultRoleId);
      }
    }
    await user.save();
    const userData = await authUtils.getUserDataForFrontend(user,ccModuleId,user.settings.defaultRole,null,user.settings.defaultRoleMaster);
    return res.status(200).json(userData);
  }
  return res.status(400).json({message: "Unauthorized to switch"});
}