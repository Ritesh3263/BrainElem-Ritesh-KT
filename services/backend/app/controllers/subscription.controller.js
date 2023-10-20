const Ecosystem = require("../models/ecosystem.model");
const ModuleCore = require("../models/module_core.model");
const User = require("../models/user.model");
const ObjectId = require("mongodb").ObjectId;
const db = require("../models");
var bcrypt = require("bcryptjs");

////////////////    SUBSCRIPTIONS    ////////////////
exports.add = async (req, res) => {

  if(req.body.name.length<3){
    return res.status(409).send({field:'network_name', message:'Correct filed name'});
  }
  if(!req.body.owner?._id){
    return res.status(409).send({field:'owner', message:'Correct filed owner'});
  }

  if(req.body.modules.length<=0){
    return res.status(409).send({field:'modules', message:'Assign module'});
  }else{
    req.body.modules.some((m,index)=> {
      if(m.name.length<3){
        return res.status(409).send({field:`module.${index}.name`, message:'Module name'});
      }
    })
  }

  let modules = req.body.modules.map(m => ({...m, _id: new ObjectId(), core: new ObjectId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()} ))
  let moduleCores = modules.map(m=>{
  var roles = [];
  if(m.moduleType != 'TRAINING') roles = ['60825cc4963a790026a22537', '60825cc4963a790026a22547','60825cc4963a790026a2253f', '60825cc4963a790026a225a1','60855cc4963a790026a2253f','60825cc4963a790026a2254f','60825cc4963a790837a225a1','60825cc4963a788926a22537'];
  else roles = ['60825cc4963a790026a98537','60825cc4963a790056a74547','60825cc4963a695926a22537','60825cc4963a790026a5654f','60825cc4963a799626a2253f','60855cc4963a520026a2253f','60825cc4974a790837a225a1','60825cc4963a6a5926aa2537'];
  return new ModuleCore({
      moduleId: m._id, 
      _id: m.core, 
      levels: [
        {
            levelName: 'BEGINNER'
        },
        {
            levelName: 'INTERMEDIATE'
        },
        {
            levelName: 'ADVANCED'
        }
      ],
      // by default every module gonna have French and Swiss (European) grading scales
      gradingScales: [
        '5ca130000000000000000000',
        '5ca13000000000000000000A',],
      
      // we set French grading scale as default one
      defaultGradingScale: '5ca130000000000000000000',
      
      // by default every module will have standard user permissions
      rolePermissions: roles,
    })
  })
  db.moduleCore.insertMany(moduleCores)
  const subscriptionId = new ObjectId()
  let subscription = {
    _id: subscriptionId,
    name: req.body.name,
    description: req.body.description,
    modules: modules, 
    owner: req.body.owner,
  };
  let ecosystemId = req.params.ecosystemId;
  // let isEcoManagerAnOwner = true;

  await Ecosystem.findOneAndUpdate(
    { _id: ecosystemId },
    { $push: { subscriptions: subscription } },
    { runValidators: true })
  res.status(200).json({ message: "Subscription added correctly" });
  // add scope for Subscription owner
  if(req.body.owner) {
    let user = await User.findOne({_id: req.body.owner._id})
    user.scopes = user.scopes.map(x=>{
      if(x.name=="subscriptions:free:free")
        x.name = "subscriptions:all:"+subscriptionId
      return x
    })
    user.save()
  }
};

exports.readAll = async (req, res) => {
  // Get list with all subscriptions
  let ecosystemId = req.ecosystemId
  let ecosystem = await Ecosystem.findOne(
    { _id: ecosystemId },
    "subscriptions")
  if (!ecosystem) res.status(404).send({ message: "Not found!" });
  else res.status(200).json(ecosystem.subscriptions);
};

exports.updateOwner = async (req, res) => {
  let userId = req.params.userId;
  await User.findOneAndUpdate(
    {"_id": userId},
    { $set: req.body.newOwner },
    { new: true, runValidators: true })
  res.status(200).json({message: "Updated successfully"});
}

exports.update = async (req, res) => {

  if(req.body.name.length<3){
    res.status(409).send({field:'name', message:'Correct filed name'});
  }
  if(!req.body.owner?._id){
    res.status(409).send({field:'owner', message:'Correct filed owner'});
  }

  if(req.body.modules.length<=0){
    res.status(409).send({field:'modules', message:'Assign module'});
  }else{
    // req.body.modules.some((m,index)=> {
    //   if(m.name.length<3){
    //     res.status(409).send({field:`module.${index}.name`, message:'Module name'});
    //   }
    // })

    let err = null;
    const promises = req.body.modules.map((m,index)=>{
      if(m.name.length<3){
        err = `module.${index}.name`
      }
      return m;
    })
    const a = await Promise.all(promises);
    if(a && err){
      res.status(409).send({field: err, message:'Module name'});
    }else{
      let subscriptionId = req.params.subscriptionId
      // find deleted modules
      let eco = await Ecosystem.findOne({"subscriptions._id": req.params.subscriptionId}).select("subscriptions").lean().exec()
      let deletedModules = eco.subscriptions.find(x=>x._id==subscriptionId).modules.filter(x=>!req.body.modules.find(y=>y._id?.toString()==x._id))
      if(deletedModules.length>0){
        let deletedModuleIds = deletedModules.map(x=>x._id)
        // clear all related entries in the databse, and this is only first tier links to modules
        await db.moduleCore.deleteMany({"moduleId": {$in: deletedModuleIds}})
        await db.subjectSession.deleteMany({"module": {$in: deletedModuleIds}})
        await db.softSkillsTemplate.deleteMany({"module": {$in: deletedModuleIds}})
        await db.softSkill.deleteMany({"module": {$in: deletedModuleIds}})
        await db.log.deleteMany({"module": {$in: deletedModuleIds}})
        await db.internship.deleteMany({"module": {$in: deletedModuleIds}})
        await db.group.deleteMany({"module": {$in: deletedModuleIds}})
        await db.enquiry.deleteMany({"module": {$in: deletedModuleIds}})
        await db.course.deleteMany({"module": {$in: deletedModuleIds}})
        await db.coursePath.deleteMany({"module": {$in: deletedModuleIds}})
        await db.content.deleteMany({"module": {$in: deletedModuleIds}})
        await db.chapter.deleteMany({"module": {$in: deletedModuleIds}})
        await db.trainingModule.deleteMany({"module": {$in: deletedModuleIds}})
        await db.competence.deleteMany({"module": {$in: deletedModuleIds}})
        await db.competenceBlock.deleteMany({"module": {$in: deletedModuleIds}})
        await db.certificationSession.deleteMany({"module": {$in: deletedModuleIds}})
        await db.certificate.deleteMany({"module": {$in: deletedModuleIds}})
        await db.categoryRef.deleteMany({"module": {$in: deletedModuleIds}})

        let moduleManagerScopeNames = deletedModules.map(x=>`modules:all:${x._id}`)
        await db.user.updateMany(
            {"scopes.name": {$in: moduleManagerScopeNames}},
            {$pull: {"scopes": {"name": {$in: moduleManagerScopeNames}}}})
      }

      // updating subdocument
      await Ecosystem.findOneAndUpdate(
          {"subscriptions._id": subscriptionId},
          {"$set": {"subscriptions.$": req.body} },
          {runValidators: true })
      res.status(200).json({message: "Updated successfully"});

      if(req.body.owner._id) {
        // old manager
        let oldUser = await User.findOne({
          "settings.role": 'NetworkManager',
          "scopes.name": "subscriptions:all:"+subscriptionId
        })
        if (!oldUser) {
          // new manager
          let user = await User.findOne({_id:req.body.owner._id})
          user.scopes = user.scopes.map(x=>{
            if(x.name=="subscriptions:free:free")
              x.name = "subscriptions:all:"+subscriptionId
            return x
          })
          user.save()
        }
        else {
          if (!oldUser._id.equals(req.body.owner._id)) {
            // reset old manager
            oldUser.scopes = oldUser.scopes.map(x=>{
              if(x.name=="subscriptions:all:"+subscriptionId)
                x.name = "subscriptions:free:free"
              return x
            })
            await oldUser.save()
            // set new manager
            let user = await User.findOne({_id: req.body.owner._id})
            user.scopes = user.scopes.map(x=>{
              if(x.name=="subscriptions:free:free")
                x.name = "subscriptions:all:"+subscriptionId
              return x
            })
            user.save()
          }
        }
      }
    }
  }
};

exports.remove = async (req, res) => {
  let id = req.params.subscriptionId;
  let ecosystem = await Ecosystem.findOne({ "subscriptions._id": id })
  let subscription = ecosystem.subscriptions.find(x=>x._id==id)
  let deletedModuleIds = subscription.modules.map(x=>x._id)
  if(deletedModuleIds.length>0){ // takes care of the modules that were within this deleting network
    // clear all related entries in the databse, and this is only first tier links to modules
    await db.moduleCore.deleteMany({"moduleId": {$in: deletedModuleIds}})
    await db.subjectSession.deleteMany({"module": {$in: deletedModuleIds}})
    await db.softSkillsTemplate.deleteMany({"module": {$in: deletedModuleIds}})
    await db.softSkill.deleteMany({"module": {$in: deletedModuleIds}})
    await db.log.deleteMany({"module": {$in: deletedModuleIds}})
    await db.internship.deleteMany({"module": {$in: deletedModuleIds}})
    await db.group.deleteMany({"module": {$in: deletedModuleIds}})
    await db.enquiry.deleteMany({"module": {$in: deletedModuleIds}})
    await db.course.deleteMany({"module": {$in: deletedModuleIds}})
    await db.coursePath.deleteMany({"module": {$in: deletedModuleIds}})
    await db.content.deleteMany({"module": {$in: deletedModuleIds}})
    await db.chapter.deleteMany({"module": {$in: deletedModuleIds}})
    await db.trainingModule.deleteMany({"module": {$in: deletedModuleIds}})
    await db.competence.deleteMany({"module": {$in: deletedModuleIds}})
    await db.competenceBlock.deleteMany({"module": {$in: deletedModuleIds}})
    await db.certificationSession.deleteMany({"module": {$in: deletedModuleIds}})
    await db.certificate.deleteMany({"module": {$in: deletedModuleIds}})
    await db.categoryRef.deleteMany({"module": {$in: deletedModuleIds}})
    
    let moduleManagerScopeNames = deletedModuleIds.map(x=>`modules:all:${x}`)
    await db.user.updateMany(
      {"scopes.name": {$in: moduleManagerScopeNames}}, 
      {$pull: {"scopes": {"name": {$in: moduleManagerScopeNames}}}})
  }
  ecosystem.subscriptions.pull(id);
  ecosystem.save(); // saves document with subdocuments and triggers validation

  await User.findOneAndUpdate(
    {"scopes.name": "subscriptions:all:"+id}, 
    {$set: {"scopes.$.name": "subscriptions:free:free"}},
    {multi: true})
  
  res.status(200).json({ message: "Subscription was deleted successfully!" });
};

////////////////    SUBSCRIPTION OWNERS    ////////////////
exports.addOwner = async (req, res) => {
let newOwner = req.body.newOwner;
  const userId = new ObjectId();

  const newUser = new User({
    name: newOwner.name, 
    surname: newOwner.surname,
    email: newOwner.email,
    username: newOwner.username,
    password: bcrypt.hashSync(newOwner.password, 8),
    settings: { isActive: newOwner.isActive, role: newOwner.settings.role,defaultRole: newOwner.settings.role,availableRoles: [newOwner.settings.role]},
    details: newOwner.details,
    scopes: [
      { name: "users:all:" + userId },
      { name: "ecosystems:read:" + req.params.ecosystemId },
      { name: "content:create:all"},
      { name: "subscriptions:free:free" },
    ],
  })

  if(!newUser){
    res.status(400).send({ message: "Provide data!" });
  }

  newUser.save().then(()=>{
    res.status(201).send({ message: "Network owner was saved successfully!" });
  }).catch(err=>{
    if (err.toString().includes("username")) {
      res.status(409).send({ message: "Adding user failed, username already exists in database."});
    } else if(err.toString().includes("email_1")){
      res.status(409).send({ message: "Adding user failed, e-mail already exists in database."});
    }else{
      res.status(409).send(err);
    }
  });


};

exports.readAllSubscriptionOwners = async (req, res) => {
  // Get list with all subscription Owners in an ecosystem
  let users = await User.find(
    { "settings.role": 'NetworkManager', "scopes.name": "ecosystems:read:"+req.params.ecosystemId },
    "_id name surname username email createdAt details settings")
  res.status(200).json(users);
};

exports.readAllFreeSubscriptionOwners = async (req, res) => {
  let ecosystemId = req.ecosystemId;
  let subscriptionId = req.params.subscriptionId;
  let users = await User.find({ $or: [
      {
        "settings.role": 'NetworkManager' ,
        $and : [
          { "scopes.name": "ecosystems:read:"+ecosystemId}, 
          { "scopes.name": { $regex: "subscriptions:free", $options: "i" }}
        ],
      },
      { "scopes.name": "subscriptions:all:"+subscriptionId}
    ]}, "_id name surname username scopes createdAt settings createdAt")
  res.status(200).json(users);
};

exports.getSubscriptionOwner = async (req, res) => {
  // Get list with all subscription Owners
  // let match = '^subscriptions:.*'+req.params.subscriptionId+'$';
  let user = await User.findOne({ "scopes.name": "subscriptions:all:" + req.params.subscriptionId }, "_id name surname username email createdAt details settings")
  res.status(200).json(user);
};

exports.removeOwner = async (req, res) => {
  await User.findOneAndDelete({ "_id": req.params.userId });
  res.status(200).json({ message: "Deleted successfully" })

  // // delete only scope
  // User.findOne({ _id: id })
  //   .then((user) => {
  //     let scopeId = user.scopes.find((ele) => {
  //       // to be adjusted to owning multiple subscriptions
  //       if (ele.name.includes("subscriptions:")) return ele._id;
  //     });
  //     user.scopes.pull(scopeId);
  //     return user.save(); // saves document with subdocuments and triggers validation
  //   })
  //   .then((user) => {
  //     res.send({ message: "Network owner was deleted successfully!" });
  //   })
  //   .catch((e) => res.status(500).send({ message: e }));
};
