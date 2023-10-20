const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;


db.log = require("./log.model");
db.activity = require("./activity.model");

db.user = require("./user.model");
db.group = require("./group.model");

db.book = require("./book.model");
db.bookAuthor = require("./bookAuthor.model");

db.notification = require("./notification.model");

db.ecosystem = require("./ecosystem.model");
db.subscription = require("./subscription.model");
db.module = require("./module.model");
db.moduleCore = require("./module_core.model");

db.team = require("./team.model");
db.event = require("./event.model");
db.subinterest = require("./subinterest.model");
db.interest = require("./interest.model");
db.competenceBlock = require("./competence_block.model");
db.competence = require("./competence.model");
db.company = require("./company.model");
db.certificate = require("./certificate.model");
db.certificationSession = require("./certification_session.model");
db.subjectSession = require("./subject_session.model");
db.internship = require("./internship.model");
db.enquiry = require("./enquiry.model");
db.format = require("./format.model");
db.softSkillsTemplate = require("./soft_skills_template.model");
db.softSkill = require("./soft_skill.model");
db.courseImage = require("./course_image.model");
db.coursePathImage = require("./course_path_image.model");
db.orientationTestImage = require("./orientation_test_image.model");

// Cognitive
db.cognitiveTrait = require("./cognitiveTrait.model");
db.cognitiveProfile = require("./cognitiveProfile.model");
db.cognitiveTip = require("./cognitiveTip.model");
db.cognitiveArea = require("./cognitiveArea.model");
db.cognitiveFaq = require("./cognitiveFaq.model");

// My projects
db.project = require("./project.model");

//Ref
db.rolePermissionRef = require("./role_permission_ref.model");
db.categoryRef = require("./category_ref.model");
db.academicYearRef = require("./academic_year_ref.model");
db.gradingScaleRef = require("./grading_scale_ref.model");

//Content
db.trainingPath = require("./training_path.model");
db.trainingModule = require("./training_module.model");
db.course = require("./course.model");
db.coursePath = require("./course_path.model");
db.chapter = require("./chapter.model");
db.content = require("./content.model");
db.contentImage = require("./content_image.model");
db.contentFile = require("./content_file.model");
db.result = require("./result.model");
db.resultFile = require("./result_file.model");

db.mail = require("./mail.model");
// db.report = require("./report.model");
db.contentimages = require("./content_image.model");

db.order = require("./order.model");
db.roleMaster = require("./roleMaster.model");
db.permissions = require("./permissions.model");
db.rolePermissionsMapping = require("./rolePermissionsMapping.model");
db.team = require("./team.model");

db.folder = require("./folder.model");

db.creditsRequest = require("./creditsRequest.model");

module.exports = db;
