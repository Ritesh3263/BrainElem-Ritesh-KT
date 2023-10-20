const User = require("../models/user.model");
const {sendNotification} = require("../utils/mobileNotification");

const getUsersMobile=async(_users, event)=>{
    let title = `Calendar: ${event?.name}`;
    let body = `${event?.eventType}`;
    let _data = {"details": {
            "channel":'CALENDAR_EVENT',
            'eventId': `${event._id}`,
            'eventDate': `${event.date}`
        }};
    let category = 'CALENDAR_EVENT';

    const tokens = await User.find({_id: {$in: _users}})?.
    select('settings.connectedDevices')?.
    populate({path: 'settings.connectedDevices',select: '-_id deviceToken isNotificationOn'}).then(async(doc)=>{
        return await Promise.all(doc.reduce((acc,{settings:{connectedDevices}})=>{
            if(connectedDevices?.length>0){
                acc.push(...connectedDevices)
            }
            return acc;
        },[]))
    }).catch(err=>{
        console.log(err);
    });

    return await sendNotification({title,body,_data, category, tokens});
}

module.exports = getUsersMobile;