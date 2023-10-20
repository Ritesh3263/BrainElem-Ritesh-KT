const Content = require("../models/content.model");
const db = require("../models");
const ObjectId = require("mongodb").ObjectId;
const Chapter = require("../models/chapter.model");
const {braincoreTestsIds} = require("../utils/braincoreTestsIds");

// folderize the content
function folderizeContent(contents, folders={_folder:true}) {
    for (let i = 0; i < contents.length; i++) {
        let content = contents[i];
        let trainingModule = content.trainingModule;
        let capsule = content.capsule;
        let chapter = content.chapter;
        if (trainingModule) {
            if (!folders[trainingModule.name]) {
                folders[trainingModule.name] = {_folder: true};
            }
            if (!folders[trainingModule.name][chapter.name]) {
                folders[trainingModule.name][chapter.name] = {_folder: true, _mixed: true};
            }
            if(capsule) {
                if (!folders[trainingModule.name][chapter.name][content.capsule]) {
                    folders[trainingModule.name][chapter.name][content.capsule] = [];
                }
                folders[trainingModule.name][chapter.name][content.capsule].push(content);
            } else {
                folders[trainingModule.name][chapter.name][content._id] = content;
            }
        }
    }
    return folders;
}

/**
 * @openapi
 * /api/v1/library/private:
 *   get:
 *     description: Get all user private content => This is the list of all the private contents that the user has created or that he has co-created with other users. This list is displayed in the "My library" section of the platform.
 *     tags:
 *       - _library 
 *     responses:
 *       200:
 *         type: object
 *         description: Return all user private content
 *         example: { "folders": { "_folder": true, "Maths": { "_folder": true, "Probabilités et Statistiques": { "_folder": true, "_mixed": true, "61287f5ca4a86fab7c935a99": Content, "61288101a4a86f3fe2935b3b": Content, "Probabilité": [ Contents ], "Arbre de probabilité": [ Contents ] }, "Analyse": { "_folder": true, "_mixed": true, "6134fc161099981e319dad45": Content, "Fonctions": [ Contents ] } }, "Anglais": { "_folder": true, "Syntaxe": { "_folder": true, "_mixed": true, "Conjonctions": [ Contents ], "Les temps": [ Contents ] }, "Vocabulaire": { "_folder": true, "_mixed": true, "Le monde du travail": [ Contents ], "Espace et situation": [ Contents ] } } }, "allContents": [ Contents ] }      
 */
exports.getUserPrivateContents = async (req, res) => { // Get all user private content => Library
    let contents = await Content.find({$and : [
                { owner: [req.userId] }, 
                { module: req.moduleId },
                { origin: {$exists: false} },
                {$or: [{"archivedByLibrarian":  false}, {archivedByLibrarian:  {$exists: false}}]},
            ]},
            // {pages: 0} // needing page in the view to avoid async-await issue in editChaptersInProgram()
        )
        .select("title contentType libraryStatus updatedAt owner level capsule chapter trainingModule")
        .populate({path: "owner", select: 'name surname'})
        .populate({path: "chapter", select: 'name'})
        .populate({path: "trainingModule", select: 'name'})

    res.status(200).json({folders:folderizeContent(contents), allContents: contents});
};

/**
 * @openapi
 * /api/v1/library/public:
 *   get:
 *     description: Get all user public content => This is the public content that will be displayed in the library
 *     tags:
 *       - _library 
 *     responses:
 *       200:
 *         type: object
 *         description: Return all user public content
 *         example: { "folders": { "_folder": true, "Maths": { "_folder": true, "Probabilités et Statistiques": { "_folder": true, "_mixed": true, "61287f5ca4a86fab7c935a99": Content, "61288101a4a86f3fe2935b3b": Content, "Probabilité": [ Contents ], "Arbre de probabilité": [ Contents ] }, "Analyse": { "_folder": true, "_mixed": true, "6134fc161099981e319dad45": Content, "Fonctions": [ Contents ] } }, "Anglais": { "_folder": true, "Syntaxe": { "_folder": true, "_mixed": true, "Conjonctions": [ Contents ], "Les temps": [ Contents ] }, "Vocabulaire": { "_folder": true, "_mixed": true, "Le monde du travail": [ Contents ], "Espace et situation": [ Contents ] } } }, "allContents": [ Contents ] }      
 */
exports.getUserPublicContents = async (req, res) => { // Get all user public content => Library
    let conditions = { $and : [
        { libraryStatus: ['ACCEPTED'] },
        { module: req.moduleId },
        { archivedByLibrarian: false}
    ]}
    if (req.role === 'Trainee') {
        conditions.$and.push({ $or: [
            { hideFromTrainees: false },
            { hideFromTrainees: { $exists: false } }
        ]})
    }
    let contents = await Content.find(conditions)
        .select("title contentType libraryStatus updatedAt owner level description capsule chapter trainingModule")    
        .populate({path: "owner", select: 'name surname username'})
        .populate({path: "chapter", select: 'name'})
        .populate({path: "trainingModule", select: 'name'})

    res.status(200).json({folders:folderizeContent(contents), allContents: contents});
};

exports.getAllPublicContents = async (req, res) => { // Get all public content => Library // how to decide which content is public?
    let contents = await Content.find({$and : [{libraryStatus: ['ACCEPTED']}, {_id: {$nin: braincoreTestsIds}}], archivedByLibrarian: false})
        .select("title contentType libraryStatus createdAt updatedAt owner level description capsule chapter trainingModule")
        .populate({path: "owner", select: 'name surname username'})
    res.status(200).json(contents);
};

/**
 * @openapi
 * /api/v1/library/cocreated:
 *   get:
 *     description: Get all users' CoCreated contents => This is the content that the user has co-created with other users
 *     tags:
 *       - _library 
 *     responses:
 *       200:
 *         type: object
 *         description: Return all user CoCreated content
 *         example: { "folders": { "_folder": true, "Maths": { "_folder": true, "Probabilités et Statistiques": { "_folder": true, "_mixed": true, "61287f5ca4a86fab7c935a99": Content, "61288101a4a86f3fe2935b3b": Content, "Probabilité": [ Contents ], "Arbre de probabilité": [ Contents ] }, "Analyse": { "_folder": true, "_mixed": true, "6134fc161099981e319dad45": Content, "Fonctions": [ Contents ] } }, "Anglais": { "_folder": true, "Syntaxe": { "_folder": true, "_mixed": true, "Conjonctions": [ Contents ], "Les temps": [ Contents ] }, "Vocabulaire": { "_folder": true, "_mixed": true, "Le monde du travail": [ Contents ], "Espace et situation": [ Contents ] } } }, "allContents": [ Contents ] }    
 */
exports.getUserCoCreatedContents = async (req, res) => { // Get all user CoCreated content => Library
    let conditions = {$and : [
        {cocreators: req.userId},
        {module: req.moduleId},
        {archivedByLibrarian: false},
    ]}
    if (req.role === 'Trainee') {
        conditions.$and.push({ $or: [
            {hideFromTrainees: false},
            {hideFromTrainees: {$exists: false}}
        ]})
    }
    let contents = await Content.find(conditions,
        {'title': 1, 'description': 1, 'owner': 1, 'level': 1, 'createdAt': 1, 'updatedAt': 1, 'cocreators': 1, 'contentType': 1, 'status': 1})
        .select("title contentType libraryStatus updatedAt owner level capsule chapter trainingModule")
        .populate({path: "owner", select: 'name surname'})
        .populate({path: "chapter", select: 'name'})
        .populate({path: "trainingModule", select: 'name'})
        .populate({path: "cocreators", select: 'name surname'})

    res.status(200).json({folders:folderizeContent(contents), allContents: contents});
};

exports.getMyContents = async (req, res) => { // Get all user CoCreated and owner , regardless of library and module
    let conditions = {$and : [
        {$or: [{cocreators: req.userId}, {owner: req.userId}]},
        {archivedByLibrarian: false},
    ]}
    // if (req.role === 'Trainee') {
    //     conditions.$and.push({ $or: [
    //         {hideFromTrainees: false},
    //         {hideFromTrainees: {$exists: false}}
    //     ]})
    // }
    // uncomment above conditions to get cocreated and owned contents
    let contents = await Content.find(conditions,
        {'pages': -1,})
        .select("title contentType libraryStatus updatedAt owner level capsule chapter trainingModule cocreators createdAt books tags")
        .populate({path: "owner", select: 'name surname'})
        .populate({path: "tags", select: 'name'})
        .populate({path: "books", select: 'name authors status', populate: {path: 'authors', select: 'name surname'}})
        // .populate({path: "chapter", select: 'name'})
        // .populate({path: "trainingModule", select: 'name'})
        .populate({path: "cocreators", select: 'name surname'})
        // .limit(100)

    res.status(200).json(contents);
};

exports.getAllContents = async (req, res) => {
    let moduleId = req.moduleId
    if(moduleId){
        let contents = await Content.find({ 
                module: moduleId,
                sendToLibrary: true,
                archivedByLibrarian: false,
                _id: {$nin: braincoreTestsIds},
            })
            .select("title contentType libraryStatus createdAt updatedAt owner description level archiveContentFromLibraryRequested")    
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

exports.getAwaitingContents = async (req, res) => {
    let moduleId = req.moduleId
    if(moduleId){
        let contents = await Content.find( {libraryStatus: ['AWAITING'], origin: {$exists: false}, chapter: {$exists: true}, trainingModule: {$exists: true}, module: moduleId, sendToLibrary: true}, // content must have chapter/subject when sent to Library
            {pages: 0})
            // .select("title contentType libraryStatus createdAt updatedAt owner description level")    
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

exports.getRejectedContents = async (req, res) => {
    let moduleId = req.moduleId
    if(moduleId){
        let contents = await Content.find( {libraryStatus: ['REJECTED'], origin: {$exists: false}, chapter: {$exists: true}, trainingModule: {$exists: true}, module: moduleId, sendToLibrary: true}, // content must have chapter/subject when sent to Library
            {pages: 0})
            .select("title contentType libraryStatus createdAt updatedAt owner description level")    
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

/**
 * @openapi
 * /api/v1/library/to-archive:
 *   get:
 *     description: Get all contents with flag `archiveContentFromLibraryRequested` set to true, so Librarian can eventually archive it
 *     tags:
 *       - _library 
 *     responses:
 *       200:
 *         type: object
 *         description: Return all content to be archived (`archiveContentFromLibraryRequested` set to true)
 *         example: { "folders": { "_folder": true, "Maths": { "_folder": true, "Probabilités et Statistiques": { "_folder": true, "_mixed": true, "61287f5ca4a86fab7c935a99": Content, "61288101a4a86f3fe2935b3b": Content, "Probabilité": [ Contents ], "Arbre de probabilité": [ Contents ] }, "Analyse": { "_folder": true, "_mixed": true, "6134fc161099981e319dad45": Content, "Fonctions": [ Contents ] } }, "Anglais": { "_folder": true, "Syntaxe": { "_folder": true, "_mixed": true, "Conjonctions": [ Contents ], "Les temps": [ Contents ] }, "Vocabulaire": { "_folder": true, "_mixed": true, "Le monde du travail": [ Contents ], "Espace et situation": [ Contents ] } } }, "allContents": [ Contents ] } 
 */

exports.getContentToArchive = async (req, res) => {
    let moduleId = req.moduleId
    if(moduleId){
        let contents = await Content.find( {archiveContentFromLibraryRequested: true, origin: {$exists: false}, chapter: {$exists: true}, trainingModule: {$exists: true}, module: moduleId, sendToLibrary: true}, // content must have chapter/subject when sent to Library
            {pages: 0})
            .select("title contentType libraryStatus createdAt updatedAt owner description level")    
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

exports.getAcceptedContents = async (req, res) => {
    let moduleId = req.moduleId
    if(moduleId){
        let contents = await Content.find( {libraryStatus: ['ACCEPTED'], origin: {$exists: false}, module: moduleId, sendToLibrary: true, archivedByLibrarian: false},
            {pages: 0})
            .select("title contentType libraryStatus createdAt updatedAt owner description level")    
            .populate({path: "owner", select: ['_id', 'username']})
        res.status(200).json(contents);
    } else res.status(200).json([])
};

// Requesting archiving of content from library - it must be accepted by the librarian
exports.requestArchiveOfContentFromLibrary = async (req, res) => {

    let content = await Content.findOneAndUpdate({ _id: req.params.contentId}, { $set: { archiveContentFromLibraryRequested: true }}, { returnOriginal: false, timestamps: false })
    res.status(200).json({ message: "Archiving of content requested successfully!" }); 
};

// Revoke request for archiving of content from library
exports.revokeArchiveOfContentFromLibrary = async (req, res) => {
    let content = await Content.findOneAndUpdate({ _id: req.params.contentId}, { $set: { archiveContentFromLibraryRequested: false }}, { returnOriginal: false, timestamps: false })
    res.status(200).json({ message: "Archiving of content request revoked successfully!" }); 
};

exports.manageContentStatus = async (req, res) => { // Action for editing single content
    // TODO: check if the user has access to modify this content!
    let content = {...req.body.content}
    var contentToReindex
    if(content.libraryStatus == "REJECTED") {
        var rejectedInLibraryAt = new Date().toISOString()
        contentToReindex = await Content.findOneAndUpdate(
            {_id: content._id},
            { $set: { libraryStatus: "REJECTED", approvedByLibrarian: false, rejectedInLibraryAt: rejectedInLibraryAt }},
            { runValidators: true, returnOriginal: false})
        contentToReindex.index();// Reindex in elasticsearch
        res.status(200).json({ message: "The content has been rejected successfully!" }); 
        let notification = await db.notification.create({
            name: "Content Rejected!",
            content: `Your content "${content.title}" has been rejected by the librarian!`,
            type: "COMMON",
            module: req.moduleId,
        })
        await db.user.updateOne({_id: content.owner}, 
            {$addToSet: {"settings.userNotifications":{
                isRead: false,
                notification: notification._id,
            }}})

        // remove rejected content from chapter
        await Chapter.findOneAndUpdate( 
            { _id: content.chapter },
            { $pull: { "assignedContent": content._id } },
            { runValidators: true })

    } else {
        if(!content.archivedByLibrarian) { 
            content.libraryStatus = "ACCEPTED" 
            content.approvedInLibraryAt = new Date().toISOString() // precaution 

            contentToReindex = await Content.findOneAndUpdate(// modify original
                { _id: content._id, origin: {$exists: false} },
                { $set:
                    {  libraryStatus: "ACCEPTED", 
                        approvedByLibrarian: true,
                        approvedInLibraryAt: content.approvedInLibraryAt,
                        version: 1}
                },
                { returnOriginal: false})
            contentToReindex.index();// Reindex in elasticsearch
        
            // add accepted content to chapter
            await Chapter.findOneAndUpdate( 
            { _id: content.chapter },
            { $push: { "assignedContent": content._id } },
            { runValidators: true })

            let notification = await db.notification.create({
                name: "Content Accepted!",
                content: `Your content "${content.title}" has been accepted by the librarian!`,
                type: "COMMON",
                module: req.moduleId,
            })
            await db.user.updateOne({_id: content.owner}, 
                {$addToSet: {"settings.userNotifications":{
                    isRead: false,
                    notification: notification._id,
                }}})
            res.status(200).json({ message: "The content has been approved successfully!" }); 
        }
        else
        {
            content.archivedInLibraryAt = new Date().toISOString()
            contentToReindex = await Content.findOneAndUpdate(
            { _id: content._id },
            { $set:
                { 
                archivedByLibrarian: true,
                archivedInLibraryAt: content.archivedInLibraryAt}
            },
            { returnOriginal: false})
            contentToReindex.index();// Reindex in elasticsearch
            res.status(200).json({ message: "The content has been archived successfully!" }); 
        }
    }
};

exports.getLibraryData = async (req, res) => {
    let today = new Date();
    let sixMonthAgo = new Date(new Date(today.setMonth(today.getMonth() - 6)).setDate(1));     

    let data = await db.content.aggregate([
        { "$match": {
            "createdAt": { "$gte": sixMonthAgo},
            "module": ObjectId(req.moduleId),
            // "contentType": "TEST",
            // "_id": {$nin: braincoreTestsIds}
        }},
        { "$group": {
            "_id": { 
                // "$year": "$createdAt",
                "$month": "$createdAt",
            },
            "total": { "$sum": 1 }, // count
            "accepted": { "$sum": { "$cond": [ 
                { "$and": [ 
                    { "$eq": [ "$libraryStatus", "ACCEPTED" ]}, 
                    { "sendToLibrary": true}, 
                    { "$ne": [ { "$type": "$origin" }, "objectId" ]},
                    { "$eq": [ { "$type": "$trainingModule" }, "objectId" ]},
                    { "$eq": [ { "$type": "$chapter" }, "objectId" ]},
                ]}, 1, 0 
            ] } },
            "rejected": { "$sum": { "$cond": [ 
                { "$and": [ 
                    { "$eq": [ "$libraryStatus", "REJECTED" ]},
                    { "sendToLibrary": true}, 
                    { "$ne": [ { "$type": "$origin" }, "objectId" ]},
                    { "$eq": [ { "$type": "$trainingModule" }, "objectId" ]},
                    { "$eq": [ { "$type": "$chapter" }, "objectId" ]},
                ]}, 1, 0 
            ] } },
            "awaiting": { "$sum": { "$cond": [ 
                { "$and": [ 
                    { "$eq": [ "$libraryStatus", "AWAITING" ]},
                    { "sendToLibrary": true}, 
                    { "$ne": [ { "$type": "$origin" }, "objectId" ]},
                    { "$eq": [ { "$type": "$trainingModule" }, "objectId" ]},
                    { "$eq": [ { "$type": "$chapter" }, "objectId" ]},
                ]}, 1, 0 
            ] } },
            // "other": $total - $accepted - $rejected - $awaiting,
        }},
        { "$sort": { "_id": 1 } }
    ]);
    return res.status(200).json(data);
}