const db = require('../models')
const auth = require('./certificationSessionAuth')

// Enroll user for certification session
// return {status: <boolen>, code: <number>, message: <string>}
exports.enrollForCertificationSession = async (userId, certificationSessionId) => {
    var certificationSession = await db.certificationSession.findById(certificationSessionId);
    if (certificationSession.unassignedTrainees?.length < 1) { // in case, unassigned trainee field is not created or empty
        certificationSession.unassignedTrainees = [userId]
        certificationSession.traineesCount = 1 // later to consider trainee count from group
    } else if (!certificationSession.unassignedTrainees.some(t => t.equals(userId))) {
        certificationSession.unassignedTrainees.push(userId)
        certificationSession.traineesCount++
    }

    try {
        await certificationSession.save()
        await db.user.findOne({_id: userId}, (err, user) => {
            if (err) console.log(err)
            else {
                let scope = user.scopes.find(s => s.name === "modules:read:" + certificationSession.module)
                if (!scope) {
                    user.scopes.push({ name: "modules:read:" + certificationSession.module })
                    user.save()
                }
            }
        })
        return { status: true, code: 200, message: "User was assigned for certification session" }
    } catch (error) {
        return { status: false, code: 500, message: error.message }
    }

}

// Unenroll user fro, certification session
// return {status: <boolen>, code: <number>, message: <string>}
exports.unenrollFromCertificationSession = async (userId, certificationSessionId) => {
    var certificationSession = await db.certificationSession.findById(certificationSessionId);

    if (await auth.isAlreadyAssignedToGroup(userId, certificationSession)) {
        for (const groupId of certificationSession.groups) {
            console.log('Unenroll from group: ', groupId)
            let group = await db.group.findById(groupId)
            let removeIndex = group.trainees.indexOf(userId);
            if (removeIndex >= 0) {
                console.log('Unenroll from group', group?._id)
                group.trainees.splice(removeIndex, 1);
                await group.save()
            }
        }
    } else {
        console.log('certificationSession.unassignedTrainees', certificationSession.unassignedTrainees)
        let removeIndex = certificationSession.unassignedTrainees.indexOf(userId);
        if (removeIndex >= 0) {
            if (removeIndex >= 0) {
                console.log('Unenroll from awaiting list')
                certificationSession.unassignedTrainees.splice(removeIndex, 1);
            }
        }
    }

    try {
        certificationSession.traineesCount--
        await certificationSession.save()
        return { status: true, code: 200, message: "User was unassigned from certification session" }
    } catch (error) {
        return { status: false, code: 500, message: error.message }
    }

}