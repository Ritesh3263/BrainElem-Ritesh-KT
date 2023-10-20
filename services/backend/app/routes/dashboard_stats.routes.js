const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/dashboard_stats.controller");
const api = "/api/v1/dashboard_stats/";


module.exports = function(app) {
    app.get(api+"latest/my_content", [authJwt.verifyToken], asyncHandler(controller.myLatestContents));
    app.get(api+"latest/my_enquiries", [authJwt.verifyToken], asyncHandler(controller.myLatestEnquiries));
    app.get(api+"latest/my_accomplishments", [authJwt.verifyToken], asyncHandler(controller.myLatestAccomplishments));
    app.get(api+"latest/activities", [authJwt.verifyToken], asyncHandler(controller.loadLatestActivities));
    app.get(api+"upcoming/events/:userId?", [authJwt.verifyToken], asyncHandler(controller.upcomingEvents));
    app.get(api+"details/content/:contentId", [authJwt.verifyToken], asyncHandler(controller.loadContentDetails));
    app.get(api+"top-low-results/:groupId/:trainingModuleId", [authJwt.verifyToken], asyncHandler(controller.loadTopLowResults));
    app.get(api+"top-low-time-spent/:groupId", [authJwt.verifyToken], asyncHandler(controller.loadTopLowTimeSpent));
    app.get(api+"averageContentCreationTime/:userId?", [authJwt.verifyToken], asyncHandler(controller.averageContentCreationTime));
    app.get(api+"loadCurriculums/:type", [authJwt.verifyToken], asyncHandler(controller.loadCurriculums));
    app.get(api+"loadClasses/:type", [authJwt.verifyToken], asyncHandler(controller.loadClasses));
};