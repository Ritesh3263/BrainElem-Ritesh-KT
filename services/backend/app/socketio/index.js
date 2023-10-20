const app = require('../../server');
const { createServer } = require("http");
const { Server } = require("socket.io");
const db = require("../models");
const { getBigBlueButtonMeetingActiveAttendees } = require("../utils/event");

exports.initSocket =(httpServer)=>{
    // const PORT = process.env.PORT || 80;
    // const httpServer = createServer(app);
    // httpServer.listen(PORT, '0.0.0.0',  () => {
    //     console.log(`Server is running on port ${PORT}.`);
    // });
    exports.io = new Server(httpServer, { /* options */ });

    this.io.on('connection', (socket) => {
        socket.on("addUser",userId=>{
            this.addUser(userId,socket.id);
        });

        socket.on("updateEventActivity",(eventId, userId, data)=>{
            this.updateEventActivity(eventId, userId, data, socket.id);
        });
        socket.on("updateContentActivity",(contentId, userId, data)=>{
            this.updateContentActivity(contentId, userId, data, socket.id);
        });
        socket.on("disconnect",()=>{
            this.removeUser(socket.id);
        });
    });

}

let users = [];
exports.addUser =(userId,socketId)=>{
    !users.some(user=> user.userId === userId) && users.push({userId,socketId});
}

exports.removeUser=(socketId)=>{
    users = users.filter(user=> user.socketId !== socketId);
}

exports.getUsers=(_users)=>{
    return users.filter(u=> !_users.includes(u));
}

exports.updateEventActivity = async (eventId, userId, data, socketId) => {
    updateActivity('eventActivityUpdated', db.event, eventId, userId, data, socketId)

}
exports.updateContentActivity = async (contentId, userId, data, socketId) => {
    updateActivity('contentActivityUpdated', db.content, contentId, userId, data, socketId)
}

// Update the inforamtions about users, activity and meeting associated with it
// This data is used to display live updates of the users inside content display  
const updateActivity = async (emitName, model, objectId, userId, data, socketId) => {

    console.log('socket - Recived: updateActivity', objectId, userId)
    // Check if user was active in the last inerval
    let isActive = (data.time - data.inactiveTime - data.awayTime)>0 || data.time==0;

    let initUser = { _id: userId, isActive: isActive, lastActive: new Date(), time: data.time, inactiveTime: data.inactiveTime, awayTime: data.awayTime, inactiveCount: data.inactiveCount, awayCount: data.awayCount }
    
    
    var object = await model.findById(objectId).exec();
    if (!object) return
    if (!object?.attendees?.length){
        await model.update({_id: objectId}, {$addToSet: {attendees: initUser}}, {timestamps: false})
        await model.update({_id:objectId}, {$set:{'lastEmit': new Date()}}, {timestamps: false}) 
        this.io.emit(`${emitName}_${objectId}`, object);
    }
    if (!object.lastEmit){
        await model.update({_id:objectId}, {$set:{'lastEmit': new Date()}}, {timestamps: false}) 
    }

    else {//Event exists
        
        var userIndex = object.attendees.findIndex(a => a._id == userId)
        if (userIndex < 0){//Adding new user
            await model.update({_id: objectId}, {$addToSet: {attendees: initUser}}, {timestamps: false})
        }
        else {// User already exists
            let attendee = object.attendees[userIndex]
            let update = {
                "attendees.$.time": attendee.time + data.time,
                "attendees.$.inactiveTime": attendee.inactiveTime + data.inactiveTime,
                "attendees.$.awayTime": attendee.awayTime + data.awayTime,
                "attendees.$.inactiveCount": attendee.inactiveCount + data.inactiveCount,
                "attendees.$.awayCount": attendee.awayCount + data.awayCount,
                "attendees.$.isActive": isActive,
                "attendees.$.currentPageNumber": data.currentPageNumber
            }
            if (isActive) update['attendees.$.lastActive'] = new Date();
            await model.update({_id: objectId, "attendees._id": userId}, {$set: update}, {timestamps: false}) 
        }

        var secondsSinceLastEmit = ((new Date).getTime() - object?.lastEmit?.getTime()) / 1000;
        // Emit maximum once per 10 seconds - or when this is the first connection with time = 0
        if (secondsSinceLastEmit > 10 || data.time==0) {
            // # VIDEO MEETING ################################################
            let isMeetingStarted = false
            let meetingAttendeesCount = 0
            let meetingUrl = undefined
            let meetingDetails = undefined

            if (object.meetingUrl) {// Custom meeting ULR saved in database
                isMeetingStarted = true
                meetingUrl = object.meetingUrl
                meetingDetails = object.meetingDetails
            } else {// Default BBB meeting - count attendees of video meeting on BigBlutButton
                var check = await getBigBlueButtonMeetingActiveAttendees(objectId)
                console.log(check)
                if (check.status) {
                    isMeetingStarted = true
                    meetingAttendeesCount = check.attendees.length
                }
            } //#################################################################

            // Update lastEmit date
            object.lastEmit = new Date()
            await model.update({_id:objectId}, {$set:{'lastEmit': new Date()}}, {timestamps: false}) 
            
            // Emit 
            this.io.emit(`${emitName}_${objectId}`, { ...object.toObject(), meetingUrl: meetingUrl, meetingDetails: meetingDetails, isMeetingStarted: isMeetingStarted, meetingAttendeesCount: meetingAttendeesCount });
        }
    }
}
