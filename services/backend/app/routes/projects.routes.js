const { authJwt } = require("../middlewares");
const controller = require("../controllers/projects.controller");
const api = "/api/v1/projects/";
const asyncHandler = require("express-async-handler");

module.exports = function (app) {
    // CRUD
    app.route(api+"all").get([authJwt.verifyToken], asyncHandler(controller.getProjects));
    app.route(api+"read/:projectId").get([authJwt.verifyToken], asyncHandler(controller.getProject));
    app.route(api+"add").post([authJwt.verifyToken, authJwt.canCreateProject], asyncHandler(controller.addProject));
    app.route(api+"edit/:projectId").put([authJwt.verifyToken], asyncHandler(controller.editProject));
    app.route(api+"remove/:projectId").delete([authJwt.verifyToken], asyncHandler(controller.deleteProject));
    
    app.route(api + ":projectId").get([authJwt.verifyToken, authJwt.canAccessProject], asyncHandler(controller.getProject));
    app.route(api + ":projectId").put([authJwt.verifyToken, authJwt.isProjectCreator, authJwt.canCreateProject], asyncHandler(controller.editProject));
    app.route(api + ":projectId").delete([authJwt.verifyToken, authJwt.isProjectCreator], asyncHandler(controller.deleteProject));

    app.route(api + "collections/card/:collectionId").get([authJwt.verifyToken, authJwt.canAccessProjectCollection], asyncHandler(controller.getCognitiveBlocksCollection));
    app.route(api + "blocks/:blockId").get([authJwt.verifyToken, authJwt.canAccessProjectBlock], asyncHandler(controller.getCognitiveBlock));
    app.route(api + "blocks/progress/:blockId").post([authJwt.verifyToken, authJwt.canAccessProjectBlock], asyncHandler(controller.progressForCognitiveBlock));
    app.route(api + "collections/feedback").post([authJwt.verifyToken, authJwt.canAccessProjectCollection], asyncHandler(controller.feedbackForCognitiveCollection));

    app.route(api + "collections/assigned").get([authJwt.verifyToken], asyncHandler(controller.getAssignedCognitiveBlocksCollections));
    app.route(api + "collections/users").post([authJwt.verifyToken], asyncHandler(controller.getPossibleCognitiveBlocksCollectionsForUsers));

}