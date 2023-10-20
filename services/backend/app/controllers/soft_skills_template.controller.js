const db = require("../models");
const User = db.user;
const Group = require("../models/group.model");
const SoftSkillsTemplate = require("../models/soft_skills_template.model");
const SoftSkill = require("../models/soft_skill.model");
const ModuleCore = require("../models/module_core.model");
const Ecosystem = require("../models/ecosystem.model");

exports.add = async (req, res) => {
  const report = new SoftSkillsTemplate(req.body);
  report.module = req.moduleId
  report.creator = req.userId
  report.save()
  res.status(200).json({message: "Created successfully", reportId: report._id});
};

exports.update = async (req, res) => {
  let sst = await SoftSkillsTemplate.findOneAndUpdate(
    { _id: req.params.templateId },
    { $set: req.body },
    { runValidators: true })
  if (!sst) res.status(404).send({ message: "Not found" });
  else res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await SoftSkillsTemplate.findByIdAndDelete(req.params.templateId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readGroups = async (req, res) => {
  if (req.role === "Parent") {
    let user = await User.findOne({_id:req.userId}, {"details.children": 1})
    if (!user) res.status(404).send({ message: "Not found" });
    else {
      let classes = await Group.find({trainees: { $in: user.details.children } })
      if (!classes) res.status(404).send({ message: "Not found" });
      else res.status(200).json({class: classes.map(x => ({_id: x._id, name: x.name})), children: user.details.children});
    }
  } else if(req.role === "Inspector") {
    let ecosystem = await Ecosystem.findOne(
          { "subscriptions.modules._id": req.moduleId },
          ["_id", "subscriptions.modules._id", "subscriptions.modules.core"]
        )
      .populate({path: "subscriptions.modules.core", select: ['groups'], populate: {path: 'groups', select: ['name', '_id']} })
    if (!ecosystem) return res.status(404).send({ message: "Groups not found." });
    else {
      // let subscription = ecosystem.subscriptions.find((subscription) => {
      //   return subscription.modules.some(
      //     (module) => module._id == req.moduleId
      //   );
      // });
      // //Find proper module
      // let module = subscription.modules.find(x => x._id.toString() === req.moduleId);
      // let groupsList = module.core.groups.map(x => x._id)
      let groups = await Group.find({module: req.moduleId}).populate({path: "academicYear"}).lean().exec()
      // filter active groups
      groups = groups.filter(g => {
        if (req.selectedPeriod) return !!g.academicYear.periods.find(p => p._id.toString() == req.selectedPeriod)
        else return !!g.academicYear.periods.find(p => (new Date(p.startDate) <= new Date() && new Date(p.endDate) >= new Date()))
      })
      res.status(200).json(groups)
    }    //Find proper subscription
  } else {
    let classes = await Group.find({classManager: req.userId })
    res.status(200).json(classes.map(x => ({_id: x._id, name: x.name})));
  }
};

exports.readTraineesInGroup = async (req, res) => {
  let groupId = req.params.groupId;
  let core = await ModuleCore.findOne({moduleId: req.moduleId})
  if (!core || !core.groups.includes(groupId)) res.status(404).send({ message: "Not found" });
  else {
    let group = await Group.findOne({_id: groupId})
      .populate({ path: "trainees", select: ["username","name","surname"] })
    if (!group) res.status(404).send({ message: "Not found" });
    else res.status(200).json(group.trainees);
  }
};

exports.readReportsOfTraineeInGroup = async (req, res) => {
  let groupId = req.params.groupId;
  let traineeId = req.params.traineeId;
  let user = await User.findOne({_id:traineeId}, {reports: 1})
  if (!user) res.status(404).send({ message: "User not found" });
  else {
    let report = user.reports.filter(x=>x.group.equals(groupId));
    let creator = await db.user.findOne({_id: report[0].creator}).select("name, surname").catch((err) => false);
    // to be adjusted in front: ReportTraineeTable, line: 38, author: item.creator.name
    report.map(x=>x.creator = creator);
    console.log(report, "I can see 'creator' surname, but not name? ");
    res.status(200).json(report)
  }
};

exports.newReadReportsOfTraineeInGroup = async (req, res) => {
  let groupId = req.params.groupId;
  let traineeId = req.params.traineeId;
  let moduleCore = await ModuleCore.findOne({moduleId: req.moduleId})
  if (!moduleCore || !moduleCore.groups.includes(groupId)) res.status(404).send({ message: "Not found" });
  else {
    let sst = await SoftSkillsTemplate.find({group:groupId, trainee:traineeId})
    if (!sst) res.status(404).send({ message: "Not found" });
    else res.status(200).json(sst);
  }
};

exports.readTemplate = async (req, res) => {
  let sst = await SoftSkillsTemplate.findById(req.params.templateId)
    .populate({ path: "softSkills" })
  sst.type = "SOFT_SKILLS"; // why we have TYPE in front?
  if (!sst) res.status(404).send({ message: "Not found" });
  else res.status(200).json(sst);
};

// template
exports.readAllReportsTemplates = async (req, res) => {
  let sst = await SoftSkillsTemplate.find({module: req.moduleId})
    .populate({ path: "softSkills"})
  res.status(200).json(sst);
};

exports.addSoftSkill = async (req, res) => {
  let soft = await SoftSkill.findOne({},{_id:1}).sort({_id:-1})
  let newSoft = new SoftSkill({
      _id: soft?._id + 1,
      module: req.moduleId,
      ...req.body,
    });
  await newSoft.save()
  res.status(200).json({message: "Created successfully"});
};

exports.readAllSoftSkills = async (req, res) => {
  let soft = await SoftSkill.find({module: req.moduleId})
  res.status(200).json(soft);
};

exports.readSoftSkill = async (req, res) => {
  let soft = await SoftSkill.findById(req.params.softSkillId)
  res.status(200).json(soft);
};

exports.updateSoftSkill = async (req, res) => {
  let soft = await SoftSkill.findOneAndUpdate(
    { _id: req.params.softSkillId },
    { $set: req.body },
    { runValidators: true })
  if (!soft) res.status(404).send({ message: "Not found" });
  else res.status(200).json({ message: "Updated successfully" });
};

exports.removeSoftSkill = async (req, res) => {
  await SoftSkill.findByIdAndDelete(req.params.softSkillId)
  res.status(200).json({ message: "Deleted successfully" });
};
