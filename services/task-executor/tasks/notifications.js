const fcmUrl = 'https://fcm.googleapis.com/fcm/send';
// Replace with FCM server key
const fcmServerKey = process.env.FCM_SERVER_KEY;
const options = {
    headers: {
        'Authorization': `key=${fcmServerKey}`,
        'Content-Type': 'application/json'
    }
}
const axios = require('axios');

module.exports.sendPushNotification = (data) => {
    if (data.type === 'single') {
        sendSingleDeviceMessage(data.messages);
    } else if (data.type === 'multiple') {
        sendMultipleDevicesMessage(data.messages);
    } else if (data.type === 'all') {
        sendAllDevicesMessage(data.messages);
    }
}

// Send message to a single device
const sendSingleDeviceMessage = (message) => {
  sendFcmMessage(message);
}

// Send message to multiple devices
const sendMultipleDevicesMessage = (messages) => {  
    sendFcmMessage(messages);
}

// Send message to all devices
const sendAllDevicesMessage = (message) => {
	message.to = '/topics/all';
  sendFcmMessage(message);
}

// Send the FCM message
const sendFcmMessage = (message) => {
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
			console.log('Push Notification sent :', JSON.stringify(response));
		})
		.catch((error) => {
			console.log('Error Push Notification:', error.message);
		});
	}
}