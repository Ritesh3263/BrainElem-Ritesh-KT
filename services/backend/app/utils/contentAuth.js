const db = require('../models')
const {braincoreTestsIds} = require('./braincoreTestsIds')
const { isTrainerFromGroup } = require("./groupAuth")

// CONTENT AUTHORIZATION
const isContentOwner = async (user, content) => {
    // Check if user is owner of the content
    return content.owner && content.owner.equals(user._id);
}

const isContentCocreator = async (user, content) => {
    // Check if user is cocreator of the content
    return content.cocreators && content.cocreators.includes(user._id);
}

const isContentInCurriculum = async (content) => {
    if(await db.trainingPath.findOne({"trainingModules.chosenChapters.chosenContents.content": content._id}, {_id:1})) return false;
    else return true;
}
const canAccessContentFromGroup = async (user, content) => {
    // Check if user can access content through one of his groups/shared-group
    let trainingPath = await db.trainingPath.findOne({"trainingModules.chosenChapters.chosenContents.content": content._id}, {_id:1})
    let contentSharedGroups = content.groups.map(g => g._id.toString())
    let userSharedGroups = await db.group.find({trainees: { $elemMatch: {$eq: user._id} }}, {"_id": 1})
    userSharedGroups = userSharedGroups.map(g => g._id.toString())
    if (userSharedGroups.some(x=>contentSharedGroups.includes(x))) return true // true: this user belongs to one of the groups where this content were shared with
    else if (trainingPath) { // empty trainingPath means this content doesn't belong to any group
        let contentGroup = await db.group.findOne({"program.duplicatedTrainingPath": trainingPath._id}, {_id:1})
        if (contentGroup){
            let userGroups = await db.group.find({trainees: { $elemMatch: {$eq: user._id} }}, {"_id": 1})
            return userGroups.some(x=>x._id.equals(contentGroup._id))
        } return false
    } else return false
}

const canAccessContentAsParent = async (childIds, content) => {
    let trainingPath = await db.trainingPath.findOne({"trainingModules.chosenChapters.chosenContents.content": content._id}, {_id:1})
    let contentSharedGroups = content.groups.map(g => g._id.toString())
    let userSharedGroups = await db.group.find({trainees: { $in : childIds }}, {"_id": 1})
    userSharedGroups = userSharedGroups.map(g => g._id.toString())
    if (userSharedGroups.some(x=>contentSharedGroups.includes(x))) return true // true: this user belongs to one of the groups where this content were shared with
    else if (trainingPath) { // empty trainingPath means this content doesn't belong to any group
        let contentGroup = await db.group.findOne({"program.duplicatedTrainingPath": trainingPath._id}, {_id:1})
        if (contentGroup){
            let userGroups = await db.group.find({trainees: { $in : childIds }}, {"_id": 1})
            return userGroups.some(x=>x._id.equals(contentGroup._id))
        } return false
    } else return false
}

const canAccessContentFromProgram = async (user, content) => {
    // Check if user can access content through one of his programs
    let trainingPath = await db.trainingPath.find({"trainingModules.chosenChapters.chosenContents.content": content._id}, {_id:1})
    let trainingPathIds = trainingPath.map(x=>x._id)
    let course = await db.course.find({"chosenChapters.chosenContents.content": content._id }, {_id:1})
    let courseIds = course.map(x=>x._id)
    let coursePath = await db.coursePath.find({"courses": { $in : courseIds }}, {_id:1})
    let coursePathsIds = coursePath.map(x=>x._id)

    if(trainingPath.length > 0) {
        const isExist = await db.group.exists({
            "program.duplicatedTrainingPath": { $in : trainingPathIds },
            $or: [
                {"program.assignment.trainers": user._id},
                {classManager: user._id},
                {trainees: user._id}
            ]
        });
        return isExist;
    }
    if(coursePath.length > 0) {
        if(user.settings.role === "Trainee" || (await user.getPermissions()).bcCoach.access) {
            // return true;
            //when trainee tries to open content in session in TRAINING 
            const isExist = await db.group.exists({
                "duplicatedCoursePath": { $in : coursePathsIds },
                $or: [
                    {trainees: user._id} 
                ]
            });
            return isExist;
        }
        else {
            //when examiner/trainer tries to open content in session in TRAINING 
            let groups = await db.group.find({"duplicatedCoursePath":  { $in : coursePathsIds }}, {_id:1})
            const isExist = await db.certificationSession.exists({
                "groups": { $in : groups },
                "examiners": user._id
            });
            return isExist;
        }
    }
    return false;
}

const canAccessContentFromLibrary = (user, content) => {
    // Check if content can be accessed through library
    return (content.sendToLibrary && content.libraryStatus === 'ACCEPTED') 
}

const isContentHidden = (user, content) => {
    // Chcek if content is hidden from the user
    return (user.isTrainee() && content.hideFromTrainees);
}

const isContentArchived = (content) => {
    // Check if content was archived by the librarian
    return content.archivedByLibrarian
}
exports.haveResults = async (userId, contentId) => {
    // Chek if user already have results for the content
    let user = await db.user.findOne({_id: userId})
    if (user.isAdmin()) return false;
    return await db.result.exists({'content': contentId,  event: { $exists:false }, 'user': userId})
}

exports.canRetake = async (userId, contentId) => {
    let content = await db.content.findById(contentId).exec()
    return content.allowMultipleAttempts
}

exports.isContentInsideModule = async (contentId, moduleId) => {
    // if (db.mongoose.isValidObjectId(contentId) && db.mongoose.isValidObjectId(moduleId)) { // checking if onJectId is valid otherwise may produce error
        let content = await db.content.findById(contentId).populate("origin").exec()
        let trainingModuleId = content.origin? content.origin.trainingModule:content.trainingModule
        return await db.moduleCore.exists({trainingModules:trainingModuleId, moduleId:moduleId})
    // }
    // else return false
}

exports.isContentApprovedInLibrary = async (contentId) => {
        let content = await db.content.findById(contentId).exec()
        return (content.libraryStatus === 'ACCEPTED')
}

exports.isContentInsideEcosystem = async (contentId, ecosystemId) => {
        let content = await db.content.findById(contentId).populate("origin").exec()
        let trainingModuleId = content.origin? content.origin.trainingModule:content.trainingModule
        let ecosystem = await db.ecosystem.findById(ecosystemId).exec()
        let moduleIds = await ecosystem.subscriptions.map(s=>s.modules.map(m=>m._id)).flat(2)
        return await db.moduleCore.exists({trainingModules:trainingModuleId, moduleId: moduleIds})
}

// exports.isLibrarian = async (userId, contentId) => {
//     // Chek if user already have results for the content
    
//     return await db.result.exists({'content': contentId, 'user': userId})
// }


// Check if user is owner/creator or cocrator
// return {status: <boolen>, message: <string>}
exports.isContentOwnerOrCocreator = async (userId, contentId) => {
    let user = await db.user.findOne({_id: userId})
    let content = await db.content.findById(contentId).catch((err) => false);
    if (await isContentOwner(user, content) || await isContentCocreator(user, content)) return {status: true}
    else return {status: false}
}

exports.canOverviewContent = async (userId, contentId, moduleId) => {
    // Allow accessing BrainCore test for everyone
    if (braincoreTestsIds.includes(contentId)) return {status: true};

    // Check if user can overview the content
    let user = await db.user.findOne({_id: userId})
    let content = await db.content.findById(contentId).catch((err) => false);
    if (!content) return {status: true}; // allowed but then controller be notifying user that content doesn't exist
    if(!user) return {status: false};

    if (user.isAdmin()) return {status: true};
    // Always allow if user has one of the following roles and module is correct 
    if (user.isEcoManager() || user.isCloudManager() || user.isNetworkManager() || user.isModuleManager() || user.isLibrarian() || user.isArchitect() || user.isInspector()) {
        if (content.module?.equals(moduleId)) return { status: true };
    }

    if (isContentArchived(content)) return {status: false, message: "ARCHIVED"};
    
    // This gives the trainers/teachers possibility to display the content in the program
    // It also gives the owner possibility to take his test as many times as he wants
    if ((await this.canExamineContent(userId, contentId)).status) return {status: true};

    // TRAINING TODO
    if (moduleId!=0){
        let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":moduleId}).exec()
        if((ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId))?.moduleType === "TRAINING") return {status: true}; // TODO - FOR THE MOMENT ALLOWING ON OVERVIEW IF TRAINING MODULE
    }
    
    if (isContentHidden(user, content)) return {status: false};
    let status = (await isContentOwner(user, content) ||
        await isContentCocreator(user, content) ||
        canAccessContentFromLibrary(user, content) ||
        await canAccessContentFromGroup(user, content)||
        await canAccessContentFromProgram(user, content) || 
        await canAccessContentAsParent(user.details.children, content)
        
    )
    return {status: status, message: status?"":"Can't overview this content"};
}

// Check if user can supervise contnet
// This includes examinatioon, `hideFromTrainees` opiton and locking/unlocking the elements visibility 
// return {status: <boolen>, message: <string>}
exports.canExamineContent = async (userId, contentId, moduleId) => {
    let content = await db.content.findById(contentId).catch((err) => false);
    let user = await db.user.findOne({_id: userId}).catch((err) => false);;
    if (!user || !content) return { status: false, message: "Requested data not found" };
    if (user.isAdmin()) return { status: true };
    // Always allow if user has one of the following roles and module is correct 
    if (user.isEcoManager() || user.isCloudManager() || user.isNetworkManager() || user.isModuleManager() || user.isLibrarian() || user.isArchitect() || user.isInspector()) {
        if (content.module?.equals(moduleId)) return { status: true };
    }

    if ((await this.canEditContent(userId, contentId)).status) return { status: true };

    let trainingPath = await db.trainingPath.findOne({ "trainingModules.chosenChapters.chosenContents.content": content._id }, { _id: 1 })
    if (trainingPath){
        let group = await db.group.findOne({"program.duplicatedTrainingPath": trainingPath._id})
        if (group && await isTrainerFromGroup(userId, group._id)){
            return {status: true}
        }
    }
    let status = (await isContentOwner(user, content) ||
        await isContentCocreator(user, content)
    )
    return { status: status, message: !status ? "Can't examinate this content" : "" };
}

// return {status: <boolen>, message: <string>}
exports.canDisplayContent = async (userId, contentId, moduleId) => {
    // Allow accessing BrainCore test for everyone
    if (braincoreTestsIds.includes(contentId)) return {status: true};

    let content = await db.content.findById(contentId).catch((err) => false);
    let user = await db.user.findOne({_id: userId}).catch((err) => false);;
    if (!user || !content) return {status: false, message: "Requested data not found"};
    if (user.isAdmin()) return {status: true};

    console.log("🚀 ~ sample usage => user.getPermissions():", await user.getPermissions())
    // Always allow if user has one of the following roles and module is correct 
    if (user.isEcoManager() || user.isCloudManager() || user.isNetworkManager()  || user.isModuleManager() || user.isAssistant() || user.isLibrarian() || user.isArchitect() || user.isInspector()){
        if (content.module?.equals(moduleId)) return {status: true};
    }



    if (isContentArchived(content)) return {status: false, message: "ARCHIVED"};

    // This gives the trainers/teachers possibility to display the content in the program
    // It also gives the owner possibility to take his test as many times as he wants
    if ((await this.canExamineContent(userId, contentId)).status) return {status: true};
    // check if content is test type
    if (content.contentType === "TEST" 
        && await this.haveResults(userId, contentId) 
        && !(await this.canRetake(userId, contentId))
        && !(content.allowExtraAttemptFor.includes(userId))
        ) return {status: false, message: "Test was already taken."}
    // Check if user can display/start the content
    if (isContentHidden(user, content)) return {status: false};

    let status = (await isContentOwner(user, content) ||
        await isContentCocreator(user, content) ||
        canAccessContentFromLibrary(user, content) ||
        await canAccessContentFromGroup(user, content) ||
        await canAccessContentFromProgram(user, content)
    )
    return {status: status, message: !status ? "Can't display this content" : ""};
}

// Check if user can edit or remove content
// return {status: <boolen>, code: <number>, message: <string>}
exports.canEditContent = async (userId, contentId) => {
    // Check if user can edit the content
    let user = await db.user.findOne({_id: userId}).catch((err) => false);;
    let content = await db.content.findById(contentId).catch((err) => false);;
    if (!user || !content) return {status: false, message: `Data does not exists in database. userId ${userId} contentId: ${contentId}`};
    if (user.isAdmin()) return {status: true};
    let ecosystemId = (user.scopes.find(e => e.name.match('ecosystems:')))?.name.split(":").pop()
    let status = !(await this.isContentApprovedInLibrary(contentId)) 
    && (await isContentOwner(user, content) 
    || await isContentCocreator(user, content))

    return {status: status, message: !status ? "You are not authirized to access this content" : ""};
}


// can teach trainingModule
exports.canTeachTrainingModule = async (userId, trainingModuleId) => {
    let group = await db.group.findOne({"program.assignment.trainingModule":trainingModuleId, "program.assignment.trainers": { $elemMatch: {$eq: userId} }}).exec()
    for (let i = 0; i < group.program.length; i++) {
        if (group.program[i].assignment.some(x=>(x.trainingModule.equals(trainingModuleId)&&x.trainers.includes(y=>y.equals(userId))))) return true;
    }
    if (await db.group.exists({"program.assignment.trainingModule":trainingModuleId, classManager: userId})) return true;
    // add more logic here to check if user can read the trainingModule
    return false;
}

// can access trainingModule via module
exports.canAccessTrainingModuleViaModule = async (trainingModuleId, moduleId) => {
    if (await db.moduleCore.exists({moduleId: moduleId, trainingModules: {$in: trainingModuleId}})) return true;
    let groups = await db.group.find({"program.assignment.trainingModule":trainingModuleId}).exec()
    let groupIds = groups.map(g=>g._id)
    if (await db.moduleCore.exists({moduleId: moduleId, groups: {$in: groupIds}})) return true;
    return false;
}

// can access chapter via module
exports.canAccessChapterViaModule = async (chapterId, moduleId) => {
    // Training Center fix
    let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":moduleId}).exec()
    if((ecosystem?.subscriptions.find(s=>s.modules.id(moduleId))?.modules.id(moduleId))?.moduleType === "TRAINING") return true;  // TODO - FOR THE MOMENT ALLOWING ON EDIT IF TRAINING MODULE
    let core = await db.moduleCore.findOne({moduleId}).exec()
    if (core.trainingPaths.length==0) return true;// special bypass if no training path is set in the core
    let trainingPaths = await db.trainingPath.find({"trainingModules.chosenChapters.chapter": chapterId}).exec()
    let trainingPathIds = trainingPaths.map(tp=>tp._id) // can add original trainingPathIds from here as well if needed
    if (await db.moduleCore.exists({moduleId: moduleId, trainingPaths: {$in: trainingPathIds}})) return true;
    return false;
}