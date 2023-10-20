const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/library.controller");
const api = "/api/v1/library/";
module.exports = function(app) {
    app.get(api+"private", [authJwt.verifyToken, authJwt.canReadLibrary], asyncHandler(controller.getUserPrivateContents));
    app.get(api+"public", [authJwt.verifyToken, authJwt.canReadLibrary], asyncHandler(controller.getUserPublicContents));
    app.get(api+"getAllPublicContents", [authJwt.verifyToken], asyncHandler(controller.getAllPublicContents));
    app.get(api+"cocreated", [authJwt.verifyToken, authJwt.canReadLibrary], asyncHandler(controller.getUserCoCreatedContents));
    app.get(api+"my-contents", [authJwt.verifyToken], asyncHandler(controller.getMyContents));
    app.get(api+"all", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getAllContents));
    app.get(api+"awaiting", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getAwaitingContents));
    app.get(api+"accepted", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getAcceptedContents));
    app.get(api+"rejected", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getRejectedContents));
    app.get(api+"to-archive", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.getContentToArchive));
    app.put(api+"manage-content-status", [authJwt.verifyToken, authJwt.canReadWholeLibrary], asyncHandler(controller.manageContentStatus));
    app.get(api+"getLibraryData", [authJwt.verifyToken], asyncHandler(controller.getLibraryData));

    // Requesting/revoking archiving from library - such request must be accepted by the librarian
    app.post(api+":contentId/archiving/request", [authJwt.verifyToken, authJwt.isContentOwnerOrCocreator], asyncHandler(controller.requestArchiveOfContentFromLibrary));
    app.post(api+":contentId/archiving/revoke", [authJwt.verifyToken, authJwt.isContentOwnerOrCocreator], asyncHandler(controller.revokeArchiveOfContentFromLibrary));
}