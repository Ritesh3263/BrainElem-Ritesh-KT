const { authJwt } = require("../middlewares");
const controller = require("../controllers/module-core.controller");
const asyncHandler = require("express-async-handler");
const api = "/api/v1/module-core/"

module.exports = function(app) {
	// new permissions are needed
	app.get(api+"read/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readModuleCore));
	app.put(api+"update/:moduleCoreId", [authJwt.verifyToken], asyncHandler(controller.updateModuleCore));
	app.get(api+"read-all-module-users/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readAllModuleUsers));
	app.get(api+"readAllClassManagers/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readAllClassManagers));
	app.get(api+"readAllModuleTrainers/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readAllModuleTrainers));
	app.get(api+"readAllModuleTrainees/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readAllModuleTrainees));
	
	// academic-year
	app.put(api+"updateMSAcademicYear/:yearId", [authJwt.verifyToken], asyncHandler(controller.updateMSAcademicYear));
	app.put(api+"addMSAcademicYear/:moduleId", [authJwt.verifyToken], asyncHandler(controller.addMSAcademicYear));
	app.delete(api+"removeMSAcademicYear/:yearId", [authJwt.verifyToken], asyncHandler(controller.removeMSAcademicYear));
	
	// subject
	app.put(api+"updateMSSubject/:subjectId", [authJwt.verifyToken], asyncHandler(controller.updateMSSubject));
	app.put(api+"addMSSubject/:moduleId", [authJwt.verifyToken], asyncHandler(controller.addMSSubject));
	app.delete(api+"removeMSSubject/:subjectId", [authJwt.verifyToken], asyncHandler(controller.removeMSSubject));

	// category
	app.put(api+"updateMSCategory/:categoryId", [authJwt.verifyToken], asyncHandler(controller.updateMSCategory));
	app.put(api+"addMSCategory/:moduleCoreId", [authJwt.verifyToken], asyncHandler(controller.addMSCategory));
	app.delete(api+"removeMSCategory/:categoryId", [authJwt.verifyToken], asyncHandler(controller.removeMSCategory));

	// class
	app.put(api+"updateMSClass/:classId", [authJwt.verifyToken], asyncHandler(controller.updateMSClass));
	app.put(api+"addMSClasses", [authJwt.verifyToken], asyncHandler(controller.addMSClasses));
	app.delete(api+"removeMSClass/:classId", [authJwt.verifyToken], asyncHandler(controller.removeMSClass));
	app.get(api+"readGroupsByTraineeId/:traineeId", [authJwt.verifyToken], asyncHandler(controller.readGroupsByTraineeId));
	app.put(api+"editChaptersInProgram", [authJwt.verifyToken], asyncHandler(controller.editChaptersInProgram));

	// scaling
	app.put(api+"updateMSScale/:scaleId", [authJwt.verifyToken], asyncHandler(controller.updateMSScale));
	app.put(api+"addMSScale/:moduleCoreId", [authJwt.verifyToken], asyncHandler(controller.addMSScale));
	app.delete(api+"removeMSScale/:scaleId", [authJwt.verifyToken], asyncHandler(controller.removeMSScale));

	// curriculum
	app.get(api+"readCurriculumsByYear/:yearId/:moduleId", [authJwt.verifyToken], asyncHandler(controller.readCurriculumsByYear));
	app.get(api+"readCurriculumsByModule", [authJwt.verifyToken], asyncHandler(controller.readCurriculumsByModule));
	app.put(api+"updateMSCurriculum/:curriculumId", [authJwt.verifyToken], asyncHandler(controller.updateMSCurriculum));
	app.put(api+"addMSCurriculum/:moduleCoreId", [authJwt.verifyToken], asyncHandler(controller.addMSCurriculum));
	app.delete(api+"removeMSCurriculum/:curriculumId", [authJwt.verifyToken], asyncHandler(controller.removeMSCurriculum));
	app.put(api+"resetCurriculum", [authJwt.verifyToken], asyncHandler(controller.resetTrainingPath));
	app.put(api+"saveContentOrder", [authJwt.verifyToken], asyncHandler(controller.saveContentOrder));

	// grades
	app.get(api+"getProgramGrades/:trainingModuleId/", [authJwt.verifyToken], asyncHandler(controller.getProgramGrades));
	app.get(api+"getTraineesInClassWithExamList/:trainingModuleId/", [authJwt.verifyToken], asyncHandler(controller.getTraineesInClassWithExamList));
	app.put(api+"getSubjectGradesInClass/:groupId/", [authJwt.verifyToken], asyncHandler(controller.getSubjectGradesInClass));
	app.get(api+"getSubjectsInClass/:groupId/:periodId", [authJwt.verifyToken], asyncHandler(controller.getSubjectsInClass));
	app.get(api+"getMinmax", [authJwt.verifyToken], asyncHandler(controller.getMinmax));

	// need to verify if the user is allowed to access this userdetails 
	app.put(api+"update-user/:userId", [authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.updateUser));
	//=> todo update permissions? remove user
	app.put(api+"remove-user/:userId", [authJwt.verifyToken, authJwt.canWriteUser], asyncHandler(controller.removeUser));
	// need to verify if the user is allowed to add a new user
	app.put(api+"add-user/:moduleId", [authJwt.verifyToken], asyncHandler(controller.addUser));
	app.get(api+":moduleId/grading-scales", [authJwt.verifyToken], asyncHandler(controller.getAllGradingScalesForModule));
	app.post(api+"addUsersFromCsv", [authJwt.verifyToken], asyncHandler(controller.addUsersFromCsv));

	app.get(api+"countContentsInModule", [authJwt.verifyToken, authJwt.canCreateContent], asyncHandler(controller.countContentsInModule)); 

	app.get(api+"getTrainingModuleFromOtherPrograms/:trainingModuleId", [authJwt.verifyToken], asyncHandler(controller.getTrainingModuleFromOtherPrograms));
};
