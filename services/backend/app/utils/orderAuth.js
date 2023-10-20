const db = require('../models')

// Check if user can read `order`
exports.canReadOrder = async (userId, orderId) => {
    try {
        var user = await db.user.findOne({_id: userId});
        var order = await db.group.findOne({ _id: orderId})
        // Check if order belongs to the user
        if (order?.user == userId) return true;
        else if (user.isAdmin()) return true;
        else return false;
    } catch (error) {
        return false;
    }
}

// Check if user can read `order` with providerId
exports.canReadOrderWithProviderId = async (userId, providerId) => {
    try {
        var user = await db.user.findOne({_id: userId});
        var order = await db.order.findOne({providerId: providerId})
        // Check if order belongs to the user
        if (order?.user == userId) return true;
        else if (user.isAdmin()) return true;
        else return false;
    } catch (error) {
        return false;
    }
}

// Check if user can read `order` which contains certificationSessionId
exports.canReadOrderWithCertificationSessionId = async (userId, certificationSessionId) => {
    try {
        var user = await db.user.findOne({_id: userId});
        var order = await db.order.findOne({ user: userId, certificationSessions: certificationSessionId })
    } catch (error) {
        return false;
    }
    return true;
}

