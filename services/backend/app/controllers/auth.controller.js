const db = require("../models");
const mailer = require("../utils/mailer/mailer");
const authUtils = require("../utils/auth");
const contentUtils = require("../utils/content");
const Company = require("../models/company.model");


const User = db.user;

var bcrypt = require("bcryptjs");


exports.signup = async (req, res) => {
  let user = await authUtils.getNewUser(req.body)
  user.save()

  var baseUrl =  `https://${req.hostname}`
  if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
  mailer.sendAccountConfirmationEmail(user, baseUrl, (error) => {
    if (error) res.status(200).json({ message: "Registered successfully! Email not sent!", error })
    else res.status(200).json({message: "Successfully registred, please check your email.", userId: user._id});
  })
};



/**
 * @openapi
 * /api/v1/auth/signin/:
 *   post:
 *     description: Signin/Login action 
 *     tags:
 *      - _auth
 *     security: []
 *     parameters:
 *       - name: user
 *         in: body
 *         description: |
 *             ### Demo users
 * 
 *             Password for all demo users is: Testing123!
 *             
 *             To lern more about available roles in the system [click here](https://gitlab.elia.academy/root/elia/-/blob/dev/documentation/roles.md)
 * 
 *             #### School Module:
 *              - modulemanager
 *              - architect
 *              - student1
 *              - trainer1
 *              - classmanager1
 *              - librarian
 *              - parent1
 *              - inspector1
 *              - root
 * 
 *             #### Training Module:
 *              - tmodulemanager
 *              - trainingmanager1
 *              - ttrainee1
 *              - ttrainer1
 *              - tlibrarian
 *              - coordinator1
 *              - partner1 (business client)
 *              - root
 * 
 *             #### Cognitive Module:
 *              - cmodulemanager
 * 
 *  
 *         
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *                type: string
 *                default: student1
 *                example: student1
 *             password:
 *                type: string
 *                example: Testing123!
 *      
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            access_token:
 *              type: string
 *              description: Access token(JWT) used for authorization 
 */
exports.signin = async (req, res) => {
  let user = await User.findOne({username: req.body.username}).populate([{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}])
  if (!user) {
    return res.status(404).send({ message: "Invalid credentials" });
  }

  // Do not allow empty password
  if (!req.body.password.length) return res.status(401).send({
    accessToken: null,
    message: "Invalid credentials",
  });

  // Check if domain is allowed for this user
  let isDomainAllowed = await authUtils.isDomainAllowed(req, user)
  if (!isDomainAllowed) return res.status(403).send({ message: "DOMAIN_NOT_ALLOWED" });

  if (!bcrypt.compareSync(req.body.password, user.password)) {
    if (user.otherPassword?.password && bcrypt.compareSync(req.body.password, user.otherPassword.password)) {
      // if user has otherPassword, and it matches, then allow logging in
    } else {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid credentials",
      });
    }
  }

  if (!user.settings.isActive) {
    return res.status(405).send({
      message: "Invalid credentials",
    });
  }

  if (user.settings.selfRegistered && !user.settings.emailConfirmed) {
    return res.status(403).send({ message: "EMAIL_NOT_CONFIRMED" });
  }

  user.settings.prevLogin = user.settings.currentLogin;
  user.settings.currentLogin = {
    time: Date.now(),
    // deviceType: 'deviceType',
    // deviceId: 'deviceId',
    // ip: 'ip',
    // city: 'city',
  };

  user.settings.role = user.settings.defaultRole;
  user.settings.roleMaster = user.settings.defaultRoleMaster;
  if (req.body.timezone) {
    if (!user.settings.timezone || user.settings.timezone !== req.body.timezone) {
        user.settings.timezone = req.body.timezone;
    }
  }
  user.save() // reset role, saving user's default role to avoid having multiple roles in the sidebar
  var userData = await authUtils.getUserDataForFrontend(user,null,user.settings.defaultRole,null,user.settings.defaultRoleMaster)
  
  if (userData.role=="ModuleManager" && !userData.modules?.length != 0) {
    return res.status(403).send({ message: "You are a module manager but assigned to no modules yet!"});
  } else if (userData.role=="Assistant" && !userData.modules?.length != 0) {
    return res.status(403).send({ message: "You are an assistant but assigned to no modules yet!"});
  } else if (userData.role=="NetworkManager" && !userData.subscriptions?.length != 0) {
    return res.status(403).send({ message: "You are a network manager but assigned to no networks yet!"});
  } else if (userData.role=="EcoManager" && !userData.ecosystems?.length != 0) {
    return res.status(403).send({ message: "You are an ecosystem manager but assigned to no ecosystems yet!"});
  }
  
  // In case administrator(user with all:all:all scope) is asking for specific scopes overide his scopes from database.
  // It's usefull for testing, as you can check if scopes are working properly.
  if (userData.scopes.includes("all:all:all") && req.body.scope) {
    userData.scopes = req.body.scope.split(" ");
  }

  res.status(200).json(userData);
};



/**
 * @openapi
 * /api/v1/auth/refreshToken/:
 *   post:
 *     description: Refresh existing token. This can be used to set active module.
 *     tags:
 *      - _auth
 *     parameters:
 *       - name: data
 *         in: body
 *         description: |
 *            Refresh existing token. This can be used to set active module.
 *         schema:
 *           type: object
 *           required:
 *             - selectedModuleId
 *           properties:
 *             selectedModuleId:
 *                type: string
 *                default: "333000000000000000000000"
 *                example: "333000000000000000000000"
 *     responses:
 *       200:
 *        schema:
 *          type: object
 *          properties:
 *            access_token:
 *              type: string
 *              description: Access token(JWT) used for authorization 
 */
exports.refreshToken = async (req, res) => {
  let user = await User.findOne({_id: req.userId});
  if (!user){
    return res.status(404).send({ message: "User Not found." });
  }
  else if (!user?.settings?.isActive){
    return res.status(403).send({ message: "User Not active." });
  }
  // With every refreshToken try to refresh RECOMMENDATIONS, 
  // it will be executed only once in provided time interval
  // if (await contentUtils.shoudRefreshRecommendations(req.userId)){
  //   contentUtils.findRecommendations(req.userId)
  // }

  /*
    Based on module selection
      -> If user selects Training Center Module
        -> If selected Training Center Module is associatedModule then role priority wise
        -> If selected Training Center Module is Universal TC then Trainee role
      -> if user selects Cognitive Center Module (currently single module)
        -> role is other and default permissions given
  */
  const roleUpdate = await switchRoleByModuleId(user, req.body.selectedModuleId);
  const userData = await authUtils.getUserDataForFrontend(user,req.body.selectedModuleId,user.settings.defaultRole,null,user.settings.defaultRoleMaster)
  return res.status(200).json(userData);
};



/**
 * @openapi
 * /api/v1/mobile/auth/registerDevice:
 *   post:
 *     description: Register Device to user
 *     tags:
 *       - auth
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *            type: object
 *            required:
 *              - deviceToken
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the Device
 *                example: "Galaxy Note10+"
 *              brand:
 *                type: string
 *                description: Brand of the Device
 *                example: "samsung"
 *              os:
 *                type: string
 *                description: Os of the Device
 *                example: "android"
 *              osVersion:
 *                type: string
 *                description: osVeriosn of the Device
 *                example: "11"
 *              modelName:
 *                type: string
 *                description: Modelname of the Device
 *                example: "SM-N975F"
 *              productname:
 *                type: string
 *                description: productname of the Device
 *                example: "d2s"
 *              platformApiLevel:
 *                type: string
 *                description: Api Level of the Device
 *                example: "30"
 *              osBuildId:
 *                type: string
 *                description: OsBuildId of the Device
 *                example: "RP1A.200720.012.N975FXXU6FUBD"
 *              modelId:
 *                type: string
 *                description: ModelId of the Device
 *                example: "-"
 *              deviceToken:
 *                type: string
 *                description: Unique token of device
 *                example: "ExponentPushToken[7YBccQP_enapER56SAOtWw]"
 *              isNotificationOn:
 *                type: boolean
 *                description: To turn on notification
 *                example: true
 *     responses:
 *       200:
 *         schema:
 *          type: object
 *          properties:
 *            data:
 *              type: string
 *              example: "Device is already exist - OK"
 *                 
 *         description: Success Response.
 *       201:
 *         schema:
 *          type: object
 *          properties:
 *            data:
 *              type: string
 *              example: "Device pinned for curren user"
 *                 
 *         description: Success Response.
 *       400:
 *         description: Invalid or Bad Request (Required fields is/are missing)
 *         schema:
 *           type: object
 *           properties:
 *             data:
 *               type: string
 *               example: Device Token is required
 */
exports.registerDevice = async (req,res)=>{
  if (!req.body.deviceToken) {
      return res.status(400).json({data: "Device Token is Required"});
  }

  const device = await ConnectedDevice.findOne({deviceToken: req.body.deviceToken}) || null;

  if(device){
      if(device?.userId?.toString() !== req.userId?.toString()){
          //=> add device for current user
          await User.findOneAndUpdate({_id: req.userId},
              {$addToSet: {"settings.connectedDevices": device?._id}},
              {runValidators: true, new: true});

          // => remove device from prev user
          await User.findOneAndUpdate({_id: device.userId},{$pull:{'settings.connectedDevices': device._id}});

          // => update userId in device
          device.userId = req.userId;

          // => save device changes
          await device.save().then((doc)=>{
              return res.status(201).send({ data: "Device pinned for curren user"});
          }).catch(err=>{
              if(err) throw new Error(err);
          })

      }else {
          // => if user doesn't change 'OK'
          return res.status(200).json({ data: "Device is already exist - OK"});
      }
  }else{
      // else create new device and pin to user

      const newDevice = await new ConnectedDevice({
          userId: req.userId,
          ...req.body
      });

      if(newDevice?._id){
          await User.findOneAndUpdate({_id: req.userId},
              {$addToSet: {"settings.connectedDevices": newDevice?._id}},
              {runValidators: true, new: true})
      }

      newDevice.save().then((doc)=>{
          return res.status(201).send({ data: "Device was added"});
      }).catch(err=>{
          if(err) throw new Error(err);
      })
  }

}










/*
  Based on module selection
    -> If user selects Training Center Module
      -> If selected Training Center Module is associatedModule then role priority wise
      -> If selected Training Center Module is Universal TC then Trainee role
    -> if user selects Cognitive Center Module (currently single module)
      -> role is other and default permissions given
*/
const switchRoleByModuleId = async (user, moduleId) => {
  const modulesObj = await user.detectModule(moduleId);
  // If user has cognitive and training scope and user is created from cognitive module
  // if user role is Other
  let switchRole = 'Trainee';
  if (user.settings.role === 'Other' && user.isInTrainingCenter(modulesObj)) {
    // if user wants to select Training Center after signin
    // if user selects associated training center module then role priority else Trainee
    if (modulesObj[0].associatedModule) {
      if (user.settings.availableRoles.includes('ModuleManager')) {
        switchRole = 'ModuleManager';
      } else if (user.settings.availableRoles.includes('TrainingManager')) {
        switchRole = 'TrainingManager';
      } else if (user.settings.availableRoles.includes('Trainer')) {
        switchRole = 'Trainer';
      }
    }
    user.settings.role = switchRole;
    user.settings.defaultRole = switchRole;
    if (!user.settings.availableRoles.includes(switchRole)) {
      user.settings.availableRoles.push(switchRole);
    }
  } else if (user.settings.role !== 'Other') {
    // take present role
    switchRole = user.settings.role;
    // If user role is not Other
    // If user wants to select cognitive center after signin
    if (user.isInCognitiveCenter(modulesObj)) {
      const defaultRoleMasterId = '63c8f1cb88bbc68cce0eb2ea';
      const traineeRoleMasterId = '64058db74037cfa1d4085598';
      const previousRole = user.settings.role;
      const defaultRoleId = (user.settings.role === 'ModuleManager' ? defaultRoleMasterId : traineeRoleMasterId);
      user.settings.role = 'Other';
      user.settings.defaultRole = 'Other';
      if (!user.settings.roleMaster) {
        user.settings.roleMaster = defaultRoleId;
        user.settings.defaultRoleMaster = defaultRoleId;
        if (!user.settings.availableRoleMasters.find(role => role.toString() == defaultRoleId)) {
          user.settings.availableRoleMasters.push(defaultRoleId);
        }
      }
    } else if (user.isInTrainingCenter(modulesObj)) {
      if (modulesObj[0].associatedModule) {
        // if user selected associated training center module then role priority
        if (user.settings.availableRoles.includes('ModuleManager')) {
          switchRole = 'ModuleManager';
        } else if (user.settings.availableRoles.includes('TrainingManager')) {
          switchRole = 'TrainingManager';
        } else if (user.settings.availableRoles.includes('Trainer')) {
          switchRole = 'Trainer';
        }
      } else if (modulesObj[0]._id.toString() === '200004000080000000000000') {
        // if user selected Universal Training center then role is trainee else existing role
        switchRole = 'Trainee'
      }
      user.settings.role = switchRole;
      user.settings.defaultRole = switchRole;
      if (!user.settings.availableRoles.includes(switchRole)) {
        user.settings.availableRoles.push(switchRole);
      }
    }
  }
  await user.save();
  await user.populate([{path:"settings.roleMaster",select: ["_id", "name"]},{path:"settings.availableRoleMasters",select: ["_id", "name"]},{path:"settings.defaultRoleMaster",select: ["_id", "name"]}]).execPopulate();
  return;
}


exports.confirmEmail = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (!user){
    return res.status(404).send({ message: "User Not found." });
  }
  user.settings.emailConfirmed = true;
  user.save()
  res.status(200).json({message: "Email confirmed.", userId: user._id});
};

exports.resetPassword = async (req, res) => {
  let user = await User.findOne({ email: req.body.email })

  // Do not allow to reset password if account was not confirmed
  if (user?.settings?.selfRegistered && !user?.settings?.emailConfirmed) return res.status(403).send({ message: 'Email was not confirmed'});
  else if (!user?.settings?.isActive) return res.status(403).send({ message: 'Inactive user'});

  if (user) {
    var baseUrl =  `https://${req.hostname}`
    if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
    mailer.sendResetPasswordEmail(user, baseUrl, (err) => {
      if (err) res.status(500).send({ message: err.message});
      else res.status(200).json();
    });
  } else {
    // It's best to always return 200, 
    // so it's not possible to detect which emails exists in database
    res.status(200).json();
  }
};

exports.resetPasswordByOTP = async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(404).json({message: "User with this email was not found"});
  // Generate 4 digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);
  const otpExpireAt = new Date(new Date().setMinutes(new Date().getMinutes() + 15));
  user = await User.findOneAndUpdate({_id: user._id}, {otp: otp, otpExpireAt: otpExpireAt}, {new: true});
  mailer.sendResetPasswordOTPEmail(user, (err) => {
    if (err) res.status(500).json({ message: err.message});
    else res.status(200).json({message: "success"});
  });
}

exports.verifyOtp = async (req, res) => {
  let user = await User.findOne({email: req.body.email, otp: req.body.otp});
  if (!user) return res.status(404).json({message: "Invalid OTP!"});
  if (new Date(user.otpExpireAt) < new Date()) return res.status(400).json({message: "OTP expired!"});
  return res.status(200).json({message: "OTP verification successful!"});
}

exports.changePasswordByOtp = async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if (!user) return res.status(404).json({message: "User not found"});
  const passwordHash = bcrypt.hashSync(req.body.newPassword, 8);
  user = await User.findOneAndUpdate({_id: user._id}, {password: passwordHash});
  return res.status(200).json({message: "Password updated!"});
}

exports.resetMyPassword = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (user) {
    var baseUrl =  `https://${req.hostname}`
    if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
    mailer.sendResetPasswordEmail(user, baseUrl, (err) => {
      if (err) res.status(500).send({ message: err.message});
      else res.status(200).json({ message: "Email with a reset-password link has been sent!" });
    });
  } else {
    res.status(404).send({ message: "Your email does not exist in the system!" });
  }
};

exports.changePassword = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (user) {
    if (!bcrypt.compareSync(req.body.password, user.password)&&!bcrypt.compareSync(req.body.password, user.otherPassword?.password??''))
      return res.status(401).send({ message: "Incorrect password!" });
    else {
      user.password = bcrypt.hashSync(req.body.newPassword, 8)
      user.save()
      res.status(200).json({ message: "Password updated!" });
    }
  }
};

exports.isUsernameTaken = async (req, res) => {
  let exists = await User.exists({ username: req.body.username });
  if (exists && req.body.userId) {
    let oldExists = await User.exists({ _id: req.body.userId, username: req.body.username });
    res.status(200).json({ exists: !oldExists });
  } else res.status(200).json({ exists });
};

exports.isEmailTaken = async (req, res) => {
  let exists = await User.exists({ email: req.body.email });
  res.status(200).json({ exists });
}

exports.addModuleToScopes = async (req, res) => {
  let user = await User.findOne({_id: req.userId})
  if (user){
    if(!user.scopes.find(x=>x.name === "modules:read:"+req.body.moduleId)){
      // set module for company (the first module, `partner` choose after the registration)
      // we may have additional modal, after loggining in, "set moduleID for your company"
      await Company.findOneAndUpdate(
        { owner: req.userId, module: {$exists: false} },
        { $set: { "module": req.body.moduleId } });
      User.findByIdAndUpdate(req.userId,
        { $push: {
            scopes: [
              { name: "modules:read:" + req.body.moduleId,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
        }}, { new: true })
      res.status(200).json({ message: "Module was added to scopes successfully!" });
    } else {
      console.log("Module already exists in scopes")
      res.status(200).json({message: "Module already exists in scopes"});
    }
  } else {
    console.error("No, user found!")
    res.status(404).send({message: "No, user found!"});
  }
};