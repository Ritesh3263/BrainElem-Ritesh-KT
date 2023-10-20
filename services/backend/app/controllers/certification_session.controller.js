const db = require("../models");
const utils = require("../utils/certificationSession");
const Certificate = require("../models/certificate.model");
const Content = require("../models/content.model"); //1
const Chapter = require("../models/chapter.model"); //2
const Course = require("../models/course.model"); //3
const CoursePath = require("../models/course_path.model"); //4
const CertificationSession = require("../models/certification_session.model"); //5
const Group = require("../models/group.model");
const Event = require("../models/event.model");
const User = require("../models/user.model");
const ModuleCore = require("../models/module_core.model");
const { getRawQueryForCertificationSession } = require("../utils/searchEngine");
const ObjectId = require("mongodb").ObjectId;
const certificationSessionAuthUtils = require("../utils/certificationSessionAuth");

exports.add = async (req, res) => {
  const certificationSession = new CertificationSession(req.body);
  certificationSession.module = req.moduleId;
  certificationSession.traineesCount = certificationSession.unassignedTrainees.length
  certificationSession.save()
  certificationSession.index(); // Reindex in elasticsearch 
  // check user modification permission!!
  let cert = await Certificate.findById(certificationSession.certificate)
    .populate([
      { path: "assignedCompetenceBlocks", select: "competences" },
      // { path: "externalCompetences", select: "title" }
    ])
  if (!cert) res.status(404).send({ message: "Not found" });
  else {
    let certificate = {
      _id: new ObjectId(),
      // status: true,
      certificate: cert._id,
      certificationSession: certificationSession._id,
      details: certificationSession.examiners?.map(examiner=>(
        {
          // status: true,
          _id: new ObjectId(),
          examiner: examiner,
          verificationDate: new Date(), // when is verified?
          // comment: 'This certification is added by '+req.userId,
          competenceBlocks: cert.assignedCompetenceBlocks?.map(cb=>(
            {
              block: cb._id,
              competences: cb.competences?.map(com=>({
              competence: com,
              // grade: '6'
            }))}
          )),
          externalCompetences: cert.externalCompetences?.map(eCom=>({
            competence: eCom,
            // grade: '4'
          }))
        }
      )),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    await User.updateMany({_id: { $in: certificationSession.unassignedTrainees }},
      { $push: { certificates: certificate }},
      { runValidators: true })
    res.status(200).json({message: "Created successfully", certificationSessionId: certificationSession._id});
  }
};

// create newAdd function to add new certification_session
exports.newAdd = async (req, res) => {
  // Allow on adding session without manager/category
  if(!req.body.trainingManager) delete req.body.trainingManager
  if(!req.body.category) delete req.body.category
  if(req.body.coursePath.certificate) req.body.certificate = req.body.coursePath.certificate
  if(req.body.coursePath.internships) req.body.internships = req.body.coursePath.internships
  
    // deal with new groups 
    let groupId = new ObjectId();
    let group = await db.group.create({
      ...req.body.groups[0],
      _id: groupId,
      name: req.body.groups[0].name,
      module: req.moduleId,
      coursePath: req.body.coursePath,
      // duplicatedCoursePath: newCoursePathId,
    })

    
  let currentSession = new CertificationSession({...req.body, groups: [group]});
  currentSession.module = req.moduleId;
  currentSession.trainingManager = req.userId;
  currentSession.examiners = [req.userId];
  currentSession.traineesCount = currentSession.unassignedTrainees.length





  await currentSession.save()
  currentSession = await CertificationSession.findById(currentSession._id).populate([
    { path: "examiners", select: "name surname email settings.role" },
    { path: "trainingManager", select: "name surname"},
    { path: "unassignedTrainees", select: "name surname"},
    { path: "internships"},
    { path: "certificate"},
    { path: "category"},
    { path: "event"},
    { path: "coursePath", select: "name description image courses" , populate: [
      { path: "courses", select: "name chosenChapters", populate: [
          { path: "chosenChapters.chapter", select: "name description level type" },
          { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
      ]}
    ]},
    { path: "groups", populate: [
      { path: "trainees" },
      { path: "examiner", select: "name surname email" },
      { path: "coursePath", select: "name description image" },
      { path: "duplicatedCoursePath", select: "name courses", populate: [
        { path: "courses", select: "name chosenChapters", populate: [
            { path: "chosenChapters.chapter", select: "name description level type" },
            { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
        ]},
        { path: "category", select: "name"}
      ]},
    ]},
  ])
  

      // DUPLICATING COURSE PATH::
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    
    let duplicatedCoursesList = []
    let duplicatedChaptersList = []
    let justContentsList = []
    let duplicatedCoursesObject = []
    let duplicatedChaptersObject = []
    let newCoursePathId = new ObjectId();
    // duplicating coursePath
    const newCoursePath = new CoursePath({
      _id: newCoursePathId,
      courses: currentSession.coursePath.courses,
      name: currentSession.coursePath.name,
      category: currentSession.coursePath.category,
      description: currentSession.coursePath.description,
      level: currentSession.coursePath.level,
      type: currentSession.coursePath.type,
      module: currentSession.coursePath.module,
      creator: currentSession.coursePath.creator,
      origin: currentSession.coursePath._id,
    });
    
    currentSession.coursePath.courses.forEach((course) => {
      let newCourseId = new ObjectId();
        duplicatedCoursesList[course._id] = newCourseId
        const newCourse = new Course({
          _id: newCourseId,
          name: course.name,
          description: course.description,
          level: course.level,
          type: course.type,
          module: course.module,
          creator: course.creator,
          chosenChapters: course.chosenChapters,
          origin: course._id,
        });
        duplicatedCoursesObject[newCourseId] = newCourse;
  
        course.chosenChapters.forEach((chapter) => {
          let newChapterId = new ObjectId();
          duplicatedChaptersList[chapter['chapter']?._id] = newChapterId
          const newChapter = new Chapter({
            _id: newChapterId,
            name: chapter['chapter']?.name,
            module: chapter['chapter']?.module,
            description: chapter['chapter']?.description,
            dependantChapters: chapter['chapter']?.dependantChapters,
            // assignedContent: chapter['chapter']?.assignedContent, // no need, as this is used only for BLUE EYE = curriculum creations
            creator: chapter['chapter']?.creator,
            level: chapter['chapter']?.level,
            type: chapter['chapter']?.type,
            durationTime: chapter['chapter']?.durationTime,
            origin: chapter['chapter']?._id,
          });
  
        duplicatedChaptersObject[newChapterId] = newChapter;
        chapter.chosenContents.forEach((content) => {
          justContentsList[content['content']?._id] = content['content']?._id;  
        });
      });
      course = newCourseId;
    });
  
    // saving duplicated  coursePaths
    newCoursePath.courses = newCoursePath.courses.map(course=>{
      if(duplicatedCoursesList[course._id]){
        course = duplicatedCoursesList[course._id]
        return course;
      }
    })
    await newCoursePath.save();

    group.duplicatedCoursePath = newCoursePath._id;
    await group.save();
  
    // update chapters&contents IDs in duplicatedCoursesObject, to have duplicated IDs instead of original
    let coursesKeys = Object.keys(duplicatedCoursesObject)
    coursesKeys.forEach(x=>{
      duplicatedCoursesObject[x].chosenChapters.map(y=>{
           y.chapter = duplicatedChaptersList[y.chapter];
            y.chosenContents.forEach(z=>{
              z.content = justContentsList[z.content];
              return z;
            })
           return y;
  
      })
    })
  
    // saving duplicated courses
    coursesKeys.forEach(x=>{
      duplicatedCoursesObject[x].save();
    })
  
    // saving duplicated chapters
    let chaptersKeys = Object.keys(duplicatedChaptersObject)
    chaptersKeys.forEach(x=>{
      if(duplicatedChaptersObject[x].name){
        duplicatedChaptersObject[x].save(function(err){
            if(err){
                  console.log(err);
                  return;
            }
          });
      }
    })
  
  currentSession.save()
  currentSession.index(); // Reindex in elasticsearch

  res.status(200).json({message: "Created successfully", certificationSessionId: currentSession._id});
};

exports.read = async (req, res) => {
  let certificationSession = await CertificationSession.findById(req.params.certificationSessionId)
    .populate([
      {path: "trainees", select: "name surname email"},
      {path: "examiners", select: "name surname email"},
      {path: "internships"},
      {path: "groups" , populate: [
        {path: "duplicatedCoursePath", select: "name courses", populate: [
          { path: "courses", select: "name chosenChapters",
            populate: [
              { path: "chosenChapters.chapter", select: "name description level type" },
              { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
            ]
          },
          { path: "category", select: "name"}
        ]},
      ]},
    ])
  if (!certificationSession) res.status(404).send({ message: "Not found" });
  else res.status(200).json(certificationSession);
};

// Get overview details about certification session
exports.getCertificationSessionOverview = async (req, res) => {
  let certificationSession = await CertificationSession.findById(req.params.certificationSessionId)
    .populate([
      { path: "trainingManager", select: "name surname"},
      { path: "internships"},
      { path: "certificate"},
      { path: "category"},
      { path: "event"},
      { path: "coursePath", select: "name description image" }
    ])
  if (!certificationSession) res.status(404).send({ message: "Not found" });
  else {
    certificationSession = certificationSession.toObject()
    certificationSession.paymentRequired = await certificationSessionAuthUtils.isPaymentRequired(req.userId, certificationSession)
    console.log(certificationSession)
    res.status(200).json(certificationSession);
  }
}

exports.newRead = async (req, res) => {
  let certificationSession = await CertificationSession.findOne({
    _id: req.params.certificationSessionId,
    archived: false
  }).populate([
      { path: "examiners", select: "name surname email settings.role" },
      { path: "trainingManager", select: "name surname"},
      { path: "unassignedTrainees", select: "name surname"},
      { path: "internships"},
      { path: "certificate"},
      { path: "category"},
      { path: "event"},
      { path: "coursePath", select: "name description image" },
      { path: "groups", populate: [
        { path: "trainees", select: "name surname"},
        { path: "examiner", select: "name surname email" },
        { path: "coursePath", select: "name description image" },
        { path: "duplicatedCoursePath", select: "name courses", populate: [
          { path: "courses", select: "name chosenChapters", populate: [
              { path: "chosenChapters.chapter", select: "name description level type" },
              { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
          ]},
          { path: "category", select: "name"}
        ]},
      ]},
    ])
  if (!certificationSession) res.status(404).send({ message: "Not found" });
  else {
    switch (req.role) { // role based filtering
      case 'Trainee':
        certificationSession.groups = certificationSession.groups.filter(g => g.trainees.some(t => t._id.toString() === req.userId.toString()));
        // res.status(200).json(certificationSession);
        break;
      default:
        break;
    }
    res.status(200).json(certificationSession);
  }
};

exports.newReadPublic = async (req, res) => {
  let certificationSession = await CertificationSession.findById(req.params.certificationSessionId)
    .populate([
      { path: "examiners", select: "name surname email settings.role" },
      { path: "trainingManager", select: "name surname"},
      { path: "unassignedTrainees", select: "name surname"},
      { path: "internships"},
      { path: "groups", populate: [
        { path: "trainees", select: "name surname email" },
        { path: "examiner", select: "name surname email" },
        { path: "coursePath", select: "name description image" },
        { path: "duplicatedCoursePath", select: "name courses", populate: [
          { path: "courses", select: "name chosenChapters", populate: [
            { path: "chosenChapters.chapter", select: "name description level type" },
            { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
          ]},
          { path: "category", select: "name"}
        ]},
      ]},
    ])
  if (!certificationSession) res.status(404).send({ message: "Not found" });
  else res.status(200).json(certificationSession);
};

exports.newGetContent = async (req, res) => {
  let [content, user] = await Promise.all([
    db.content.findById(req.params.contentId).lean(),
    User.findOne({ _id: req.userId }, { sessionContentProgress: 1 }).lean()
  ]) 
  let progress = user.sessionContentProgress.find(p => p.contentId.toString() == req.params.contentId);
  content.status = progress?.status;
  if (!content) res.status(404).send({ message: "Not found" });
  else res.status(200).json(content);
};

exports.newReadCourse = async (req, res) => {
  const courseId = req.params.courseId;
  // optionals 
  const sessionId = req.params.sessionId;
  const groupId = req.params.groupId;
  const userId = req.params.userId||req.userId;

  const [user, course] = await Promise.all([
    // CertificationSession.findOne({ "_id": sessionId }).populate({ path: "enquiry" }),
    User.findOne({ _id: userId }, { sessionContentProgress: 1 }),
    Course.findById(courseId).populate([
      { path: "chosenChapters.chapter", select: "name description level type origin" },
      { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime origin hideFromTrainees" }
    ]).lean()
  ]);

  let contentIds = course.chosenChapters.flatMap(chapter => chapter.chosenContents.map(content => content.content));
  let events = await Event.find({ $and: [
      { addedFromGradebook: { $exists: false } },
      // { assignedGroup: groupId },
      // { assignedSession: sessionId },
      { assignedCourse: courseId },
      { assignedContent: { $in: contentIds } }
    ]}).sort('-createdAt')


  course.chosenChapters.forEach(chapter => {
    chapter.chosenContents.forEach(content => {
      let allContentEvents = events.filter(e => e.assignedContent.toString() === content.content._id.toString());
      let leatestContentEvent = allContentEvents[0]
      let progress = user.sessionContentProgress.find(p => p.contentId.toString() === content.content._id.toString());
      
      // Single content in the session can have multiple events assigned to it. 
      // So setting eventId and eventType on the content itself might be confusing.
      content.content.eventType = leatestContentEvent?.eventType;
      content.content.eventId = leatestContentEvent?._id;
      content.content.date = leatestContentEvent?.date;
      // Instead send full list of all associated events
      content.content.events = allContentEvents;

      content.content.status = progress?.status;
    });
  });

  res.status(200).json(course);

};

exports.readAll = async (req, res) => {
  let certificationSessions = await CertificationSession.find({ module: req.moduleId})
  res.status(200).json(certificationSessions);
};

exports.readAllTemplateSessions = async (req, res) => {
  let certificationSessions = await CertificationSession.find({ module: req.moduleId, origin: {$exists: false}})
  res.status(200).json(certificationSessions);
};

exports.readAllArchivedSessions = async (req, res) => { 
  let certificationSessions = await CertificationSession.find({module: req.moduleId, archived: true, enquiry: {$exists: true}})
    .populate([
      { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
      { path: "trainingPath", select: "name trainingModules", populate: [
        { path: "trainingModules.originalTrainingModule", select: ["name"] },
        { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
        { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
      ]},
      { path: "groups", select: "name trainees examiners", populate: [
        { path: "duplicatedCoursePath", select: "name courses", populate: [
          { path: "category", select: "name"},
          { path: "courses", select: "name chosenChapters", populate: [
            { path: "chosenChapters.chapter", select: "name description level type" },
            { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
          ]},
        ]},
      ]},
    ])
  res.status(200).json(certificationSessions);
} 

exports.readAllArchivedSessionsWithoutCompany = async (req, res) => { 
  let certificationSessions = await CertificationSession.find({module: req.moduleId, archived: true, enquiry: {$exists: false}})
    .populate([
      { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
      { path: "trainingPath", select: "name trainingModules", populate: [
        { path: "trainingModules.originalTrainingModule", select: ["name"] },
        { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
        { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
      ]},
      { path: "groups", select: "name trainees examiners", populate: [
        { path: "duplicatedCoursePath", select: "name courses", populate: [
          { path: "category", select: "name"},
          { path: "courses", select: "name chosenChapters", populate: [
            { path: "chosenChapters.chapter", select: "name description level type" },
            { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
          ]},
        ]},
      ]},
    ])
  res.status(200).json(certificationSessions);
} 

exports.readAllUserSessionsWithoutCompany = async (req, res) => { 
  if (req.role ===  'TrainingManager'){
    let certificationSessions = await CertificationSession.find({
        module: req.moduleId,
        archived: false,
        trainingManager: req.userId, 
        enquiry: {$exists: false}
      })
      .populate([{
          path: "trainingPath",
          select: "name trainingModules",
          populate: [
            { path: "trainingModules.originalTrainingModule", select: ["name"] },
            { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
          ],
        },
        { path: "category", select: "name"}
      ])
    res.status(200).json(certificationSessions);
  } 
  else if (req.role === 'ModuleManager'){
    let certificationSessions = await CertificationSession.find({module: req.moduleId, archived: false, enquiry: {$exists: false}})
      .populate([
        { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
        { path: "category", select: "name"},
        { path: "trainingPath", select: "name trainingModules", populate: [
          { path: "trainingModules.originalTrainingModule", select: ["name"] },
          { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
        ]},
        { path: "groups", select: "name trainees examiners", populate: [
          { path: "duplicatedCoursePath", select: "name courses", populate: [
            { path: "category", select: "name"},
            { path: "courses", select: "name chosenChapters", populate: [
              { path: "chosenChapters.chapter", select: "name description level type" },
              { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
            ]},
          ]},
        ]},
      ])
    res.status(200).json(certificationSessions);
  }
  else {
    let certificationSessions = await CertificationSession.find({$or: [{examiners: req.userId },{trainingManager: req.userId}], archived: false,  enquiry: {$exists: false}})
      .populate([
        { path: "trainingPath",
          select: "name trainingModules",
          populate: [
            { path: "trainingModules.originalTrainingModule", select: ["name"] },
            { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
          ],
        },
        { path: "duplicatedCoursePath", select: "name courses", populate: 
            [{ 
                path: "courses", select: "name chosenChapters" ,
                populate: [
                  { path: "chosenChapters.chapter", select: "name description level type" },
                  { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
                ]
              },
              { path: "category", select: "name"}
            ]},
        { path: "groups",
          select: "name trainees examiners",
        },
        { path: "category", select: "name"}
      ])

    switch (req.role) { // role based filtering
      case 'Trainer':{
        let events = await db.event.find({
          assignedSession: { $in: certificationSessions.map(cs => cs._id) },
          assignedTrainer: req.userId,
        })
        if (events.length > 0) {
          res.status(200).json(certificationSessions.filter(cs=>(
            cs.examiners?.find(e=>e.equals(req.userId)) ||
            events.find(e => e.assignedSession.equals(cs._id))
          )));
        } else {
          res.status(200).json(certificationSessions.filter(cs => cs.examiners?.find(e => e.equals(req.userId))));
        }
        break;
      }
      default:{
        res.status(200).json(certificationSessions);
        break;
      }
    }
  }
};

exports.readAllUserSessions = async (req, res) => { 
  if (req.role ===  'TrainingManager'){
    let certificationSessions = await CertificationSession.find({
        module: req.moduleId,
        archived: false,
        // trainingManager: req.userId, 
        enquiry: {$exists: true}
      })
      .populate([{
          path: "trainingPath",
          select: "name trainingModules",
          populate: [
            { path: "trainingModules.originalTrainingModule", select: ["name"] },
            { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
          ],
        },
        { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
        { path: "category", select: "name"},
      ])
    res.status(200).json(certificationSessions);
  } else if (req.role === 'ModuleManager'){
    let certificationSessions = await CertificationSession.find({module: req.moduleId, archived: false, enquiry: {$exists: true}})
      .populate([
        { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
        { path: "category", select: "name"},
        { path: "trainingPath", select: "name trainingModules", populate: [
          { path: "trainingModules.originalTrainingModule", select: ["name"] },
          { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
        ]},
        { path: "groups", select: "name trainees examiners", populate: [
          { path: "duplicatedCoursePath", select: "name courses", populate: [
            { path: "category", select: "name"},
            { path: "courses", select: "name chosenChapters", populate: [
              { path: "chosenChapters.chapter", select: "name description level type" },
              { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
            ]},
          ]},
        ]},
      ])
    res.status(200).json(certificationSessions);
  } else if (req.role == 'Coordinator'){
    let certificationSessions = await CertificationSession.find({
        enquiry: {$exists: true},
        module: req.moduleId,
        archived: false,
        // coordinator: req.userId, for the moment allow coordinator to load all sessions
      })
      .populate([{
          path: "trainingPath",
          select: "name trainingModules",
          populate: [
            { path: "trainingModules.originalTrainingModule", select: ["name"] },
            { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
            { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
          ],
        },
        { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
        { path: "category", select: "name"}
      ])
    res.status(200).json(certificationSessions);
  } else {
    let certificationSessions = await CertificationSession.find({
        $and: [
          // { module: req.moduleId },
          { $or: [{archived: false}, {archived: {$exists: false}}], },
        ]
      })
      .populate(
        [
          { path: "trainingPath",
            select: "name trainingModules",
            populate: [
              { path: "trainingModules.originalTrainingModule", select: ["name"] },
              { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
              { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
            ],
          },
          { path: "duplicatedCoursePath", select: "name courses", populate: 
              [{ 
                  path: "courses", select: "name chosenChapters" ,
                  populate: [
                    { path: "chosenChapters.chapter", select: "name description level type" },
                    { path: "chosenChapters.chosenContents.content", select: "title contentType durationTime" },
                  ]
                },
                { path: "category", select: "name"}
              ]},
          {
            path: "groups",
            select: "name trainees examiners",
          },
          { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },
          { path: "category", select: "name"},
          { path: "coursePath", select: "image"}
        ]
      )
    switch (req.role) { // role based filtering
      case 'Trainee':{
        let user = await User.findOne({_id: req.userId}, {certificates:1})
        let cSessions = JSON.parse(JSON.stringify(certificationSessions));
        cSessions = cSessions.filter(cs => cs.groups.some(g => g.trainees.some(t => t == req.userId)) || cs.unassignedTrainees.some(t => t == req.userId))

        for (const cs of cSessions) {
          cs.hasCertificate = user.certificates.some(c => (c.certificationSession == cs._id && c.status))
          cs.paymentRequired = await certificationSessionAuthUtils.isPaymentRequired(req.userId, cs)
        }
        res.status(200).json(cSessions);
        break;
      }
      case 'Examiner':{
        res.status(200).json(certificationSessions.filter(cs => cs.groups.some(g => g.examiners.some(e => e._id.toString() === req.userId.toString()))));
        break;
      }
      case 'Partner':{
        res.status(200).json(certificationSessions.filter(cs => cs.enquiry?.company?.owner.equals(req.userId)));
        break;
      }
      case 'Trainer':{
        let events = await db.event.find({
            assignedSession: { $in: certificationSessions.map(cs => cs._id) },
            assignedTrainer: req.userId,
          })
        if (events.length > 0) {
          res.status(200).json(certificationSessions.filter(cs=>(
            cs.examiners?.find(e=>e.equals(req.userId)) ||
            events.find(e => e.assignedSession.equals(cs._id)) ||
            cs.groups.some(g => g.trainees.some(t => t._id.toString() === req.userId.toString())) || // trainee logic from takeCourse()
            cs.unassignedTrainees.some(t => t._id.toString() === req.userId.toString()) // trainee logic from takeCourse()
          )));
        } else {
          res.status(200).json(certificationSessions.filter(cs => 
            cs.examiners?.find(e => e.equals(req.userId)) ||
            cs.groups.some(g => g.trainees.some(t => t._id.toString() === req.userId.toString())) || // trainee logic from takeCourse()
            cs.unassignedTrainees.some(t => t._id.toString() === req.userId.toString()) // trainee logic from takeCourse()
          ));
        }
        break;
      }

      // IF BC COACH CANDIDATE LOAD ONLY SESSIONS LIKE FOR TRAINEE : g => g.trainees.some(t => t == req.userId))
      // IF BC TRAINER LOAD ALL SESSIONS 
      // BOTH ABOVE HAVE ROLE: OTHER
      case 'Other':{
        let user = await User.findOne({_id: req.userId}, {certificates:1})
        if ((await user.getPermissions()).bcTrainer.access) res.status(200).json(certificationSessions.filter(cs => cs.groups.some(g => g.examiners.some(t => t == req.userId))))
        else if ((await user.getPermissions()).bcCoach.access) res.status(200).json(certificationSessions.filter(cs => cs.groups.some(g => g.trainees.some(t => t == req.userId))))
        // else res.status(200).json(certificationSessions.filter(cs => cs.groups.some(g => g.trainees.some(t => t == req.userId)) || cs.unassignedTrainees.some(t => t == req.userId)))
        else res.status(200).json(certificationSessions)
        break;
      }
      default:{
        res.status(200).json(certificationSessions);
        break;
      }
    }
  }
};

exports.readAllUserSessionsInCertificate = async (req, res) => {
  if(req.role === 'ModuleManager'){
    let certificationSessions = await CertificationSession.find({ module: req.moduleId, certificate: req.params.certificationId})
      .populate({
        path: "trainingPath", 
        select: "name trainingModules",
        populate: [
          { path: "trainingModules.originalTrainingModule", select: ["name"] },
          { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
        ],
      },
      { path: "enquiry", select: "name company", populate: { path: "company", select: "name owner" } },)
    res.status(200).json(certificationSessions);
  }
  else{
    let certificationSessions = await CertificationSession.find({ 
          module: req.moduleId,
          certificate: req.params.certificationId,
          $or: [{examiners: req.userId },{trainees: req.userId}, {trainingManager: req.userId}]}) // examiners and trainees not anymore in model.. to be updated
      .populate({
        path: "trainingPath",
        select: "name trainingModules",
        populate: [
          { path: "trainingModules.originalTrainingModule", select: ["name"] },
          { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
          { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
        ],
      })
    res.status(200).json(certificationSessions);
  }
};

exports.readTraineeSessions = async (req, res) => {
  let certificationSessions = await CertificationSession.find({module: req.moduleId, trainees: { $in: req.params.traineeId}})
    .populate({
      path: "trainingPath",
      select: "name trainingModules",
      populate: [
        { path: "trainingModules.originalTrainingModule", select: ["name"] },
        { path: "trainingModules.chosenChapters.chapter", select: ["name"] },
        { path: "trainingModules.chosenChapters.chosenContents.content", select: ["title"] },
      ],
    })
  res.status(200).json(certificationSessions);
};

exports.update = async (req, res) => {
  //remove not needed enquiry ID
  delete req.body.enquiry
  
  let currentSession = await CertificationSession.findOne({"_id":req.params.certificationSessionId})
    .populate({
      path: "coursePath",
      populate: [
        { path: "courses",
          populate: [
            { path: "chosenChapters.chapter" },
            { path: "chosenChapters.chosenContents.content" }
          ]
        }
      ],
    })

  let newGroups = req.body.groups.filter(g=>g.new); 
  let oldGroups = req.body.groups.filter(g=>!g.new);
  let groups = [];
  let groupIDs = [];
  newGroups.forEach(ng => {

    // DUPLICATING COURSE PATH::
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    
    let duplicatedCoursesList = []
    let duplicatedChaptersList = []
    let justContentsList = []
    let duplicatedCoursesObject = []
    let duplicatedChaptersObject = []
    let newCoursePathId = new ObjectId();
    // duplicating coursePath
    const newCoursePath = new CoursePath({
      _id: newCoursePathId,
      courses: currentSession.coursePath.courses,
      name: currentSession.coursePath.name,
      category: currentSession.coursePath.category,
      description: currentSession.coursePath.description,
      level: currentSession.coursePath.level,
      type: currentSession.coursePath.type,
      module: currentSession.coursePath.module,
      creator: currentSession.coursePath.creator,
      origin: currentSession.coursePath._id,
    });
    
    currentSession.coursePath.courses.forEach((course) => {
      let newCourseId = new ObjectId();
        duplicatedCoursesList[course._id] = newCourseId
        const newCourse = new Course({
          _id: newCourseId,
          name: course.name,
          description: course.description,
          level: course.level,
          type: course.type,
          module: course.module,
          creator: course.creator,
          chosenChapters: course.chosenChapters,
          origin: course._id,
        });
        duplicatedCoursesObject[newCourseId] = newCourse;
  
        course.chosenChapters.forEach((chapter) => {
          let newChapterId = new ObjectId();
          duplicatedChaptersList[chapter['chapter']?._id] = newChapterId
          const newChapter = new Chapter({
            _id: newChapterId,
            name: chapter['chapter']?.name,
            module: chapter['chapter']?.module,
            description: chapter['chapter']?.description,
            dependantChapters: chapter['chapter']?.dependantChapters,
            // assignedContent: chapter['chapter']?.assignedContent, // no need, as this is used only for BLUE EYE = curriculum creations
            creator: chapter['chapter']?.creator,
            level: chapter['chapter']?.level,
            type: chapter['chapter']?.type,
            durationTime: chapter['chapter']?.durationTime,
            origin: chapter['chapter']?._id,
          });
  
        duplicatedChaptersObject[newChapterId] = newChapter;
        chapter.chosenContents.forEach((content) => {
          justContentsList[content['content']?._id] = content['content']?._id;  
        });
      });
      course = newCourseId;
    });
  
    // saving duplicated  coursePaths
    newCoursePath.courses = newCoursePath.courses.map(course=>{
      if(duplicatedCoursesList[course._id]){
        course = duplicatedCoursesList[course._id]
        return course;
      }
    })
    newCoursePath.save();
  
    // update chapters&contents IDs in duplicatedCoursesObject, to have duplicated IDs instead of original
    let coursesKeys = Object.keys(duplicatedCoursesObject)
    coursesKeys.forEach(x=>{
      duplicatedCoursesObject[x].chosenChapters.map(y=>{
           y.chapter = duplicatedChaptersList[y.chapter];
            y.chosenContents.forEach(z=>{
              z.content = justContentsList[z.content];
              return z;
            })
           return y;
  
      })
    })
  
    // saving duplicated courses
    coursesKeys.forEach(x=>{
      duplicatedCoursesObject[x].save();
    })
  
    // saving duplicated chapters
    let chaptersKeys = Object.keys(duplicatedChaptersObject)
    chaptersKeys.forEach(x=>{
      if(duplicatedChaptersObject[x].name){
        duplicatedChaptersObject[x].save(function(err){
            if(err){
                  console.log(err);
                  return;
            }
          });
      }
    })

    
    // END OF DUPLICATION
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________
    // ________________________________________________________

    let groupId = new ObjectId();
    groupIDs.push(groupId);
    groups.push(
      new db.group({
        ...ng,
        _id: groupId,
        module: req.moduleId,
        coursePath: currentSession?.coursePath,
        duplicatedCoursePath: newCoursePathId,
      })
    );
  });

  // updates users of already existning groups 
  oldGroups.map(async x=>{
    // let trainees = x.trainees.map(y=>y._id);
    await Group.findOneAndUpdate(
      { _id: x._id },
      { $set: { trainees: x.trainees.map(y=>y._id) } },
      { runValidators: true });
  })

  // list of all trainees in old and new groups, for certification update
  const allTrainees = [];

  oldGroups.map(x=>{
    x.trainees.map(y=>{
      allTrainees.push(y._id)
    })
  })
  newGroups.map(x=>{
    x.trainees.map(y=>{
      allTrainees.push(y._id)
    })
  })
  

  // https://gitlab.elia.academy/root/elia/-/issues/371
  // also: having different naming in frontend, assignedCertificate vs certificate
  // if(!req.body.assignedCertificate) 
  // req.body.certificate = currentSession.certificate
  // else
  // req.body.certificate = req.body.assignedCertificate;
  // commmented as someone update the frontent and it start working 

  
  // req.body.groups = oldGroups.map(g=>g._id); // only ID of groups are needed
  // req.body.groups = req.body.groups.concat(groupIDs); // add new group IDs to the list of groups in the session
  await db.group.insertMany(groups)
  
  
  // ADD groups IDS to CORE
  await ModuleCore.findOneAndUpdate(
    { moduleId: req.moduleId },
    { $push: { groups: { $each: groupIDs } } },
    { runValidators: true })

  let cSession = await CertificationSession.findOneAndUpdate(
    { _id: req.params.certificationSessionId },
    { $set: {...req.body, groups:[...oldGroups.map(g=>g._id), ...groupIDs]} },
    { runValidators: true, new: true })
  cSession.index();// Reindex in elasticsearch
  // check user modification permission!!
  let cert = await Certificate.findById(cSession.certificate)
    .populate({ path: "assignedCompetenceBlocks", select: "competences" })
  if (!cert) console.error({ message: "Not found 2 " });
  else {
    let certificate = {
      _id: new ObjectId(),
      status: false,
      certificate: cert._id,
      certificationSession:req.params.certificationSessionId,
      details: cSession.examiners?.map(examiner=>(
        {
          // status: true, // no need anymore as just TrainingMager is certrifying 
          _id: new ObjectId(),
          examiner: examiner,
          status: false,
          verificationDate: new Date(), // when is verified?
          comment: '',
          competenceBlocks: cert.assignedCompetenceBlocks?.map(cb=>(
            {
              block: cb._id,
              competences: cb.competences?.map(com=>({
              competence: com,
              // grade: '6'
            }))}
          )),
        }
      )),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    let users = await User.find({_id: { $in: allTrainees }})
    let userIds = users.filter(u=>!u.certificates.find(c=>c.certificationSession.equals(req.params.certificationSessionId))).map(u=>u._id)
    await User.updateMany(
      {_id: { $in: userIds }},
      { $addToSet: { certificates: certificate }},
      { runValidators: true },
      (err) => console.error({ message: err })
    )

    // when new examiners are added: update their certificates
    let newExaminers = req.body.examiners?.filter(x=>!cSession.examiners.find(y=>y.equals(x._id)))
    if(newExaminers.length>0){
      newExaminers.forEach(async newExaminerId => {
        allTrainees.forEach(async element => {
          await User.findOneAndUpdate(
            { _id: element, 'certificates.certificationSession': req.params.certificationSessionId },
            { $push:  {"certificates.$.details": {
                examiner:newExaminerId,
                status: false,
                competenceBlocks:[],
                externalCompetences:[],
                comment:''
              }} },
            { runValidators: true })
        });
      });
    }
    // when examiners are removed: update their certificates
    let deletedExaminers = cSession.examiners?.filter(x=>!req.body.examiners.find(y=>y._id==x))
    if(deletedExaminers.length>0){
      deletedExaminers.forEach(async deletedExaminerId => {
        allTrainees.forEach(async element => {
          await User.findOneAndUpdate(
            { _id: element, 'certificates.certificationSession': req.params.certificationSessionId },
            { $pull:  {"certificates.$.details": {examiner: deletedExaminerId}} },
            { runValidators: true });
        });
      });
    }
  }
  ////////// INTERNSHIP  ////////////
  if (req.role === 'ModuleManager') {
    let users = await User.find({ _id: { $in: req.body.groups.map(g=>g.trainees)?.flat()||[] } }) 
    let newInternships = req.body.internships.filter(i => i.new);
    let discardedInternships = currentSession.internships.filter(i=>!req.body.internships.find(x=>x._id==i.toString()))
    if (newInternships.length>0||discardedInternships.length>0) {
      await User.bulkWrite(
        users.map(u => (
          {updateOne: {
            filter: { _id : u._id },
            update: { 
              $set: {
                certificates: u.certificates.map(c=>{
                  let cc = JSON.parse(JSON.stringify(c));
                  if (cc.certificationSession == req.params.certificationSessionId){
                    return {...cc, internshipStatus: false}
                  } else return cc
                }),
                internships: u.internships.filter(i=>!discardedInternships.find(di=>di.toString()==i.internship.toString())).concat(newInternships.filter(i=>!u.internships.find(x=>x.internship.equals(i._id))).map(i=>({internship: i._id, status: false})))
              }, 
            },
            upsert: false
          }}
        )),
      )
    } 
  } else if (req.role === 'TrainingManager') {
    let newUnassignedTrainees = req.body.groups.map(g=>g.trainees?.filter(tr => tr.new)).flat();
    if (newUnassignedTrainees.length > 0) {
      let users = JSON.parse(JSON.stringify(await User.find({ _id: { $in: newUnassignedTrainees.map(x=>x._id) } })))
      let updatedUsers = users.map(u => {
        let internshipIds = u.internships.map(i => i.internship);
        let addInternships = req.body.internships.filter(i => internshipIds.indexOf(i._id) === -1);
        u.certificates = u.certificates.map(c=>{
          if(c.certificationSession==req.params.certificationSessionId){
            c.internshipStatus = false;
          }
          return c
        })
        u.internships = u.internships.concat(addInternships.map(i=>({internship: i._id, status: false})))
        return u
      })
      await User.bulkWrite(
        updatedUsers.map(u => (
          {updateOne: {
            filter: { _id : u._id },
            update: { $set: {certificates: u.certificates, internships: u.internships} },
            upsert: false
          }}
        )),
      )
    }
    if (req.body.deletedUnassignedTrainees?.length>0) {
      let users = JSON.parse(JSON.stringify(await User.find({ _id: { $in: req.body.deletedUnassignedTrainees||[] } })))
      let internshipIdsToRemove = req.body.internships.map(i=>i._id)
      let updatedUsers = users.map(u => {
        u.internships = u.internships.filter(i => internshipIdsToRemove.indexOf(i.internship) === -1);
        return u
      });
      // what about internship status in certificate?
      await User.bulkWrite(
        updatedUsers.map(u => (
          {updateOne: {
            filter: { _id : u._id },
            update: { $set: {internships: u.internships} },
            upsert: false
          }}
        )),
      )
    }
  }
  res.status(200).json({ message: "Updated successfully!" });
};

exports.remove = async (req, res) => {
  await CertificationSession.findByIdAndDelete(req.params.certificationSessionId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readUserTrackers = async (req, res) => {
  let user = await User.findOne(
    {_id: req.params.userId},
    {sessionProgress: 1})
  if (!user) res.status(404).send({ message: "User not found" });
  else {
    let tracker = user.sessionProgress.filter(x=>x.certificationSessionId.equals(req.params.certificationSessionId))
    if (tracker?.length>0) res.status(200).json(tracker)
    else res.status(404).send({ message: "Not found" })
  }
};

exports.readUserContentProgress = async (req, res) => {
  let user = await User.findOne(
      {_id: req.params.userId},
      {sessionContentProgress: 1})
  if (!user) res.status(404).send({ message: "User not found" });
  if(req.params.userId !== req.userId && (await user.getPermissions()).bcCoach.access) 
    return res.status(404).send({ message: "No access" })
  let tracker = user.sessionContentProgress.filter(x=>x.contentId.equals(req.params.contentId))
  if (tracker?.length>0) res.status(200).json(tracker)
  else res.status(404).send({ message: "Not found" })
};


exports.readAllContentProgressOfUserInSession = async (req, res) => {
  let user = await User.findOne(
    {_id: req.params.userId},
    {sessionContentProgress: 1})
  if (!user) res.status(404).send({ message: "User not found" });
  if(req.params.userId !== req.userId && (await user.getPermissions()).bcCoach.access) 
  return res.status(404).send({ message: "No access" })
  let tracker = user.sessionContentProgress.filter(x=>x?.certificationSessionId?.equals(req.params.certificationSessionId))
  if (tracker?.length>0) res.status(200).send(tracker)
  else res.status(404).send({ message: "Not found" })
};

exports.archive = async (req, res) => {
  await CertificationSession.findOneAndUpdate(
    { _id: req.params.certificationSessionId },
    { $set: {archived: true}},
    { runValidators: true })
  res.status(200).json({ message: "Session has been archived successfully" });
};

exports.restore = async (req, res) => {
  await CertificationSession.findOneAndUpdate(
    { _id: req.params.certificationSessionId },
    { $set: {archived: false}},
    { runValidators: true })
  res.status(200).json({ message: "Session has been restored successfully" });
};


exports.readAllTraineesFromTemplate = async (req, res) => {
  let session = await db.certificationSession.findById(req.params.certificationSessionId)
  let users = await User.find(
    // {_id: { $in: session.map(a => a._id) }},
    {_id: { $in: session.unassignedTrainees }})
  res.status(200).json(users);
};

exports.saveUserTracker = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (!user) res.status(404).send({ message: "User not found" });
  else {
    let found = user.sessionProgress.find(t=>(t.certificationSessionId.equals(req.params.certificationSessionId) && t.latestChapterId.equals(req.params.chapterId)))
    if (found) user.sessionProgress = user.sessionProgress.map(t=>{
        if(t.certificationSessionId.equals(req.params.certificationSessionId) && t.latestChapterId.equals(req.params.chapterId)) {
          t.latestContentId = req.params.contentId
        }
        return t
      })
    else user.sessionProgress.push({
        certificationSessionId: req.params.certificationSessionId,
        latestChapterId: req.params.chapterId,
        latestContentId: req.params.contentId,
      })
    user.save()
    res.status(200).json({ message: "Updated successfully" });
  }
};

exports.saveContentProgress = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (!user) res.status(404).send({ message: "User not found" });

  let isValidId = ObjectId.isValid(req.params.contentId)
  if (!isValidId) return res.status(400).send({ message: "Could not save session progress. Provided content id is invalid." });
  let content = await Content.findById({_id: req.params.contentId})
  if (!content) return res.status(404).send({ message: "Could not save session progress. Content was not found." });

  else {
    let found = user.sessionContentProgress.find(t=>(t.contentId.equals(req.params.contentId)))
    if (found) user.sessionContentProgress = user.sessionContentProgress.map(t=>{
        if(t.contentId.equals(req.params.contentId)) {
          t.status = req.body.status
        }
        return t
      })
    else user.sessionContentProgress.push({
        contentId: req.params.contentId,
        status: req.body.status
        
      })
    user.save()
    res.status(200).json({ message: "Updated successfully" });
  }
};

exports.readAllTraineeSessions = async (req, res) => {
  let groups = await db.group.find({trainees: req.userId})
  let cSessions = await CertificationSession.find(
    {$or: [
      { unassignedTrainees: req.userId }, 
      { 'groups.group': groups?.map(g=>g._id)??[] }
    ]})
  res.status(200).json(cSessions);
}

exports.readAllTrainingManagers = async (req, res) => {
  let users = await User.find( {"settings.availableRoles": 'TrainingManager'}, "name surname username settings createdAt")
  res.status(200).json(users);
};

exports.getAllTrainingManagersByModule = async (req, res) => {
  let users = await User.find({ "scopes.name": "modules:read:" + req.moduleId, "settings.availableRoles": 'TrainingManager'}, "name surname username settings createdAt")
  res.status(200).json(users);
};

exports.readAllCoordinators = async (req, res) => {
  let users = await User.find(
      { "scopes.name": "modules:read:" + req.moduleId, "settings.role": 'Coordinator'},
      "name surname username settings createdAt")
  res.status(200).json(users);
};


  // TODO, if yet not added, add 'trainee' role for that parnter (or any other user role)
exports.takeCourse = async (req, res) => {
  let output = await utils.enrollForCertificationSession(req.userId, req.params.certificationSessionId)
  res.status(output.code).send({ message: output.message });
};


// Unenroll user from certification session
exports.unenroll = async (req, res) => {
  await CertificationSession.findById(req.params.certificationSessionId, async function (err, certificationSession) {
    if (err) res.status(500).send({ message: err });
    else if(!certificationSession) res.status(404).send({ message: "Not found" });
    else{
      let output = await utils.unenrollFromCertificationSession(req.userId, certificationSession)
      res.status(output.code).send({message: output.message});
    }
  })
}


exports.issueInternship = async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.params.userId, 'certificates.certificationSession': '613a35c37124ba003c4bc143' },
    { $set:  {"certificates.$.internshipStatus": true} },
    { runValidators: true });
  res.status(200).json({ message: "Updated successfully" });
}

exports.issueCertificate = async (req, res) => {
  await User.findOneAndUpdate(
    { _id: req.params.userId, 'certificates.certificationSession': '613a35c37124ba003c4bc143' },
    { $set:  {"certificates.$.status": true} },
    { runValidators: true });
  res.status(200).json({ message: "Updated successfully" });
}

// getSessionsForExplore exclude sessions if trainee is associated in groups.trainees or in unassigned trainees
exports.getSessionsForExplore = async (req, res) => {
  let searchRecommended = (req.query.searchQuery || req.query.categoryId) ? 'false' : 'true';
  let rawQuery = await getRawQueryForCertificationSession(req.query.searchQuery, req.userId, searchRecommended, req.query.categoryId, req.moduleId)
  CertificationSession.esSearch(rawQuery, async function (err, results) {
    if (err) res.status(500).send({ message: err });
    else if (!results.hits.hits.length) res.status(404).send({ message: "Not found" });
    else{
      if (searchRecommended == 'true'){
        //Reorder recommended sessions besed on scores from contentRecommendations
        //let user = await db.user.findById(req.userId);
        //let recommendations = user.contentRecommendations
        // count sum of recommendation scores for each session
        //results.hits.hits = results.hits.hits.sort.....
      }
      for (const cs of results.hits.hits) {
        cs._source.paymentRequired = await certificationSessionAuthUtils.isPaymentRequired(req.userId, {_id: cs._id, ...cs._source});
      }
      res.status(200).json(results);
    } 
  });
};

exports.countFinishedSessions = async (req, res) => {
  // for trainee/trainer // https://gitlab.elia.academy/root/elia/-/issues/649
  let userId = req.params.userId;
  let certificationSessions = await CertificationSession.find({
    archived: true, // can also check the endDate
  }).populate(
    [
      {
        path: "groups",
        select: "name trainees examiners",
      },
    ]
  )
    if (!certificationSessions) res.status(404).send({ message: "Not found" });
    else {
      switch (req.role) { // role based filtering
        case 'Trainee':
          var cSessions = JSON.parse(JSON.stringify(certificationSessions));
          var count1 = cSessions.filter(cs => cs.groups.some(g => g.trainees.some(t => t == userId)) || cs.unassignedTrainees.some(t => t == userId)).length
          res.status(200).json(count1.toString());
          break;
        case 'Trainer':
          var events = await db.event.find({
            assignedSession: { $in: certificationSessions.map(cs => cs._id) },
            assignedTrainer: userId})
          count1 = certificationSessions.filter(cs=>(
            cs.examiners?.find(e=>e.equals(userId)) ||
            events.find(e => e.assignedSession.equals(cs._id)) ||
            cs.groups.some(g => g.trainees.some(t => t._id.toString() === userId.toString())) || // trainee logic from takeCourse()
            cs.unassignedTrainees.some(t => t._id.toString() === userId.toString()) // trainee logic from takeCourse()
          )).length

          var count2 = certificationSessions.filter(cs => 
            cs.examiners?.find(e => e.equals(userId)) ||
            cs.groups.some(g => g.trainees.some(t => t._id.toString() === userId.toString())) || // trainee logic from takeCourse()
            cs.unassignedTrainees.some(t => t._id.toString() === userId.toString()) // trainee logic from takeCourse()
          ).length
          
          if (events.length > 0) {
            res.status(200).json(count1.toString());
          } else {
            res.status(200).json(count2.toString());
          }
          break;
        default:
          res.status(200).json(certificationSessions);
          break;
      }
    }
}


exports.countReceivedCertifications = async (req, res) => {
  // for trainee // https://gitlab.elia.academy/root/elia/-/issues/649
  let certificationSessions = await CertificationSession.find()
    .populate([{
      path: "groups",
      select: "name trainees examiners",
    }])
  let ecosystem = await db.ecosystem.findOne({"subscriptions.modules._id":req.moduleId}).exec()
  let moduleType = ecosystem?.subscriptions.find(s=>s.modules.id(req.moduleId))?.modules.id(req.moduleId)?.moduleType
  if(moduleType === "TRAINING") {
    res.status(200).json(certificationSessions);

  } else if (moduleType === "SCHOOL"){
    switch (req.role) { // role based filtering
      case 'Trainee':
        var user = await User.findOne({_id: req.userId}, {certificates:1})
        var cSessions = JSON.parse(JSON.stringify(certificationSessions));
        var count = 0
        cSessions.filter(cs => cs.groups.some(g => g.trainees.some(t => t == req.userId)) || cs.unassignedTrainees.some(t => t == req.userId))
          .map(cs => {
            cs.hasCertificate = user.certificates.some(c => (c.certificationSession == cs._id && c.status));
            if(cs.hasCertificate) count++;
            return count;
          })
        res.status(200).json({count});
        break;
      default:
        // res.status(200).json(certificationSessions);
        res.status(200).json({count});
        break;
    }
  } else { // COGNITIVE
    res.status(200).json(certificationSessions);

  }
}

// get most popular sessions based on number of business clients who have taken the session and number of trainees who have taken the session
exports.getMostPopularSessions = async (req, res) => {
  let sessions = await CertificationSession.aggregate()
    // .match({  })
    .project({
      name: 1,
      traineesCount: 1,
      origin: 1,
      module: 1,
    })
    .group({
      _id: {origin: "$origin"},
      count: {$sum: 1},
      traineesCount: {$sum: "$traineesCount"},
    })
    .sort({count: -1})
    .limit(5)
    // .populate({
    //   path: "_id.origin",
    //   select: "name",
    // })
    .exec(); 

    let getSessionName = await CertificationSession
    .find({ _id: { $in: sessions.map(s => s._id.origin) } })
    .select("name")
    .exec(); 

  let getSessionNameMap = sessions.map(s => {
    let sessionName = getSessionName.find(sn => sn._id.equals(s._id.origin));
    return {
      _id: s._id.origin,
      name: sessionName?.name??'Not in use',
      count: s.count,
      traineesCount: s.traineesCount,
    }
  });
  res.status(200).json(getSessionNameMap);
}
