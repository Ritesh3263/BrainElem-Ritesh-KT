// Utils/helpers for events
const db = require("../models");

const eventAuth = require('./eventAuth')

var crypto = require('crypto')
var axios = require('axios');
var parseStringPromise = require('xml2js').parseStringPromise;

// Check the status of the event
// event - event to check
// group - if status should be calculated for whole group
exports.checkStatus = (event, group = false) => {
    var startDate, endDate;
    if (event.assignedContent) { // Dont set for exams in class
        if (event.endDate) endDate = new Date(event.endDate)
        if (event.date) startDate = new Date(event.date)
    }

    // Filter latest resutls 
    let users = []
    var latestResults = []

    event.results.forEach(r => {
        if (!users.find(u=>r.user.equals(u))) {
            users.push(r.user)
            latestResults.push(r)
        }
    })


    let now = new Date()
    let status;
    if (now < startDate) status = "UPCOMING"
    else if (now > startDate && now < endDate) status = "CURRENT"
    else if (!endDate || now > endDate) status = "FINISHED"
    if (group && status=="FINISHED") {
        if ((!endDate || now > endDate) && latestResults.length) {// Only when assigned content and when event is finished
            let allVerified = true
            let allPublished = true
            latestResults.forEach(r => {
                if (!r.grade) allVerified = false
                if (!r.published) allPublished = false
            })
            if (allPublished) status = "PUBLISHED"
            else if (allVerified) status = "VERIFIED"
            if (event.name == 'Gradebook exam') console.log(event.name, status,latestResults)
            

        }
    } else if (!group){
        var latestResult = latestResults[0]
            if (latestResult){
            if (event.allowExtraAttemptFor.includes(latestResult.user)) {
                status = "RETAKE"
            } else if (latestResult && latestResult.published) {// Result verified and published
                status = "PUBLISHED"
            } else if (latestResult && latestResult.grade) {// Result verified
                status = "VERIFIED"
            }
        }
    }
    return status;
}


// Return events objects with assinged status
// Input: 
// events - list of events
// group - status should be calculated for whole group
exports.assignStatuses = async (events, group) => {
    for (let event of events) {
        event.status = this.checkStatus(event, group)
    }
}

// Assign results for the events on the list
// events - list of events
// userId - when provided, get only results for this user
exports.assignResults = async (events, userId) => {
    for (let event of events){
        let query = {event: event._id}
        if (userId) query.user = userId
        let results = await db.result.find(query, {user: 1, grade:1, comment: 1, published:1, publishedAt: 1}).sort('-createdAt')
        event.results = results
      }
}

// Returns:
// - checksum - calculated checksum added to the url eg. &checksum=1fcbb0c4fc1f039
// Input:
// - action - requested url action name eg. `create`
// - query - query string of url, eg. name=Test+Meeting&meetingID=abc123
const getBigBlueButtonChecksum = (action, query) => {
    let  string = action+query+process.env.BIG_BLUE_BUTTON_SECRET
    var shasum = crypto.createHash('sha1')
    shasum.update(string)
    let checksum = shasum.digest('hex')
    return checksum
}


// Start BigBlueButton meeting associated with event
// Return - {status: <bool>, message: <str>, code: <int>, link: <str>}
//   status - status of the execution
//   message - message about the execution
//   code - code of response
// Input - eventId - event id
exports.startBigBlueButtonMeeting = async (eventId, userId) => {
    let event = await db.event.findById(eventId).exec();
    let query = new URLSearchParams({name: event.name, meetingID: eventId}).toString()
    let checksum = getBigBlueButtonChecksum('create', query)

    let createMeetingUrl = `${process.env.BIG_BLUE_BUTTON_URL}bigbluebutton/api/create?${query}&checksum=${checksum}`
    try{ 
        let response = await axios.get(createMeetingUrl)
        if (response?.data?.response?.messageKey == 'idNotUnique'){
            return {status: true, message: 'Meeting already exists'}
        } else if (response?.data?.response?.messageKey){
            return {status: false, code: 500, message: response?.data?.response?.messageKey}
        }
        
        let json = await parseStringPromise(response.data)
        return {status: true, message: json}
    } catch (e){
        return {status: false, code: 500, message: e.message}
    }
}

// End BigBlueButton meeting associated with event
// Return - {status: <bool>, message: <str>, code: <int>, link: <str>}
//   status - status of the execution
//   message - message about the execution
//   code - code of response
exports.endBigBlueButtonMeeting = async (eventId) => {
    let query = new URLSearchParams({meetingID: eventId}).toString()
    let checksum = getBigBlueButtonChecksum('end', query)

    let endMeetingUrl = `${process.env.BIG_BLUE_BUTTON_URL}bigbluebutton/api/end?${query}&checksum=${checksum}`
    try{ 
        let response = await axios.get(endMeetingUrl)
        let json = await parseStringPromise(response.data)
        return {status: true, message: json}
    } catch (e){
        return {status: false, code: 500, message: e.message}
    }
}

// Get BigBlueButton link for connecting to meeting associated with event
// Return - {status: <bool>, message: <str>, code: <int>, link: <str>}
//   status - status of the execution
//   message - message about the execution
//   code - code of response
//   link - BigBlueButton link for connecting to meeting associated with event
// Input - eventId - event id
exports.getBigBlueButtonMeetingLink = async (eventId, moduleId, userId) => {
    let user = await db.user.findOne({_id: userId}).exec();

    let isModerator = await eventAuth.canExamineEvent(userId, moduleId, eventId)
    let role = isModerator ? "MODERATOR" : "VIEWER"
    let query = new URLSearchParams({fullName: user.name+" "+user.surname, userID: user._id, role: role, meetingID: eventId}).toString()
    let checksum = getBigBlueButtonChecksum('join', query)
    let joinMeetingUrl = `${process.env.BIG_BLUE_BUTTON_URL}bigbluebutton/api/join?${query}&checksum=${checksum}`
    return {status: true, link: joinMeetingUrl}
}


// Get BigBlueButton link for connecting to meeting associated with event
// Return - {status: <bool>, message: <str>, code: <int>, details: <obj>}
//   status - status of the execution
//   message - message about the execution
//   code - code of response
//   link - BigBlueButton link for connecting to meeting associated with event
// Input - eventId - event id
exports.getBigBlueButtonMeetingDetails = async (eventId) => {
    let query = new URLSearchParams({meetingID: eventId}).toString()
    let checksum = getBigBlueButtonChecksum('getMeetingInfo', query)
    let getMeetingDetailsUrl = `${process.env.BIG_BLUE_BUTTON_URL}bigbluebutton/api/getMeetingInfo?${query}&checksum=${checksum}`
    try{ 
        let response = await axios.get(getMeetingDetailsUrl)
        if (response?.data?.response?.messageKey == 'notFound'){
            return {status: false, code: 404, message: "Meeting not found"}
        } else if (response?.data?.response?.messageKey){
            return {status: false, code: 500, message: response?.data?.response?.messageKey}
        }
        
        let details = await parseStringPromise(response.data)
        return {status: true, details: details.response}
    } catch (e){
        return {status: false, code: 500, message: e.message}
    }
}


// Get BigBlueButton active attendees 
// Return - {status: <bool>, message: <str>, code: <int>, details: <obj>}
//   status - status of the execution
//   message - message about the execution
//   code - code of response
//   attendees -  active attendees in the meeting
// Input - eventId - event id
exports.getBigBlueButtonMeetingActiveAttendees = async (eventId) => {
    let result = await this.getBigBlueButtonMeetingDetails(eventId)
    if (result.status) {
        try {
            let attendees = result.details.attendees[0].attendee
            if (attendees) {
                let attendeesIds = []
                let attendeesCount = 0
                attendees = attendees.forEach(a => {
                    // Filter active attendees
                    if ([!attendeesIds.includes(a.userID[0]) && a.isListeningOnly[0], a.hasJoinedVoice[0], a.hasVideo[0]].includes('true')) {
                        attendeesIds.push(a.userID[0])
                    }
                })
                return { status: true, attendees: attendeesIds }
            }
            else return { status: true, attendees: [] }
        } catch (e) {
            return { status: true, attendees: [] }
        }

    } else return { status: false, code: result.code, message: result.message }
}