const db = require("../models");
const Format = require("../models/format.model");
const Chapter = require("../models/chapter.model");

exports.add = async (req, res) => {
  const format = new Format(req.body);
  format.module = req.moduleId
  format.save()
  res.status(200).json({message: "Created successfully", formatId: format._id});
};

// read format by formatId
exports.read = async (req, res) => {
  let format = await Format.findById(req.params.formatId)
  if (!format) res.status(404).send({ message: "Not found" });
  else res.status(200).json(format);
};
exports.update = async (req, res) => {
  await Format.findOneAndUpdate(
    { _id: req.params.formatId },
    { $set: req.body },
    { runValidators: true })
  res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  let format = await Format.findByIdAndDelete(req.params.formatId)
  if (!format) res.status(404).send({ message: "Not found" });
  else res.status(200).json({ message: "Deleted successfully" });
};

exports.readAll = async (req, res) => {
  let formats = await Format.find({"module": req.moduleId})
  res.status(200).json(formats);
};

exports.readAllExceptInit = async (req, res) => {
  let formats = await Format.find({"module": req.moduleId, initFormat: { $exists: false }})
  res.status(200).json(formats);
};

// getCategoryRefs
exports.getCategoryRefs = async (req, res) => {
  let categoryRefs = await db.categoryRef.find({})
  res.status(200).json(categoryRefs);
};

exports.getChaptersFromFormat = async (req, res) => {
  let format = await Format.findOne({_id: req.params.formatId})
    .populate({ path: "chosenChapters.chosenContents.content" })
  if (!format) res.status(404).send({ message: "Not found" });
  else {
    let listOfChapters = format.chosenChapters.map(x=> x.chapter)
    let chapters = await Chapter.find({_id: listOfChapters})
    res.status(200).json(chapters);
  }
};