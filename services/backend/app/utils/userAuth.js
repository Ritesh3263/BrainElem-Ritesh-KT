const db = require('../models')


const hasCommonModule = async (user1, user2) => {
    // Check if user1 has access for any of modules of user2 except Universal BrainElem 
    let user1ModulesIds = (await user1.getModulesIds()).filter(id => id.toString() !== "200004000080000000000000");
    let user2ModulesIds = (await user2.getModulesIds()).filter(id => id.toString() !== "200004000080000000000000");
    let hasCommonModule = user1ModulesIds.some(u1m => user2ModulesIds.some(u2m => u2m.equals(u1m)))
    if (hasCommonModule) return true;
}

// Check if `user` can read information about another `requestedUser`
exports.canReadUser = async (userId, requestedUserId, moduleId=null) => {
    // If user is himself
    if (userId == requestedUserId) return true;
    // Find users
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    let requestedUser = await db.user.findOne({_id: requestedUserId}).catch((err) => false);
    
    if (!user) return false;
    // If administrator
    if (user.isAdmin()) return true;
    // If parent of that user
    if (user.details.children.some(childId => childId.equals(requestedUser._id))) return true;
    // If user is trainee
    if (user.isTrainee()) return false;
    // if (user.isTrainee() || user.isParent()) return false; // why parent can't read user?
    
    // Check if they share any module
    if (!requestedUser) return false;
    if (hasCommonModule(user, requestedUser)) {
        if (user.isAssistant()) {
            let permissions = user.settings.permissions?.assistant?.find(p => p.module.equals(moduleId))?.disallowed||[]
            if (permissions.includes("read-user")) return false;
        } else return true;
    }
    // #################################################################
    // Default
    return false;
}

// Check if user can train requested user(eg. if can add grade etc.).
exports.canTrainUser = async (userId, requestedUserId) => {
    // Find users
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    let requestedUser = await db.user.findOne({_id:requestedUserId}).catch((err) => false);
    // If administrator
    if (user.isAdmin()) return true;
    // If user is trainee or parent
    if (user.isTrainee() || user.isParent()) return false;
    // Check if they share any module
    if (hasCommonModule(user, requestedUser)) return true;
    // Default
    return false;
}

