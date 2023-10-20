const Ecosystem = require("../models/ecosystem.model");
const ModuleCore = require("../models/module_core.model");
const User = require("../models/user.model");
const Group = require("../models/group.model");
const TrainingModule = require("../models/training_module.model");
const ObjectId = require("mongodb").ObjectId;
const db = require("../models");

var bcrypt = require("bcryptjs");

const moduleUtils = require("../utils/module");

////////////////    MODULES    ////////////////
exports.add = async (req, res) => {
  let mod = req.body
  let moduleCoreId = new ObjectId()
  mod._id = new ObjectId()
  mod.core = moduleCoreId
  let subscriptionId = req.subscriptionId;
  let ecosystem = await Ecosystem.findOne({ "subscriptions._id": subscriptionId })
  const subscription = ecosystem.subscriptions.id(subscriptionId); // returns a matching subdocument
  const scopes = [];
  var roles = [];
  if(mod.moduleType === 'SCHOOL') roles = ['60825cc4963a790026a22537', '60825cc4963a790026a22547','60825cc4963a790026a2253f', '60825cc4963a790026a225a1','60855cc4963a790026a2253f','60825cc4963a790026a2254f','60825cc4963a790837a225a1','60825cc4963a788926a22537'];
  else if (mod.moduleType === 'TRAINING') roles = ['60825cc4963a790026a98537','60825cc4963a790056a74547','60825cc4963a695926a22537','60825cc4963a790026a5654f','60825cc4963a799626a2253f','60855cc4963a520026a2253f','60825cc4974a790837a225a1','60825cc4963a6a5926aa2537'];

  if (mod.moduleType === 'Cognitive(+Training)') {
    /* if moduleType is Cognitive(+Training)
      -> create COGNITIVE module
      -> create COGNITIVE module core
      -> create TRAINING module
      -> create TRAINING module core
      -> add modules to subscription
      -> add scopes to managers
    */
   // COGNITIVE
    const cognitiveModule = JSON.parse(JSON.stringify(req.body));
    cognitiveModule._id = mod._id;
    cognitiveModule.moduleType = 'COGNITIVE';
    const cognitiveModuleCore = new ModuleCore({
      moduleId: cognitiveModule._id,
      defaultGradingScale: '5ca13000000000000000000a',
    });
    cognitiveModule.core = cognitiveModuleCore._id;
    // TRAINING
    const trainingModule = JSON.parse(JSON.stringify(req.body));
    trainingModule._id = new ObjectId();
    trainingModule.moduleType = 'TRAINING';
    const trainingModuleCore = new ModuleCore({
      moduleId: trainingModule._id,
      defaultGradingScale: '5ca13000000000000000000a',
    });
    trainingModule.core = trainingModuleCore._id;
    cognitiveModuleCore.save();

    // maintain asscoate module
    cognitiveModule.associatedModule = trainingModule._id;
    trainingModule.associatedModule = cognitiveModule._id;
    subscription.modules.push(cognitiveModule);
    scopes.push({name: 'modules:all:'+cognitiveModule._id});
    trainingModuleCore.save();
    subscription.modules.push(trainingModule);
    scopes.push({name: 'modules:all:'+trainingModule._id});
  } else {
    const moduleCore = new ModuleCore({
      _id: moduleCoreId,
      moduleId: mod._id,
      levels: [
        { levelName: 'BEGINNER' },
        { levelName: 'INTERMEDIATE' },
        { levelName: 'ADVANCED'  }
      ],
      // by default every module will have French and Swiss (European) grading scales
      gradingScales: ['5ca130000000000000000000',  '5ca13000000000000000000A', ],
      // we set French grading scale as default one
      defaultGradingScale: '5ca130000000000000000000',
      // by default every module will have standard user permissions
      rolePermissions: roles,
    });
    moduleCore.save()
    subscription.modules.push(mod);
    scopes.push({name: "modules:all:"+mod._id});
  }

  let initFormats=  {
    en: {
      1: "WEEKENDS",
      2: "EVERY DAY",
      3: "ONCE A MONTH",
      4: "IRREGULARLY",
    },
    fr: {
      1: "FINS DE SEMAINE",
      2: "TOUS LES JOURS",
      3: "UNE FOIS PAR MOIS",
      4: "IRRÉGULIÈREMENT",
    }
  };
    
  if(mod.language == "en" || mod.language == "fr"){
    let formats = [
      { _id: new ObjectId(), name: initFormats[mod.language][1],  module: mod._id, initFormat: 1},
      { _id: new ObjectId(), name: initFormats[mod.language][2], module: mod._id, initFormat: 1},
      { _id: new ObjectId(), name: initFormats[mod.language][3], module: mod._id, initFormat: 1},
      { _id: new ObjectId(), name: initFormats[mod.language][4], module: mod._id, initFormat: 1},
    ];
    db.format.insertMany(formats, (err) => { if (err) console.error(err.message); })  
  }
  ecosystem.save(); // saves document with subdocuments and triggers validation
  res.send({ message: "Module was added successfully!" });
  // add scope for Module manager
  let user = await User.updateMany(
    {_id: { $in: req.body.currentManagers.map(x=>x._id) }},
    {$push: {scopes: {$each: scopes}}},
    {new: true}
  )
  if (!user) console.error("No, manager found!")
};

exports.readAll = async (req, res) => {
  let ecosystem = await Ecosystem.findOne({ "subscriptions._id": req.params.subscriptionId }).lean()
  if (!ecosystem) res.status(404).send({ message: "Not found" });
  else {
    let modules = ecosystem?.subscriptions.find(s=>s._id==req.params.subscriptionId)?.modules.filter(x=>x.archived != 1)||[]
    modules = await Promise.all(modules.map(async x=>{
        x.assignedManagers = await User.find(
          { "scopes.name": "modules:all:" + x._id },
          "name surname username settings createdAt")
          return x
    }))
    res.status(200).json(modules);
  }
};

/**
 * @openapi
 * /api/v1/modules/import-users:
 *   post:
 *     description: Import Users from modules
 *     tags:
 *       - _Cognitive User Module 
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            properties:
 *              moduleIds:
 *                type: array
 *                description: Ids of module
 *                example: ["333000000000000000000000"]
 *              roles:
 *                type: array
 *                description: roles
 *                example: ["Trainee"]
 *              roleMasters:
 *                type: array
 *                description: role masters
 *                example: ["63c8f59088bbc68cce0eb6e0"]
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              example: No new users to import
 *            changes:
 *              type: array
 *         description: Success Response.
 */
exports.importUsersFromModules = async (req, res) => {
  console.log("importUsersFromModules", req.body)
  let currentUsersCount = await User.countDocuments({ "scopes.name": { $regex: "^modules:.*?" + req.moduleId + "$", $options: "i" } });
  let eco = await Ecosystem.findOne({ "subscriptions.modules._id": req.moduleId })
  let subscription = eco.subscriptions.find(sub=>sub.modules.id(req.moduleId))
  let module = subscription.modules.id(req.moduleId)
  let maxLimit = module.usersLimit - currentUsersCount

  let counts = await Promise.all(req.body.moduleIds.map(async moduleId => {
    let count = await User.countDocuments({
      $and: [
        { 'settings.availableRoles': { $in: req.body.roles }},
        { "scopes.name": "modules:read:" + moduleId },
        { "scopes.name": { $not: { $eq: "modules:read:" + req.moduleId } } }
      ]
     })
    return count
  }))
  let toBeModifiedCount = await counts.reduce((a, b) => a + b, 0)
  if (toBeModifiedCount == 0) {
    res.status(200).json({ message: `No new users to import`, changes: [] });
  } else if (toBeModifiedCount <= maxLimit) {
    let changes = await Promise.all(req.body.moduleIds.map(async moduleId => {
      // import all users from modules to new module based on selected roles
      let change = await db.user.updateMany(
        { "scopes.name": "modules:read:" + moduleId, 'settings.availableRoles': { $in: req.body.roles }, 'settings.availableRoleMasters': {$in: req.body.roleMasters} },
        { $addToSet: { scopes: { name: "modules:read:" + req.moduleId } } },
        { new: true }
      )
      return {change, moduleId}
    }))
    res.status(200).json({ message: `Imported ${toBeModifiedCount} users`, changes });
  } else {
    res.status(200).json({ message: `Users limit exceeded (${maxLimit} users left, ${toBeModifiedCount} users to be imported)`, changes: [] });
  }
};

exports.read = async (req, res) => {
  let moduleId = req.params.moduleId;
  let eco = await Ecosystem.findOne(
    { "subscriptions.modules._id": moduleId },)
    .populate({ path: "subscriptions.modules.core" })
  if (!eco) res.status(404).send({ message: "Not found" });
  else {
    let subscription = eco.subscriptions.find(sub=>sub.modules.id(moduleId))
    res.status(200).json(subscription.modules.id(moduleId));
  }
};

exports.update = async (req, res) => {
  let moduleId = req.params.moduleId;
  let currentManagerIds = req.body.currentManagers.map(x=>x._id)

  await Ecosystem.findOne(
    { "subscriptions.modules._id": moduleId },
    (err, eco) => {
      if (err) res.status(500).send({ message: "Error" });
      else if (!eco) res.status(404).send({ message: "Not found" });
      else {
        eco.subscriptions.map(sub =>
          sub.modules.map(mod => {
            if (mod._id == moduleId) {
              mod.name = req.body.name;
              mod.moduleType = req.body.moduleType;
              mod.description = req.body.description;
              mod.groups = req.body.groups;
              mod.trainingModules = req.body.trainingModules;
              mod.domainName = req.body.domainName;
              mod.expires = req.body.expires;
              mod.isActive = req.body.isActive;
              mod.language = req.body.language;
              mod.usersLimit = req.body.usersLimit;
            }
            return mod
          })
        );
        eco.save();
        res.status(200).json({ message: "Module was updated successfully!" });
      }
    }
  )
  // remove scope for Module manager
  await User.updateMany(
    { "scopes.name": "modules:all:" + moduleId },
    {$pull: {scopes: {name: "modules:all:" + moduleId}}},
    {new: true}
  )
  // update scope for Module manager
  if (currentManagerIds.length>0) {
    await User.updateMany(
      { "_id": { $in: currentManagerIds } },
      {$push: {scopes: {name: "modules:all:" + moduleId}}},
      {new: true}
    )
  }
};

exports.remove = async (req, res) => {
  let moduleId = req.params.moduleId;
  let ecosystem = await Ecosystem.findOne({ "subscriptions.modules._id": moduleId })
  ecosystem.subscriptions.map((sub) => {
    sub.modules.map(x => {
      if(x._id == moduleId) {
        x.archived = 1;}
        return x;
    })
    // sub.modules.pull(moduleId);
    return sub;
  });
  ecosystem.save(); // saves document with subdocuments and triggers validation

  await ModuleCore.updateOne({ moduleId: moduleId }, { $set: { ['archived']: 1 } }, { runValidators: true }).exec()

  // // remove corresponding scope
  // await User.updateMany(
  //   { "scopes.name": "modules:all:" + moduleId },
  //   { $pull: { scopes: { name: "modules:all:" + moduleId } } }
  // )
  res.status(200).json({ message: "Module was removed successfully!" });
};

////////////////    MODULE MANAGERS    ////////////////
exports.addManager = async (req, res) => {
  let newManager = req.body.moduleManager;
  const userId = new ObjectId();
  const user = new User({
    _id: userId,
    name: newManager.name, 
    surname: newManager.surname,
    username: newManager.username,
    email: newManager.email,
    password: bcrypt.hashSync(newManager.password, 8),
    settings: {...newManager.settings, role: "ModuleManager",defaultRole: "ModuleManager",availableRoles: ["ModuleManager"]},
    details: newManager.details,
    scopes: [
      { name: "users:all:" + userId }, 
      { name: "subscriptions:read:" + req.subscriptionId },
      { name: "content:create:all" },
      { name: "modules:free:free" },
    ],
  });

  user.save().then(()=>{
    res.status(200).json({ message: "Manager was saved successfully!" });
  }).catch(err=>{
    res.status(409).send(err);
  })

};

exports.updateManager = async (req, res) => {
  req.body.moduleManager.settings.role = "ModuleManager"; // force set role to ModuleManager
  req.body.moduleManager.settings.availableRoles = ["ModuleManager"]; // force set availableRoles to ModuleManager
  req.body.moduleManager.settings.defaultRole = "ModuleManager"; // force set defaultRole to ModuleManager
  
  await User.findOneAndUpdate(
    {_id:req.params.userId},
    { $set: req.body.moduleManager },
    { new: true, runValidators: true })
  res.status(200).json({ message: "Manager was updated successfully!" });
};

exports.readAllManagers = async (req, res) => {
  let subscriptionId = req.params.subscriptionId;
  let moduleManagers = await User.find(
    {"settings.availableRoles": 'ModuleManager' , "scopes.name": "subscriptions:read:"+subscriptionId }, // TODO: load according to network ID
    "name surname username scopes settings createdAt")
  res.status(200).json(moduleManagers);

};

exports.readFreeManagers = async (req, res) => {
  let moduleId = req.params.moduleId;
  let freeModuleManagers = await User.find({ $or: [
    {
      "settings.availableRoles": 'ModuleManager' ,
      $and : [
        { "scopes.name": "subscriptions:read:"+req.subscriptionId}, 
        { "scopes.name": "modules:free:free"}
      ],
    },
    { "scopes.name": "modules:all:"+moduleId}]},
    "_id name surname username scopes settings createdAt")
  res.status(200).json(freeModuleManagers);

};

exports.getManagersInModule = async (req, res) => {
  // Get list with all module managers
  let moduleManagers = await User.find(
    { 
      "scopes.name": "modules:all:" + req.params.moduleId, 
      "settings.availableRoles": { $in : ['ModuleManager']}  
    },
    "_id name surname username settings createdAt")
    res.status(200).json(moduleManagers);
  };

// actually ger ModuleManager, used only in TRAINING
exports.getArchitectsInModule = async (req, res) => {
    const matchAllScopeActions = `^modules:.*?${req.params.moduleId}$`;
    let moduleArchitects = await User.find({
        "scopes.name": { $regex: matchAllScopeActions, $options: "i" },
        "settings.availableRoles":  "ModuleManager"
    }, "_id name surname username settings createdAt")
    res.status(200).json(moduleArchitects);
};
  
exports.getRemainingUser = async (req, res) => {
  let moduleId = req.params.moduleId;
  let currentUsersCount = await User.countDocuments({ "scopes.name": { $regex: "^modules:.*?" + moduleId + "$", $options: "i" } });
  let eco = await Ecosystem.findOne({ "subscriptions.modules._id": moduleId })
  if (!eco) res.status(404).send({ message: "Not found" });
  else {
    let subscription = eco.subscriptions.find(sub=>sub.modules.id(moduleId))
    let module = subscription.modules.id(moduleId)
    res.status(200).json({count: (module.usersLimit - currentUsersCount)});
  }
};

exports.removeModuleManger = async (req, res) => {
  
  await User.findOneAndDelete({_id:req.params.userId})
  res.status(200).json({ message: "Deleted successfully" });
};

// this is actually not removing manager, but removing module from manager
exports.removeModuleFromManager = async (req, res) => {
  let user = await User.findOne({ _id: req.params.userId })
  for(var i = user.scopes.length - 1; i >= 0; i--) {
    if (user.scopes[i].name.includes("modules:")) 
      user.scopes.pull(user.scopes[i]._id)
  }
  // // pushing lost scopes, to be able to be selected as manager once more
  // let scopeId = new ObjectId()
  // var scope = { name: 'modules:free:free', _id: scopeId };
  // user.scopes.push(scope);
  // await user.save(); // saves document with subdocuments and triggers validation
  res.send({ message: "Module manager was deleted successfully!" });
};

////////////////    TRAINING MODULES    ////////////////
exports.readAllTrainingModules = async (req, res) => {
  // Get list with all training modules inside module
  // const roles = ['Root','EcoManger, CloudManager, NetworkManager']
  if (req.role == 'CloudManager'){
    let trainingModules = await TrainingModule.find({origin: {$exists: false}}).populate({
      path: "chapters", select: ["name"]
    }).exec()
    res.status(200).json(trainingModules);
  } else {
    if (!req.moduleId) req.moduleId = req.params.moduleId
    let core = await ModuleCore.findOne({ moduleId: req.moduleId }, {trainingModules:1})
      .populate({
        path: "trainingModules", select: ["name", "chapters"] ,
        populate: { path: "chapters", select: ["name"]}
      })
    if (!core) res.status(404).send({ message: "Module not found." });
    res.status(200).json(core.trainingModules);
  }
};


////////////////    GROUPS    ////////////////
exports.readAllGroups = async (req, res) => {

  if (!req.moduleId) req.moduleId = req.params.moduleId
  // Get list with all groups inside module
  let ecosystem = await Ecosystem.findOne(
      { "subscriptions.modules._id": req.moduleId },
      ["_id", "subscriptions.modules._id", "subscriptions.modules.core"]
    )
    .populate({path: "subscriptions.modules.core", select: ['groups'], populate: {path: 'groups', select: ['name', '_id']} })
  if (!ecosystem) return res.status(404).send({ message: "Groups not found." });
  //Find proper subscription
  let subscription = ecosystem.subscriptions.find((subscription) => {
    return subscription.modules.some(
      (module) => module._id == req.moduleId
    );
  });
  //Find proper module
  let module = subscription.modules.find(
    (module) => module._id == req.moduleId
  );
  res.status(200).json(module.core.groups);
};
exports.getAllGroupsForArchitect = async (req, res) => {
  let modulecore = await ModuleCore.findOne({moduleId: req.moduleId})
  let groups = await Group.find({_id:  { $in: modulecore.groups},
  })
  .populate({path: 'academicYear'})
  res.status(200).json(groups) 
};

////////////////   TRAINERS    ////////////////
exports.readAllTrainers = async (req, res) => {
  let users = await User.find({"settings.availableRoles": 'Trainer' }, "name surname")
  res.status(200).json(users);
};

exports.readAllTrainersInModule = async (req, res) => {
  if (!req.moduleId) req.moduleId = req.params.moduleId
  let users = await User.find({$and :
    [{"settings.availableRoles": 'Trainer' },
    { "scopes.name": 'modules:read:'+req.moduleId}]},
    "name surname")
  res.status(200).json(users);
};

exports.readClassManagersGroups = async (req, res) => {
  let classes = await Group.find({classManager: req.userId })
  res.status(200).json(classes.map(x => x._id));
};

exports.getModuleUsers = async (req, res) => {
  let moduleId = req.params.moduleId||req.moduleId;
  let moduleUsers = await moduleUtils.getAllUsersInModule(req.userId, moduleId)
  // let moduleUsers = await User.find(
  //     { "scopes.name": { $regex: "^modules:.*?" + moduleId + "$", $options: "i" } },
  //     "name surname username settings.roleMaster"
  // ).populate([{path: "settings.roleMaster", select: "name"}]);
  return res.status(200).json({
      message: "Users fetched successfully",
      data: moduleUsers
  });
};
/////////////////  MODULE SETUP  ////////////////////















