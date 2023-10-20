const CoursePath = require("../models/course_path.model");
const CoursePathImage = require("../models/course_path_image.model");

exports.create = async (req, res) => {
  const coursePath = new CoursePath(req.body);
  //coursePath.creator = req.userId
  //coursePath.module = req.moduleId
  await coursePath.save()
  res.status(200).json({message: "Created successfully", coursePathId: coursePath._id});
};

// read coursePath by coursePathId
exports.read = async (req, res) => {
  let coursePath = await CoursePath.findById(req.params.coursePathId)
  .populate([
      {path: 'courses'},
      {path: 'category'},
      {path: 'chosenChapters.chapter'},
      {path: 'chosenChapters.chosenContents.content'},
      {path: 'image'},
      ])
    res.status(200).json(coursePath);
};

exports.readWithDetails = async (req, res) => {
    let coursePath = await CoursePath.findById(req.params.coursePathId)
        .populate([
            {path: 'category'},
            {path: 'courses', select: '_id name chosenChapters',
                populate:[
                    {path: 'chosenChapters.chapter', select: '_id name'},
                    {path: 'chosenChapters.chosenContents.content', select: '_id title contentType durationTime'},
                ]},
        ])
        res.status(200).json(coursePath);
};


exports.update = async (req, res) => {
  let coursePath = await CoursePath.findOneAndUpdate(
    { _id: req.params.coursePathId },
    { $set: req.body },
    { runValidators: true })
  if (!coursePath) res.status(404).send({ message: "Not found" });
  else {
    // if reindex is not needed, then following part is not in any effect
    // // Reindex all associated certificationSessions in ElasticSearch 
    // // I couldnt do it in model's post middleware due to circular dependency
    // let cSessions = await db.certificationSession.find({ coursePath: req.params.coursePathId },
    // cSessions.forEach((cSession) => {
    //   // Using cSession.index() for some reason removes coursePath from cSession in ElasticSearch
    //   // Using cSession.save() works fine 
    //   cSession.save();
    // });
    res.status(200).json({ message: "Updated successfully" })
  }
};

exports.remove = async (req, res) => {
  await CoursePath.findByIdAndDelete(req.params.coursePathId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readAll = async (req, res) => {
  let coursePaths = await CoursePath.find({"module": req.moduleId, origin: {$exists: false}})
    .populate("category")
  res.status(200).json(coursePaths);
};

exports.uploadImage = async (req, res) => { // Action for uploading files
  let image = { fileName: req.file.filename, fileOriginalName: req.file.originalname, mimeType: req.file.mimetype, size: req.file.size }
  image = await CoursePathImage.create(image)
  res.status(200).json(image);
};

exports.downloadImage = async (req, res) => { // Action for downloading image
  if (req.params.imageId){
    let image = await CoursePathImage.findById(req.params.imageId)
      if (!image) res.status(404).send({ message: "Image not found." });
      else{
        res.sendFile(`/app/public/course_path/images/${image.fileName}`);
      }
  }
  else res.status(404).send({ message: "Image not found." });
}