const Competence = require("../models/competence.model");

exports.add = async (req, res) => {
  const competence = new Competence(req.body);
  competence.module = req.moduleId;
  competence.save();
  res.status(200).json({message: "Created successfully", competenceId: competence._id});
};

exports.read = async (req, res) => {
  let competence = await Competence.findById(req.params.competenceId)
  if (!competence) res.status(404).send({ message: "Not found" });
  else res.status(200).json(competence);
};

exports.checkTitle = async (req, res) => {
  res.status(200).json(await Competence.exists({title: req.data})) 
};

exports.readAll = async (req, res) => {
  let competences = await Competence.find({"module": req.moduleId})
  res.status(200).json(competences);
};

exports.update = async (req, res) => {
  let competence = await Competence.findOneAndUpdate(
    { _id: req.params.competenceId },
    { $set: req.body },
    { runValidators: true })
      if (!competence) res.status(404).send({ message: "Not found" });
      else res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await Competence.findByIdAndDelete(req.params.competenceId)
  res.status(200).json({ message: "Deleted successfully" });
};
