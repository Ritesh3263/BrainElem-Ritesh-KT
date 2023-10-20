const Internship = require("../models/internship.model");
const Company = require("../models/company.model");
const User = require("../models/user.model");

exports.addCredit = async (req, res) => {
  let user = await User.updateOne( 
    {"_id": req.params.traineeId,'certificates.certificationSession': req.params.sessionId },
    {"$set": {"certificates.$.internshipStatus": true}},
    {"runValidators": true}) 
  res.status(200).json(user);
};

exports.add = async (req, res) => {
  // if no company for location, make internship online 
  if (!req.body.company) {
    delete req.body.company;
    req.body.online = true;
  } 
  const internship = new Internship(req.body);
  internship.module = req.moduleId;
  if (!internship.email) internship.email = undefined;
  internship.save()
  res.status(200).json({message: "Created successfully", internshipId: internship._id});
};

exports.read = async (req, res) => {
  let internship = await Internship.findById(req.params.internshipId)
    .populate([
      {path: "content", select: "title"},
      {path: "company",select: ['_id','name','city','postcode','buildNr','street']},
    ])
  if (!internship) res.status(404).send({ message: "Not found" });
  else  res.status(200).json(internship);
};

exports.readAll = async (req, res) => {
  let internships = await Internship.find({module: req.moduleId})
    .populate([
      //{path: "content", select: "title"},
      //{path: "subinterests", select: "name"},
      {path: "company"},
      {path: 'category'},
    ])
  res.status(200).json(internships);
};

exports.update = async (req, res) => {
  await Internship.findOneAndUpdate(
    { _id: req.params.internshipId },
    { $set: req.body },
    { runValidators: true })
  res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await Internship.findByIdAndDelete(req.params.internshipId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readAllExaminers = async (req, res) => { // selfRegistered 
  let users = await User.find({}) // why the conditions are still drafted?!
  res.status(200).json(users);
}

exports.readAllTrainees = async (req, res) => { // selfRegistered 
  let users = await User.find({}) // why the conditions are still drafted?!
  res.status(200).json(users);
}

exports.readAllCompanies = async (req, res) => {
  let companies = await Company.find({"module": req.moduleId},'_id name city postcode street buildNr')
  res.status(200).json(companies);
};