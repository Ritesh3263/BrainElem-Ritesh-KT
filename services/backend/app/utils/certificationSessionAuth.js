const db = require('../models')


// Check if user already assigned to one of the groups in session
// return <boolen>
exports.isAlreadyAssignedToGroup = async (userId, certificationSession) => {
    for (const groupId of certificationSession.groups) {
        let group = await db.group.findById(groupId)
        if (group.trainees.some(t => t.equals(userId))) return true;
    }
    return false;
}

// Check if user already enrolled for session
// return <boolen>
exports.isAlreadyEnrolled = async (userId, certificationSession) => {
    if (certificationSession.unassignedTrainees.some(t => t.equals(userId))) return true;
    else if (await this.isAlreadyAssignedToGroup(userId, certificationSession)) return true;
    else return false;
}

// Check if limit of assigned users is reached
// return <boolen>
exports.isLimitReached = async (certificationSession) => {
    return (certificationSession.traineesCount >= certificationSession.traineesLimit)
}

// Check if enrollment has already started
// return <boolen>
exports.isBeforeEnrollmentTime = async (certificationSession) => {
    let startDate = certificationSession.enrollmentStartDate;
    // Make sure it's midnight of the selected date
    startDate.setHours(0,0,0,0);
    return (startDate > Date.now())
}

// Check if enrollment time has already finished
// return <boolen>
exports.isAfterEnrollmentTime = async (certificationSession) => {
    let endDate = certificationSession.enrollmentEndDate;
    // Make sure it's midnight of the next day
    endDate.setHours(24,0,0,0);
    return (endDate < Date.now())
}

// Check if payment is required
// return <boolen>
exports.isPaymentRequired = async (userId, certificationSession) => {
    if (certificationSession.paymentEnabled) {
        // Check if order with this session exists. 
        // User is assigned for session before payment is completed in order to prevent exceeding limits 
        let order = await db.order.findOne({ user: userId, status: "COMPLETED", certificationSessions: { $in: certificationSession._id } })
        return (!order)
    } else return false;
}

// Check if user can assign for certification session
// return {status: <boolen>, code: <number>, message: <string>}
exports.canEnrollForCertificationSession = async (userId, certificationSession) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // Not found
    if (!user) return { status: false, code: 404, message: "Could not find user" }
    if (!certificationSession) return { status: false, code: 404, message: "Could not find certification session" }

    if (await this.isAlreadyEnrolled(userId, certificationSession)) return { status: false, code: 403, message: "You are already in this course" }
    else if (await this.isBeforeEnrollmentTime(certificationSession)) return { status: false, code: 403, message: "Enrollment has not yet started" }
    else if (await this.isAfterEnrollmentTime(certificationSession)) return { status: false, code: 403, message: "Enrollment has already finished" }
    else if (await this.isLimitReached(certificationSession)) return { status: false, code: 403, message: "Participants limit reached" }// text was changed, as had wrong msg while being trainee
    else return { status: true, code: 200, message: "User can take this course" }
}
// Check if user can buy certification session
// Almost the same as canAssign
// it allows to buy sessions if user is assigned already but payment was not completed 
// return {status: <boolen>, code: <number>, message: <string>}
exports.canBuyCertificationSession = async (userId, certificationSession) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // Not found
    if (!user) return { status: false, code: 404, message: "Could not find user" }
    if (!certificationSession) return { status: false, code: 404, message: "Could not find certification session" }

    if (await this.isAlreadyEnrolled(userId, certificationSession)) {
        let isPaymentRequired = await this.isPaymentRequired(userId, certificationSession);
        if (isPaymentRequired) return { status: true, code: 200, message: "User can pay for the course" }
        else return { status: false, code: 403, message: "You already paid for this course" }
    }
    else if (await this.isBeforeEnrollmentTime(certificationSession)) return { status: false, code: 403, message: "Enrollment has not yet started" }
    else if (await this.isAfterEnrollmentTime(certificationSession)) return { status: false, code: 403, message: "Enrollment has already finished" }
    else if (await this.isLimitReached(certificationSession)) return { status: false, code: 403, message: "Participants limit reached" }// text was changed, as had wrong msg while being trainee
    else return { status: true, code: 200, message: "User can buy this course" }
}

// Check if user can unenroll from certification session
// return {status: <boolen>, code: <number>, message: <string>}
exports.canUnenrollForCertificationSession = async (userId, certificationSession) => {
    let user = await db.user.findOne({_id: userId}).catch((err) => false);
    // Not found
    if (!user) return { status: false, code: 404, message: "Could not find user" }
    if (!certificationSession) return { status: false, code: 404, message: "Could not find certification session" }

    if (await this.isAlreadyEnrolled(userId, certificationSession)) return { status: true, code: 200, message: "User can unenroll" }
    else return { status: false, code: 403, message: "User is not enrolled" }
}

exports.isTrainerAndGroupFromSession = async (userId, groupId) => {
    return await db.certificationSession.exists({ 
        $and: [
            {groups:  groupId},
            {examiners:  userId}, 
        ]
    })
}