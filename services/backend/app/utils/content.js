var User = require('../models/user.model')
var Content = require('../models/content.model')
var ContentFile = require('../models/content_file.model')
const { getRawQueryForContent } = require("./searchEngine");
const tasker = require('../utils/tasker/tasker')


exports.populateContentFiles = async (content) => {
    // Load files' details from the database for content object before it's saved into database
    // It must be done before running AI algorithms as those algorithms uses `fileTextExtracted` fields
    for (let i = 0; i < content.pages.length; i++) {
      let page = content.pages[i]
      if (page.elements) {
        for (let j = 0; j < page.elements.length; j++) {
          let element = page.elements[j]
          if (element.subtype === 'file' && element.file) {
            // Replace ID with object
            element.file = await ContentFile.findOne({ '_id': element.file })
          }else if (element.file){
            delete element.file
          }
        }
      }
    }
    return content;
}


exports.shoudRefreshRecommendations = async (userId) => {

    var user = await User.findOne({_id: userId});
    if (user?.lastRecommendationsUpdate){
      let sinceLastUpdate = (new Date()) - user.lastRecommendationsUpdate
      // If previous update was within last X minutes, return false
      return (sinceLastUpdate > 1000*60*24);
    }

}

exports.findRecommendations = async (userId) => {
    // Update time of last update
    var user = await (User.findOne({_id:userId}).populate('details.subinterests'))
    user.lastRecommendationsUpdate = new Date();
    user.save(async (err) => {
      if (err) console.error("Could not update lastRecommendationsUpdate timestamp.")
      else {
        // Find 1000 contents for the user
        let rawQuery = await getRawQueryForContent(null, userId, null, 'true', null, 0, 1000)
        Content.esSearch(rawQuery, function (err, results) {
          if (err) console.error(err)
          else {
            let contentsIds = results.hits.hits.map((hit) => hit._id)
            tasker.addTask({task: "ASSIGN_VORTICAL_SCORE", userId: userId, contentsIds: contentsIds }, 'vortical',  (err) => {
                if (err) console.error(err)
            })
          }
        });
      }
    });
  }


exports.clearElements = (content) => {
  // Hide all details from content pages as they are not needed
  // We only need a type/subtype for each element in the content to dispaly tags
  let emptyPages = [];
  if (!content?.pages) return emptyPages;
  content.pages.forEach(page => {
    let elements = []
    page.elements.forEach(element => {
      elements.push({ type: element.type, subtype: element.subtype })
    })
    emptyPages.push({ elements: elements })
  })
  return emptyPages;
}