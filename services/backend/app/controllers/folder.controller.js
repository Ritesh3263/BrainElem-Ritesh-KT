const db = require("../models");
const Folder = db.folder;
const User = db.user;
const ObjectId = require("mongodb").ObjectId;

// AUTHORIZATION FUNCTIONS
const isMyFolder = async (folderId,userId) => {
    const folder = await Folder.findById(folderId);
    if (!folder) return false;
    return folder.creator.toString() === userId.toString();
}
const isInMyFolder = async (folderId,userId) => {
    const folder = await Folder.findById(folderId);
    if (!folder) return false;
    let currentFolder = folder;
    while (currentFolder.parent) {
        currentFolder = await Folder.findById(currentFolder.parent);
    }
    return currentFolder.creator.toString() === userId.toString();
}
// END AUTHORIZATION FUNCTIONS


// Get a folder by ID
module.exports.getFolder =  async (req, res) => {
    const folder = await Folder.findById(req.params.id).populate([
        {path: 'children'},
        {path: 'files', select: 'title contentType createdAt'},
    ]);
    if (!folder) {
      res.status(404).json({ message: `Folder with ID ${req.params.id} not found` });
    }
    else res.status(200).json(folder);
};
  
// Get all folders for a user
module.exports.getRootFolder = async (req, res ) => {
    let user = await User.findById(req.userId);
    let folderId = user.rootFolder;
    if (!user.rootFolder) {
        // create root folder
        folderId = new ObjectId();
        const folder = new Folder({
            _id: folderId,
            name: "Root folder",
            parent: null,
            children: [],
            files: [],
            creator: req.userId, //self
        });
        await folder.save().catch(err => console.log(err));
        user.rootFolder = folder;
        await user.save();
    }
    
    const folder = await Folder.findById(folderId).populate([
        {path: 'children'},
        {path: 'files', select: 'title contentType createdAt'},
    ]);
    res.status(200).json(folder);
};
  
// Create a new folder
module.exports.create = async (req, res) => {
    const folder = new Folder({...req.body, creator: req.userId, children: [], files: []});
    await folder.save();
    await Folder.findByIdAndUpdate(folder.parent, {$push: {children: folder._id}});
    res.status(201).json(folder);
};

// Update a folder
module.exports.update = async (req, res) => {
    // only update name
    if(await isMyFolder(req.params.id,req.userId) === false) 
        return res.status(401).json({ message: `You are not authorized to update this folder` });

    const folder = await Folder.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if (!folder) {
      res.status(404).json({ message: `Folder with ID ${req.params.id} not found` });
    }
    else res.status(200).json(folder);
};
  
// Delete a folder
module.exports.delete = async (req, res) => {
    if(await isInMyFolder(req.params.id,req.userId) === false)
        return res.status(401).json({ message: `You are not authorized to delete this folder` });

    // a function to delete a folder and all its children folders recursively
    const deleteFolder = async (folderId) => {
        const folder = await Folder.findByIdAndDelete(folderId);

        if (folder?.children.length > 0) {
            for (let i = 0; i < folder.children.length; i++) {
                await deleteFolder(folder.children[i]);
            }
        }
    }
    let deleted = null;
    if (req.query.type === 'FOLDER') {
            // delete all children folders and files recursively
            await deleteFolder(req.params.id);
            // remove folder from parent
            deleted = await Folder.findOneAndUpdate({}, {$pull: {children: req.params.id}});
    }
    else if (req.query.type === 'FILE') {
            deleted = await Folder.findByIdAndUpdate(req.params.id, {$pull: {files: req.query.fileId}});
    }
    else {
        res.status(400).json({ message: `Invalid type ${req.query.type}` });
    }
    if (!deleted) {
        res.status(404).json({ message: `${req.query.type} with ID ${req.params.id} not found`, deleted });
    }
    else res.status(200).json({ message: `Successfully deleted ${req.query.type}`, deleted });
};
  
// get folder tail
module.exports.getFolderTail = async (req, res) => {
    if(await isInMyFolder(req.params.id,req.userId) === false)
        return res.status(401).json({ message: `You are not authorized to view this folder` });
    // a function to get the parent of a folder if exists, recursively
    // make a list of all the folders in the path with folder name and _id
    // return the list as a json
    const folder = await Folder.findById(req.params.id);
    if (!folder) {
        res.status(404).json({ message: `Folder with ID ${req.params.id} not found` });
    }
    else {
        let tail = [];
        let currentFolder = folder;
        while (currentFolder.parent) {
            tail.push({name: currentFolder.name, _id: currentFolder._id});
            currentFolder = await Folder.findById(currentFolder.parent);
        }
        tail.push({name: currentFolder.name, _id: currentFolder._id});
        res.status(200).json(tail.reverse());
    }
}

// add contents to folder
module.exports.addContentsToFolder = async (req, res) => {
    if(await isInMyFolder(req.params.id,req.userId) === false)
        return res.status(401).json({ message: `You are not authorized to view this folder` });
    // add contents to folder
    // req.body is an array of content ids
    const folder = await Folder.findByIdAndUpdate(req.params.id, {$push: {files: {$each: req.body}}}, {new: true});
    if (!folder) {
        res.status(404).json({ message: `Folder with ID ${req.params.id} not found` });
    }
    else res.status(200).json(folder);
}