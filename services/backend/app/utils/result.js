const db = require('../models')
const axios = require('axios');
var https = require('https');

var Result = require('../models/result.model')
var ModuleCore = require('../models/module_core.model')
const {adultTestsIds, pedagogyTestsIds} = require("./braincoreTestsIds");
const moduleUtils = require('./module')

const cognitiveUtils = require("./cognitive");

function round(number){
    return Math.round(number * 100) / 100
  }


const prices = {
  'BRIANCORE_ADULT_TEST_FOR_INDIVIDUAL': {
    'EUR': 19.99,
    'USD': 19.99,
    'CHF': 19.99,
    'PLN': 99.99
  },
  'BRIANCORE_PEDAGOGY_TEST_FOR_INDIVIDUAL': {
    'EUR': 19.99,
    'USD': 19.99,
    'CHF': 19.99,
    'PLN': 99.99
  }

}

exports.getPrice = async (resultId, currencyCode) => {
  // Check type of the result
  let result = await Result.findById(resultId, {content: 1})
  let type;
  if (adultTestsIds.includes(result.content.toString())) type = 'BRIANCORE_ADULT_TEST_FOR_INDIVIDUAL'
  else if (pedagogyTestsIds.includes(result.content.toString())) type = 'BRIANCORE_PEDAGOGY_TEST_FOR_INDIVIDUAL'
  return prices[type] ? prices[type][currencyCode] : undefined
}


// Check if reault(full report) was purchased 
exports.hasAccessToFullReport = async (userId, resultId) => {
  let user = await db.user.findOne({_id: userId})

  // Users who participated in 1 and 2 phase of calibration test have resultId the same as userId. 
  // Those users should be able to access full reports for free
  if (userId == resultId) return true
  else {// Find completed(payed) order which includes this result
    let completedOrder = await db.order.findOne({user: user._id,  results: resultId, status: 'COMPLETED'})
    if (completedOrder) return true
  }

  // SPECIAL MODULES
  // Do not require payment for PDF report

  let userModules = await user.getModules()
  for (let module of userModules) {
    if (moduleUtils.isMarksModule(module._id.toString())) return true
    if (moduleUtils.isSpecialModule(module._id.toString())) return true//Eg. nemesis
  }

  return false
}





// Get statistics for results of content/event
// - users - list of users for which statistics will be provided
// - moduleId - to find gradingScale
// - contentId - id of content for which statistics will be provided
// - eventId - optional - event for which statistics will be provided
exports.getStats = async (users, moduleId, contentId, eventId) => {
    // Prepare list of attendees
    var attendees = [];
    // Find grading-scale
    var moduleCore = await ModuleCore.findOne({ moduleId: moduleId }).populate(['gradingScales', 'defaultGradingScale'])
    var gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0] || null
    for (const t of users) {
      var attendee = t.toObject();
      let conditions = { user: attendee._id}
      if (eventId) conditions.event = eventId
      else{ // Only results not associated with event
        conditions.event = { $exists:false }
        conditions.content = contentId
      }
      attendee.results = await Result.find(conditions).sort('-createdAt').exec()
      // Check if user passed or failed
      if (attendee.results.length) attendee.passed = attendee.results[0].percentage >= gradingScale.passPercentage
      // How many attempts
      attendee.attempts = attendee.results ? attendee.results.length : 0;
      attendees.push(attendee)
    }
  
    // Filter only attendees who already have results
    let attendeesWithResults = attendees.filter(t => t.results.length)
    if (attendeesWithResults.length) {
      var latestGrades = attendeesWithResults
        .filter(t => t.results[0].grade !== undefined && t.results[0].grade !== null)
        .map(t => { return parseFloat(t.results[0].grade.replace(",", ".")) })
      var averageGrade = latestGrades.length && latestGrades.reduce((a, b) => a + b, 0) / latestGrades.length;
  
      let latestPoints = attendeesWithResults.map(t => t.results[0].points)
      var averagePoints = latestPoints.length && latestPoints.reduce((a, b) => a + b, 0) / latestPoints.length
  
      var latestTimeSpent = attendeesWithResults.map(t => t.results[0].timeSpent)
      var averageTimeSpent = latestTimeSpent.length && latestTimeSpent.reduce((a, b) => a + b, 0) / latestTimeSpent.length;
    }
  
    // Sort alphabetically
    attendees.sort((a,b)=>{return a.name.localeCompare(b.name)})
    // First show attendees with results
    let attendeesWithResult = attendees.filter(a=>a.attempts)
    let attendeesWithoutResult = attendees.filter(a=>!a.attempts)
    attendees = attendeesWithResult.concat(attendeesWithoutResult)

    return {
      attendees: attendees,
      averageGrade: round(averageGrade),
      averagePoints: round(averagePoints),
      averageTimeSpent: round(averageTimeSpent),
      took: attendeesWithResults.length,
      passed: attendeesWithResults.filter(t => t.passed).length,
      failed: attendeesWithResults.filter(t => !t.passed).length
    }
  }