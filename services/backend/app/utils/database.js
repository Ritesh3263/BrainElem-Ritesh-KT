const db = require("../models");
// Structure
const { contents } = require('./database/contents')
const { contentFile } = require('./database/contentFile')
const { chapters } = require('./database/chapters')
const { trainingModules } = require('./database/trainingModules')
const { trainingPaths } = require('./database/trainingPaths')
const { moduleCores } = require('./database/moduleCores')
const { ecosystems } = require('./database/ecosystems')
const { moduleManagers } = require('./database/moduleManagers')
const { assistants } = require('./database/assistants')

// Users
const { partners } = require('./database/partners')
const { architects } = require('./database/architects')
const { librarians } = require('./database/librarians')
const { classManagers } = require('./database/classManagers')
const { trainers } = require('./database/trainers')
const { trainees } = require('./database/trainees')
const { parents } = require('./database/parents')
const { inspectors } = require('./database/inspectors')
const { coordinators } = require('./database/coordinators')
const { trainingManagers } = require('./database/trainingManagers')


// DEMO
const { demo_users } = require('./database/demo_users')
const { demo_results } = require('./database/demo_results')



// Cognitive
const { cognitiveTraits } = require('./database/cognitiveTraits')
const {  cognitiveProfiles } = require('./database/cognitiveProfiles')
const {  cognitiveTips } = require('./database/cognitiveTips')
const {  cognitiveAreas } = require('./database/cognitiveAreas')
const {  cognitiveFaqs } = require('./database/cognitiveFaqs')

const {  cognitiveContents } = require('./database/cognitiveContents')
const {  cognitiveContentFiles } = require('./database/cognitiveContentFiles')
const {  cognitiveContentImages } = require('./database/cognitiveContentImages')

// Projects
const {  projects } = require('./database/projects')
const {  projectCognitiveBlocksContents } = require('./database/projectCognitiveBlocksContents')

// Refs
const { academicYearRefs } = require('./database/academicYearRefs')
const { rolePermissionRefs } = require('./database/rolePermissionRefs')
const { categoryRefs } = require('./database/categoryRefs')
const { gradingScaleRefs } = require('./database/gradingScaleRefs')


const { groups } = require('./database/groups')
const { teams } = require('./database/teams')
const { interests } = require('./database/interests')
const { subinterests } = require('./database/subinterests')
const { events } = require('./database/events')
const { results } = require('./database/results')
// BrainCore Tests results(Franch and English) for student1
const { braincorePedagogyTestsResults } = require('./database/braincorePedagogyTestsResults')
const { braincorePedagogyTestsResultsAllLevels } = require("./database/braincorePedagogyTestsResultsAllLevels");
const { braincoreAdultTestsResults } = require('./database/braincoreAdultTestsResults')
const { braincoreAdultTestsResultsAllLevels } = require("./database/braincoreAdultTestsResultsAllLevels");

const { softSkillsTemplates } = require('./database/softSkillsTemplates')
const { softSkills } = require('./database/softSkills')
const { competenceBlocks } = require('./database/competenceBlocks')
const { competences } = require('./database/competences')
const { certificates } = require('./database/certificates')
const { certificationSessions } = require('./database/certificationSessions')

const { companies } = require('./database/companies')
const { internships } = require('./database/internships')
const { folders } = require('./database/folders')

const { enquiries } = require('./database/enquiries')
const { courses } = require('./database/courses')
const { coursePaths } = require('./database/coursePaths')

const { books } = require('./database/books')
const { bookAuthors } = require('./database/bookAuthors')
const { certificateTemplates } = require('./database/certificateTemplates')
const { courseImages } = require('./database/courseImages')
const { coursePathImages } = require('./database/coursePathImages')
const { formats } = require('./database/formats')
const { notifications } = require('./database/notifications')
const { subjectSessions } = require('./database/subjectSessions')

// Role Master
const { roleMasters } = require("./database/roleMaster");
// permissions
const { permissions } = require("./database/permissions");
// rolePermissionsMapping
const { rolePermissionsMappings } = require("./database/rolePermissionsMapping");
// sentinel trainees
const { sentinelTrainees } = require('./database/trainees_for_sentinel');
// sentinel results
const { sentinelResults } = require('./database/results_for_sentinel');



//const {} = require('./database/')

// Remove all collections in database
async function removeCollections() {
    const collections = await db.mongoose.connection.db.collections()

    for (let collection of collections) {
        await collection.deleteMany({})
    }
}

async function createContent() {
    return db.content.insertMany(contents, (err) => { if (err) if (err.code!=11000){console.error(err.message)} })
}

async function initFolder() {
    return db.folder.insertMany(folders, (err) => { if (err) if (err.code!=11000){console.error(err.message)} })
}

async function createChapter() {
    return db.chapter.insertMany(chapters, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}


async function createTrainingModule() {
    return db.trainingModule.insertMany(trainingModules, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createTrainingPath() {
    return db.trainingPath.insertMany(trainingPaths, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })

}

async function createModuleCore() {
    return db.moduleCore.insertMany(moduleCores, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createEcosystem() {
    return db.ecosystem.insertMany(ecosystems, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

// for user scope, meaning of the middle string as follows,
//      :all: = manager
//      :free: = yet not assigned as a manager
//      :read: = belonging to the segment (i.e. ecosystem, network, module)

async function createAdminUser() {
    let user = new db.user({
        _id: "999999999999999999999999", username: 'root', email: 'root', name: 'Name of', surname: 'Sudo',
        settings: {
            language: 'en', isActive: true, role: "Root", availableRoles: ['Root'], defaultRole: 'Root', selfRegistered: false, emailConfirmed: true
        },
        password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
        scopes: [{ name: "all:all:all" }]
    })
    try {
        let result = await user.save();
        return result
    } catch (err) {
        if (err?.code!=11000) console.log('Error in createAdminUser ' + err);
    }
}

async function createEcoManager() {
    let user = new db.user({
        _id: "999999999999999999999998", username: 'ecomanager', email: 'ecomanager', name: 'Name of', surname: 'Ecomanager',
        settings: {
            language: 'en', isActive: true, role: "EcoManager", availableRoles: ['EcoManager'], defaultRole: 'EcoManager'
        },
        password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
        scopes: [{ name: "users:all:999999999999999999999998" }, { name: "ecosystems:all:100000000000000000000000" }, { name: 'content:create:all' }]
    })
    let result = user.save((err) => { if (err) if (err.code!=11000){console.error(err.message)}; });
    return result
}

async function createCloudManager() {
    let user = new db.user({
        _id: "999999999999999999999956", username: 'cloudmanager', email: 'cloudManager', name: 'Name of', surname: 'CloudManager',
        settings: {
            language: 'en', isActive: true, role: "CloudManager", availableRoles: ['CloudManager'], defaultRole: 'CloudManager'
        },
        password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
        scopes: [{ name: "users:all:999999999999999999999956" }, { name: "ecosystems:read:100000000000000000000000" }, { name: 'content:create:all' }]
    })
    let result = user.save((err) => { if (err) if (err.code!=11000){console.error(err.message)}; });
    return result
}


// subscription = network
async function createSubscriptionOwner() {
    let user = new db.user({
        _id: "999999999999999999999997", username: 'networkmanager', email: 'networkmanager', name: 'Name of', surname: 'Network Manager',
        settings: {
            language: 'en', isActive: true, role: "NetworkManager", availableRoles: ['NetworkManager'], defaultRole: 'NetworkManager'
        },
        password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
        details: { displayName: "Rem", phone: "+48 123 456 789", street: "Zapolska", buildNr: "20/7", postcode: "32-100", city: "Cracow", country: "Poland", dateOfBirth: "2022-07-31T12:13:46.847Z" },
        scopes: [{ name: "users:all:999999999999999999999997" }, { name: "ecosystems:read:100000000000000000000000" }, { name: "subscriptions:all:110000000000000000000000" }, { name: 'content:create:all' }]
    })
    let result = user.save((err) => { if (err) if (err.code!=11000){console.error(err.message)}; });
    return result
}

async function createUserWithEmail(email) {

    let user = new db.user({
        username: 'test_user', email: email, name: 'test', surname: 'test',
        settings: {
        },
        password: '$2a$08$iFPUg2dPt7gRQoE6QPLYYOXUlPoeKMi1wbhf/ombVSr4r4Zsab9ei',
        scopes: [{ name: "all:all:all" }]
    })
    let result = user.save((err) => { if (err) if (err.code!=11000){console.error(err.message)}; });
    return result
}

async function createModuleManager() {
    return db.user.insertMany(moduleManagers, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createAssistant() {
    return db.user.insertMany(assistants, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createPartner() {
    return db.user.insertMany(partners, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createArchitect() {
    return db.user.insertMany(architects, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createLibrarian() {
    return db.user.insertMany(librarians, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createClassManager() {
    return db.user.insertMany(classManagers, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createTrainer() {
    return db.user.insertMany(trainers, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createTrainee() {
    return db.user.insertMany(trainees, {ordered : false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSentinelTrainee() {
    return db.user.insertMany(sentinelTrainees, {ordered : false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createParent() {
    return db.user.insertMany(parents, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createInspector() {
    return db.user.insertMany(inspectors, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCoordinator() {
    return db.user.insertMany(coordinators, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createTrainingManager() {

    return db.user.insertMany(trainingManagers, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}


// Create all objects needed for demo
async function createDemo() {

    // Users
    let demo_users_ids = demo_users.map(u=>u._id)
    await db.user.deleteMany({_id:{$in:demo_users_ids}});


    // Results
    let demo_results_ids = demo_results.map(u=>u._id)
    await db.result.deleteMany({_id:{$in:demo_results_ids}});

}

// COGNITIVE
async function createCognitiveData() {
    // #########################################
    // ###### REMOVING PREVIOUS VERSION ########
    await db.cognitiveTrait.deleteMany({});
    await db.cognitiveTip.deleteMany({});
    await db.cognitiveProfile.deleteMany({});
    await db.cognitiveArea.deleteMany({});
    await db.cognitiveFaq.deleteMany({});

    
    // My project blocks contents
    let projectCognitiveBlocksContentsIds = projectCognitiveBlocksContents.map(c=>c._id)
    await db.content.deleteMany({_id:{$in:projectCognitiveBlocksContentsIds}})
    db.content.insertMany(projectCognitiveBlocksContents, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })




    // My projects
    let projectsIds = projects.map(c=>c._id)
    await db.project.deleteMany({_id:{$in:projectsIds}})
    db.project.insertMany(projects, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })



    // Activities and materials
    // Remove by ID - as those models are not only used for cognitive data
    let contentsIds = cognitiveContents.map(c=>c._id)
    let contentFilesIds = cognitiveContentFiles.map(f=>f._id)
    let contentImagesIds = cognitiveContentImages.map(i=>i._id)

    await db.content.deleteMany({_id:{$in:contentsIds}})
    await db.contentFile.deleteMany({_id:{$in:contentFilesIds}})
    await db.contentImage.deleteMany({_id:{$in:contentImagesIds}})


    // #########################################
    // #### INSERTING ##########################
    let traits = cognitiveTraits
    db.cognitiveTrait.insertMany(traits, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    db.cognitiveProfile.insertMany(cognitiveProfiles, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    db.cognitiveTip.insertMany(cognitiveTips, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    db.cognitiveArea.insertMany(cognitiveAreas, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    db.cognitiveFaq.insertMany(cognitiveFaqs, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })

    await db.contentFile.insertMany(cognitiveContentFiles, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    await db.contentFile.insertMany(contentFile, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    await db.contentImage.insertMany(cognitiveContentImages, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
    await db.content.insertMany(cognitiveContents, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })


    return
}


////////////////////  REFs  ////////////////////
async function createAcademicYearRef() {
    return db.academicYearRef.insertMany(academicYearRefs, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createRolePermissionRef() {
    return db.rolePermissionRef.insertMany(rolePermissionRefs, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCategoryRef() {
    return db.categoryRef.insertMany(categoryRefs, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createGradingScaleRef() {
    return db.gradingScaleRef.insertMany(gradingScaleRefs, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createGroup() {
    return db.group.insertMany(groups, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createInterests() {
    return db.interest.insertMany(interests, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSubinterests() {
    return db.subinterest.insertMany(subinterests, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createEvent() {
    return db.event.insertMany(events, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createResults() {
    return db.result.insertMany(results, {ordered: false}, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSentinelResults() {
    return db.result.insertMany(sentinelResults, {ordered: false}, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createBraincoreTestsResults() {
    let all = braincorePedagogyTestsResults
    all = all.concat(braincorePedagogyTestsResultsAllLevels)
    all = all.concat(braincoreAdultTestsResults)
    all = all.concat(braincoreAdultTestsResultsAllLevels)
    
    let allIds = all.map(r=>r._id)
    await db.result.deleteMany({_id:{$in:allIds}})
    db.result.insertMany(all, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSoftSkillsTemplate() {

    return db.softSkillsTemplate.insertMany(softSkillsTemplates, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSoftSkill() {
    return db.softSkill.insertMany(softSkills, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCompetenceBlock() {
    return db.competenceBlock.insertMany(competenceBlocks, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCompetence() {
    return db.competence.insertMany(competences, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCertificate() {
    return db.certificate.insertMany(certificates, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCertificationSession() {
    return db.certificationSession.insertMany(certificationSessions, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCompany() {
    return db.company.insertMany(companies, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createInternship() {
    return db.internship.insertMany(internships, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createEnquiry() {

    return db.enquiry.insertMany(enquiries, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCourse() {
    return db.course.insertMany(courses, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCoursePath() {
    return db.coursePath.insertMany(coursePaths, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createBook() {
    return db.book.insertMany(books, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createTeam() {
    return db.team.insertMany(teams, { ordered: false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createBookAuthor() {
    return db.bookAuthor.insertMany(bookAuthors, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCertificateTemplate() {
    return db.contentimages.insertMany(certificateTemplates, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCourseImage() {
    return db.courseImage.insertMany(courseImages, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createCoursePathImage() {
    return db.coursePathImage.insertMany(coursePathImages, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createFormat() {
    return db.format.insertMany(formats, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createNotifications() {
    return db.notification.insertMany(notifications, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createSubjectSession() {
    return db.subjectSession.insertMany(subjectSessions, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

// Role Master
async function createRoleMasters() {
    await db.roleMaster.deleteMany({module: "ALL"});
    return db.roleMaster.insertMany(roleMasters, {ordered : false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}
// permissions
async function createPermissions() {
    await db.permissions.deleteMany({module: "ALL"});
    return db.permissions.insertMany(permissions, {ordered : false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}
// Role Permissions mapping
async function createRolePermissionsMappings() {
    await db.rolePermissionsMapping.deleteMany({roleMaster: {$in: 
        [
            "63c8f1cb88bbc68cce0eb2ea", // Administrator
            "64058db74037cfa1d4085598", // Trainee
            "64058e394037cfa1d4085599", // Trainer
            "64058e6a4037cfa1d408559a", // TrainingManager
        ]
    }});
    return db.rolePermissionsMapping.insertMany(rolePermissionsMappings, {ordered : false }, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

async function createContentFile() {
    return db.contentFile.insertMany(contentFile, (err) => { if (err) if (err.code!=11000){console.error(err.message)}; })
}

module.exports = {
    createDemo,
    createContent,
    createContentFile,
    createChapter,
    initFolder,
    createGroup,
    createTeam,
    // Cognitive
    createCognitiveData,
    createAcademicYearRef,
    createCategoryRef,
    createGradingScaleRef,
    createRolePermissionRef,
    createTrainingModule,
    createTrainingPath,
    createAdminUser,
    createEcosystem,
    createEcoManager,
    createCloudManager,
    createSubscriptionOwner,
    createModuleManager,
    createAssistant,
    createModuleCore,
    createArchitect,
    createClassManager,
    createLibrarian,
    createTrainer,
    createTrainee,
    createSentinelTrainee,
    createParent,
    createInspector,
    createCoordinator,
    createTrainingManager,
    createUserWithEmail,
    removeCollections,
    createInterests,
    createSubinterests,
    createCompetenceBlock,
    createCompetence,
    createEvent,
    createResults,
    createSentinelResults,
    createBraincoreTestsResults,
    createSoftSkillsTemplate,
    createSoftSkill,
    createCertificate,
    createCertificationSession,
    createPartner,
    createCompany,
    createInternship,
    createEnquiry,
    createCourse,
    createCoursePath,
    createBook,
    createBookAuthor,
    createCertificateTemplate,
    createCourseImage,
    createCoursePathImage,
    createFormat,
    createNotifications,
    createSubjectSession,
    createRoleMasters, // Role Master
    createPermissions, // permissions
    createRolePermissionsMappings, // Role Permissions Mapping
}
