//import axios from "axios";
//import authHeader from "./auth-header";
import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'logs';



const finishTutorial = () => {
    return eliaAPI.post(API_ROUTE + "/finishTutorial");
};

const logAction = (name, logDetails) => {
  return eliaAPI.post(`${API_ROUTE}/actions/${name}`, { logDetails: logDetails });
};

const logTime = async (details) => {
  // testing demos
  // console.log(await eliaAPI.get(`dashboard_stats/top-low-results/611ab380d26a78c075422076/61287dcaa4a86f7e35934a11`));
  // console.log(await eliaAPI.get(`dashboard_stats/top-low-time-spent/611ab380d26a78c075422076`));
  // console.log(await logByDay(7)) // test logByDay, uncomment to test with each time logTime is called
  // console.log(await getClusteredLogs(null,3)) // test getClusteredLogs, uncomment to test with each time logTime is called
  // logByDate('889979999999900000000001') // test logByDate, uncomment to test with each time logTime is called
  // countLogins('889979999999900000000001') // test countLogins, uncomment to test with each time logTime is called
  // console.log(await mostVisitedPages()) // test mostVisitedPages, uncomment to test with each time logTime is called
  // console.log(await loginCount(null,'week')) // test loginCount, uncomment to test with each time logTime is called
  // console.log(await averageContentCreationTime()) // test averageContentCreationTime, uncomment to test with each time logTime is called
  // console.log(await timeSpentCreatingContent(null,"day")) // test timeSpentCreatingContent, uncomment to test with each time logTime is called 
  // console.log(await eliaAPI.get(`commonData/popular/content`)) // test popularContent, uncomment to test with each time logTime is called
  // console.log(await eliaAPI.get(`commonData/popular/subjects`)) // test popularSubjects, uncomment to test with each time logTime is called
  return eliaAPI.post(`${API_ROUTE}/time`, details);
};

// get average active time
const logByDay = (userId, days) => { // default 30 days
  if (userId && days) return eliaAPI.get(`${API_ROUTE}/logByDay/${userId}/${days}`);
  else if (userId||days) return eliaAPI.get(`${API_ROUTE}/logByDay/${userId||days}`);
  else return eliaAPI.get(`${API_ROUTE}/logByDay`);
};

const getClusteredLogs = (userId, days) => {
  if (userId && days) return eliaAPI.get(`${API_ROUTE}/clusteredLogs/${userId}/${days}`);
  else if (userId||days) return eliaAPI.get(`${API_ROUTE}/clusteredLogs/${userId||days}`);
  else return eliaAPI.get(`${API_ROUTE}/clusteredLogs`);
};

const logByDate = (userId, date) => {
  if (userId && date) return eliaAPI.get(`${API_ROUTE}/logByDate/${userId}/${date}`);
  else if (userId||date) return eliaAPI.get(`${API_ROUTE}/logByDate/${userId||date}`);
  else return eliaAPI.get(`${API_ROUTE}/logByDate`);
};

const countLogins = (userId, date) => {  
  return eliaAPI.get(`${API_ROUTE}/countLogins/${userId}/${date}`);
};

// Start tracking user 
//  * log - boolean - log details in the console
const trackUser = (callback, interval, log=false) => {
  var away = false; // User is away(left the website)
  var inactive = false; // User is inactive(no activity of mouse/keybord etc.)

  var becameAway = false; // Indicates that user just became away, only until first interval
  var becameInactive = false; // Indicates that user just became inactive, only until first interval
  
  var timeInInterval = 0; // Total time of the interval
  var awayTimeInInterval = 0;// For how long user was away in the interval
  var inactiveTimeInInterval = 0;// For how long user was inactive in the interval

  var awayCountInInterval = 0; // How many times user was away in the interval
  var inactiveCountInInterval = 0; // How many times user was inacitve in the interval

  var startInterval// Time of starting interval
  var startAwayInterval; // Time of becoming away
  var startInactiveInterval;// Time of becoming inactive

  async function track() {
    // Initial values
    let now = performance.now();
    
    timeInInterval = ((now - startInterval) / 1000) || 0;
    let awayTimeIncrease = (now - startAwayInterval) / 1000;
    let inactiveTimeIncrease = (now - startInactiveInterval) / 1000;

    if (away && becameAway) {
      log && console.log(`Away time increased: ${awayTimeIncrease.toFixed(2)} sec.`)
      awayTimeInInterval += awayTimeIncrease;
    } else if (away) {
      log && console.log(`User still away, time increased: ${awayTimeIncrease.toFixed(2)} sec.`)
      awayTimeInInterval += awayTimeIncrease
    } else if (inactive && becameInactive) {
      log && console.log(`Inactive time increased:, ${inactiveTimeIncrease.toFixed(2)} sec.`)
      inactiveTimeInInterval += inactiveTimeIncrease;
    } else if (inactive) {
      log && console.log(`User still inactive, time increased: ${inactiveTimeIncrease.toFixed(2)} sec.` )
      inactiveTimeInInterval += inactiveTimeIncrease
    }

    log && console.log(`--- > Interval took ${timeInInterval.toFixed(2)} sec.`)
    log && console.log(`--- > In this interval user was away for ${awayTimeInInterval.toFixed(2)} sec.`)
    log && console.log(`--- > In this interval user was inactive for ${inactiveTimeInInterval.toFixed(2)} sec.\n\n\n\n`)
    
    // Call callback passed as argument
    await callback(timeInInterval, awayTimeInInterval, inactiveTimeInInterval, awayCountInInterval,inactiveCountInInterval)

    // Reset values
    becameAway = false;
    becameInactive = false;

    timeInInterval = 0
    awayTimeInInterval = 0
    inactiveTimeInInterval = 0

    awayCountInInterval = 0;
    inactiveCountInInterval = 0;

    now = performance.now();
    startInterval = now
    startAwayInterval = now;
    startInactiveInterval = now;

  }

  // Start process of detecting presence
  var stopTrackPresence = trackPresence(
    () => {//  User away
      away = true;
      inactive = false;
      awayCountInInterval += 1;
      becameAway = true;
      startAwayInterval = performance.now();
      log && console.log('User left, start counting time.')
    },
    () => { // User back
      away = false;
      inactive = false;
      let awayTimeIncrease = (performance.now() - startAwayInterval) / 1000;
      log && console.log(`User is back after: ${awayTimeIncrease.toFixed(2)} sec.`)
      awayTimeInInterval += awayTimeIncrease;
    }
  )

  // Start process of detecting activity
  var inactivityIntervalTime = 5
  var inactivityThreshold = 15
  var stopTrackActivity = trackActivity(
    () => { // User inactive
      if (!away) {
        inactive = true;
        inactiveCountInInterval += 1;
        becameInactive = true;
        startInactiveInterval = performance.now();
        inactiveTimeInInterval += inactivityThreshold// First
        log && console.log('User became inactive, start counting time...')
      }
    },
    () => { // User active

      if (inactive && !away) {
        inactive = false;
        let inactiveTimeIncrease = (performance.now() - startInactiveInterval) / 1000;
        log && console.log(`User is active again after ${inactiveTimeIncrease.toFixed(2)} sec.`)
        inactiveTimeInInterval += inactiveTimeIncrease;
      } else inactive = false;
    },
    inactivityIntervalTime,
    inactivityThreshold
  )

  
  track()//First time
  // Start interval for tracking
  var trackInterval = setInterval(track, interval * 1000);

  function stopTrack() {
    clearInterval(trackInterval);
    stopTrackPresence();
    stopTrackActivity();
  }

  return stopTrack;

}


// Track activity of mouse and keyboard, 
// and consider user as non active if there is 
// no activity for more than  `inactiveThreshold`
//  * inactiveCallback - function is called when user is inactive for more then `inactiveThreshold`
//  * activeCallback - function is called when user is actice again
//  * intervalTime - time interval(miliseconds) after which incrementTimer is run
//  * inactiveThreshold -  time in miliseconds after which user is considered as non active
const trackActivity = (inactiveCallback, activeCallback, intervalTime, inactiveThreshold) => {
  var active = true;
  var inactiveTime = 0;
  var idleInterval = setInterval(incrementTimer, intervalTime*1000);

  function resetTimer() { // Reset timer if any activity was detected
    inactiveTime = 0;
    if (!active){ 
      activeCallback();
      active = true;
    }
  }
  function incrementTimer() {
    // Check if timer reached `inactiveThreshold`
    inactiveTime = inactiveTime + intervalTime;
    if (active && inactiveTime >= inactiveThreshold){ 
      active = false;
      inactiveCallback();
    }
  }

  // Add eventsListeners  for resetTimer
  document.addEventListener('click', resetTimer)
  document.addEventListener('mousemove', resetTimer)
  document.addEventListener('keydown', resetTimer)
  document.addEventListener('mousemove', resetTimer)
  document.addEventListener('scroll', resetTimer, true);
  document.addEventListener('touchend', resetTimer, false);
  document.addEventListener('touchmove', resetTimer, false);

  function stopTrackActivity() {
    clearInterval(idleInterval);
    document.removeEventListener('click', resetTimer)
    document.removeEventListener('mousemove', resetTimer)
    document.removeEventListener('keydown', resetTimer)
    document.removeEventListener('mousemove', resetTimer)
    document.removeEventListener('scroll', resetTimer, true);
    document.removeEventListener('touchend', resetTimer, false);
    document.removeEventListener('touchmove', resetTimer, false);
  }

  return stopTrackActivity;

}

// Track presence on the website
const trackPresence = (outCallback, inCallback) => {
  var visible = true;
  var eventName;
  var propName = "hidden";
  if (propName in document) eventName = "visibilitychange";
  else if ((propName = "msHidden") in document) eventName = "msvisibilitychange";
  else if ((propName = "mozHidden") in document) eventName = "mozvisibilitychange";
  else if ((propName = "webkitHidden") in document) eventName = "webkitvisibilitychange";
  if (eventName) document.addEventListener(eventName, handleChange);

  if ("onfocusin" in document){
    document.addEventListener('onfocusin', handleChange)
    document.addEventListener('onfocusout', handleChange)
  }
  // Changing tab with alt+tab
  window.addEventListener('pageshow', handleChange)
  window.addEventListener('pagehide', handleChange)
  window.addEventListener('focus', handleChange)
  window.addEventListener('blur', handleChange)

  // Initialize state if Page Visibility API is supported
  if (document[propName] !== undefined) handleChange({ type: document[propName] ? "blur" : "focus" });

  function handleChange(evt) {
    evt = evt || window.event;
    if (visible && (["blur", "focusout", "pagehide"].includes(evt.type) || (this && this[propName]))) {
      visible = false;
      outCallback()
    }
    else if (!visible && (["focus", "focusin", "pageshow"].includes(evt.type) || (this && !this[propName]))) {
      visible = true;
      inCallback()
    }
  }

  function stopTrackPresence() {
    document.removeEventListener(eventName, handleChange);
    document.removeEventListener('onfocusin', handleChange)
    document.removeEventListener('onfocusout', handleChange)
    window.removeEventListener('pageshow', handleChange)
    window.removeEventListener('pagehide', handleChange)
    window.removeEventListener('focus', handleChange)
    window.removeEventListener('blur', handleChange)
  }

  return stopTrackPresence;

};

const closeLog = async () => {
  return eliaAPI.post(`${API_ROUTE}/closeLog`);
 };

const mostVisitedPages = (userId) => {  
  if (userId) return eliaAPI.get(`${API_ROUTE}/mostVisitedPages/${userId}`);
  else return eliaAPI.get(`${API_ROUTE}/mostVisitedPages`);
};

const loginCount = (userId,countBy) => { // countBy: 'day'/'daily', 'week'/'weekly', 'month'/'monthly', 'year'/'annual'/'yearly'/'annually', default 'weekday' 
  if (countBy) return eliaAPI.get(`${API_ROUTE}/loginCount/${userId}/${countBy}`);
  else if (userId) return eliaAPI.get(`${API_ROUTE}/loginCount/${userId}`);
  else return eliaAPI.get(`${API_ROUTE}/loginCount`);
}

const averageContentCreationTime = (userId) => {
  if (userId) return eliaAPI.get(`${API_ROUTE}/averageContentCreationTime/${userId}`); // user average content creation time
  else return eliaAPI.get(`${API_ROUTE}/averageContentCreationTime`); // all users average content creation time // TODO I DIDNT SEE IT, replaced in controller with req.userId
}

const timeSpentCreatingContent = (userId, basis) => {
  if (basis) return eliaAPI.get(`${API_ROUTE}/timeSpentCreatingContent/${userId}/${basis}`);
  else if (userId) return eliaAPI.get(`${API_ROUTE}/timeSpentCreatingContent/${userId}`);
  else return eliaAPI.get(`${API_ROUTE}/timeSpentCreatingContent`);
}

const functions = {
  finishTutorial,
  logAction,
  logTime,
  trackUser,
  logByDay,
  getClusteredLogs,
  logByDate,
  closeLog, 
  countLogins,
  
  mostVisitedPages,
  loginCount,
  averageContentCreationTime,
  timeSpentCreatingContent,
};

export default functions;
