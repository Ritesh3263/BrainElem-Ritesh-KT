const Content = require("../models/content.model");
const ObjectId = require("mongodb").ObjectId;
const Chapter = require("../models/chapter.model");
const Ecosystem = require("../models/ecosystem.model");

exports.getUserPrivateContents = async (req, res) => { // Get all user private content => Cloud
    let contents = await Content.find( {$and : [{cloudStatus: ['PRIVATE','AWAITING','REJECTED','ACCEPTED']},{owner: [req.params.userId]}]},
        // {pages: 0} // needing page in the view to avoide async-await issue in editChaptersInProgram()
        )
        .populate({path: "owner", select: ['_id', 'username']})
    res.status(200).json(contents);
};

exports.getUserPublicContents = async (req, res) => { // Get all user public content => Cloud
    let contents = await Content.find({$and : [{cloudStatus: ['ACCEPTED']},{owner: [req.params.userId]}]},
        {pages: 0})
        .populate({path: "owner", select: ['_id', 'username']})
    res.status(200).json(contents);
};

exports.getUserCoCreatedContents = async (req, res) => { // Get all user CoCreated content => Cloud
    let contents = await Content.find({$and : [{cloudStatus: ['ACCEPTED','PRIVATE','AWAITING','REJECTED']},{cocreators: req.params.userId}]},
        {'title': 1, 'description': 1, 'owner': 1, 'level': 1, 'createdAt': 1, 'updatedAt': 1, 'cocreators': 1, 'contentType': 1, 'status': 1})
        .populate({path: "owner", select: ['_id', 'username']})
    res.status(200).json(contents);
};

exports.getAllContents = async (req, res) => {
    if(req.ecosystemId){ // user with upper role than moduleManager 
        let ecosystem = await Ecosystem.findById(req.ecosystemId)
        if (!ecosystem) res.status(404).send({ message: "Ecosystem not found." });
        else {
            let moduleIds = ecosystem.subscriptions.map(s=>s.modules.map(m=>m._id)).flat(2)
            let contents = await Content.find({ 
                    $or: [{
                        cloudStatus: ['AWAITING', 'REJECTED'], 
                        $or: [ {ecosystem: req.ecosystemId}, {module: moduleIds} ],
                    },{
                        cloudStatus: ['ACCEPTED'], 
                        $or: [ {ecosystem: req.ecosystemId}, {module: moduleIds} ],
                    }],
                    origin: {$exists: false}, 
                    sendToCloud: true,
                    }, {pages: 0})
                .populate({path: "owner", select: ['_id', 'username']})
            res.status(200).json(contents);
        }
    } else if (req.moduleId) { // if ecosystemId doesn't exist but moduleId exists
        let contents = await Content.find({ 
                $or: [{
                    cloudStatus: ['AWAITING', 'REJECTED'], 
                },{
                    cloudStatus: ['ACCEPTED'], 
                }],
                module: req.moduleId,
                origin: {$exists: false}, 
                sendToCloud: true,
                }, {pages: 0})
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

exports.getAwaitingContents = async (req, res) => {
    if(req.ecosystemId){ // user with upper role than moduleManager 
        let ecosystem = await Ecosystem.findById(req.ecosystemId)
        if (!ecosystem) res.status(404).send({ message: "Ecosystem not found." });
        else {
            let moduleIds = ecosystem.subscriptions.map(s=>s.modules.map(m=>m._id)).flat(2)
            let contents = await Content.find( {sendToCloud: true, cloudStatus: ['AWAITING'], origin: {$exists: false}, chapter: {$exists: true}, trainingModule: {$exists: true}, $or: [{ecosystem: req.ecosystemId},{module: moduleIds}] },  // contents must have chapter/subject when sent to Library
                {pages: 0})
                .populate({path: "owner", select: ['_id', 'username']})
            res.status(200).json(contents);
        }
    } else if (req.moduleId) { // if ecosystemId doesn't exist but moduleId exists
        let contents = await Content.find( {cloudStatus: ['AWAITING'], origin: {$exists: false}, module: req.moduleId },
            {pages: 0})
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([]) // no content found!
};

exports.manageContentStatus = async (req, res) => { // Action for editing single content
    // TODO: check if the user has access to modify this content!
    let content = {...req.body.content}
    if (content.cloudStatus == "REJECTED") {
        Content.findOneAndUpdate( // modify original/copy
            {_id: content._id},
            { $set: { cloudStatus: "REJECTED", approvedByCloudManager: false }},
            { runValidators: true, returnOriginal: false})
            res.status(200).json({ message: "The content has been rejected successfully!" }); 
    } else {
        content.cloudStatus = "ACCEPTED"
        content.approvedByCloudManager = false // precaution 
        content.approvedInCloudAt = new Date().toISOString() // precaution 

        Content.findOneAndUpdate( // modify original
            { _id: content._id, origin: {$exists: false} },
            { $set: { cloudStatus: "ACCEPTED", approvedByCloudManager: false } })
            res.status(200).json({ message: "The content has been approved successfully!" }); // already have a copy
    }
};
//***********************************