const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
const Course = require("../models/course.model");
const Chapter = require("../models/chapter.model");
const Content = require("../models/content.model");
const CourseImage = require("../models/course_image.model");

exports.create = async (req, res) => {
  const course = new Course(req.body);
  course.creator = req.userId
  course.module = req.moduleId
  if(course.type === "PUBLIC"){
    course.libraryStatus = "AWAITING";
    course.sendToLibrary = true;
  }
  await course.save()
  res.status(200).json({message: "Created successfully", courseId: course._id});
};

exports.read = async (req, res) => {
  let course = await Course.findById(req.params.courseId)
    .populate([
        {path: 'category'},
        {path: 'chosenChapters.chapter'},
        {path: 'chosenChapters.chosenContents.content'},
        {path: 'image'},
        ])
    res.status(200).json(course);
};

exports.update = async (req, res) => {
  let course = await Course.findOneAndUpdate(
    { _id: req.params.courseId },
    { $set: req.body },
    { runValidators: true })
      if (!course) res.status(404).send({ message: "Not found" });
      else res.status(200).json({ message: "Updated successfully" });
};

exports.updateFromSession = async (req, res) => {
  let duplicatingChList = []
  // chapter management
  // let allSelectedChapters = req.body.assignedChapters.filter(x=>x.isSelected)
  // let chaptersToCreate = allSelectedChapters.filter(x=>!x.old)
  let allSelectedChapters = req.body.chosenChapters
  // let currentContentIds = allSelectedChapters.map(x=>x.chosenContents.map(y=>y.content)).flat()
  // content management
  // let initialContents = req.body.initialContents
  // let contnetsToBeDeleted = initialContents.filter(x=>!currentContentIds.includes(x))

  allSelectedChapters.map(chapter=>{
    let newChapterId = new ObjectId();
    // COMMENT 1,  if chapter.isNew = TRUE, add it to "duplicatingChList" and save it to database, line: 77
      duplicatingChList[chapter.chapter._id] = newChapterId
      const newChapter = new Chapter({
        _id: newChapterId,
        name: chapter.chapter.name,
        description: chapter.chapter.description, 
        assignedContent: chapter.chapter._id? chapter.chapter.assignedContent: chapter.chosenContents,
        level: chapter.chapter.level,
        type: chapter.chapter.type,
        durationTime: chapter.chapter.durationTime,
        creator: chapter.chapter._id? chapter.chapter.creator: req.userId,
        addedByTrainer: true,
      });

      newChapter.save(() => {});
    // END OF COMMENT 1
  });

  let contentArray = [];
  // prepare content 
  allSelectedChapters.map(async cx=>({
    chosenContents: await cx.chosenContents.map(async c=>{
      contentArray[c.content._id] = await db.content.findById(c.content._id).exec() 
      return contentArray;
    })
  }))

  let course = await Course.findById(req.params.courseId) // duplicatedCourseId
      if (!course) res.status(404).send({ message: "Not found" });
      else {
            course.chosenChapters = allSelectedChapters.map(cx=>({
            chapter: duplicatingChList[cx.chapter._id],
            chosenContents: cx.chosenContents.map(c=>{
                      return {content: c.content}
                })
          }))
        await course.save()
        res.status(200).json({ message: "Updated successfully" });
      }
};

exports.remove = async (req, res) => {
  await Course.findByIdAndDelete(req.params.courseId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readAll = async (req, res) => {
  let query = { origin: {$exists: false}}
  if (req.role !== "ModuleManager") {
  query.creator = req.userId;
  }
  let courses = await Course.find(query)
  .populate("category")
  .populate("chosenChapters.chapter")
  .populate("chosenChapters.chosenContents.content")
  res.status(200).json(courses);
};

exports.getAllCourses = async (req, res) => {
  let moduleId = req.moduleId
  if(moduleId){
      let courses = await Course.find({ 
              module: moduleId,
              type: "PUBLIC"          })
          .populate({path: "creator", select: ['_id', 'username']})
      res.status(200).json(courses);
  } else res.status(200).json([])
};

exports.getCourse = async (req, res) => {
  let getCourse = await Course.findById({'_id': req.params.courseId})
  res.status(200).json(getCourse);
};

// getCategoryRefs
exports.getCategoryRefs = async (req, res) => {
  let getCategoryRefs = await db.categoryRef.find({})
  res.status(200).json(getCategoryRefs);
};

exports.getCategoryRefsFromModule = async (req, res) => {
  let getCategoryRefs = await db.categoryRef.find({module: req.moduleId})
  res.status(200).json(getCategoryRefs);
};


exports.getChaptersFromCourse = async (req, res) => {
  let core = await Course.findOne({_id: req.params.courseId})
    .populate({ path: "chosenChapters.chosenContents.content" })
  if (!core) res.status(404).send({ message: "Not found" });
  else {
    let listOfChapters = core.chosenChapters.map(x=> x.chapter)
    let events = await Chapter.find({_id: listOfChapters})
    res.status(200).json(events);
  }
};

exports.uploadImage = async (req, res) => { // Action for uploading files
  let image = await CourseImage.create({ 
    fileName: req.file.filename, 
    fileOriginalName: req.file.originalname, 
    mimeType: req.file.mimetype, 
    size: req.file.size 
  })
  res.status(200).json(image);
};

exports.downloadImage = async (req, res) => { // Action for downloading image
  if (req.params.imageId){
    let image = await CourseImage.findById(req.params.imageId)
      if (!image) res.status(404).send({ message: "Image not found." });
      else{
        res.sendFile(`/app/public/course/images/${image.fileName}`);
      }
  }
  else res.status(404).send({ message: "Image not found." });
}

exports.getImageDetails = async (req, res) => { // Action for downloading image
  let image = await CourseImage.findById(req.params.imageId)
  if (!image) res.status(404).send({ message: "Image not found." });
  else res.status(200).json(image)
};

exports.manageCourseStatus = async (req, res) => { // Action for editing single content
  let course = {...req.body.course}
  var courseToReindex
  if(course.libraryStatus == "REJECTED") {
      var rejectedInLibraryAt = new Date().toISOString()
      courseToReindex = await Course.findOneAndUpdate(
          {_id: course._id},
          { $set: { libraryStatus: "REJECTED", approvedByLibrarian: false, rejectedInLibraryAt: rejectedInLibraryAt }},
          { runValidators: true, returnOriginal: false})
      
      let notification = await db.notification.create({
          name: "Course Rejected!",
          course: `Your course "${course.title}" has been rejected by the librarian!`,
          type: "COMMON",
          module: req.moduleId,
      })
      await db.user.updateOne({_id: course.owner}, 
          {$addToSet: {"settings.userNotifications":{
              isRead: false,
              notification: notification._id,
          }}})

      // remove rejected course from chapter
      await Chapter.findOneAndUpdate( 
          { _id: course.chapter },
          { $pull: { "assignedCourse": course._id } },
          { runValidators: true })

      res.status(200).json({ message: "The course has been rejected successfully!" }); 
  } else {
      if(!course.archivedByLibrarian) { 
          course.libraryStatus = "ACCEPTED" 
          course.approvedInLibraryAt = new Date().toISOString() // precaution 

          courseToReindex = await Course.findOneAndUpdate(// modify original
              { _id: course._id },
              { $set:
                  {  libraryStatus: "ACCEPTED", 
                      approvedByLibrarian: true,
                      approvedInLibraryAt: course.approvedInLibraryAt,
                      version: 1}
              },
              { returnOriginal: false})
          // courseToReindex.index();// Reindex in elasticsearch

          let notification = await db.notification.create({
              name: "Course Accepted!",
              course: `Your course "${course.title}" has been accepted by the librarian!`,
              type: "COMMON",
              module: req.moduleId,
          })
          await db.user.updateOne({_id: course.owner}, 
              {$addToSet: {"settings.userNotifications":{
                  isRead: false,
                  notification: notification._id,
              }}})
          res.status(200).json({ message: "The course has been approved successfully!" }); 
      }
      else
      {
          course.archivedInLibraryAt = new Date().toISOString()
          courseToReindex = await Course.findOneAndUpdate(
          { _id: course._id },
          { $set:
              { 
              archivedByLibrarian: true,
              archivedInLibraryAt: course.archivedInLibraryAt}
          },
          { returnOriginal: false})
          // courseToReindex.index();// Reindex in elasticsearch
          res.status(200).json({ message: "The course has been archived successfully!" }); 
      }
  }
};
