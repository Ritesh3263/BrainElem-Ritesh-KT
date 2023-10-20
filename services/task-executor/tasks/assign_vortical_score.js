const TrainingModule = require('../models/training_module.model')
const Chapter = require('../models/chapter.model')
const ContentFile = require('../models/content_file.model')
const Interest = require('../models/interest.model')
const Subinterest = require('../models/subinterest.model')
const User = require('../models/user.model')
const Content = require('../models/content.model')

var axios = require('axios');


async function assignVorticalScore(userId, contentsIds, callback) {
    let user = await User.findById(userId),
    
    contentRecommendations = []
    if (!user) callback({ message: 'No user found!', ack: 1 })
    
    for (const contentId of contentsIds) {
      let content = await Content.findById(contentId)
      .populate([{path: 'chapter', select: ['name']},
                {path: 'pages.elements.file'},
                {path: 'trainingModule', select: ['name']}])
      // Make sure content and it's trainingModule and chapter exits
      if (!content || !content.trainingModule || !content.chapter) continue;
      try {
        let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/vortical/score`, {user: {user: user}, content: {content: content}})
        contentRecommendations.push({"score": response.data.score, "content": content._id})
      } catch (error) {
        console.error(error.message);
      }
    }

    user.contentRecommendations = contentRecommendations;
    user.save((err, user) => {
      if (!err){ 
       callback()
       console.log('Saving recommendation scores for user', userId)
      } else callback(err)
    });


}


module.exports = assignVorticalScore;
