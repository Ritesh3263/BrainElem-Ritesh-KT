const { authJwt } = require("../middlewares");
const asyncHandler = require("express-async-handler");
const controller = require("../controllers/certificate.controller");
const api = "/api/v1/certificates/";

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken, authJwt.canCreateCertificate], asyncHandler(controller.add));
  app.get(api+"read/:certificateId", [authJwt.verifyToken], asyncHandler(controller.read));
  app.get(api+"readUserCertification/:certificateId", [authJwt.verifyToken], asyncHandler(controller.readUserCertification)); // TODO
  app.get(api+"readAll", [authJwt.verifyToken, authJwt.canReadAllCertificates], asyncHandler(controller.readAll));
  app.get(api+"readAllTraineesInSession/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.readAllTraineesInSession));
  app.get(api+"readTraineeInSession/:traineeId/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.readTraineeInSession));
  app.get(api+"readTraineeCertifications/:sessionId/:traineeId", [authJwt.verifyToken], asyncHandler(controller.readTraineeCertifications));
  app.get(api+"readAllUserCertifications/:sessionId", [authJwt.verifyToken], asyncHandler(controller.readAllUserCertifications)); // TODO AUTH
  app.get(api+"readAllExaminerCertifications", [authJwt.verifyToken, authJwt.canReadUserCertificates], asyncHandler(controller.readAllExaminerCertifications));
  app.get(api+"readAllGradingScales", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.readAllGradingScales));
  app.get(api+"readAllForBlockchain", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.readAllForBlockchain));
  app.put(api+"update/:certificateId", [authJwt.verifyToken, authJwt.canReadCertificate], asyncHandler(controller.update));
  app.put(api+"updateTraineeInSession/:traineeId/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.updateTraineeInSession));
  app.put(api+"updateTraineeDetailInSession/:traineeId/:certificationSessionId", [authJwt.verifyToken, authJwt.canReadSession], asyncHandler(controller.updateTraineeDetailInSession));
  app.delete(api+"delete/:certificateId", [authJwt.verifyToken, authJwt.canReadCertificate], asyncHandler(controller.remove));
  app.get(api+"loadExaminerList/:traineeId/:sessionId", [authJwt.verifyToken], asyncHandler(controller.loadExaminerList));
  app.get(api+"getIdOfInnerTraineeCertificate/:sessionId/:traineeId", [authJwt.verifyToken], asyncHandler(controller.getIdOfInnerTraineeCertificate));
  app.get(api+"viewEvaluation/:traineeId/:trainerId/:sessionId", [authJwt.verifyToken], asyncHandler(controller.viewEvaluation));
  app.get(api+"certify/:traineeId/:sessionId", [authJwt.verifyToken], asyncHandler(controller.certify));
  app.post(api+"certifyOnBlockchain/:traineeId/:sessionId", [authJwt.verifyToken, authJwt.isAdmin], asyncHandler(controller.certifyOnBlockchain));
  app.get(api+"verify/:certificationId", [], asyncHandler(controller.verify));// Available for external users
  app.get(api+"isCertified/:traineeId/:sessionId", [authJwt.verifyToken], asyncHandler(controller.isCertified));
  app.put(api+"updateEvaluationStatus/:traineeId", [authJwt.verifyToken], asyncHandler(controller.updateEvaluationStatus));
  app.put(api+"updateEvaluationAdditionalComment/:traineeId", [authJwt.verifyToken], asyncHandler(controller.updateEvaluationAdditionalComment));
  app.get(api+"isCertificateInUse/:certificateId", [authJwt.verifyToken], asyncHandler(controller.isCertificateInUse));
};