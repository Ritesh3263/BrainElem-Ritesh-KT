const getUsersMobile = require('../../socketio/mobileNotifications');
exports.mobileTest = async (req,res)=>{
    console.log("By-test_route")
    // const users = [
    //     '999999999999999999999991',
    //     '999999999999999999999990',
    //     '999999999999999999999994',
    // ];
    // const event ={
    //     name: 'Event name',
    //     date: '2022-10-02T22:00:00.000Z',
    //     _id: '63343a590378cd0179a18fe2',
    //     eventType: 'Online Class'
    // }
    //
    // const {data} = await getUsersMobile(users,event);
    res.status(200).json({data:"OK"})
}