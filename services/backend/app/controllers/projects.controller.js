const db = require("../models");
const cognitiveUtils = require("../utils/cognitive");

function getParticipants(project) {
    var participants = []
    if (!project?.cognitiveBlockCollection) return participants
    for (let collection of project?.cognitiveBlockCollection) {
        let usersIds = collection.users.map(u=>{return u._id?u._id.toString():u.toString()})
        participants = [...new Set([...participants, ...usersIds])]
    }
    return participants

}


// Get status for the project
function getStatus(project) {

    let status = 'todo'
    if (project?.cognitiveBlockCollection) {
        for (let collection of project.cognitiveBlockCollection) {

            for (let block of collection.cognitiveBlocks) {
                // If status alrady set
                if (block.status) {
                    let arr = Object.values(block.status)
                    // Status is set for all the people
                    if (Object.keys(block.status).length >= collection.users.length) {
                        if (arr.includes('in_progress') || arr.includes('done')) status = 'in_progress'
                        if (arr.every(v => v === 'done')) status = 'done'
                    } else {// Not all of people has status
                        if (arr.includes('in_progress') || arr.includes('done')) status = 'in_progress'
                    }
                } else status = 'todo'

            }
        }
    }

    if ((status == 'in_progress' || status == 'todo') && new Date() > new Date(project.deadline)) {
        status = 'delayed'
    }

    return status
}


// Get progress of the project, collection or block
// project - project object - when collectionId and blockId are not provided
//           progress for this project will be returened as integer in range 0, 100
// collectionId - optional -  when provided progress for this collection will be returned as integer in range 0, 100
// blockId - optional - when provided progress for this block will be returned as integer in range 0, 100
function getProgress(project, collectionId, blockId) {
    var all = in_progress = done = 0
    if (project?.cognitiveBlockCollection) {
        for (let collection of project.cognitiveBlockCollection) {
            if (collectionId && collection._id != collectionId) continue
            for (let block of collection.cognitiveBlocks) {
                if (blockId && block._id != blockId) continue
                all += collection.users.length
                // If status alrady set
                if (block.status) {
                    let arr = Object.values(block.status)
                    in_progress += arr.filter(s => s == 'in_progress').length
                    done += arr.filter(s => s == 'done').length
                }
            }
        }
    }
    let progress = 100 * done / all
    return parseInt(progress ?? 0)
}

/**
 * @openapi
 * /api/v1/projects/all:
 *   get:
 *     description: |
 *       Get list of all projects inside module
 *     tags:
 *      - _projects
 *     responses:
 *       200:
 *        description: List of projects
 *        schema:
 *          type: object
 *          example: {"projects":[{"_id":"116b67144025fc00083d1311","name":"My first project","module":"333000000000000000000000","creator":"63b27cc52d8fb5f910d142b5","deadline":"2027-07-30T11:43:51.531Z","__v":0,"createdAt":"2023-06-02T15:27:50.654Z","updatedAt":"2023-06-02T15:27:50.654Z","progress":75,"status":"todo","numberOfParticipants":1},{"_id":"116b67144025fc00083d1322","name":"My second project","module":"333000000000000000000000","creator":"63b27cc52d8fb5f910d142b5","deadline":"2024-03-01T11:43:51.531Z","__v":0,"createdAt":"2023-06-02T15:27:50.655Z","updatedAt":"2023-06-02T15:27:50.655Z","progress":75,"status":"todo","numberOfParticipants":1},{"_id":"647a0ad641f77c1abe8c1bed","name":"Example of project name","deadline":"2025-06-02T12:36:02.320Z","module":"333000000000000000000000","creator":"63b27cc52d8fb5f910d142b5","createdAt":"2023-06-02T15:29:26.416Z","updatedAt":"2023-06-02T15:29:26.416Z","__v":0,"progress":75,"status":"todo","numberOfParticipants":1}]}
 * 
*/
exports.getProjects = async (req, res) => {
    if (!req.moduleId) return res.status(400).send("Module is not selected.");
    let projects = await db.project.find({ "module": req.moduleId, "creator": req.userId })
        .populate({path: 'cognitiveBlockCollection.cognitiveBlocks.content', select: 'title durationTime'})
        .sort({ createdAt: 'desc' })// first the latest


    let projectsToReturn = []
    for (let project of projects) {
        project = project.toObject()
        for (let collection of project.cognitiveBlockCollection) {
            collection.progress = getProgress(project, collection._id)
            for (let block of collection.cognitiveBlocks) {
                block.progress = getProgress(project, collection._id, block._id)
            }
        }

        project.progress = getProgress(project)
        project.status = getStatus(project)

        let participants = getParticipants(project)
        project.numberOfParticipants = participants.length

        // delete project.cognitiveBlockCollection

        projectsToReturn.push(project)
    }
    return res.status(200).json( projectsToReturn );
};


/**
 * @openapi
 * /api/v1/projects/read/{projectId}:
 *   get:
 *     description: |
 *       Get single project with all the details
 *     tags:
 *      - _projects
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         type: string
 *         example: 116b67144025fc00083d1311 
 *         description: Id of the project
 *     responses:
 *       200:
 *        description: Project
 *        schema:
 *          type: object
 *          example: {"_id":"116b67144025fc00083d1311","name":"My first project","module":"333000000000000000000000","creator":"63b27cc52d8fb5f910d142b5","deadline":"2027-07-30T11:43:51.531Z","cognitiveBlockCollection":[{"users":["999979999999900000000001"],"_id":"647a0a7641f77c1abe8bd371","opportunity":"1_1_2_1","cognitiveBlocks":[{"_id":"647a0a7641f77c1abe8bd372","content":"646b67144025fc00083d1311","deadline":"2027-07-30T11:43:51.531Z","status":{"999979999999900000000001":"todo"},"progress":75},{"_id":"647a0a7641f77c1abe8bd373","content":"646b67144025fc00083d1312","deadline":"2027-07-30T11:43:51.531Z","status":{"999979999999900000000001":"in_progress"},"progress":75},{"_id":"647a0a7641f77c1abe8bd374","content":"646b67144025fc00083d1313","deadline":"2027-07-30T11:43:51.531Z","status":{"999979999999900000000001":"done"},"progress":75},{"_id":"647a0a7641f77c1abe8bd375","content":"646b67144025fc00083d1314","deadline":"2027-07-30T11:43:51.531Z","status":{"999979999999900000000001":"delayed"},"progress":75},{"_id":"647a0a7641f77c1abe8bd376","content":"646b67144025fc00083d1315","deadline":"2027-07-30T11:43:51.531Z","progress":75}]}],"__v":0,"createdAt":"2023-06-02T15:27:50.654Z","updatedAt":"2023-06-02T15:27:50.654Z","numberOfParticipants":1,"progress":75,"status":"todo"}
 * 
*/
exports.getProject = async (req, res) => {
    if (!req.moduleId) return res.status(400).send("Module is not selected.");

    let project = await db.project.findOne({ "_id": req.params.projectId, "module": req.moduleId, "creator": req.userId })
        .populate({path: 'cognitiveBlockCollection.cognitiveBlocks.content', select: ['title', 'durationTime']})
        .populate({path: 'cognitiveBlockCollection.users', select: ['name', 'surname']})
    project = project.toObject()

    let participants = getParticipants(project)
    project.numberOfParticipants = participants.length

    project.progress = getProgress(project)
    project.status = getStatus(project)

    let user = await db.user.findOne({ _id: req.userId }) // it can be any user as it will retun all the available opportunities 
    let opportunities = await cognitiveUtils.prepareOpportunities(undefined, 'leader', user.settings.language??'en', undefined, 5)

    for (let collection of project.cognitiveBlockCollection) {
        collection.progress = getProgress(project, collection._id)
        let opportunity = opportunities.find(o => o.key == collection.opportunity)
        collection.opportunity = opportunity
        for (let block of collection.cognitiveBlocks) {
            block.progress = getProgress(project, collection._id, block._id)
        }
    }
    return res.status(200).json(project);
};


/**
 * @openapi
 * /api/v1/projects/add:
 *   post:
 *     description: | 
 *       Add new project based on data from request body.
 *       Object must follow all the rules from ProjectSchema, 
 *       otherwise the validation errors will be returned when saving to database. 
 *     tags:
 *      - _projects
 *     parameters:
 *       - name: project
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             project:
 *                type: object
 *                properties:
 *                  name:
 *                     type: string
 *                     example: 'Example of project name'
 *                  deadline:
 *                     type: string
 *                     example: '2025-06-02T12:36:02.320Z'
 *                  cognitiveBlockCollection:
 *                     type: array
 *                     items: 
 *                       type: object
 *                       example: {"opportunity": "1_1_2_1", "users": ["999979999999900000000001"], "deadLine": "2024-02-30T11:43:51.531Z", "cognitiveBlocks": [{"content": "646b67144025fc00083d1315", "deadline": "2024-07-30T11:43:51.531Z"}]}
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Created successfully
 *            projectId:
 *              type: string
 *              example: <_id>
 */
exports.addProject = async (req, res) => {
    if (!req.moduleId) return res.status(400).send("Module is not selected.");
    let data = {...req.body}

    if (data.cognitiveBlockCollection){
        for (let collection of data.cognitiveBlockCollection) {
            if (collection?.opportunity?.key){
                collection.opportunity = collection?.opportunity?.key
            }
        }
    }

    let project = new db.project(data)
    project.module = req.moduleId
    project.creator = req.userId


    project.save(function (err, project) {
        if (err) return res.status(500).send({ message: err });
        else return res.status(200).json({ message: "Created successfully", projectId: project._id });
    });
};


/**
 * @openapi
 * /api/v1/projects/edit/{projectId}:
 *   put:
 *     description: | 
 *       Edit existing project based on data from request body.
 *       Object must follow all the rules from ProjectSchema, 
 *       otherwise the validation errors will be returned when saving to database. 
 *     tags:
 *      - _projects
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         type: string
 *         example: "116b67144025fc00083d1311"
 *         description: Id of project to edit
 *       - name: project
 *         in: body
 *         schema:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             project:
 *                type: object
 *                properties:
 *                  name:
 *                     type: string
 *                     example: 'Example of project name'
 *                  deadline:
 *                     type: string
 *                     example: '2025-06-02T12:36:02.320Z'
 *                  cognitiveBlockCollection:
 *                     type: array
 *                     items: 
 *                       type: object
 *                       example: {"opportunity": "1_1_2_1", "users": ["999979999999900000000001"], "deadLine": "2024-02-30T11:43:51.531Z", "cognitiveBlocks": [{"content": "646b67144025fc00083d1315", "deadline": "2024-07-30T11:43:51.531Z"}]}
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Updated successfully
 *            projectId:
 *              type: string
 *              example: <_id>
 */
exports.editProject = async (req, res) => {
    var project = { ...req.body }
    let projectId = req.params.projectId
    // Do not allow to edit those properties
    delete project.creator
    delete project.module

    db.project.findOneAndUpdate({ "_id": projectId, creator: req.userId, module: req.moduleId }, project, { runValidators: true, returnOriginal: false }, function (err, project) {
        if (err) return res.status(500).send({ message: err });
        else if (!project) return res.status(404).send("Project not found");
        else return res.status(200).json({ message: "Updated successfully", projectId: project._id });
    })
};

/**
 * @openapi
 * /api/v1/projects/remove/{projectId}:
 *   delete:
 *     description: | 
 *       Delete existing project
 *     tags:
 *      - _projects
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         type: string
 *         description: Id of project to edit
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: Deleted successfully
 *            projectId:
 *              type: string
 *              example: <_id>
 */
exports.deleteProject = async (req, res) => {
    var projectId = req.params.projectId
    db.project.findOneAndDelete({ "_id": projectId, creator: req.userId, module: req.moduleId }, function (err, project) {
        if (err) return res.status(500).send({ message: err });
        if (!project) return res.status(404).send("Project not found");
        return res.status(200).json({ message: "Deleted successfully", projectId: projectId });
    });
};

/**
 * @openapi
 * /api/v1/projects/collections/card/{collectionId}:
 *   get:
 *     description: |
 *        Load selected collection details.
 *     tags:
 *      - _projects_collections
 *     parameters:
 *       - name: collectionId
 *         in: path
 *         required: true
 *         type: string
 *         example: 647cbdcf56514c12aaafce11
 *         description: Id of collection for which details should be loadded
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
 *     responses:
 *       200:
 *        description: List of opportunities
 *        schema:
 *          type: object
 *          example: {}
 * 
*/
exports.getCognitiveBlocksCollection = async (req, res) => {
    let user = await db.user.findOne({ _id: req.userId })
    if (!user) return res.status(404).send({ message: "USER_NOT_FOUND" });
    var lang = user.settings.language??'en'

    let traits = {// Used to get name of the trait which is associated with area of development 
        '1': await cognitiveUtils.getTraitForArea('1', req.query.type, lang),
        '2': await cognitiveUtils.getTraitForArea('2', req.query.type, lang),
        '3': await cognitiveUtils.getTraitForArea('3', req.query.type, lang),
        '4': await cognitiveUtils.getTraitForArea('4', req.query.type, lang),
        '5': await cognitiveUtils.getTraitForArea('5', req.query.type, lang)
    }


    let project = await db.project.findOne({ "cognitiveBlockCollection._id": req.params.collectionId, "cognitiveBlockCollection.users": req.userId }).sort({ 'cognitiveBlockCollection.createdAt': 'desc' })// first the latest results
    if (!project) return res.status(404).send({ message: "Project was not found" });

    let opportunities = await cognitiveUtils.prepareOpportunities(undefined, req.query.type, lang, undefined, 5)

    let collection = project.cognitiveBlockCollection.find(c => c?._id == req.params.collectionId)





    // Transform to object
    collection = collection.toObject()
    // Not needed
    delete collection.users


    // Assign feedback
    let useful = undefined;
    let confirmed = undefined;
    let favourite = undefined;
    if (collection?.feedback && req.userId in collection?.feedback) {
        let feedback = collection?.feedback[req.userId]
        if (feedback) {
            useful = feedback.useful
            confirmed = feedback.confirmed
            favourite = feedback.favourite
        }
    }

    delete collection.feedback
    collection = { ...collection, useful: useful, confirmed: confirmed, favourite: favourite }

    // Find associated opportunity
    let opportunity = opportunities.find(o => o.key == collection.opportunity)
    collection.opportunity = { ...opportunity, area: { ...opportunity.area, trait: { key: traits[opportunity.area.key].key, shortName: traits[opportunity.area.key].shortName } } }

    for (let block of collection.cognitiveBlocks) {
        // Load status from object
        if (block.status && req.userId in block.status) block.status = block.status[req.userId]
        else block.status = 'todo'
        
        // Populate content
        let content = await db.content.findOne({ _id: block.content }, { title: 1, _id: 1 }).lean()
        
        // Set progress
        // TODO-review
        let progress = user.sessionContentProgress.find(p => p.contentId.toString() == req.params.contentId);
        content.status = progress?.status;
        block.content = content
    }



    return res.status(200).json(collection);
}

/**
 * @openapi
 * /api/v1/projects/collections/assigned:
 *   get:
 *     description: |
 *        Load list of cognitive blocks collections(opportunities) assigned for a user.
 *        Those collections has been assigned by the manager/trainer inside MyProjects.
 *        Each collection is associated with specific opportunity and is composed of smaller `blocks`.
 *        Each of those `blocks` is associated with specific `content`. 
 *     tags:
 *      - _projects_collections
 *     parameters:
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
 *     responses:
 *       200:
 *        description: List of opportunities
 *        schema:
 *          type: object
 *          example: []
 * 
*/
exports.getAssignedCognitiveBlocksCollections = async (req, res) => {
    let user = await db.user.findOne({ _id: req.userId })
    if (!user) return res.status(404).send({ message: "USER_NOT_FOUND" });
    var lang = user.settings.language??'lang'

    var collections = await cognitiveUtils.getAssignedCognitiveCollections(user, req.query.type, lang)
    return res.status(200).json(collections);
}

/**
 * @openapi
 * /api/v1/projects/collections/users:
 *   post:
 *     description: |
 *        Get list of all possible cognitive blocks collections(opportunities) for requested users.
 *        Those collections can be assigned by the manager/trainer to selected users inside MyProjects.
 *        Each collection is associated with specific opportunity and is composed of smaller `blocks`.
 *        Each of those `blocks` is associated with specific `content`
 *        Herea are areas key with associated traits keys:
 *        '1' = 'self-activation'
 *        '2' = 'self-confidence'
 *        '3' = 'communication-strategy'
 *        '4' = 'cooperation'
 *        '5' = 'regularity'
 *     tags:
 *      - _projects_collections
 *     parameters:
 *       - name: users
 *         in: body
 *         description: List of users with areas keys which should be included when getting collections
 *         schema:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 type: string
 *               example: [{_id: "999979999999900000000001", areas: ['1','2']}, {_id: "111179999999900000000002", areas: ['1']}]
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
 *         - team-leader
 *         description: Type of the user for which data will be displayed(reader). When not provided it will be automatically detected based on BrainCore Test, role and age of the user.
 *     responses:
 *       200:
 *        description: The list of opportunities including all the details
 *        schema:
 *          type: object
 *          example: {}
 * 
 */
exports.getPossibleCognitiveBlocksCollectionsForUsers = async (req, res) => {

    let user = await db.user.findOne({ _id: req.userId })
    if (!user) return res.status(404).send({ message: "USER_NOT_FOUND" });
    var lang = user.settings.language??'en'


    let traits = { // Used to get name of the trait which is associated with area of development
        '1': await cognitiveUtils.getTraitForArea('1', 'leader', lang),
        '2': await cognitiveUtils.getTraitForArea('2', 'leader', lang),
        '3': await cognitiveUtils.getTraitForArea('3', 'leader', lang),
        '4': await cognitiveUtils.getTraitForArea('4', 'leader', lang),
        '5': await cognitiveUtils.getTraitForArea('5', 'leader', lang)
    }


    // TODO
    var cognitiveBlocks = [
        { content: await db.content.findById('646b67144025fc00083d1311', {title: 1, durationTime: 1})},
        { content: await db.content.findById('646b67144025fc00083d1312', {title: 1, durationTime: 1})},
        { content: await db.content.findById('646b67144025fc00083d1313', {title: 1, durationTime: 1})},
        { content:await db.content.findById('646b67144025fc00083d1314', {title: 1, durationTime: 1})}
    ]
    if (lang=='fr'){
        cognitiveBlocks = [
            { content: await db.content.findById('646b67144025fc00083d1321', {title: 1, durationTime: 1})},
            { content: await db.content.findById('646b67144025fc00083d1322', {title: 1, durationTime: 1})},
            { content: await db.content.findById('646b67144025fc00083d1323', {title: 1, durationTime: 1})},
            { content:await db.content.findById('646b67144025fc00083d1324', {title: 1, durationTime: 1})}
        ]
    }



    let collections = []
    for (let reqUser of req.body) {

        let user = await db.user.findOne({ _id: reqUser }, { _id: 1, name: 1, surname: 1 })
        if (!user) continue
        // return res.status(404).send("One of the users could not be found");

        // Find all opportunities for this user
        let opportunities = await user.getOpportunities('leader', lang, reqUser.areas, 3)


        for (let opportunity of opportunities) {
            // Check if collection for this opportunity already exists
            let existingCollection = collections.find(c => c.id == opportunity.key)
            if (existingCollection) {
                existingCollection.users = [...new Set([...existingCollection.users, user])]
            }
            else {
                let collection = { // add a unique identifier for the collection, not objectId
                    id: opportunity.key,
                    users: [user],
                    opportunity: {
                        key: opportunity.key, text: opportunity.text,
                        area: {
                            key: opportunity.area.key,
                            trait: { key: traits[opportunity.area.key].key, shortName: traits[opportunity.area.key].shortName }
                        }
                    },
                    cognitiveBlocks: cognitiveBlocks
                }
                collections.push(collection)
            }
        }
    }
    return res.status(200).json(collections);
};



/**
 * @openapi
 * /api/v1/projects/collections/feedback:
 *   post:
 *     description: |
 *        Send feedback about the cognitive collection. This feeedback might be one of the following: 
 *        1. confirmed - Marking card with this collection as identified
 *        2. useful - Marking card with this collection as useful
 *        3. favourite - Marking card with this collection as favourite
 *     tags:
 *      - _projects_collections
 *     parameters:
 *       - name: feedback
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             _id:
 *               description: Id of thecognitive collection
 *               type: integer
 *               example: "647a0ad641f77c1abe8c1bee"
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
exports.feedbackForCognitiveCollection = async (req, res) => {

    let project = await db.project.findOne({
        "cognitiveBlockCollection._id": req.body._id,
        "cognitiveBlockCollection.users": req.userId
    })

    if (!project) return res.status(404).send("Collection not found");
    let collection = project.cognitiveBlockCollection.find(c => c._id.toString() == req.body._id)

    if (!collection.feedback) collection.feedback = {}
    if (!collection.feedback[req.userId]) collection.feedback[req.userId] = {}

    if (req.body.favourite != undefined) collection.feedback[req.userId].favourite = req.body.favourite
    if (req.body.useful != undefined) collection.feedback[req.userId].useful = req.body.useful
    if (req.body.confirmed != undefined) collection.feedback[req.userId].confirmed = req.body.confirmed

    collection.markModified('feedback')

    project.save(function (err, project) {
        if (err) return res.status(500).send({ message: err });
        else return res.status(200).json({ message: "Feedback saved successfully", cognitiveBlockCollectionId: req.body._id });
    });
}


/**
 * @openapi
 * /api/v1/projects/blocks/progress/{blockId}:
 *   post:
 *     description: |
 *        Set proggress for cognitive block.
 *     tags:
 *      - _projects_collections
 *     parameters:
 *       - name: blockId
 *         in: path
 *         required: true
 *         type: string
 *         example: 647cbdcf56514c12aaafce01 
 *         description: Id of the cognitive block
 *       - name: data
 *         in: body
 *         description: Status to set
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum:
 *               - todo
 *               - in_progress
 *               - done
 *               example: done
 *     responses:
 *       200:
 *        description: Response
 *        schema:
 *          type: object
 *          example: {"message": "Progress saved"}
 * 
*/
exports.progressForCognitiveBlock = async (req, res) => {
    const statuses = ['todo', 'in_progress', 'done']
    let project = await db.project.findOne({
        "cognitiveBlockCollection.cognitiveBlocks._id": req.params.blockId,
        "cognitiveBlockCollection.users": req.userId
    })

    if (!statuses.includes(req.body.status)) return res.status(400).send("Status must be on of the following" + statuses.toString());
    if (!project) return res.status(404).send("Collection not found");

    for (let collection of project.cognitiveBlockCollection) {
        for (let block of collection.cognitiveBlocks) {
            if (block._id.toString() == req.params.blockId) {
                if (!block.status) block.status = {}
                block.status[req.userId] = req.body.status
                block.markModified('status')
            }
        }

    }
    //let collection = project.cognitiveBlockCollection.find(c => c._id.toString() == req.body._id)

    project.save(function (err, project) {
        if (err) return res.status(500).send({ message: err });
        else return res.status(200).json({ message: "Progress saved successfully", cognitiveBlockId: req.body.blockId });
    });
}



/**
 * @openapi
 * /api/v1/projects/blocks/{blockId}:
 *   get:
 *     description: |
 *        Get details for cognitive block.
 *     tags:
 *      - _projects_collections
 *     parameters:
 *       - name: blockId
 *         in: path
 *         required: true
 *         type: string
 *         example: 647cbdcf56514c12aaafce01 
 *         description: Id of the cognitive block
 *     responses:
 *       200:
 *        description: Response
 *        schema:
 *          type: object
 *          example: {"message": "Progress saved"}
 * 
*/
exports.getCognitiveBlock = async (req, res) => {
    const statuses = ['todo', 'in_progress', 'done']
    let project = await db.project.findOne({
        "cognitiveBlockCollection.cognitiveBlocks._id": req.params.blockId,
        "cognitiveBlockCollection.users": req.userId
    })

    if (!project) return res.status(404).send("Collection not found");

    for (let collection of project.cognitiveBlockCollection) {
        for (let block of collection.cognitiveBlocks) {
            if (block._id.toString() == req.params.blockId) {
                block = block.toObject()
                // Load status from object
                if (block.status && req.userId in block.status) block.status = block.status[req.userId]
                else block.status = 'todo'
                return res.status(200).json(block)
            }
        }

    }
}