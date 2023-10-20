const Company = require("../models/company.model");
const Ecosystem = require("../models/ecosystem.model");
const User = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;

var bcrypt = require("bcryptjs");

exports.add = async (req, res) => {
  const company = new Company(req.body);
  company.module = req.moduleId;
  if (!company.email) company.email = undefined;
  company.save()
    res.status(200).json({message: "Created successfully", companyId: company._id});
};

exports.read = async (req, res) => {
  let company = await Company.findById(req.params.companyId)
      if (!company) res.status(404).send({ message: "Not found" });
      else  res.status(200).json(company);
};

exports.readByOwner = async (req, res) => {
  let company = await Company.find({"owner": req.params.ownerId})
  res.status(200).json(company);
};

exports.readAll = async (req, res) => {
  let findString = {module: req.moduleId}
  if (req.role=='Partner') findString = {owner: req.userId}

  let companies = await Company.find(findString)
  res.status(200).json(companies);
};

exports.readAllPartnerExaminers = async (req, res) => { 
  let company = await Company.findById(req.params.companyId)
  .populate([
    {path: "examiners", select: "name surname email settings details createdAt" },
  ])
    if (!company) res.status(404).send({ message: "Not found" });
    else  res.status(200).json(company);
};

exports.readAllPartnerTrainees = async (req, res) => { 
  let company = await Company.findById(req.params.companyId)
  .populate([
    {path: "trainees", select: "name surname email settings details createdAt" },
  ])
    if (!company) res.status(404).send({ message: "Not found" });
    else  res.status(200).json(company);
};

exports.readAllPartnerExaminersAndTrainees = async (req, res) => { 
  let company = await Company.findById(req.params.companyId)
  .populate([
    {path: "examiners", select: "name surname email settings details createdAt" },
    {path: "trainees", select: "name surname email settings details createdAt" },
  ])
    if (!company) res.status(404).send({ message: "Not found" });
    else  res.status(200).json(company);
};

exports.readExaminer = async (req, res) => {
  let user = await User.findOne({_id: req.params.examinerId},
    {name:1, surname:1, username:1, email:1, details:1, settings:1})
    if (!user) res.status(404).send({ message: "Not found" });
    else res.status(200).json(user);
};

exports.update = async (req, res) => {
  if (!req.body.email) req.body.email = undefined;
  await Company.findOneAndUpdate(
    { _id: req.params.companyId },
    { $set: req.body },
    { runValidators: true })
    res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await Company.findByIdAndDelete( req.params.companyId)
  res.status(200).json({ message: "Deleted successfully" });  
};

exports.addExaminer = async (req, res) => {
  let currentUsersCount = await User.countDocuments({ "scopes.name": { $regex: "^modules:.*?" + req.moduleId + "$", $options: "i" } });
  let ecosystemId = (await Ecosystem.findOne(
      { "subscriptions.modules._id": req.moduleId},
      { "_id": 1 }))?._id

  let eco = await Ecosystem.findOne({ "subscriptions.modules._id": req.moduleId })
      if (!eco) res.status(404).send({ message: "Not found" });
      else {
        let subscription = eco.subscriptions.find(sub=>sub.modules.id(req.moduleId))
        let module = subscription.modules.id(req.moduleId)
        let maxLimit = module.usersLimit - currentUsersCount

        if (maxLimit>0) {
          // let enquiry = await db.enquiry.findOne({company: req.params.companyId, email: req.body.email, otherLogic: "xyz"}) // to find the trainee limit
          const userId = new ObjectId();
          let newUser = req.body;
          
          const user = new User({
            _id: userId,
            name: newUser.name, 
            surname: newUser.surname,
            username: newUser.username,
            password: bcrypt.hashSync(newUser.password, 8),
            settings: newUser.settings,
            details: newUser.details,
            scopes: [
              { name: "users:all:" + userId },
              { name: "content:create:all"},
              { name: "modules:read:"+req.moduleId },
            ],
          });
          user.settings.role = ["Trainer","Trainee"].includes(newUser.settings.role)?newUser.settings.role:"Trainee" // protect role from being set to anything else
          user.settings.defaultRole = user.settings.role
          user.settings.availableRoles = [user.settings.role]
          user.settings.selfRegistered = true
          user.settings.emailConfirmed = true
          if (newUser.email) user.email = newUser.email
          if (ecosystemId) user.scopes.push({ name: "ecosystems:read:"+ecosystemId }) // prevent adding null/undefined id of ecosystem scope
        
          user.save()
            var userPush = { examiners: user._id };
              if (user.settings.role=="Trainee") {
                userPush = { trainees: user._id };
              } 
              let company = await Company.findByIdAndUpdate(
                req.params.companyId,
                { $push: userPush },
                { runValidators: true })
                if (!company) res.status(404).send({ message: "Not found" });
                else res.status(200).json({ message: "User has been saved successfully!"});
        } else res.send({ message: "No user has been added! You have reached the limit of adding a new user in this Training Center!" });
      }
};

exports.removeExaminer = async (req, res) => { // delete the user completely? currently dissociating only 
  let user = await User.findOneAndUpdate(
    {_id: req.params.examinerId},
    { $unset: { "details.company": "" }},
    { runValidators: true })
      if (!user) res.status(404).send({ message: "Not found" });
      else {
        let company = await Company.findByIdAndUpdate(
          req.params.companyId,
          { $pull: { examiners: user._id } },
          { runValidators: true })
          if (!company) res.status(404).send({ message: "Not found" });
          else res.status(200).json({ message: "User has been removed successfully!"});
      }
};