const db = require("../models");
const ObjectId = require("mongodb").ObjectId;


let getGroupingInfo = (basis='weekday', theDate) => {
    let groupBy = { year: { $year: theDate } }
    switch (basis) {
        case 'day':
        case 'daily':
            basis = 'daily'
            groupBy.month = { $month: theDate }
            groupBy.day = { $dayOfMonth: theDate }
            break;
        case 'week':
        case 'weekly':
            basis = 'weekly'
            groupBy.month = { $month: theDate }
            groupBy.week = { $week: theDate }
            break;
        case 'month':
        case 'monthly':
            basis = 'monthly'
            groupBy.month = { $month: theDate }
            break;
        case 'year':
        case 'yearly':
        case 'annual':
        case 'annualy':
            basis = 'annualy'
            break;
        case 'weekday':
        default:
            basis = 'weekday'
            groupBy = { weekDay: { $dayOfWeek: theDate } }
            break;
    }
    return {groupBy, basis}
}

exports.finishTutorial = async (req, res) => {
    let userId = req.userId;
    // find by id and update
    await db.user.updateOne({ _id: ObjectId(userId) }, { $set: { "settings.hideTutorial": true } });
    res.status(200).json({ message: "Tutorial finished" });
}

exports.logAction = async (req, res) => { // Log action
    // Log some actions with details
    let log = new db.log({action: req.params.action, user: req.userId, module: ObjectId(req.moduleId), details: req.body.logDetails})
    log.save()
    res.status(200).json({message: "Logged successfully"})
};
// get average activeTime of last 20 logs
exports.logByDay = async (req, res) => {
    let days = parseInt(req.params.days)||7; // default 7 day
    let userId = ObjectId(req.userId) // default to current user
    if (req.params.userId?.length==24) {
        userId = ObjectId(req.params.userId)
    } else if (req.params.userId) days = parseInt(req.params.userId)  
    
    let total_inTime = await db.log.aggregate()
    .match({ action: 'active', module: ObjectId(req.moduleId), user: userId, createdAt: { $gt: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }})
    .group({ 
        _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" }, 
            day: { $dayOfMonth: "$createdAt" }, 
            weekDay: { $dayOfWeek: "$createdAt" }, 
        },
        activityTimePerDay: { $sum: "$details.inTime" }, 
        awayTime: { $sum: "$details.awayTime" },
        loginCount: { $sum: 1 } 
    }) 
    .sort('-_id.day -_id.weekDay')
    res.status(200).json(total_inTime)
};

exports.getClusteredLogs = async (req, res) => {
    let userId = ObjectId(req.userId) // default to current user
    let days = parseInt( req.params.days )||7; // default 7 days
    if (req.params.userId?.length==24) {
        userId = ObjectId(req.params.userId)
    } else if (req.params.userId) days = parseInt(req.params.userId)   

    let avgPerDay = await db.log.aggregate()
    .match({ action: 'active', user: userId, module: ObjectId(req.moduleId) })
    .group({ 
        _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" }, 
            day: { $dayOfMonth: "$createdAt" }, 
            // week: { $week: "$createdAt" }, 
            // weekDay: { $dayOfWeek: "$createdAt" }, 
        }, 
        avg: { $avg: "$details.inTime" }, 
        count: { $sum: 1 },
        details: { $push: "$details" }
    })
    .sort('-_id')
    .limit(days)
    res.status(200).json(avgPerDay)
};

exports.logByDate = async (req, res) => {
    let userId = ObjectId(req.userId) // default to current user
    let date = req.params.date? new Date(req.params.date) : new Date() // default to current date
    if (req.params.userId?.length==24) {
        userId = ObjectId(req.params.userId)
    } else if (req.params.userId) date = new Date(req.params.userId)  

    let logs = await db.log.aggregate()
    .project({ // get logs on a specific day
        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        action: 1, details: 1, user: 1, createdAt: 1, module: 1
    })
    .match({ action: 'active', module: ObjectId(req.moduleId), user: userId, day: date.toISOString().substring(0, 10) })
    .group({
        _id: null,
        total_inTime: { $sum: "$details.inTime" },
        countLogs: { $sum: 1 }
    })
    // .limit(1)
    res.status(200).json(logs)
};


exports.logTime = async (req, res) => { // Log time spent on the platform

    // Combine logs from same URL - do not disable on production
    let combineAccessedURLLogs = true;

    // Find latest active log for this session
    let log = await db.log
    // .findOne({ action: 'active', status: true, user: req.userId, "updatedAt": { $gt: new Date(Date.now() - 2 * 60 * 1000) } }) // check for last 2 minutes
    .findOne({ action: 'active', status: true, user: req.userId, module: ObjectId(req.moduleId), }) // we keep one log per login, no need to calculate date as in comment above
    .sort({ updatedAt: -1 })
    .exec()
        
    if (!log) { // If there is no recent time interval, create new one
        let newLog = new db.log({ action: 'active', user: req.userId, module: ObjectId(req.moduleId), details: { totalTime: 0, inactiveTime: 0, inTime: 0, rawAwayTime: 0, awayTime: 0, inactiveCount: req.body.inactiveCount, awayCount: req.body.awayCount } })
        newLog.save()
        res.status(200).json({ message: "Started to track time" })
    } else { // Update time for last interval
        let totalTime =   log.details.totalTime + req.body.time
        let awayTime = log.details.awayTime + req.body.awayTime
        let inactiveTime = log.details.inactiveTime + req.body.inactiveTime
        let awayCount = log.details.awayCount + req.body.awayCount
        let inactiveCount = log.details.inactiveCount + req.body.inactiveCount

        // opposite of awayTime
        let inTime =   totalTime - awayTime;
        
        // count on which page the time was spent (inTime)
        let baseUrl = req.protocol + '://' + req.get('host');
        let vistedPage = req.headers.referer.replace(baseUrl, "");
        let singleInTime = req.body.time - req.body.awayTime
        let accessedURL = {name: vistedPage, inTime: singleInTime, date: new Date().toISOString()};

        // get the total (raw) away time 
            // get the total (raw) away time 
        // get the total (raw) away time 
        // calculated by substracting log.createdAt+inTime from Date(now)
        let rawAwayTime = new Date(log.createdAt);
        rawAwayTime.setSeconds(rawAwayTime.getSeconds() + inTime);
        let now = new Date().toISOString();
        let diff = new Date(now) - new Date(rawAwayTime);
        rawAwayTime = Math.floor(diff / 1e3);
        

        if (combineAccessedURLLogs) {
            let entry = log.accessedURLs.find(url => url.name === vistedPage);
            if (entry){//Update time for existing entry
                entry.inTime += singleInTime;
                entry.date = new Date().toISOString();
            }
            else log.accessedURLs.push(accessedURL);
        } else {
            log.accessedURLs.push(accessedURL);
        }
        
        log.details = {...log.details, totalTime, inactiveTime, awayTime, inTime, rawAwayTime, awayCount, inactiveCount };
        log.save();

        if (totalTime === 0 && awayTime === 0 && inactiveTime === 0)
            res.status(200).json({ message: "No time added to logs, time/inactiveTime/awayTime = 0" })
        else 
            res.status(200).json({ message: "Time logged successfully" })
    }
};

exports.closeLog = async (req, res) => { 
    let log = await db.log
    .findOne({ action: 'active', user: req.userId, module: ObjectId(req.moduleId), status: true })
    .sort({ updatedAt: -1 })
    if (!log) {
        let newlog = db.log({ 
            action: 'active', 
            user: req.userId, 
            module: ObjectId(req.moduleId), 
            details: { totalTime: 0, inactiveTime: 0, inTime: 0, rawAwayTime: 0, awayTime: 0, inactiveCount: 0, awayCount: 0 },
            accessedURLs: [],
            status: false,
            userDeviceInfo: {}
        })
        await newlog.save()
        res.status(200).json({ message: "Created a dead log" })
    }
    else {   
        log.status = false;
        log.save();
        res.status(200).json({ message: "Log closed successfully" })
    }
}

exports.countLogins = async (req, res) => {
    let userId = ObjectId(req.userId) // default to current user
    let date = req.params.date? new Date(req.params.date) : new Date() // default to current date
    if (req.params.userId?.length==24) {
        userId = ObjectId(req.params.userId)
    } else if (req.params.userId) date = new Date(req.params.userId) 

    let count = await db.log.countDocuments({user: userId, module: ObjectId(req.moduleId), createdAt: { $gte: date}})
    res.status(200).json({count});
  };

exports.mostVisitedPages = async (req, res) => { // get top 5 visited pages
    let userId = req.params.userId?.length==24? ObjectId(req.params.userId):ObjectId(req.userId) // default to current user

    let mostVisitedPages = await db.log.aggregate()
    .match({ user: userId, module: ObjectId(req.moduleId), })
    .project({ accessedURLs: 1, user: 1, module: 1 })
    .unwind('$accessedURLs')
    .group({ 
        _id: '$accessedURLs.name', 
        count: { $sum: 1 }, 
        totalTime: { $sum: '$accessedURLs.inTime' } 
    })
    .sort({ count: -1, totalTime: -1 })
    .limit(5)
    .exec()
    res.status(200).json(mostVisitedPages)
}

// number of login daily, weekly, monthly, yearly, default is weekdays
exports.loginCount = async (req, res) => {
    let userId = req.params.userId?.length==24? ObjectId(req.params.userId):ObjectId(req.userId); // default to current user
    let info = getGroupingInfo('year',"$createdAt")

    let loginCount = await db.log.aggregate()
    .match({ module: ObjectId(req.moduleId), user: userId })
    .group({
        _id: info.groupBy, 
        count: { $sum: 1 },
        // dates: { $push: "$createdAt" } // we can use this to get the array of dates of each logins
    })
    .sort({ _id: 1 })
    .exec()
    res.status(200).json(loginCount)
}

// average time spent on page 'create-cotnent' and old '/create-presentation', '/create-test'
exports.averageContentCreationTime = async (req, res) => {
    // If userId is not provided in request parameters, use current user
    let userId = req.params.userId ? req.params.userId : req.userId
    
    // Count all create contents
    let countOriginalContents = await db.content.countDocuments({
        owner: userId, origin: {$exists:0} 
    })

    let contentCreationTime = await db.log.aggregate()
    .project({ accessedURLs: 1, user: 1, module: 1 })
    .match({ user: ObjectId(userId), module: ObjectId(req.moduleId)})
    .unwind('$accessedURLs')
    .match({'accessedURLs.name': { $regex: /\/create-presentation|\/create-test|\/create-content/ } })
    .group({
        _id: null, // use '$accessedURLs.name' to seperate logs
        count: { $sum: 1 }, // corresponding to the number of logs
        totalTime: { $sum: '$accessedURLs.inTime' },
    })
    .exec()

    let response = {
        numberOfContents: countOriginalContents,
        averageContentCreationTime: countOriginalContents ? ((contentCreationTime[0]?.totalTime || 0)/countOriginalContents) : 0,
    }
    res.status(200).json(response)
}

// time spend on creating content weekly, monthly, yearly
exports.timeSpentCreatingContent = async (req, res) => {
    let userId = req.params.userId?.length==24? ObjectId(req.params.userId):ObjectId(req.userId); // default to current user
    
    let info_content = getGroupingInfo(req.params.basis, "$createdAt")
    let info_log = getGroupingInfo(req.params.basis, "$accessedURLs.date")

    let originalContents = await db.content.aggregate()
    .match({ owner: userId, origin: {$exists:0}})
    .group({
        _id: { groupBy: info_content.groupBy }, 
        count: { $sum: 1 },
    })
    .sort({ _id: 1 })
    .exec()

    let timeSpentCreatingContent = await db.log.aggregate()
    .match({ module: ObjectId(req.moduleId), user: userId })
    .project({ accessedURLs: 1, user: 1, module: 1 })
    .unwind('$accessedURLs')
    .match({ 'accessedURLs.name': { $regex: /\/create-presentation|\/create-test|\/create-content/ } })
    .group({
        _id: {
            name: '$accessedURLs.name', // neet to filter-in the name because we want to combine both logs and focus to number of content created regardless of the content type
            groupBy: info_log.groupBy,
        },
        count: { $sum: 1 }, // number of log pulses for this content
        totalTime: { $sum: '$accessedURLs.inTime' },
    })
    .sort({ _id: 1 })
    .exec()

    let result = originalContents.map(x => {
        if (info_content.basis=='daily') {
            let totalTime = timeSpentCreatingContent.find(y => y._id.groupBy.year==x._id.groupBy.year && y._id.groupBy.month==x._id.groupBy.month && y._id.groupBy.day==x._id.groupBy.day)?.totalTime || 0
            return {
                _id: x._id.groupBy, count: x.count, totalTime,
                averageTime: totalTime?totalTime/x.count:0,
            }
        } else if (info_content.basis=='weekly') {
            let totalTime = timeSpentCreatingContent.find(y => y._id.groupBy.year==x._id.groupBy.year && y._id.groupBy.month==x._id.groupBy.month && y._id.groupBy.week==x._id.groupBy.week)?.totalTime || 0
            return {
                _id: x._id.groupBy, count: x.count, totalTime,
                averageTime: totalTime?totalTime/x.count:0,
            }
        } else if (info_content.basis=='monthly') {
            let totalTime = timeSpentCreatingContent.find(y => y._id.groupBy.year==x._id.groupBy.year && y._id.groupBy.month==x._id.groupBy.month)?.totalTime || 0
            return {
                _id: x._id.groupBy, count: x.count, totalTime,
                averageTime: totalTime?totalTime/x.count:0,
            }
        } else if (info_content.basis=='annualy') {
            let totalTime = timeSpentCreatingContent.find(y => y._id.groupBy.year==x._id.groupBy.year)?.totalTime || 0
            return {
                _id: x._id.groupBy, count: x.count, totalTime,
                averageTime: totalTime?totalTime/x.count:0,
            }
        } else if (info_content.basis=='weekday') {
            let totalTime = timeSpentCreatingContent.find(y => y._id.groupBy.weekDay==x._id.groupBy.weekDay)?.totalTime || 0
            return {
                _id: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][x._id.groupBy.weekDay-1],
                count: x.count, totalTime,
                averageTime: totalTime?totalTime/x.count:0,
            }
        }
    })
    res.status(200).json(result)
}