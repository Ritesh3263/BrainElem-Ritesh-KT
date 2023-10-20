// Utils for managing credits

const db = require('../models')
const { isSpecialModule, isMarksModuleManager, isMarksModule } = require("./module");
const cognitiveUtils = require("./cognitive");




// Get initial number of available  credits for user
// This will allow to set some initial value for some modules
// For example for Mark module it was requested that all users have 5 credits by default
// userId - user for who credits will be deducted
// moduleId - module in which credits will be deducted
// creditType - type of the credit
exports.getInitialCreditNumber = (userId, moduleId, creditType = 'BRAINCORE_TEST') => {
  // For coaches in Mark's module but not for Mark himself
  if (!isMarksModuleManager(userId) && isMarksModule(moduleId)) return 5
  else if (isSpecialModule(moduleId) || isMarksModuleManager(userId)) return 100
  else return 0
}


// Get data about credits for a user
// user - user for who data will be returned
// moduleCore - module core in which credits are stored
// creditType - type of the credit
exports.getCreditData = (user, moduleCore, creditType = 'BRAINCORE_TEST') => {

  let available = exports.getAvailableCreditNumber(user._id, moduleCore, creditType)
  let used = exports.getUsedCreditNumber(user._id, moduleCore, creditType)
  let percentage = exports.getUsedCreditPercentage(user._id, moduleCore, creditType)
  let requested = 0
  let requestedDate = '-'
  let requestedStatus = '-'
  let userName = user.name + " " + user.surname
  if (user.name == '_') userName = user.email

  let data = { id: user._id, user: userName, available: available, used: used, percentage: percentage, requested: requested, requestedDate: requestedDate, requestedStatus: requestedStatus }
  return data
}

// Get number of available credits for user
// This will allow to set some initial value for some modules
// For example for Mark module it was requested that all users have 5 credits by default
// userId - user for who credits will be deducted
// moduleCore - module core in which credits will be deducted
// creditType - type of the credit
exports.getAvailableCreditNumber = (userId, moduleCore, creditType = 'BRAINCORE_TEST') => {
  let index = moduleCore.credits.findIndex(c => { return c.user == userId.toString() && c.creditType == creditType })
  if (index >= 0) {
    return moduleCore.credits[index]?.available// Credits counter already exits for the user
  } else if (index == -1) {// Credits counter does not exists for this user
    let initCredits = exports.getInitialCreditNumber(userId, moduleCore.moduleId)
    return initCredits
  }
}

// Get number of used credits for user
// This will allow to set some initial value for some modules
// For example for Mark module it was requested that all users have 5 credits by default
// userId - user for who credits will be deducted
// moduleCore - module core in which credits will be deducted
// creditType - type of the credit
exports.getUsedCreditNumber = (userId, moduleCore, creditType = 'BRAINCORE_TEST') => {
  let index = moduleCore.credits.findIndex(c => { return c.user == userId.toString() && c.creditType == creditType })
  if (index >= 0) {
    return moduleCore.credits[index]?.used ?? 0// Credits counter already exits for the user
  } else return 0
}

// Get percentage of used credits for user
// This will allow to set some initial value for some modules
// For example for Mark module it was requested that all users have 5 credits by default
// userId - user for who credits will be deducted
// moduleCore - module core in which credits will be deducted
// creditType - type of the credit
exports.getUsedCreditPercentage = (userId, moduleCore, creditType = 'BRAINCORE_TEST') => {
  let available = exports.getAvailableCreditNumber(userId, moduleCore, creditType)
  let used = exports.getUsedCreditNumber(userId, moduleCore, creditType)
  let percentage = 100
  if (available > 0) percentage = 100 * used / (available + used)
  return percentage
}


// Check if user has available credits
// userId - user for who credits will be deducted
// moduleId - module in which credits will be deducted
// creditType - type of the credit to deduct
exports.haveCredits = async (userId, moduleId, creditType = 'BRAINCORE_TEST') => {
  let core = await db.moduleCore.findOne({ moduleId: moduleId })
  if (!core) return false
  let available = exports.getAvailableCreditNumber(userId, core, creditType)
  return available > 0 ? true : false
}

// Deduct available credits from the pool
// userId - user for who credits will be deducted
// moduleId - module in which credits will be deducted
// number - number of credits to be deducted
// countUsed - when true it will increase the `used` counter
// creditType - type of the credit to deduct
exports.deductCredits = async (userId, moduleId, number = 1, countUsed = true, creditType = 'BRAINCORE_TEST') => {
  let core = await db.moduleCore.findOne({ moduleId: moduleId })
  let index = core.credits.findIndex(c => { return c.user.toString() == userId.toString() && c.creditType == creditType })
  if (index >= 0 && core.credits[index].available >= number) {// Credits counter found
    core.credits[index].available = core.credits[index]?.available - number
    if (countUsed) core.credits[index].used = core.credits[index]?.used + number
    await core.save()
  } else if (index == -1) {// Credits counter does not exists for this user
    let initCredits = exports.getInitialCreditNumber(userId, moduleId)
    if (initCredits >= number) {
      let credit = { user: userId, used: 0, available: initCredits - number, creditType: creditType }
      if (countUsed) credit.used = number
      core.credits.push(credit)
      await core.save()
    }
  }
}


// Unblock BrainCore test results which were blocked by unsufficient credits
// userId - user for who credits will be assigned
// creditObj - object to update
//
// it returns updated `creditObj`
exports.unblockResults = async (userId, creditObj) => {
    // If no available credits
    if (creditObj.available==0) return creditObj
    
    // Find blocked results
    let results = await db.result.find({ inviter: userId, blockedByCredits: true}).sort({ createdAt: 1 });
    if (!results) return creditObj


    for (let result of results.slice(0, creditObj.available)) {
      creditObj.used+=1
      creditObj.available-=1
      result.blockedByCredits = false// true // for testing
      await result.save()
    }

    return creditObj
}

// Assign credits to the pool
// userId - user for who credits will be assigned
// moduleId - module in which credits will be assigned
// number - number of credits to be assigned
// creditType - type of the credit to add
exports.assignCredits = async (userId, moduleId, number = 1, creditType = 'BRAINCORE_TEST') => {
  let available = 0;
  let core = await db.moduleCore.findOne({ moduleId: moduleId })
  let index = core.credits.findIndex(c => { return c.user.toString() == userId.toString() && c.creditType == creditType })
  if (index >= 0) {// Credits counter found
    core.credits[index].available = core.credits[index].available + number
    core.credits[index] = await exports.unblockResults(userId, core.credits[index])
  } else if (index == -1) {// Credits counter does not exists for this user
    let initCredits = exports.getInitialCreditNumber(userId, moduleId)
    if (initCredits >= number) {
      available = initCredits + number
      let creditObj = { user: userId, used: 0, available: available, creditType: creditType }
      core.credits[index] = await exports.unblockResults(userId, creditObj)
      core.credits.push(creditObj)
    }
  }


  await core.save()


}
