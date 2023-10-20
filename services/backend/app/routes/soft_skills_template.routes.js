const { authJwt } = require("../middlewares");
const controller = require("../controllers/soft_skills_template.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/soft-skills-template/";

module.exports = function(app) {
  app.post(api+"add", [authJwt.verifyToken], asyncHandler(controller.add));
  app.put(api+"update/:templateId", [authJwt.verifyToken], asyncHandler(controller.update));
  app.delete(api+"delete/:templateId", [authJwt.verifyToken], asyncHandler(controller.remove));
  app.get(api+"read-groups", [authJwt.verifyToken], asyncHandler(controller.readGroups));
  app.get(api+"read-trainees/:groupId", [authJwt.verifyToken], asyncHandler(controller.readTraineesInGroup));
  app.get(api+"new-read-reports-of-trainee/:traineeId/:groupId", [authJwt.verifyToken], asyncHandler(controller.newReadReportsOfTraineeInGroup));
  
  // templates
  app.get(api+"read-template/:templateId", [authJwt.verifyToken], asyncHandler(controller.readTemplate));
  app.get(api+"read-all-templates", [authJwt.verifyToken], asyncHandler(controller.readAllReportsTemplates));
  
  // soft skills 
  app.post(api+"add-soft-skill", [authJwt.verifyToken], asyncHandler(controller.addSoftSkill));
  app.put(api+"update-soft-skill/:softSkillId", [authJwt.verifyToken], asyncHandler(controller.updateSoftSkill));
  app.get(api+"read-soft-skill/:softSkillId", [authJwt.verifyToken], asyncHandler(controller.readSoftSkill));
  app.get(api+"read-all-soft-skills", [authJwt.verifyToken], asyncHandler(controller.readAllSoftSkills));
  app.delete(api+"removeSoftSkill/:softSkillId", [authJwt.verifyToken], asyncHandler(controller.removeSoftSkill));  
};