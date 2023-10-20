const db = require("../models");
const Team = db.team;
const User = db.user;
const notifications = require('../utils/notifications');
const moduleUtils = require("../utils/module");
const cognitiveUtils = require("../utils/cognitive");
const teamUtils = require("../utils/team");

/**
 * @openapi
 * /api/v1/bctest/users/{moduleId}:
 *   get:
 *     description: Get Module Users list
 *     tags:
 *       - _Brain Core Test Registration
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         required: true
 *         type: string
 *         example: "333000000000000000000000"
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Users fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  username:
 *                    type: string
 *                    example: "user A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */
module.exports.getModuleUsers = async (req, res) => {
    let moduleId = req.params.moduleId;
    let moduleUsers = await moduleUtils.getAllUsersInModule(req.userId, moduleId)
    return res.status(200).json({
        message: "Users fetched successfully",
        data: moduleUsers
    });
};

/**
 * @openapi
 * /api/v1/bctest/teams:
 *   get:
 *     description: Get Teams list
 *     tags:
 *       - _Brain Core Test Registration
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Teams fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: "team A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */

module.exports.getTeams = async (req, res) => {
    var teams = await moduleUtils.getAllTeamsInModule(req.userId, req.moduleId)
    var teamsWithStatuses = [];
    for (const team of teams) {
        let teamWithStatus = team
        let status = await teamUtils.getBrainCoreStatusForTeam(team._id);
        teamWithStatus.brainCoreTest = status;
        teamsWithStatuses.push(teamWithStatus);
    }
    return res.status(200).json({
        message: "Teams fetched successfully",
        data: teamsWithStatuses
    });
};

/**
 * @openapi
 * /api/v1/bctest/teams-with-progress/{userId}/{sessionId}:
 *   get:
 *     description: Get Teams list with progress
 *     tags:
 *       - certification_session
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         example: 64b1081b32865c07f90fbbab
 *       - name: sessionId
 *         in: path
 *         required: true
 *         type: string
 *         example: 64b11050f472b7083848a314
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Teams fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: "team A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */

module.exports.getTeamsWithProgress = async (req, res) => {
    let userId = req.params.userId;
    const sessionId = req.params.sessionId;
  
    const [user, session] = await Promise.all([
        User.findById(userId, "username name surname email createdAt details settings teams brainCoreTest sessionContentProgress")
        .populate([{path:"settings.roleMaster",select: ["_id", "name"]},
                {path:"settings.availableRoleMasters",select: ["_id", "name"]},
                {path:"settings.defaultRoleMaster",select: ["_id", "name"]}, 
                {path: "teams", select: ["name"]}
            ]).lean(),
        db.certificationSession.findById(sessionId).populate([{path: "coursePath", populate: {path: "courses", populate: [
            { path: "chosenChapters.chapter", select: "name description level type origin" },
            { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime origin hideFromTrainees" }
        ]}}]).lean()

    ]);
  
    // let contentIds = course.chosenChapters.flatMap(chapter => chapter.chosenContents.map(content => content.content));
    let contentIds = session.coursePath.courses.flatMap(course => course.chosenChapters.flatMap(chapter => chapter.chosenContents.map(content => content.content)));
    let events = await db.event.find({ $and: [
        { addedFromGradebook: { $exists: false } },
        // { assignedGroup: groupId },
        { assignedSession: sessionId },
        // { assignedCourse: courseId },
        { assignedContent: { $in: contentIds } }
      ]})
  
      session.coursePath.courses.forEach(course => {
        course.chosenChapters.forEach(chapter => {
            chapter.chosenContents.forEach(content => {
                let event = events.find(e => e.assignedContent.toString() === content.content._id.toString());
                let progress = user.sessionContentProgress.find(p => p.contentId.toString() === content.content._id.toString());
                content.content.eventType = event?.eventType;
                content.content.eventId = event?._id;
                content.content.date = event?.date;
                content.content.status = progress?.status;
                content.content;
            });
        });
    });
    return res.status(200).json({
        message: "Teams fetched successfully",
        progress: session.coursePath.courses,
        user: user
    });
};

const traitsKeys =  ['current-performance-indicator', 'self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity', 'strong-and-weak-points-for-self-activation', 'strong-and-weak-points-for-self-confidence', 'strong-and-weak-points-for-communication-strategy', 'strong-and-weak-points-for-cooperation', 'strong-and-weak-points-for-regularity', 'communication', 'collaboration', 'creativity', 'critical-thinking', 'motivation', 'personal-engagement', 'strong-and-weak-points-for-motivation', 'strong-and-weak-points-for-personal-engagement', 'respect', 'empathy', 'emotional-intelligence-in-relation-with-others', 'emotional-intelligence-in-relation-with-oneself', 'leadership', 'risk-taking', 'stress-management', 'emotional-intelligence-global', 'extraversion', 'need-for-independence', 'mediation-and-influence', 'empathy', 'self-control', 'self-esteem', 'stress-management', 'sense-of-mastery', 'risk-taking', 'time-and-cost' ];  // Static, outside of the function

/**
 * @openapi
 * /api/v1/bctest/teams-traits:
 *   get:
 *     description: Get Teams list with traits
 *     tags:
 *       - _Brain Core Test Registration
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Teams fetched successfully
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    example: "team A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 */


module.exports.getTeamsWithTraits = async (req, res) => {
    let teams = [];
    if (req.roleMaster._id.toString() == "63c8f1cb88bbc68cce0eb2ea") {
        teams = await Team.find({status: {$ne: "deleted"}, module: req.moduleId})
        .populate([{ path: "trainee", select: "name surname brainCoreTest" }]);
    } else {
        const user = await User.findOne({_id: req.userId}, {enabledTeams: 1});
        teams = await Team.find({_id: {$in: user && user.enabledTeams || []}, status: {$ne: "deleted"}, module: req.moduleId})
        .populate([{ path: "trainee", select: "name surname brainCoreTest" }]);
    }

    var teamsWithStatuses = [];
    for (const team of teams) {
        let teamWithStatus = team.toObject();
        let status = await teamUtils.getBrainCoreStatusForTeam(team._id);
        teamWithStatus.brainCoreTest = status;
        teamsWithStatuses.push(teamWithStatus);
    }
    const usersIds = teams.flatMap(team => 
        team.trainee.map(user => {
            return user._id;
        })
    );



    

    let results = await cognitiveUtils.getLatestBrainCoreResultsForUsers(usersIds);
    if (!results || !results.length) {
        return res.status(404).json({ message: "No Results" });
    }

    let dbUsers = await User.find({ _id: { $in: usersIds } }, { name: 1, surname: 1, email: 1 }); 

    let usersWithTraits = await cognitiveUtils.getUsersWithTraits(
        dbUsers,
        results,
        traitsKeys,
        req.query.type,
        req.language ?? 'fr'
    );

    let usersWithTraitsMap = new Map(usersWithTraits.map(user => [user._id.toString(), user.traits]));

    return res.status(200).json({
        message: "Teams fetched successfully",
        data: teamsWithStatuses.map(team => ({
            ...team,
            trainee: team.trainee.map(user => ({
                ...user,
                traits: usersWithTraitsMap.get(user._id.toString()) || [],
            }))
        }))
    });
};



/**
 * @openapi
 * /api/v1/bctest/bctestregister:
 *   post:
 *     description: BC Test Register User/Team - Multiple users or teams can register
 *     tags:
 *       - _Brain Core Test Registration 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              userId:
 *                type: array
 *                items:
 *                  type: string
 *                description: An Array of User Ids or single User Id
 *                example: ["63c8f4f888bbc68cce0eb6dd"]
 *              testType:
 *                type: string
 *                default: adult
 *                enum:
 *                - adult
 *                - pedagogy
 *                description: |
 *                  Type of the test for which user will be invited
 *                  - adult - BrainCore Pro Test
 *                  - pedagogy - BrainCore Edu Test
 *                example: "adult"
 *              registerDate:
 *                type: string
 *                description: Register Date in UTC
 *                example: "Tue, 24 Jan 2023 03:04:05 GMT"
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Request sent to 10 users successfully and 0 users has ongoing test, should complete 
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: userId is/are required! | registerDate is required
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User/s not found or deleted!
 */
module.exports.bcTestRegister = async (req, res) => {
    const body = req.body;
    if (!body.userId) {
        return res.status(400).json({
            message: "userId is/are required!"
        });
    }
    if (Array.isArray(body.userId) && !body.userId.length) {
        return res.status(400).json({
            message: "Please select the users to register"
        })
    }
    if (!body.registerDate) {
        return res.status(400).json({
            message: "registerDate is required!"
        });
    }
    if (!isValidDate(new Date(body.registerDate))) {
        return res.status(400).json({
            mesage: "registerDate is invalid or should be future date!"
        });
    }
    let userIds = [];
    if (Array.isArray(body.userId)) {
        userIds = body.userId;
    } else {
        userIds.push(body.userId);
    }
    const users = await User.find({_id: {$in: userIds}, status: {$ne: "deleted"}}, {brainCoreTest: 1, email: 1, settings: 1, teams: 1});
    console.log(`Got Users = ${users.length}`);
    if (!users || !users.length) {
        return res.status(404).json({
            message: "User/s not found or deleted!"
        });
    }
    let validUserIds = []; // store users can register
    let validUserTeamIds = []; // store users team those can register
    for (const user of users) {
        // if user already has sent request then do not allow
        // if (user.brainCoreTest && ((user.brainCoreTest.registerDate && Date.now() < new Date(user.brainCoreTest.registerDate).getTime()) && (user.brainCoreTest.status == "Request sent"))) {
        //     continue;
        // }
        validUserIds.push(user._id);
        // If user is part of team then update team test status
        if (user.team) {
            validUserTeamIds.push(user.team);
        }
    }
    if (!validUserIds.length) {
        return res.status(400).json({
            message: "User/s has ongoing test or not found!"
        })
    }
    const updateData = {
        brainCoreTest: {
            registerDate: body.registerDate,
            completionDate: null,
            status: "Request sent",
            reminderEmailSent: false,
            requestDate: new Date()
        }
    };
    const updateUsers = await User.updateMany({_id: {$in: validUserIds}}, {$set: updateData});
    // update latest register date for team if brainCoreTest object already exists
    let updateTeams = await Team.updateMany({_id: {$in: validUserTeamIds}, brainCoreTest: {$exists: true}}, {$set: {
        'brainCoreTest.registerDate': body.registerDate,
        'brainCoreTest.status': "Request sent"
    }});
    // set brainCoreTest object for team if brainCoreTest object not exists
    updateTeams = await Team.updateMany({_id: {$in: validUserTeamIds}, brainCoreTest: {$exists: false}}, {$set: updateData});
    // send notification to users
    let triggeredBy = await User.findById(req.userId)
    var baseUrl =  `https://${req.hostname}`
    if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
    sendRegisterNotification(validUserIds, req.moduleId, triggeredBy, baseUrl, body.testType);
    return res.status(200).json({
        message: `Request sent to ${validUserIds.length} users successfully and ${userIds.length - validUserIds.length} users has ongoing test, it should complete`
    });
};


// triggeredBy - user who is inviting
// baseUrl - base url which will be used to create link
// testType - Type of the test for which user will be invited: ['pedagogy', 'adult']
const sendRegisterNotification = async (userIds, moduleId, triggeredBy, baseUrl, testType) => {
    const users = await User.find({_id: {$in: userIds}, status: {$ne: "deleted"}}, {brainCoreTest: 1, email: 1, settings: 1, teams: 1}).populate([{path: "settings.connectedDevices", select: "isNotificationOn deviceToken"}]);
    /*
        send Email, Mobile Device and Web (Push) notifications
    */
    const notificationTo = {
        email: true,
        push: true
    }
    notifications.sendNotifications(users, moduleId, triggeredBy, 'BrainCoreRegisterConfirm', notificationTo, baseUrl, testType);
}

function isValidDate(d) {
    if (!d instanceof Date) {
        return false;
    }
    if (isNaN(d)) {
        return false;
    }
    // old date
    if (d.getTime() < Date.now()) {
        return false;
    }
    return true;
}