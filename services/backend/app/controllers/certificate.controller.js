const db = require("../models");
const Certificate = require("../models/certificate.model");
// const UserCertificates = require("../models/user_certificates.model");
const CertificationSession = require("../models/certification_session.model");
const Competence = require("../models/competence.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const Notification = require("../models/notification.model");
const ObjectId = require("mongodb").ObjectId;

exports.read = async (req, res) => {
  let certificate = await Certificate.findById(req.params.certificateId)
    .populate([{path: "assignedCompetenceBlocks", select: "title competences", populate: {path: "competences", select: "title"}},{path: "externalCompetences", select: "title"}])
  if (!certificate) res.status(404).send({ message: "Not found" });
  else  res.status(200).json(certificate);
};

exports.readAll = async (req, res) => {
  let certificate = await Certificate.find({"module": req.moduleId})
    .populate([{path: "assignedCompetenceBlocks", select: "title competences", populate: {path: "competences", select: "title"}},{path: "externalCompetences", select: "title"}])
  if (!certificate) res.status(404).send({ message: "Not found" });
  else res.status(200).json(certificate);
};

exports.readUserCertification = async (req, res) => {
  let user = await User.findOne({"certificates._id": req.params.certificateId}) // later, we need access permission validation
    .populate([
      { path: "certificates.certificationSession",  
        select: "name trainingManager certificate",
        populate: [{path: "certificate", select: "name EQFLevel expires description module template"}, {path: "trainingManager", select: "name surname"}]
      },
      {path: "certificates.details.examiner",  select: "name surname"},
    ])
  if (!user) res.status(404).send({ message: "Not found" });
  else res.status(200).json(user.certificates.id(req.params.certificateId))
};

exports.readAllUserCertifications = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
    .populate([
      { path: "certificates.certificationSession",  
        select: "name certificate", 
        populate: {
          path: "certificate",
          populate: [
            {path: "assignedCompetenceBlocks", select: "title competences", populate: {path: "competences", select: "title"}},
            {path: "externalCompetences", select: "title"}
          ]
        }
      }
    ])
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    if(['undefined',null].includes(req.params.sessionId)) res.status(200).json(user.certificates);
    else res.status(200).json(user.certificates.filter(x=>x.certificationSession._id.equals(req.params.sessionId)));
  }
};

exports.readAllExaminerCertifications = async (req, res) => {
  let group = await Group.find({examiner: req.userId})
  if (!group) res.status(404).send({ message: "Not found" });
  else {
    let certificate = await CertificationSession.find({module: req.moduleId, examiners: { $in: req.userId}})
    .populate({path: "certificate",  select: ["name", "EQFLevel", "expires"]})
    
    if (!certificate) res.status(404).send({ message: "Not found" });
    else res.status(200).json(certificate);
  }
};

exports.readAllForBlockchain = async (req, res) => {
  let users = await User.find({
      "certificates.status": true,
      "certificates.verificationDate": { $ne: null },
      //"certificates.blockchainStatus": { $in: [null, false] }
    })
    .populate({
      path: "certificates.certificationSession",
      select: "name"
    })

  let certificates = [];
  for (let i = 0; i < users.length; i++) {
    let user = users[i];
    if (user.certificates) {
      for (let j = 0; j < user.certificates.length; j++) {
        let certificate = user.certificates[j]
        certificates.push({
          _id: certificate._id,
          name: certificate.certificationSession.name,
          sessionId: certificate.certificationSession._id,
          userId: user._id,
          userName: user.name,
          userSurname: user.surname,
          date: certificate.verificationDate,
          status: "valid",
          blockchainStatus: certificate.blockchainStatus
        })
      }
    }
  }
  res.status(200).json(certificates);
};

exports.add = async (req, res) => {
  const certificate = new Certificate(req.body);
  let c = await Competence.findOne({},{_id:1}).sort({_id:-1})
  let newCompetence = req.body.additionalCompetences.map((x,i)=>{
    const competenceId = c._id+i+1
    x._id = competenceId
    x.module = req.moduleId
    //x.title = x.name
    x.gradingScale = '5ca13000000000000000000a'
    x.block = 0
    return x
  });
  await db.competence.insertMany(newCompetence)
  let externalCompetences = req.body.additionalCompetences.map((item,i) => { return c._id+i+1; })
  externalCompetences.forEach(element => {          
    certificate.externalCompetences.push(element)
  });
  certificate.module = req.moduleId;
  certificate.save()
  res.status(200).json({message: "Created successfully", certificateId: certificate._id});
};

exports.update = async (req, res) => {
  // i'm receiving 'additionalCompetences' so i'm changing it to 'externalCompetences' below, as certificates don't have 'additionalCompetences'
  req.body.externalCompetences = req.body.additionalCompetences.filter(y=>!y.isNew).map((item,i) => { return item._id; })
  await Certificate.findOneAndUpdate(
    { _id: req.params.certificateId },
    { $set: req.body },
    { runValidators: true })
    
  res.status(200).json({ message: "Updated successfully" });
  // adding external competences: 
  let c = await Competence.findOne({},{_id:1}).sort({_id:-1})
  let newCompetence = req.body.additionalCompetences.filter(y=>y.isNew).map((x,i)=>{
    const competenceId = c._id+i+1
    x._id = competenceId
    x.module = req.moduleId
    //x.title = x.name
    x.gradingScale = '5ca13000000000000000000a'
    x.block = 0
    return x
  });
  db.competence.insertMany(newCompetence)
  let externalCompetences = req.body.additionalCompetences.filter(y=>y.isNew).map((item,i) => { return c._id+i+1; })
  
  await Certificate.findOneAndUpdate(
    { _id: req.params.certificateId },
    { $push: { externalCompetences } },
    { runValidators: true });
};

exports.remove = async (req, res) => {
  await Certificate.findByIdAndDelete(req.params.certificateId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.readAllGradingScales = async (req, res) => {
  let gradingScale = await db.gradingScaleRef.find({})
    // .populate({path: "creator", select: ["name", "surname"]})
  if (!gradingScale) res.status(404).send({ message: "Not found" });
  else res.status(200).json(gradingScale);
};

exports.readAllTraineesInSession = async (req, res) => {
  let certificationSession = await CertificationSession.findById(req.params.certificationSessionId)
    .populate([
      { path: "trainees", 
        select: "name surname email settings details certificates",
        populate: [
          {path: "certificates.details.competenceBlocks.block", select: "title" },
          {path: "certificates.details.competenceBlocks.competences.competence", select: "title" },
          {path: "certificates.details.externalCompetences.competence", select: "title" }
        ]},
      { path: "examiners", select: "name surname email"},
      { path: "groups", populate: {path: 'trainees'}},
    ])
  if (!certificationSession) res.status(404).send({ message: "Not found" });
  else res.status(200).json(certificationSession);
};

exports.readTraineeInSession = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {name:1, surname:1, username:1, email:1, details:1, settings:1, certificates:1})
    .populate([
      {path: "certificates.certificationSession", 
        select: "name certificate", 
        populate: {
          path: "certificate",
          populate: [
            {path: "assignedCompetenceBlocks", select: "title competences", populate: {path: "competences", select: "title"}},
            {path: "externalCompetences", select: "title"}
          ]
        },
      },
      {path: "details.children", select: "name surname"},
      {path: "certificates.details.competenceBlocks.block", select: "title" },
      {path: "certificates.details.competenceBlocks.competences.competence", select: "title" },
      {path: "certificates.details.externalCompetences.competence", select: "title" }
    ])
  if (!user) res.status(404).send({ message: "Not found" });
  else res.status(200).json(user);
};

exports.readTraineeCertifications = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId},{certificates:1})
    .populate([
      {path: "certificates.certificationSession", 
        select: "name certificate", 
        populate: {
          path: "certificate",
          populate: [
            {path: "assignedCompetenceBlocks", select: "title competences", populate: {path: "competences", select: "title"}},
            {path: "externalCompetences", select: "title"}
          ]
        },
      },
      {path: "certificates.details.competenceBlocks.block", select: "title" },
      {path: "certificates.details.competenceBlocks.competences.competence", select: "title" },
      {path: "certificates.details.externalCompetences.competence", select: "title" }
    ])
  if (!user) res.status(404).send({ message: "Not found" });
  else res.status(200).json(user.certificates.find(x=>x.certificationSession._id.equals(req.params.sessionId)));
};

exports.updateTraineeInSession = async (req, res) => {
  let globalStatus = true
  let user = await User.findOne({_id: req.params.traineeId})
  
  user.certificates = user.certificates.map(x=>{
    if(x.certificationSession == req.params.certificationSessionId){
    x.details = x.details.map(y=>{
      if(y.examiner == req.userId){
        y.status = req.body.isCertificated
        y.comment = req.body.additionalComment
      }
      if(!y.status) globalStatus = false  
      return y;
      })
    }
    x.status = globalStatus
    return x;
  })
  user.save() 
  res.status(200).json({ message: "Evaluation was saved successfully!" });
};



// will not be needed anymore in this form, as now Training Manager is certyfing 
exports.updateTraineeDetailInSession = async (req, res) => {
  // let globalStatus = true
  // let changed = false
  let user = await User.findOne({_id: req.params.traineeId})
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    user.certificates = user.certificates.map(x=>{
        if(x.certificationSession.equals(req.params.certificationSessionId)){
          let foundDetail = x.details.findIndex(y=>y.examiner.equals(req.userId))
          let addDetail = {
          ...req.body,
          examiner: req.userId,
          verificationDate: new Date()
          }
          if (foundDetail >- 1) x.details[foundDetail] = addDetail
          else x.details.push(addDetail)
          
          // x.details = x.details.map(y=>{
          //   if(y.examiner.equals(req.userId)){
          //     changed = true
          //     y = {...y, ...req.body }
          //     // y.status = req.body.isCertificated
          //     // y.comment = req.body.additionalComment
          //   }
          //   if(!y.status) globalStatus = false  
          //   return y;
          //  })
        }
      //  if (changed) x.status = globalStatus
        return x;
      })
    user.save()
    res.status(200).json({ message: "Evaluated succesfully!" });
  }
};

// loadExaminerList
exports.loadExaminerList = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
    .populate([ {path: "certificates.details.examiner", select: "name surname email"} ])
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    let certificates = user.certificates.filter(x=>x.certificationSession.equals(req.params.sessionId))
    // let examiners = certificates.map(x=>x.details.map(y=>y.examiner)).flat()
    res.status(200).json(certificates.map(x=>x.details.map(y=>y.examiner)).flat());
  }
};

exports.getIdOfInnerTraineeCertificate = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    let certificate = user.certificates.find(x=>x.certificationSession.equals(req.params.sessionId))
    // let examiners = certificates.map(x=>x.details.map(y=>y.examiner)).flat()
    res.status(200).json(certificate?._id);
  }
};

exports.viewEvaluation = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
    .populate([
      // {path: "certificates.certificationSession",
      //   select: "name certificate",
      //   populate: {
      //     path: "certificate",
      //     populate: [
      //       {path: "assignedCompetenceBlocks"},
      //       {path: "externalCompetences", select: "title"}
      //     ]
      //   },
      // },
      {path: "certificates.details.competenceBlocks.block", select: "title" },
      {path: "certificates.details.competenceBlocks.competences.competence", select: "title" },
      {path: "certificates.details.externalCompetences.competence", select: "title" }
    ])
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    let certificate = user.certificates.find(x=>x.certificationSession.equals(req.params.sessionId)) // assuming only one certificate per session, for multiple certificates, need to use filter instead of find
    let certificateExaminer = certificate.details.find(x=>x.examiner.equals(req.params.trainerId));
    res.status(200).json({...certificateExaminer, status: certificate.status});
  }
};

exports.certify = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1, "settings":1})
  // .populate([ {path: "certificates.details.examiner", select: "name surname email"} ])
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    user.certificates = user.certificates.map(x=>{
      if(x.certificationSession == req.params.sessionId){
        x.status = true
        x.verificationDate = Date.now();
      }
      return x;
    })
    // let notiId = new ObjectId();
    let newNoti = new Notification({
      // _id: notiId,
      name: `New certification Issued!`,
      // content: `Assigned content`,
      type: 'COMMON',
      module: req.moduleId,
    })
    // update rolemasters from bc coach candidate to bc coach
    user.settings.roleMaster = '64b106e2bc79d907c1bf9283'
    user.settings.defaultRoleMaster = '64b106e2bc79d907c1bf9283'
    if(user.settings.availableRoleMasters.find(x=>x.equals('64b106e2bc79d907c1bf9282'))){ // replace with '64b106e2bc79d907c1bf9283' if found
      user.settings.availableRoleMasters = user.settings.availableRoleMasters.filter(x=>!x.equals('64b106e2bc79d907c1bf9282'))
      user.settings.availableRoleMasters.push('64b106e2bc79d907c1bf9283')
    }
    newNoti.save((err, notification)=>{
      if (err) {
        user.save()
        res.status(200).json({ message: "Certified successfully! (unnotified)" });
      } else {
        if (user.settings.userNotifications) {
          user.settings.userNotifications.push({
            isRead: false,
            notification: notification._id,
          })
        } else {
          user.settings.userNotifications = [{
            isRead: false,
            notification: notification._id,
          }]
        }
        user.save()
        res.status(200).json({ message: "Certified successfully! (notified)" });
      }
    })
  }
};

exports.certifyOnBlockchain = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
  // .populate([ {path: "certificates.details.examiner", select: "name surname email"} ])
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    user.certificates = user.certificates.map(x=>{
      if(x.certificationSession == req.params.sessionId){
        x.blockchainStatus = true
        x.blockchainNetworkId = req.body.networkId
        x.blockchainContractAddress = req.body.contractAddress
      }
      return x;
    })
    user.save()
    res.status(200).json({ message: "Certified successfully!" });
  }
};

// Load data for verification
exports.verify = async (req, res) => {
  let user = await User.findOne({ "certificates._id": req.params.certificationId }, {name:1, surname:1, certificates:1})
    .populate({ path: "certificates.certificationSession", select: "name" })
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    let certification = user.certificates.find(c => { return c._id == req.params.certificationId; });
    certification = certification.toJSON();
    certification.userId = user._id;
    certification.fullName = `${user.name} ${user.surname}`;
    // Blockchain
    if (certification.blockchainStatus) {
      certification.blockchainName = "-"
      certification.adress = "-"
      if (certification.blockchainNetworkId === "1") {
          certification.blockchainName = "Ethereum"
          certification.blockchainAddress = `https://etherscan.io/readContract?a=${certification.blockchainContractAddress}`
      } else if (certification.blockchainNetworkId === "4") {
        certification.blockchainName =  "Ethereum Rinkeby"
        certification.blockchainAddress = `https://rinkeby.etherscan.io/readContract?a=${certification.blockchainContractAddress}`
      } else if (certification.blockchainNetworkId === "11155111") {
        certification.blockchainName =  "Ethereum Sepolia "
        certification.blockchainAddress = `https://sepolia.etherscan.io/readContract?a=${certification.blockchainContractAddress}`
      }
    }

    res.status(200).json(certification);
  }
};

// isCertified
exports.isCertified = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
  res.status(200).json((user.certificates.find(x=>x.certificationSession.equals(req.params.sessionId)))?.status);
};

exports.updateEvaluationStatus = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
  if (!user) res.status(404).send({ message: "Not found" });
  else {
    user.certificates = user.certificates.map(x=>{
      x.details = x.details.map(y=>{
        if(y._id == req.body.detailId){
          y.status = req.body.status
        }
        return y;
      })
      return x;
    })
    user.save(()=>{
      res.status(200).json({ message: "Status is updated successfully!" });
    })
  }
};

exports.updateEvaluationAdditionalComment = async (req, res) => {
  let user = await User.findOne({_id: req.params.traineeId}, {certificates:1})
  if (!user) res.status(404).send({ message: "Not found" });
  else {

    let certificate = user.certificates.find(x=> x.certificationSession.equals(req.body.sessionId))
    if( certificate){
      certificate.additionalComment = req.body.additionalComment;
    }
    else{
      user.certificates.push({
        certificationSession: req.body.sessionId,
        additionalComment: req.body.additionalComment
      })
      
    }
    user.save()
    res.status(200).json({ message: "Comment is updated successfully!" });
  }
};

exports.isCertificateInUse = async (req, res) => {
  let sessions = await CertificationSession.find({certificate: req.params.certificateId})
  let count = await User.find({
    certificates: {
      $elemMatch: {
        certificationSession: {
          $in: sessions.map(x=>x._id)
        }
      }
    }
  }).count()
  res.status(200).json({count});
};