const db = require("../models");
const mailer = require("../utils/mailer/mailer");

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  var user = await db.user.findOne({username: req.body.username})
  if (user) {// If user with this username exits
    if (user.settings.selfRegistered && !user.settings.emailConfirmed && req.body.email==user.email )
    {// Resend confirmation email, if user with this username and email already exits, but email was not confirmed yet
      var baseUrl =  `https://${req.hostname}`
      if (req.hostname.includes('localhost') || req.hostname.includes('.lc')) baseUrl = baseUrl.replace('https', 'http')
      mailer.sendAccountConfirmationEmail(user, baseUrl, (error) => {
        if (error) res.status(500).send({ message: error })
        else res.status(200).json({message: "Registered successfully! Check your email.", userId: user._id});
      })
      return;
    }else{
      res.status(400).send({ message: "Failed! Username is already in use!" });
      return;
    }
  } else {// If user with this username does not exits
    user = await db.user.findOne({email: req.body.email})
    if (user) {// If user with this email exits
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    next();
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
