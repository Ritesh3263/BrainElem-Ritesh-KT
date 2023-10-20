const db = require("../models");
const CompetenceBlock = require("../models/competence_block.model");
const Competence = require("../models/competence.model");

exports.read = async (req, res) => {
  let competenceBlock = await CompetenceBlock.findById(req.params.competenceBlockId)
    .populate([
      {
        path: "competences",
        populate: {path: "gradingScale", select: ["name"]},
      },
    ])
      if (!competenceBlock) res.status(404).send({ message: "Not found" });
      else  res.status(200).json(competenceBlock);
};

exports.checkTitle = async (req, res) => {
  res.status(200).json(await CompetenceBlock.exists({title: req.data})) 
};

exports.identificationCode = async (req, res) => {
  res.status(200).json(await CompetenceBlock.exists({identificationCode: req.data})) 
};

exports.readAll = async (req, res) => {
  let competenceBlocks = await CompetenceBlock.find({"module": req.moduleId})
    .populate({path: "competences"})
  res.status(200).json(competenceBlocks);
};

exports.add = async (req, res) => {
  let newCompetenceBlock = new CompetenceBlock(req.body);
  let cBlock = await CompetenceBlock.findOne({},{_id:1}).sort({_id:-1}).catch(err => console.log("Error: cBlock", err))
  if(cBlock?._id) newCompetenceBlock._id = cBlock._id+1
  else newCompetenceBlock._id = 1
  let c = await Competence.findOne({},{_id:1}).sort({_id:-1}).catch(err => console.log("Error: c", err))
  let newCompetence = req.body.additionalCompetences.map((x,i)=>{
    if(x.isNew === true){
      const competenceId = c?._id + 1 + i|| i+1
      x._id = competenceId
      x.title = x.name
      x.module = req.moduleId;
      x.gradingScale = '5ca13000000000000000000a'
      x.block = cBlock?._id||0+1
      return x
    }
  });
  await db.competence.insertMany(newCompetence).catch(err => console.log("Error: newCompetence", err))
  let externalCompetences = req.body.additionalCompetences.map((item,i) => { 
    if(item.isNew === true){
      return c?._id  + 1 + i||i+1; }
    })
  externalCompetences.forEach(element => {          
    newCompetenceBlock.competences.push(element)
  });
  newCompetenceBlock.module = req.moduleId;
  newCompetenceBlock.save((err, competenceBlock) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.status(200).json({ message: "Added successfully" });
  });
};

exports.update = async (req, res) => {

  await CompetenceBlock.findOneAndUpdate(
    { _id: req.params.competenceBlockId },
    { $set: req.body })
  res.status(200).json({ message: "Updated successfully" });
          
  // adding external competences: 
  let c = await Competence.findOne({},{_id:1}).sort({_id:-1})
  let newCompetence = req.body.additionalCompetences.map((x,i)=>{
    if(x.isNew === true){
      const competenceId = c._id+i+1
      x._id = competenceId
      x.module = req.moduleId;
      x.title = x.name
      x.gradingScale = '5ca13000000000000000000a'
      x.block = 0
      return x
    } // check why the map() is not returning all the elements!
  });
  await db.competence.insertMany(newCompetence)
  let externalCompetences = req.body.additionalCompetences.map((item,i) => { 
    if(item.isNew === true){
      return c._id+i+1; 
    } // check why the map() is not returning all the elements!
  })

  await CompetenceBlock.findOneAndUpdate(
  { _id: req.params.competenceBlockId },
  { $push: { competences: externalCompetences } },
  { runValidators: true });

};

exports.remove = async (req, res) => {
    await CompetenceBlock.findByIdAndDelete(req.params.competenceBlockId)
    res.status(200).json({ message: "Deleted successfully" });
};
