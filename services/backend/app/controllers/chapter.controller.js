const TrainingModule = require("../models/training_module.model");
const Chapter = require("../models/chapter.model");
const db = require("../models");
const ObjectId = require("mongodb").ObjectId;

exports.read = async (req, res) => { // Get single chapter by id
 let chapter = await Chapter.findById(req.params.chapterId)
   .populate({path: "contents"}) 
  if (!chapter) res.status(404).send({ message: "Not found" });
  else res.status(200).json(chapter);
};

exports.readAll = async (req, res) => { // Get list with all chapters' ids 
  let chapters = await Chapter.find({origin: {$exists: false}})
  res.status(200).json(chapters);
};

exports.renameChapterName = async (req, res) => {
  Chapter.findOneAndUpdate(
    { _id: req.params.chapterId },
    { $set: { name: req.body.name } },
    (err, doc) => {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      res.status(200).json({ message: "Chapter name updated" });
    }
  );
};

exports.getChapters = async (req, res) => {
  let tp = await db.trainingPath.findOne({ "trainingModules.originalTrainingModule": req.params.trainingModuleId })
  .populate([
    {path: "trainingModules.chosenChapters.chapter"},
    {path: "trainingModules.chosenChapters.chosenContents.content"},
  ]).lean().exec()
  let tptm = tp.trainingModules.find(x=>x.originalTrainingModule == req.params.trainingModuleId)
  let chapters1 = tptm?.chosenChapters.map(x=>{
    return {
      ...x.chapter,
      fromProgram: true,
      assignedContent: x.chosenContents.map(y=>y.content),
    }
  })||[]
  let tpchIds = chapters1.map(x=>x._id)
  let tm = await TrainingModule.findById(req.params.trainingModuleId)
    .populate({path: "origin", populate: {path: "chapters",populate: {path: "assignedContent"}}}).lean().exec()
  if (!tm) res.status(404).send({ message: "Not found" });
  else {
    // let chapters = await Chapter.find({creator: req.userId, addedByTrainer: true}).lean()
    let chapters2 = await Chapter.find({otherContentsByTrainers: {$elemMatch: {trainer: req.userId, trainingModule: req.params.trainingModuleId}}}).lean().exec()
    chapters2 = chapters2.map(x=>{
      x.fromTrainerList = true
      x.assignedContent = x.otherContentsByTrainers.find(y=>y.trainer == req.userId && y.trainingModule == req.params.trainingModuleId).contents
      return x
    })
    chapters2 = chapters2.filter(ch=>!tpchIds.find(x=>x.equals(ch._id)))
    // remove 2nd filter if we need the original contents of a chapter to be displayed in the list
    let chapters3 = tm.origin?.chapters.filter(ch=>!(tpchIds.find(tpch=>ch._id.equals(tpch))||chapters2.find(ch2=>ch._id.equals(ch2._id))))
    res.status(200).json([
      ...chapters1,
      ...chapters2,
      // ...chapters.filter(ch=>!tpchIds.find(tpch=>ch._id.equals(tpch))),
      ...chapters3,
    ]);
    // res.status(200).json(tm.origin?.chapters)
  }
}

exports.getContent = async (req, res) => {
  let chapter = await Chapter.findById(req.params.chapterId)
    .populate({path: "assignedContent"}) 
  if (!chapter) res.status(404).send({ message: "Not found" });
  else res.status(200).json(chapter.assignedContent.filter(x=> (x.libraryStatus === "REJECTED" || x.archivedByLibrarian === false))); // cloud TODO
}

exports.search = async (req, res) => { // Search for a chapter within ElasticSearch
  let rawQuery = {
    "from" : 0, "size" : 100,
    "query": {"bool": 
      {"should": [
          { "match": { "name":  {"query": req.query.query,"boost": 10}}},
          { "match": { "description": {"query": req.query.query,"boost": 1}}},
          { "match": { "contents.name": {"query": req.query.query,"boost": 1}}},
      ]}
    }
  }

  Chapter.esSearch(rawQuery, function(err, results) {
    if (err) res.status(500).send({ message: err });
    else res.status(200).json(results);
  });
};

exports.add = async (req, res) => { // Action for adding single content 
  let trainingModuleId = req.params.trainingModuleId;
  let newChapId = new ObjectId();
  let chapter = await Chapter.create({
    ...req.body,
    _id: newChapId,
    creator: req.userId,
    trainingModule: trainingModuleId,
    module: req.moduleId,
  });

  // chapter.save()
  TrainingModule.findOneAndUpdate(
    { _id: trainingModuleId },
    { $push: { "chapters": newChapId } },
    { runValidators: true });
  res.status(200).json({ message: "Created successfully", chapter });
};
