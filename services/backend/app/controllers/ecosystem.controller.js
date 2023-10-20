const Ecosystem = require("../models/ecosystem.model");
const User = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;

var bcrypt = require("bcryptjs");

////////////////    ECOSYSTEMS    ////////////////
exports.readAll = async (req, res) => {
  // Actually get only one ecosystem
  let ecosystems = await Ecosystem.find({})
    if (!ecosystems) res.status(404).send({ message: "Not found" });
    else res.status(200).json(ecosystems);
};

exports.add = async (req, res) => {
  const ecosystem = new Ecosystem({
    name: req.body.name,
    description: req.body.description,
    isActive: req.body.isActive,
    subscriptions: [],
  });
  await ecosystem.save()
  await User.findOneAndUpdate(
    {_id: req.body.manager},
    { $set: {
        scopes: [
          { name: "users:all:" + req.body.manager },
          { name: "ecosystems:all:" + ecosystem._id },
        ],
    }},
    { new: true })
  res.status(200).json({ message: "Ecosystem was saved successfully!" });
};

exports.update = async (req, res) => {
  let params = req.body
  for (let prop in params) if (!params[prop]) delete params[prop];
  params.isActive = req.body.isActive; // because it's a boolean and can't pass through the loop above

  await Ecosystem.findByIdAndUpdate(
    req.body._id,
    { $set: params },
    { new: true })

    // clear previous scope
  await User.findOneAndUpdate(
    { 'scopes.name': 'ecosystems:all:' + req.body._id },
    { $set: { 'scopes.$.name': 'ecosystems:free:free' } },
    { new: true }
  )

  // assign new scope
  await User.findOne({ _id: req.body.manager }, async (err, user) => {
    if (err) res.status(500).send(err)
    else {
      user.scopes.map(scope => {
        if (scope.name == 'ecosystems:free:free') {
          scope.name = 'ecosystems:all:' + req.body._id
        }
        return scope
      })
      await user.save()
    }
  })
  res.status(200).json({ message: "Ecosystem was updated successfully!" });
};

exports.remove = async (req, res) => {
  let id = req.params.id;
  await Ecosystem.findByIdAndRemove(id)
  // delete corresponding ecosystem manager (scope only)
  await User.findOneAndUpdate(
    { "scopes.name": "ecosystems:all:"+id },
    { $set: { "scopes.$.name": "ecosystems:free:free" } }
  )
  res.status(200).json({ message: "Ecosystem was deleted successfully!" });
};

////////////////    ECO MANAGERS    ////////////////
exports.readAllManagers = async (req, res) => {
  // Get list with all ecosystem managers
  // regex: /ecosystems:all:/ and /ecosystems:free:/
  let ecosystemManagers = await User.find(
    { $or: [ { "scopes.name": { $regex: /ecosystems:all:/ } }, { "scopes.name": { $regex: /ecosystems:free:/ } } ] },
    "_id name surname username email scopes createdAt settings details")

    res.status(200).json(ecosystemManagers);
};

exports.getOneManager = async (req, res) => {
  let manager = await User.findOne(
    { "scopes.name": "ecosystems:all:"+req.params.ecosystemId },
    {_id:1, name:1, surname:1, username:1, email:1, scopes:1, createdAt:1, settings:1, details:1})
    res.status(200).json(manager);
};

exports.getManager = async (req, res) => {
  let manager = await User.findOne(
    { _id: req.params.userId },
    {_id:1, name:1, surname:1, username:1, email:1, scopes:1, createdAt:1, settings:1, details:1})
    res.status(200).json(manager);
};

exports.readAllFreeManagers = async (req, res) => {
  // Get list with all ecosystem managers not assigned to subscriiption
  let ecosystemManagers = await User.find(
    { $or: [ { "scopes.name": "ecosystems:free:free" }, { "scopes.name": "ecosystems:all:"+req.params.ecosystemId } ] },
    "_id name surname username email scopes createdAt settings details")
     res.status(200).json(ecosystemManagers);
};

exports.addManager = async (req, res) => {
  const userId = new ObjectId();
  const username = req.body.username;
  const user = new User({
    _id: userId,
    name: req.body.name,
    surname: req.body.surname,
    username: username,
    // email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    settings: { isActive: req.body.isActive, role: "EcoManager",defaultRole: "EcoManager",availableRoles: ["EcoManager"]},
    scopes: [
      { name: "users:all:" + userId },
      { name: "content:create:all"},
      { name: "ecosystems:free:free" },
    ],
    recommendations: [],
  });
  if (req.body.email) user.email = req.body.email
  await user.save().then(()=>{
    res.status(200).json({ message: "Ecosystem Manager was saved successfully!" });
  }).catch(err=>{
    res.status(409).send(err);
  })

};

exports.updateManager = async (req, res) => {
  let password = "";
  if (req.body.password) password = bcrypt.hashSync(req.body.password, 8);
  let params = {
    name: req.body.name,
    surname: req.body.surname,
    username: req.body.username,
    email: req.body.email,
    password: password,
    settings: { isActive: req.body.isActive, role: "EcoManager",defaultRole: "EcoManager",availableRoles: ["EcoManager"]},
    scopes: req.body.scopes,
    recommendations: [],
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

   await User.findOneAndUpdate(
    {_id:req.params.id},
    { $set: params },
    { new: true })
  res.status(200).json({ message: "Ecosystem Manager was saved successfully!" });
};

exports.removeManager = async (req, res) => {
  let id = req.params.id;
  let user = await User.findOne({ _id: id })
  let scopeId = user.scopes.find((ele) => {
    if (ele.name.includes("ecosystems:")) return ele._id;
  });
  user.scopes.pull(scopeId);
  await user.save();
  res.status(200).json({ message: "Ecosystem manager was deleted successfully!" });
};

////////////////    CLOUD MANAGERS    ////////////////
exports.addCloudManager = async (req, res) => {
  const userId = new ObjectId();
  const cloudId = "111111111111111"; //fixed ID / 23.06.2022 TODO ?
  const username = req.body.username;
  const user = new User({
    _id: userId,
    name: req.body.name,
    surname: req.body.surname,
    username: username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    settings: { isActive: req.body.isActive },
    scopes: [{ name: "users:all:" + userId }, { name: "cloud:all:" + cloudId }],
    recommendations: [],
  });
  await user.save();
  res.status(200).json({ message: "Ecosystem Manager was saved successfully!" });
};

exports.enableCloud = async (req, res) => {
  await Ecosystem.findOneAndUpdate(
    { _id: req.params.ecosystemId },
    {
      $set: { 'isCloudActive': req.body.cloudStatus} 
    })
    res.status(200).json({ message: "Updated successfully" });
};

