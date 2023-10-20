const { authJwt } = require("../middlewares");
const controller = require("../controllers/chapter.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/chapters/";

module.exports = function(app) {
  app.get(api+"search", [authJwt.verifyToken, authJwt.canReadAllChapters], asyncHandler(controller.search));
  app.get(api+"all", [authJwt.verifyToken, authJwt.canReadAllChapters], asyncHandler(controller.readAll));
  app.put(api+"rename/:chapterId", [authJwt.verifyToken ], asyncHandler(controller.renameChapterName));
  app.post(api+":trainingModuleId", [authJwt.verifyToken, authJwt.canAddChapter], asyncHandler(controller.add));
  app.get(api+":chapterId", [authJwt.verifyToken, authJwt.canReadChapter], asyncHandler(controller.read));
  app.get(api+"get-content/:chapterId", [authJwt.verifyToken, authJwt.canReadChapter], asyncHandler(controller.getContent)); // to be updated 
  app.get(api+"get-chapters/:trainingModuleId", [authJwt.verifyToken, authJwt.canReadTrainingModule], asyncHandler(controller.getChapters)); // to be updated 
}
