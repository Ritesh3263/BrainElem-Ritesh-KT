const db = require('../models')
const cognitiveUtils = require("./cognitive");




// Temporary function as currently Kamil/Ahsan are working on global changes for roles
// So I dont want to modify the functions in user.model
const isModuleAdministrator = (user) => {
  let role = user.settings?.roleMaster
  if (typeof role === 'object' && role !== null) role = role._id
  return role?.toString() == "63c8f1cb88bbc68cce0eb2ea"
}



// For each user in team assign
// team - team to check
exports.checkBlockedByCreditsForUsers = async (team)=>{
    let teamToReturn = {...team}
    for (var i = 0; i < teamToReturn.trainee.length; i++) {
      let user = teamToReturn.trainee[i]
      let blockedByCredits = await cognitiveUtils.isBlockedByCredits(user._id);
      teamToReturn.trainee[i].blockedByCredits = blockedByCredits
    }
    return teamToReturn
}

// Return all teams in module for which user has access
// if user role is Administrator then return all teams
// otherwise chek enabledTeams propery
// Parameters:
// <userId> - id of user who is requesting data
// <moduleId> - id of active module
// <checkBlockedByCredits> - when true, it will add propery about users being blocked by credits
exports.getAllTeamsInModule = async (userId, moduleId, checkBlockedByCredits=true) => {
  let teams;
  let user = await db.user.findOne({ _id: userId })
  let populate = [{path:"trainee", select: "name surname username brainCoreTest email"}]

  if (isModuleAdministrator(user)) {
    teams = await db.team.find({status: {$ne: "deleted"}, module: moduleId})
    .populate(populate).lean();
  } else {
      teams = await db.team.find({_id: {$in: user && user.enabledTeams || []}, status: {$ne: "deleted"}, module: moduleId})
      .populate(populate).lean();
  }

  // Check which user is blocked by yser
  if (checkBlockedByCredits) {
    for (let t = 0; t < teams.length; t++) {
      teams[t] = await exports.checkBlockedByCreditsForUsers(teams[t])
    }
  }

  return teams
}

// Return all users in module for which user has permission
// Parameters:
// <userId> - id of user who is requesting data
// <moduleId> - id of active module
// <loadLatestBrainCoreTestResult> - when true it will load the the latest BrainCore Test Result
// <loadCredits> - if should load credits informations
exports.getAllUsersInModule = async (userId, moduleId, loadLatestBrainCoreTestResult=true, loadCredits=false) => {
    const matchAllScopeActions = "^modules:.*?" + moduleId + "$";
    let users = await db.user.find(
        { "scopes.name": { $regex: matchAllScopeActions, $options: "i" } },
        "username name surname email createdAt details settings teams brainCoreTest creator")
        .populate([
            { path: "settings.roleMaster", select: ["_id", "name"] },
            { path: "settings.availableRoleMasters", select: ["_id", "name"] },
            { path: "settings.defaultRoleMaster", select: ["_id", "name"] },
            { path: "teams", select: ["name"] },
            { path: "enabledTeams", select: ["name"] }
          ])



    let user = await db.user.findOne({ _id: userId })
    if (user.isCognitiveCenterUser) {
        // https://brainelem.atlassian.net/browse/COG-577?focusedCommentId=11380
        // Users with Adminministrator role
        // have Unrestricted access and will receive a complete list of all users, 
        // regardless of their team assignments or creators
        //
        // Users without Adminministrator role
        // will be provided with two categories of users: 
        // users belonging to their teams and users directly created by them.

        if (isModuleAdministrator(user)) {}
        else{
            // Users belonging to managed teams
            const teams = await user.getEnabledTeams();
            const allTraineeIds = [].concat(...teams.map(obj => obj.trainee));

            // Users directly created
            users = users.filter(u => u?.creator == userId || u?._id == userId || allTraineeIds.some(id => id.equals(u._id)))
        }
    }


    let usersToReturn = []
    for (let user of users) {
      user = user.toObject()
      user.isModuleAdministrator = isModuleAdministrator(user)
      if (loadLatestBrainCoreTestResult){// Find latest processed result for BrainCore test
        let latestResult = await cognitiveUtils.getLatestBrainCoreResultForUser(user._id, { _id: 1, createdAt: 1, blockedByCredits: 1, inviter: 1, awayTime: 1, inactiveTime: 1, timeSpent: 1, content: 1});
        user.latestBrainCoreTestResult = latestResult
        user.latestBrainCoreTestResultId = latestResult?._id
      }

      usersToReturn.push(user)
    }

    return usersToReturn
}





// Check if module is one of the Mark's modules
exports.isMarksModule = (moduleId) => {
  return ['6478992a0d8465000823c0de', '6478992a0d8465000823c0e1'].includes(moduleId.toString())
}

// Check if this is Mark himself
exports.isMarksModuleManager = (userId) => {
  return ['647899100d8465000823c0b2'].includes(userId.toString())
}

// Check if module is Leysin American School
exports.isLasModule = (moduleId) => {
  return ['6500102ab4bd2c00085a6d97', '6500102ab4bd2c00085a6d9a'].includes(moduleId.toString())
}

// Check if module is Nemesis module
exports.isNemesisModule = (moduleId) => {
  return ['64e3a58b6c44140008df5f9f', '64e3a58b6c44140008df5fa2'].includes(moduleId.toString())
}

// Check if user is manager of MarketingModule
exports.isMarketingManager = (userId) => {
  return ['647341a34cb13b00085b651f'].includes(userId)
}

// Check if module is one of the Marketing modules
exports.isMarketingModule = (moduleId) => {
  return ['647341fe4cb13b00085b6589', '647341fe4cb13b00085b658c'].includes(moduleId.toString())
}

// Check if module is one of the BrainElem modules
exports.isBrainElemModule = (moduleId) => {
  return ['64636798e9c0fb0027312214', '64636798e9c0fb0027312217'].includes(moduleId.toString())
}


// Check if module is one of the JJPriv modules
exports.isJJPrivModule = (moduleId) => {
  return ['648c395b80f95e000884cf8e', '648c395b80f95e000884cf91'].includes(moduleId.toString())
}

// Check if module is one of the initial development modules
exports.isInitialSentinelModule = (moduleId) => {
  return ['333000000000000000000000'].includes(moduleId.toString())
}

// Check if module is educational type
// Special modules does not have limitation
exports.isSpecialModule = (moduleId) => {
  return (  exports.isNemesisModule(moduleId) || 
      exports.isLasModule(moduleId) ||
      exports.isMarketingModule(moduleId) || 
      exports.isBrainElemModule(moduleId) ||
      exports.isJJPrivModule(moduleId) || 
      exports.isInitialSentinelModule(moduleId))

}

// Check if module is educational type
exports.isEdu = async (moduleId) => {
  return exports.isNemesisModule(moduleId.toString()) || exports.isLasModule(moduleId.toString())
}
