const Enquiry = require("../models/enquiry.model");
const CertificationSession = require("../models/certification_session.model");
const Company = require("../models/company.model");
const ObjectId = require("mongodb").ObjectId;

exports.add = async (req, res) => {
  let newSessionId = new ObjectId();
  let oldSessionId = req.params.sessionId
  let oldSession = await CertificationSession.findOne({"_id":oldSessionId})
  let company = await Company.findOne({"owner":req.userId});
  const enquiry = new Enquiry(req.body);
  enquiry.module = req.moduleId;
  enquiry.contact = req.userId; // as "setMyselfAsContact" is set to true and blocked
  enquiry.certificationSession = oldSessionId;
  enquiry.name = oldSession.name;  
  enquiry.company = company._id;
  
  enquiry.save();
  if(['ModuleManager','Assistant'].includes(req.role)){
    var newSession = new CertificationSession({
      _id: newSessionId, //
      origin: oldSessionId, //
      enquiry: enquiry._id, //
      allowMultipleAttempts: oldSession.allowMultipleAttempts,
      status: oldSession.status,
      isSendToCloud: oldSession.isSendToCloud,
      isPublic: oldSession.isPublic,
      examiners: oldSession.examiners,
      internships: oldSession.internships,
      traineesCount: oldSession.traineesCount,
      traineesLimit: enquiry.traineesLimit, //
      certificate: oldSession.certificate,
      certificationDate: oldSession.certificationDate,
      architect: oldSession.architect, // actually moduleManager
      trainingManager: oldSession.trainingManager,
      name: oldSession.name,
      module: oldSession.module,
      coursePath: oldSession.coursePath,
      startDate: oldSession.startDate,
      endDate: oldSession.endDate,
      enrollmentStartDate: oldSession.enrollmentStartDate,
      enrollmentEndDate: oldSession.enrollmentEndDate,
      level: oldSession.level,
      format: oldSession.format,
      digitalCode: oldSession.digitalCode,
    })
    newSession.save()
  }
  res.status(200).json({ message: "Created successfully", enquiryId: enquiry._id });
};

exports.addByModuleManager = async (req, res) => {
  delete req.body.company;
  delete req.body.contact;
  req.body.addedByModuleManager = true;
  if(!req.body.architect) delete req.body.architect
  if(!req.body.certificationSession) delete req.body.certificationSession
  const enquiry = new Enquiry(req.body);
  enquiry.module = req.moduleId;
  if (!enquiry.email) enquiry.email = undefined;
  enquiry.save()
  res.status(200).json({message: "Created successfully", enquiryId: enquiry._id});
};

exports.read = async (req, res) => {
  let enquiry = await Enquiry.findById(req.params.enquiryId)
  .populate([
      {path: 'contact', select: 'name surname email'},
      {path: 'trainees', select: 'name surname email'},
  ])
  if (!enquiry) res.status(404).send({ message: "Not found" });
  else res.status(200).json(enquiry);
};

exports.readAll = async (req, res) => {
  let enquiry = await Enquiry.find({module: req.moduleId})
    .populate([
      {path: "content"}, 
      {path: "company", select: 'name'}
    ])
  res.status(200).json(enquiry);
};

exports.readAllMyEnquiries = async (req, res) => { // read all my enquiries
  let enquiry = await Enquiry.find({ contact: req.userId })
  res.status(200).json(enquiry);
};

exports.update = async (req, res) => {
  let thisEnquiry = await Enquiry.findOne({"_id":req.params.enquiryId})
  let oldSessionId = thisEnquiry.certificationSession;
  let oldSession = await CertificationSession.findOne({"_id":oldSessionId})
  // let currentSession = await CertificationSession.findOne({"enquiry":req.params.enquiryId}).populate({path: "groups"})  
  let trainees = [...req.body.trainees];
  let newSessionId = new ObjectId();
  req.body.traineesCount = trainees.length;
  await Enquiry.findOneAndUpdate(
    { _id: req.params.enquiryId },
    { $set: req.body },
    { runValidators: true })
  if(req.body.status == "Active" && ['ModuleManager', 'Assistant'].includes(req.role)){
    // session template update
    let session = await CertificationSession.findOneAndUpdate(
      { enquiry: req.params.enquiryId },
      { $set: 
        { 
          architect: req.body.architect,
          name: req.body.name, // inital name of the seession
          status: 1,
          module: req.body.module, // stays the same
          traineesCount: req.body.traineesCount,
          traineesLimit: req.body.traineesLimit,
          enrollmentStartDate: req.body.startDate,
          enrollmentEndDate: req.body.endDate,
          enquiry: req.params.enquiryId,
          unassignedTrainees: trainees
          // unassignedTrainees: oldtrainees,
          // pastTrainees: req.body.trainees,
        } 
      },
      { runValidators: true })
    if(!session){ 
      console.log("The session wasn't found. New session created.")
      if(["ModuleManager", "Assistant"].includes(req.role)){
        var newSession = new CertificationSession({
          _id: newSessionId, //
          origin: oldSessionId, //
          enquiry: req.body._id, //
          allowMultipleAttempts: oldSession.allowMultipleAttempts,
          status: oldSession.status,
          isSendToCloud: oldSession.isSendToCloud,
          isPublic: oldSession.isPublic,
          category: oldSession.category,
          examiners: oldSession.examiners,
          internships: oldSession.internships,
          traineesCount: req.body.traineesCount,
          traineesLimit: req.body.traineesLimit, //
          certificate: oldSession.certificate,
          certificationDate: oldSession.certificationDate,
          architect: req.body.architect,
          trainingManager: oldSession.trainingManager,
          name: req.body.name,
          module: req.body.module,
          coursePath: oldSession.coursePath,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          enrollmentStartDate: oldSession.enrollmentStartDate,
          enrollmentEndDate: oldSession.enrollmentEndDate,
          level: oldSession.level,
          unassignedTrainees: req.body.trainees, 
          format: oldSession.format,
          digitalCode: oldSession.digitalCode,
        })

        // var newSession = new CertificationSession({ ...oldSession})
        // newSession._id = newSessionId;

        newSession.save()
      }
    }
  }
  res.status(200).json({ message: "Updated successfully" });
};

exports.remove = async (req, res) => {
  await Enquiry.findByIdAndDelete(req.params.enquiryId)
  res.status(200).json({ message: "Deleted successfully" });
};

exports.createSessionFromEnquiry = async (req, res) => {
  
  let enquiry = await Enquiry.findById(req.params.enquiryId)
  if (!enquiry) res.status(404).send({ message: "Not found" });
  else {
    const sessionId = new ObjectId();
    const csession = new CertificationSession({
      _id: sessionId,
      name: enquiry.name,
      traineesLimit: enquiry.traineesLimit,
      unassignedTrainees: enquiry.trainees, 
      architect: enquiry.architect,
      status: 0
    })
    csession.save()
    res.status(200).json({message: "Session has been added."});
  }
};

exports.readAllSessionTemplates = async (req, res) => {
  let cSession = await CertificationSession.find({"module": req.moduleId, origin: {$exists: false}})
  const sessions = cSession.map(s=>({_id: s._id, name: s?.name??'without_name'}));
  res.status(200).json(sessions)
};