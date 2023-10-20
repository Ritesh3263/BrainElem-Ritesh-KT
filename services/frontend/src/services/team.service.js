import {eliaAPI} from "./axiosSettings/axiosSettings";
import i18next from "i18next";
import ContentService from 'services/content.service';
const { randomAnswersForBrainCoreAdultTest, randomAnswersForBrainCorePedagogyTest } = require('services/randomAnswers')

const API_ROUTE = 'modules';

//Teams Api
//Teams List
const readAllTeam = () => {
  return eliaAPI.get(`teams`);
};

//Teams Users
const readTeamUsers=(teamId)=>{
  console.log("teamId",teamId)
  return eliaAPI.get(`teams/users/`+teamId)
}

//Add Team
const addTeam = ( newTeam) => {
  return eliaAPI.post(`teams`, newTeam);
};

//Edit Team
const editTeam = (role,id) => {
  return eliaAPI.patch(`teams/${id}`,role);
};

//get Team
const readTeam = (id) => {
  return eliaAPI.get(`teams/${id}`);
};
//Delete Team
const deleteTeam = (id) => {
  return eliaAPI.delete(`teams/${id}`);
};

const teamModule = (payload, type = "team-leader", lang) => {
  // If language is not provided take it from user settings
  if (!lang) lang = i18next.language || 'en'
  return eliaAPI.post(`users/traits?lang=${lang}`, payload);
}

// Generate demo team/class
// range <string> - range of answers for BrainCore test
// number - <int> - number of users to create inside team, max 15.
// isEdu - <boolean> - if true it will create results for EDU Tests
const generateDemoTeam = (range, number=1, isEdu=false) => {
  let date = new Date().toLocaleString('en-GB').slice(12,17)
  let teamName = `Demo HR-${range} (${date})`;
  if (isEdu) teamName = `Demo EDU-${range} (${date})`;
  let payload = []
  for (let i=0; i<number; i++){
    let answers;
    if (isEdu) answers = randomAnswersForBrainCorePedagogyTest(range) 
    else answers = randomAnswersForBrainCoreAdultTest(range)
    let contentId = ContentService.adultTestsIds[0]
    if (isEdu) contentId = ContentService.pedagogyTestsIds[0]
    
    let timeSpent = Math.floor(Math.random() * (2600 - 800 + 1)) + 800
    let result = {content: contentId, data: answers, timeSpent: timeSpent}
    payload.push(result)
  }
  return eliaAPI.post(`teams/generate/demo`, {name: teamName, results: payload});
}



const functions={
  readAllTeam,
  addTeam,
  editTeam,
  deleteTeam,
  readTeamUsers,
  readTeam,
  teamModule,
  generateDemoTeam
};

export default functions;