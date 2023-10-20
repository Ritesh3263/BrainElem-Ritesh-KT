const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/notification.controller");
const api = "/api/v1/notifications/";


module.exports = function(app) {
    app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add));
    app.get(api+"read/:notificationId", [authJwt.verifyToken], asyncHandler(controller.read));
    app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll));
    app.put(api+"update/:notificationId", [authJwt.verifyToken], asyncHandler(controller.update));
    app.delete(api+"delete/:notificationId", [authJwt.verifyToken], asyncHandler(controller.remove));

    //* per user **//
    /** All user notifications **/
    app.get(api+"readAllUserNotifications/:userId", [authJwt.verifyToken], asyncHandler(controller.readAllUserNotifications));
    /** Only unread user notifications **/
    app.get(api+"readUnReadUserNotifications/:userId", [authJwt.verifyToken], asyncHandler(controller.readUnReadUserNotifications));
    /** Read notification  **/
    app.put(api+"updateUserNotifications/:userId/:notificationId", [authJwt.verifyToken], asyncHandler(controller.updateUserNotifications));

    /** add notification, then assign for users **/
    app.post(api+"addUserNotification", [authJwt.verifyToken], asyncHandler(controller.addUserNotification));
};