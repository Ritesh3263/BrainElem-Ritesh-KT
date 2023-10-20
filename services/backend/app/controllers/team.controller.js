const db = require("../models");
const Team = db.team;
const User = db.user;
const Result = db.result;
const ObjectId = require("mongodb").ObjectId;

//Utils
const authUtils = require("../utils/auth");
const teamUtils = require("../utils/team");
const moduleUtils = require("../utils/module");
const { braincoreTestsIds, pedagogyTestsIds } = require("../utils/braincoreTestsIds");

const tasker = require('../utils/tasker/tasker')

// DB Calls
module.exports.findTeam = async (query) => {
    const team = await Team.findOne(query).populate([{path:"trainee", populate: {path: "settings.roleMaster", select: "name"}, select:"name surname username brainCoreTest email"}]);
    return team;
};

module.exports.updateTeam = async (query, update) => {
    const team = await Team.findOneAndUpdate(query, update, {
        new: true
    }).populate([{path:"trainee",select:"name surname username"}]);
    return team;
};

// logic
/**
 * @openapi
 * /api/v1/teams/:
 *   get:
 *     description: Get List of Teams
 *     tags:
 *       - _Team 
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
module.exports.getAllTeams = async (req, res) => {
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
 * /api/v1/teams/{id}:
 *   get:
 *     description: Get Team By Id
 *     tags:
 *       - _Team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Team fetched successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "team A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Team not found
 */
module.exports.findTeamById = async (req, res) => {
    const team = await this.findTeam({ _id: req.params.id, status: {$ne: "deleted"} });
    if (!team) return res.status(404).json({message: "Team not found"});

    let teamWithStatus = team.toObject();
    let status = await teamUtils.getBrainCoreStatusForTeam(team._id);
    teamWithStatus.brainCoreTest = status;


    teamToReturn = await moduleUtils.checkBlockedByCreditsForUsers(teamWithStatus)

    return res.status(200).json({
        message: "Team fetched successfully",
        data: teamToReturn
    });
};

/**
 * @openapi
 * /api/v1/teams/:
 *   post:
 *     description: Create Team
 *     tags:
 *       - _Team 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - name
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the Team
 *                example: "team A"
 *              trainee:
 *                type: array
 *                description: Array of user id
 *                example: ["63c8f4f888bbc68cce0eb6dd"]
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Team Created successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "team A"
 *                trainee:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      username:
 *                       type: string
 *                       example: "user A"
 *                  
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: name is required | Team with given name exists
 */
module.exports.createTeam = async (req, res) => {
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({message: "name is required"});
    }
    // don't allow on adding teams without users inside
    // if (!body.trainee || !Array.isArray(body.trainee) || !body.trainee.length) {
    //     return res.status(400).json({message: "trainees required"});
    // }
    if (!req.moduleId) {
        return res.status(400).json({message: 'Un Authorization - moduleId'});
    }
    let team = await this.findTeam({ name: body.name, module: req.moduleId });
    if (team) return res.status(400).json({message: "Team with given name exists"});

    const object = {
      name: body.name,
      module: req.moduleId,
      trainee: body.trainee,
    };
    team = await Team.create(object);
    if (team.trainee && team.trainee.length) {
        // add team id to users
        // const operation = await User.updateMany({_id: {$in: team.trainee}}, {$set: {team: team._id}});
        const operation = await User.updateMany({_id: {$in: team.trainee}}, {$addToSet: {teams: team._id}});
    }
    team = await Team.findById(team._id).populate([{path: "trainee", select: "name surname username"}]);
    // if requested user role is not Administrator then add team Id into enabled Teams
    if (req.roleMaster._id.toString() != "63c8f1cb88bbc68cce0eb2ea") {
        await User.findOneAndUpdate({_id: req.userId}, {$push: {enabledTeams: team._id}});
    }
    return res.status(200).json({
        message: "Team Created Successfully",
        data: team
    });
};

/**
 * @openapi
 * /api/v1/teams/{id}:
 *   patch:
 *     description: Update Team By Id
 *     tags:
 *       - _Team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the Team
 *                example: "team A"
 *              trainee:
 *                type: array
 *                description: Array of user id
 *                example: ["63c8f4f888bbc68cce0eb6dd"]
 *         
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Team Updated Successfully
 *            data:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: "team A"
 *                trainee:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      username:
 *                       type: string
 *                       example: "user A"
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Team not found
 */
module.exports.updateTeamByQuery = async (req, res) => {
    const teamId = req.params.id;
    const body = req.body;
    const team = await this.findTeam({ _id: teamId, status: {$ne: "deleted"} });
    if (!team) return res.status(404).json({message: "Team not found"});
    if (body.trainee && (!Array.isArray(body.trainee) || !body.trainee.length)) {
        return res.status(400).json({message: "trainees should not be empty"});
    }

    const originalTrainees = team.trainee.map(obj => String(obj._id));
    let removedTrainees = originalTrainees.filter(id => !body.trainee.includes(id));
    let newTrainees = body.trainee.filter(id => !originalTrainees.includes(id));
    const update = await this.updateTeam({_id: teamId}, body, {new: true});
    if (removedTrainees && removedTrainees.length) {
        // remove teamId from user
        removedTrainees.map(id => ObjectId(id));
        // const operation = await User.updateMany({_id: {$in: removedTrainees}}, {$unset: {team: ""}});
        const operation = await User.updateMany({_id: {$in: removedTrainees}}, {$pull: {teams: update._id}});
    }
    if (newTrainees && newTrainees.length) {
        // add teamId to user
        newTrainees.map(id => ObjectId(id));
        // const operation = await User.updateMany({_id: {$in: newTrainees}}, {$set: {team: update._id}});
        const operation = await User.updateMany({_id: {$in: newTrainees}}, {$addToSet: {teams: update._id}});
    }
    return res.status(200).json({
        message: "Team Updated Successfully",
        data: update
    });
};

/**
 * @openapi
 * /api/v1/teams/{id}:
 *   delete:
 *     description: Delete Team By Id
 *     tags:
 *       - _Team
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         example: 63bc0b31055ed508289bf715
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Team deleted successfully
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *       404:
 *         description: Not found!
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Team not found
 */
module.exports.deleteTeam = async (req, res) => {
    const teamId = req.params.id;
    const team = await this.findTeam({ _id: teamId, status: {$ne: "deleted"} });
    if (!team) return res.status(404).json({message: "Team not found"});


    // Remove from enabled teams
    await User.updateMany({enabledTeams: teamId}, {$pull: {enabledTeams: teamId}});



    // DEMO TEAMS - will remove team,users and results permanently
    if (team.isDemo){
        // Remove only users with `_demo_` in username
        let usersToDelete = await User.find({ $and: [{_id: { $in: team.trainee}}, {isDemo : true}]})
        let usersIdsToDelete = usersToDelete.map(u=>u._id.toString()) 
        for (let userToDelete of usersToDelete){
            await userToDelete.remove()
        }
        await Result.deleteMany({ user: { $in: usersIdsToDelete}})
        await team.remove()
        return res.status(200).json({
            message: "DEMO_TEAM_DELETED_SUCCESFULLY",
        });
    }

    // NORMAL TEAMS
    const updateData = {
        name: generateTempName(team.name),
        status: "deleted"
    };
    const update = await this.updateTeam({_id: teamId}, updateData);
    if (update.trainee && update.trainee.length) {
        // remove team id from user
        // const operation = await User.updateMany({_id: {$in: update.trainee}}, {$unset: {team: ""}});
        const operation = await User.updateMany({_id: {$in: update.trainee}}, {$pull: {teams: update._id}});
    }
    return res.status(200).json({
        message: "Team Deleted Successfully",
    });
}

const generateTempName = (name = "name") => {
    return `${name}_${Date.now()}`;
}

/**
 * @openapi
 * /api/v1/teams/users/{moduleId}:
 *   get:
 *     description: Get Module Users list
 *     tags:
 *       - _Team
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
module.exports.getTeamUsers = async (req, res) => {
    const team = await this.findTeam({ _id: req.params.teamId })
        .populate([{
            path:"trainee", 
            select: "name surname username brainCoreTest email", 
            populate: {path: "settings.roleMaster", select: "name"}
        }]);
        

    return res.status(200).json({
        message: "Users fetched successfully",
        data: team.trainee
    });
};



const randomNaamesList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher',
    'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench',
    'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomNames(n = 15) {
    var result = new Array(n),
        len = randomNaamesList.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = randomNaamesList[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}



/**
 * @openapi
 * /api/v1/teams/generate/demo:
 *   post:
 *     description: Generate demo team with provided resuls. It can create a team with max 15 users inside.
 *     tags:
 *       - _Team 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              name:
 *                  type: string
 *                  description: Name of the demo team
 *                  example: "Demo #2023-02-02 12:45"
 *              results:
 *                type: array
 *                description: Array of results from BrainCore test which will be assigned to users in demo team
 *                example: [{"content":"60aaaaef2b4c80000732fdf5","data":{"100":"FR","9992":"1","9993":"3","9994":"1","9995":"4","9996":"1","10007":"2","10013":"5","10015":"2","10023":"6","10025":"5","10027":"5","10039":"4","10041":"2","10045":"6","10049":"6","10051":"5","10069":"3","10071":"5","10073":"5","10077":"6","10079":"6","10083":"6","10085":"1","10093":"4","10105":"4","10107":"5","10109":"6","10111":"1","10113":"1","10115":"6","10117":"6","10123":"6","10129":"5","10139":"5","10143":"6","10145":"6","10149":"4","10151":"6","10153":"6","10159":"3","10161":"5","10163":"1","10165":"6","10167":"6","10173":"5","10175":"5","10177":"5","10181":"5","10183":"6","10191":"6","10193":"5","10197":"3","10201":"3","10203":"6","10223":"6","10225":"5","10227":"5","10237":"5","10243":"5","10245":"4","10247":"6","10251":"3","10253":"4","10255":"1","10259":"6","10265":"6","10267":"2","10275":"5","10277":"2","10283":"6","10289":"5","10291":"5","10293":"3","10301":"6","10305":"5","10309":"5","10311":"6","10315":"5","10319":"5","10321":"4","10323":"6","10325":"6","10327":"4","10329":"5","10331":"6","10333":"6","10335":"5","10345":"4","10349":"3","10351":"1","10353":"4","10361":"5","10365":"5","10371":"5","10375":"4","10377":"5","10381":"3","10385":"5","10387":"4","10393":"5","10395":"6","10399":"1","10403":"5","10407":"6","10413":"6","10415":"3","10419":"6","10425":"3","10427":"2","10431":"6","10433":"3","10439":"5","10443":"6","10445":"3","10447":"1","10451":"6","10453":"6","10457":"5","10461":"4","10467":"6","10473":"5","10477":"6","10479":"5","10483":"3","10485":"1","10487":"4","10489":"6","10497":"5","10501":"4","10503":"5","10507":"4","10511":"4","10513":"3","10519":"3","10523":"5","10535":"5","10539":"5","10541":"6","10545":"3","10551":"5","10553":"3","10561":"5","10571":"4","10575":"4","10577":"6","10581":"5"},"timeSpent":866}]
 * 
 */
module.exports.generateDemoTeam = async (req, res) => {
    var creator = await User.findById(req.userId)
    var results = req.body.results
    if (!results) return res.status(403).send({ message: "NO_RESULTS_PROVIDED" });
    if (results.length > 15) return res.status(403).send({ message: "TOO_MANY_RESULTS" });




    // ###############################################
    // CREATE TEAM ###################################
    // ###############################################

    const object = {
        name: req.body.name??"Demo #0",
        module: req.moduleId,
        trainee: [],
        isDemo: true
    };
    let team = await Team.create(object);
    creator.enabledTeams.push(team._id);
    await creator.save()

    // ########################################
    // CREATE USERS AND RESULTS ###############
    // ########################################
    let settings = { language: creator.settings.language, origin: creator.settings.origin }
    settings.role = 'Other'
    settings.availableRoles = ['Trainee']
    settings.roleMaster = '64058db74037cfa1d4085598',//Trainee
        settings.availableRoleMasters = ['64058db74037cfa1d4085598']// Trainee
    settings.defaultRole = 'Other'

    let userNames = getRandomNames(results.length)
    let userIds = []
    for (let [index, result] of results.entries()) {
        //#####################
        // Prepare user in team
        let name = userNames[index]
        let surname = name.split("").reverse().join("");
        surname = capitalizeFirstLetter(surname.toLowerCase())
        let hash = (Math.random() + 1).toString(36).substring(7);
        let email = name.toLowerCase() + "_demo_user@"+hash+".demo"
        let user = await authUtils.getNewUser({ email: email, username: email, name: name, surname: surname, password: creator.password, settings: settings })
        user.creator = req.userId
        user.teams = [team._id]
        user.brainCoreTest = {
            registerDate: new Date(),
            completionDate: new Date(),
            status: 'Completed',
            reminderEmailSent: false,
            requestDate: new Date()
        }
        user.isDemo = true
        user.scopes.push({name: `modules:read:${req.moduleId}`})
        user.save()
        userIds.push(user._id)
        // ####################################################
        // Prepare result for user and schedule for processing
        result.user = user._id
        result.inviter = req.userId
        let createdResult = await Result.create(result);
        tasker.addTask({ task: "PROCESS_RESULTS", resultId: createdResult._id }, 'results', (err) => {
            if (err) console.error(err);
        })


    }

    // Add users to team
    team.trainee = userIds
    await team.save()


    return res.status(200).json({
        message: "CREATED_SUCCESFULLY"
    });
};