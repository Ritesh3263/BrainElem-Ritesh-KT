const Result = require('../models/result.model')
const User = require('../models/user.model')

var axios = require('axios');


async function processResults(resultId, callback) {
  let results = await Result.findById(resultId).populate([{path: 'user'},{path: 'content', select: 'language'}])

  if (results) {
    let previousProcessedResults = await Result.findOne({ user: results.user, traits: { $exists: true, $ne: [] } }).sort({ createdAt: 'desc' })

    //Prepare graphql query


    let origin = results.data["100"]// New question about origin
    // For older results take origin from test's language
    if (!origin) origin = results.content.language.toUpperCase()
    // We have normalization for PL and FR - set FR as default one
    if (!origin || (origin!=='PL' && origin!=='FR')) origin = "FR"
    
    let age = results.data["2608"]// Pedagogy - value from 11-25(age)
    if (!age) age = results.data["9993"]// Adult - value from 1-5(id of age range)


    let sex = results.data["2607"]//Pedagogy -F=1 M=2
    if (!sex) sex = results.data["9992"]// Adult - M=1 F=2

    let query = `{ user(age: ${age}, sex: ${sex
      }, origin: "${origin}", answers: "${JSON.stringify(
        results.data
      ).replaceAll('"', '\\"')}")
                {
                  traits {
                    name
                    type
                    value
                    min
                    max
                    level
                    abbreviation
                    normalizedValue
                    normalizedValueBeforeScaling
                  }
                  profiles {
                    name
                    value
                  }
                  tips {
                    id
                    level
                  }
                }
              }`;

    //Send request to elia-algorithms to transform results into traits values.
    axios.post(`${process.env.ELIA_ALGORITHMS_URL}/graphql`, { query: query })
      .then(async (response) => {
        // # TRAITS #########################################
        var traits = {}
        response.data.data.user.traits.forEach(trait => {
          let newTrait = { type: trait.type, "value": trait.value, level: trait.level, min: trait.min, max: trait.max, abbreviation: trait.abbreviation, "normalizedValue": trait.normalizedValue, "normalizedValueBeforeScaling": trait.normalizedValueBeforeScaling }

          // If feedback exits, do not remove it
          if (results?.traits){
            let previousTrait = results?.traits[trait.name]
            if (previousTrait?.feedback) newTrait.feedback = previousTrait.feedback
          }
          traits[trait.name] = newTrait
        })
        results.traits = traits
        results.markModified('traits');

        // # PROFILES #######################################
        var profiles = {}
        response.data.data.user.profiles.forEach(profile => {
          profiles[profile.name] = profile.value
        })
        results.profiles = profiles

        // # Opportunities
        var opportunities = []

        // Find feedback from previous result if exits
        if (previousProcessedResults && previousProcessedResults.opportunities){
          opportunities = previousProcessedResults.opportunities
        }
        results.opportunities = opportunities
        results.markModified('opportunities');
        // # Tips #######################################
        var tips = []
        response.data.data.user.tips.forEach(tip => {
          let newTip = {_id: tip.id, level: tip.level}
          // If feedback exits, do not remove it
          let previousTip = results?.tips?.find(t=>t._id.toString()==tip.id)
          if (previousTip?.feedback) newTip.feedback = previousTip.feedback
          if (previousTip?.displayDate) newTip.displayDate = previousTip.displayDate

          tips.push(newTip)
        })
        results.tips = tips
        results.markModified('tips');

        results.save((err, user) => {
          if (!err) callback()
          else callback(err)
        });
      },
        (error) => {
          console.error("Error when connecting to elia-algorithms:", error.message)
          callback({ message: error.message, ack: 1 });
        });


  }
  else {
    callback({ message: 'No results found!', ack: 1 })
  }
}


module.exports = processResults;
