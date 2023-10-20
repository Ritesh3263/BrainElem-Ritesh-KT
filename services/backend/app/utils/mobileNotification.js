const axios = require('axios');
const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
// Replace with FCM server key
const fcmServerKey = process.env.FCM_SERVER_KEY;
const options = {
    headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json',
        'Sender': 'id=630932056234'
    }
}

const sendNotification = async ({title,body,_data, category, tokens})=>{
    const _tokens  = tokens.filter(t=> t.isNotificationOn).map(t=> t.deviceToken);
    const message = {
        to: _tokens,
        sound: 'default',
        title: title,
        body: body,
        data:_data,
        categoryId: category,
    }
     try{
         return await axios.post('https://exp.host/--/api/v2/push/send',message,{
             headers: {
                 Accept: 'application/json',
                 'Accept-encoding': 'gzip, deflate',
                 'Content-Type': 'application/json',
             },
         })
     }catch (err){
        return err;
     }
}

// Push Notifications For CC
const sendPushNotification = (data) => {
    if (data.type === 'single') {
        sendSingleDeviceMessage(data.messages);
    } else if (data.type === 'multiple') {
        sendMultipleDevicesMessage(data.messages);
    } else if (data.type === 'all') {
        sendAllDevicesMessage(data.messages);
    }
    return;
}

// Send message to a single device
const sendSingleDeviceMessage = (message) => {
    sendFcmMessage(message);
    return;
}

// Send message to multiple devices
const sendMultipleDevicesMessage = (messages) => {  
    sendFcmMessage(messages);
    return;
}

// Send message to all devices
const sendAllDevicesMessage = (message) => {
    message.to = '/topics/all';
    sendFcmMessage(message);
    return;
}

// Send the FCM message
const sendFcmMessage = (message) => {
    console.log('*****************PUSH**************');
    if (Array.isArray(message)) {
        const requests = message.map((m) => {
            return axios.post(fcmUrl, m, options);
        });
        if (requests.length) {
            Promise.all(requests)
            .then((responses) => {
                console.log('All Push Notifications sent successfully:', responses);
            })
            .catch((error) => {
                console.error('Error Push Notification:', error.message);
            });
        }
    } else {
        axios.post(fcmUrl, message, options)
        .then((response) => {
            console.log('Push Notification sent :', response);
        })
        .catch((error) => {
            console.log('Error Push Notification:', error.message);
        });
    }
}

const mobileNotification ={
    sendNotification,
    sendPushNotification
}
module.exports = mobileNotification;