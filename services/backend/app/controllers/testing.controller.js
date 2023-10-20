const {sendNotification} = require("../utils/mobileNotification");
const User = require("../models/user.model");

exports.sendMobileNotification = async (req,res) =>{
    const {title, body, _data} = req.body;
    const category ='TEST_FROM_BROWSER';
  //=> send notification from browser to user mobile devices
    const userDevices = await User.findOne( {_id:req.userId})?.
    select('settings.connectedDevices')?.
    populate({path: 'settings.connectedDevices'});

    const tokens = userDevices?.settings?.connectedDevices.flatMap(d=> d.isNotificationOn ? [d.deviceToken]: [])
    const {data} =  await sendNotification({title,body,_data, category, tokens})

    res.status(201).send(data)
}