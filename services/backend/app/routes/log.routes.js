const { authJwt } = require("../middlewares");
const asyncHandler = require('express-async-handler')
const controller = require("../controllers/log.controller");
const api = "/api/v1/logs/";

module.exports = function(app) {
    app.post(api + "finishTutorial", [authJwt.verifyToken], asyncHandler(controller.finishTutorial));
    app.post(api+"actions/:action", [authJwt.verifyToken], asyncHandler(controller.logAction));
    app.post(api+"time", [authJwt.verifyToken], asyncHandler(controller.logTime));
    app.post(api+"closeLog", [authJwt.verifyToken], asyncHandler(controller.closeLog));
    app.get(api+"logByDay/:userId?/:days?", [authJwt.verifyToken], asyncHandler(controller.logByDay));
    app.get(api+"clusteredLogs/:userId?/:days?", [authJwt.verifyToken], asyncHandler(controller.getClusteredLogs));
    app.get(api+"logByDate/:userId?/:date?", [authJwt.verifyToken], asyncHandler(controller.logByDate));
    app.get(api+"countLogins/:userId?/:date?", [authJwt.verifyToken], asyncHandler(controller.countLogins));

    app.get(api+"mostVisitedPages/:userId?", [authJwt.verifyToken], asyncHandler(controller.mostVisitedPages));
    app.get(api+"loginCount/:userId?/:countBy?", [authJwt.verifyToken], asyncHandler(controller.loginCount));
    app.get(api+"averageContentCreationTime/:userId?", [authJwt.verifyToken], asyncHandler(controller.averageContentCreationTime));
    app.get(api+"timeSpentCreatingContent/:userId?/:basis?", [authJwt.verifyToken], asyncHandler(controller.timeSpentCreatingContent));
}