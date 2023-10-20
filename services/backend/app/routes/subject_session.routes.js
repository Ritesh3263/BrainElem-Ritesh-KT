const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/subject_session.controller");
const api = "/api/v1/subject_session/";


module.exports = function(app) {
    app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add));
    app.get(api+"read/:subjectSessionId", [authJwt.verifyToken], asyncHandler(controller.read));
    app.get(api+"readAll", [authJwt.verifyToken], asyncHandler(controller.readAll));
    app.put(api+"update/:subjectSessionId", [authJwt.verifyToken], asyncHandler(controller.update));
    app.delete(api+"delete/:subjectSessionId", [authJwt.verifyToken], asyncHandler(controller.remove));
    
    app.get(api+"readTrainees/:subjectSessionId", [authJwt.verifyToken], asyncHandler(controller.readTrainees));
    app.get(api+"readTrainee/:userId", [authJwt.verifyToken], asyncHandler(controller.readTrainee));
    app.get(api+"readProgram/:trainingModuleId", [authJwt.verifyToken], asyncHandler(controller.readProgram));
    app.get(api+"anchorProgramByChapter/:chapterId", [authJwt.verifyToken], asyncHandler(controller.anchorProgramByChapter));
    app.get(api+"readBaseProgram/:trainingModuleId", [authJwt.verifyToken], asyncHandler(controller.readBaseProgram));
    app.put(api+"mirrorTrainingModule", [authJwt.verifyToken], asyncHandler(controller.mirrorTrainingModule));
    app.put(api+"getExamHomeworkDetails", [authJwt.verifyToken], asyncHandler(controller.getExamHomeworkDetails));
    app.put(api+"readGradebook", [authJwt.verifyToken], asyncHandler(controller.readGradebook));
    app.get(api+"getPeriod/:periodId", [authJwt.verifyToken], asyncHandler(controller.getPeriod));
    app.put(api+"updateImage/:subjectSessionId", [authJwt.verifyToken], asyncHandler(controller.updateImage));
};