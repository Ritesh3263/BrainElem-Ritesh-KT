"use strict";
var handlebars = require('handlebars');
var jwt = require("jsonwebtoken");
var fs = require('fs');
const tasker = require('../tasker/tasker')
const authUtils = require('../auth')
const moduleUtils = require('../module')
const config = require("../../config/auth.config");
const Mail = require("../../models/mail.model");
const db = require("../../models");
const moment = require("moment-timezone");

handlebars.registerHelper('formatDate', function (date, format, timezone = 'Europe/Paris') {
  return moment(new Date(date)).tz(timezone).format(format);
});

handlebars.registerHelper('breaklines', function(text) {
  text = handlebars.Utils.escapeExpression(text);
  text = text.replace(/(\r\n|\n|\r)/gm, '<br>');
  return new handlebars.SafeString(text);
});

const getUserName = (user) => {
  let fullName = user.name + ' ' + user.surname;

  if (fullName.length > 5) return fullName
  else return user.email

}

const FOOTER_TEXT = {
  'en': 'BrainCore Solutions is revolutionizing recruitment, training and human resource management. With 20 years of applied research in cognitive pedagogy and neuroscience, we offer new exclusive perspectives!',
  'fr': 'BrainCore Solutions révolutionne le recrutement, la formation et la gestion des ressources humaines. Forts de 20 ans de recherches appliquées en pédagogie cognitive et en neurosciences nous offrons de nouvelles perspectives exclusives !',
  'pl': 'BrainCore Solutions rewolucjonizuje rekrutację, szkolenia i zarządzanie zasobami ludzkimi. Opierając się na 20 latach badań stosowanych w dziedzinie pedagogiki poznawczej i neuronauk, oferujemy nowe, wyjątkowe perspektywy!'
}



// Send email with link to download PDF report
// This will not give user access to the platform
exports.sendCognitiveReport = (user_invited, user_inviting, result, baseUrl, callback) => {
  let filename = __dirname + "/templates/confirm_with_button.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    //Get link with cognitive report
    var link = `${baseUrl}/api/v1/users/cognitive-report/download/${user_invited._id}/${result._id}`
    var subject = "Your results are ready"
    var replacements = {
      welcome: "Your personal report is ready",
      button: "Click here to open",
      message1: "We are pleased to provide you with the secure link that allows you to download your personal report:",
      message2: "", //<b>Validity:</b> This link is valid for 1 month from today. We invite you to download your complete report right now.
      link: link,
      contact_message: "",
      footer_text: FOOTER_TEXT['en']
    };
    if (user_invited.getLanguage() == "fr") {// ####### FR #######
      subject = "Vos résultats sont prêts"
      replacements.welcome = "Votre rapport personnel est prêt";
      replacements.button = "Cliquez ici pour ouvrir";
      replacements.message1 = "Nous avons le plaisir de vous remettre le lien sécurisé vous permettant de télécharger votre rapport personnel:";
      replacements.message2 = ""; //<b>Validité:</b> Ce lien est valable 1 mois à compter de ce jour. Nous vous invitons à télécharger votre rapport complet dès maintenant.
      replacements.contact_message = "";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }

    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user_invited.email]
    });

    // Sendgrid template 
    //mail.sendgridTemplateId = "d-c80a32d9d3504995a228fc5aab6e439c"
    //mail.sendgridDynamicTemplateData = replacements

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });

  });

}

// Send email with access to the platform
// When accessing user will be able to login into MySpace and Sentinel
exports.sendPlatformAccess = (user_invited, user_inviting, baseUrl, callback) => {
  let filename = __dirname + "/templates/confirm_with_button.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    //Generate link with token
    var token = authUtils.getJwtToken(user_invited, 2*24*3600)
    var link = baseUrl + "?token=" + token + "&confirmEmail=1"

    var subject = getUserName(user_inviting) + " invited you to BrainCore Platform"
    var replacements = {
      welcome: "Welcome to BrainCore",
      button: "Click Here to confirm",
      message1: "Hello " + getUserName(user_invited) +"\n\nNew account has been created for you by "+ getUserName(user_inviting) +" that has invited you to join the BrainCore Platform. \nUse the button above to confirm the account and access the platform.",
      subtitle: "Validity:",
      message2: " This link is valid only for 48 hours! We encourage you to use the link as soon as possible.",
      link: link,
      contact_message: "",
      footer_text: FOOTER_TEXT['en']
    };
    if (user_invited.getLanguage() == "fr") {// ####### FR #######
      subject = getUserName(user_inviting) + " vous a invité sur la plateforme BrainCore"
      replacements.welcome = "Bienvenue  à la BrainCore";
      replacements.button = "Cliquez ici pour confirmer";
      replacements.message1 = "Bonjour " + getUserName(user_invited) + "\n\nUn nouveau compte a été créé pour vous par " + getUserName(user_inviting) + " qui vous a invité à rejoindre la plateforme BrainCore. \nUtilisez le bouton ci-dessus pour confirmer le compte et accéder à la plateforme.";
      replacements.subtitle = "Validité:";
      replacements.message2 = " Ce lien n'est valable que pendant 48 heures ! Nous vous encourageons à utiliser le lien dès que possible.";
      replacements.contact_message = "";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }

    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user_invited.email]
    });

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });

  });

}

// Send email with account confirmation
exports.sendAccountConfirmationEmail = (user, baseUrl, callback) => {
  let filename = __dirname + "/templates/confirm_with_button.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    //Generate link with token
    var token = authUtils.getJwtToken(user)
    var link = baseUrl + "?token=" + token + "&confirmEmail=1"


    var subject = "BrainCore - Confirmation"
    var replacements = {
      welcome: "Account Confirmation",
      button: "Click Here to Confirm",
      message1: "You are not able to click the button we have provided a link for you to copy and paste in your browser.",
      message2: "Link",
      link: link,
      contact_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      replacements.welcome = "Confirmation de compte";
      replacements.button = "Cliquez ici pour confirmer";
      replacements.message1 = "Vous ne pouvez pas cliquer sur le bouton, nous avons fourni un lien que vous pouvez copier et coller dans votre navigateur.";
      replacements.message2 = "Le lien";
      replacements.contact_message2 = "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }


    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });


  });

}

// Send email with result confirmation - this is used by users who took a test without login
// and provided their email address at the end
exports.sendResultConfirmationEmail = (user, result, baseUrl, callback) => {
  let filename = __dirname + "/templates/confirm_with_button.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    //Generate link with token
    var token = authUtils.getJwtToken(user, 3*24*3600)
    var link = baseUrl + "?token=" + token + "&resultId="+result._id


    var subject = "Result Confirmation"
    var replacements = {
      welcome: "Result Confirmation",
      button: "Click Here to Confirm",
      message1: "You are not able to click the button we have provided a link for you to copy and paste in your browser.",
      message2: "Link",
      link: link,
      contact_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "Confirmation des résultats"
      replacements.welcome = "Confirmation des résultats";
      replacements.button = "Cliquez ici pour confirmer";
      replacements.message1 = "Vous ne pouvez pas cliquer sur le bouton, nous avons fourni un lien que vous pouvez copier et coller dans votre navigateur.";
      replacements.message2 = "Le lien";
      replacements.contact_message2 = "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }


    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });


  });

}

// Send email with link to reset password
exports.sendResetPasswordEmail = (user, baseUrl, callback) => {
  let filename = __dirname + "/templates/reset_password.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) return callback(err);

    //Generate link with token
    var token = authUtils.getJwtToken(user)
    var link = baseUrl + "?token=" + token + "&resetPassword=1"


    var subject = "BrainCore - Password recovery"
    var replacements = {
      welcome: "Hello!",
      message1: "Brainelem recently received a request for a forgotten password.",
      message2: "To change your  password, please click on below button",
      button: "Reset password",
      message3: "If you did not request that you password be reset, you can safety ignore this e-mail.",
      contact_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
      link: link,
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Réinitialiser le mot de passe";
      replacements.welcome = "Bonjour!";
      replacements.message1 = "Brainelem a récemment reçu une demande de mot de passe oublié.";
      replacements.message2 = "Pour changer votre mot de passe, veuillez cliquer sur le bouton ci-dessous";
      replacements.button = "Réinitialiser le mot de passe";
      replacements.message3 = "Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet e-mail en toute sécurité.";
      replacements.contact_message2 = "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }


    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    mail.save((err, mail) => {
      if (err) return callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });


  });

}

exports.sendResetPasswordOTPEmail = (user, callback) => {
  let filename = __dirname + "/templates/reset_password_otp.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) return callback(err);

    let subject = "BrainCore - Password Recovery"
    let replacements = {
      topic: "Password Reset Code",
      message1: `Your Email One Time Password (OTP) to reset password is`,
      message2: `${user.otp}`,
      button: "Reset Password",
      message3: "If you did not request that you password be reset, you can safety ignore this e-mail.",
      contact_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
      link: "",
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Réinitialiser le mot de passe";
      replacements.topic = `Code de réinitialisation du mot de passe`;
      replacements.message1 = `Votre mot de passe à usage unique (OTP) pour réinitialiser le mot de passe est`;
      replacements.button = "Réinitialiser le mot de Passe";
      replacements.message3 = "Si vous n'avez pas demandé la réinitialisation de votre mot de passe, vous pouvez ignorer cet e-mail en toute sécurité.";
      replacements.contact_message2 = "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }


    let template = handlebars.compile(file)
    let html = template(replacements);
    let text = replacements.topic + " " + replacements.message1 + " " + replacements.message2 + " " + replacements.message3 + " " + replacements.link;
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    mail.save((err, mail) => {
      if (err) return callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });
  });
};

exports.sendEmailForResultPublication = (user, baseUrl, callback) => {
  let filename = __dirname + "/templates/mail_with_content_result.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    //Generate link with token
    var token = authUtils.getJwtToken(user)
    var link = baseUrl + "/gradebooks-main"

    var subject = "BrainCore - New result in gradebook"
    var replacements = {
      welcome: "Welcome!",
      message1: "Dear Parent \n\n We inform you that your child has received a new mark",
      button: "Gradebook",
      message2: "If that doesn't work, copy and paste the following link in your browser:",
      link: link,
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Réinitialiser le mot de passe"
      replacements.welcome = "Bienvenu!",
        replacements.message1 = "Madame, Monsieur \n\n Nous vous informons que votre enfant a reçu une nouvelle évaluation";
      replacements.button = "Carnet de notes";
      replacements.message2 = "Si cela ne fonctionne pas, copiez et collez le lien suivant dans votre navigateur:";
      replacements.footer_text = FOOTER_TEXT['fr'];
    }

    var template = handlebars.compile(file)
    var html = template(replacements);
    var text = replacements.message1 + " " + replacements.message2 + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    // mail.save((err, mail) => {
    //   if (err) callback(err)
    //   tasker.addTask({task: "SEND_MAIL", mailId: mail._id}, 'mails', callback)
    // });
  });
}

// Send invitation for a BrainCore Test
//
// user     - user who will be invited
// inviter  - of user who triggered the invitation
// moduleId - module id to which user will be added
// baseUrl  - base url which will be used to create invitation link
// testType - type of the test for which user will be invited: ['pedagogy', 'adult']
exports.sendBCRegistrationConfirmationEmail = (user, inviter, moduleId, baseUrl, testType, callback) => {

  let filename = __dirname + "/templates/bc_test_request.html"
  fs.readFile(filename, 'utf8', async function (err, file) {
    if (err) callback(err);

    //Generate link with token
    var invitationToken = await authUtils.getTokenForBrainCoreTest(user._id, inviter._id, moduleId)
    var link = `${baseUrl}/braincore/test?email=${user.email}&inviter=${inviter._id}&moduleId=${moduleId}&invitationToken=${invitationToken}`

    // Adjust invitation link for education
    var isEdu = await moduleUtils.isEdu(moduleId)
    if (testType=='adult') isEdu=false

    if ((!testType && isEdu) || testType=='pedagogy'){
      link+="&type=pedagogy"
    }

    let subject = "BrainCore Test - Invitation"
    let replacements = {
      topic: "Request",
      imageLink: "https://cloud.braincore.ch/s/b8mDFqpf5Fpo9e3/preview",
      message1: `You are requested to take BrainCore Test by `+ getUserName(inviter)+ ` on or before`,
      date: `${user.brainCoreTest.registerDate}`,
      timezone: user.settings && user.settings.timezone,
      button: "Take Test",
      contact_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
      link: link,
      footer_text: FOOTER_TEXT['en']
    };
    if (isEdu) replacements.message1=`You are requested to take BrainCore Test on or before`


    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Invitation";
      replacements.topic = "Demande";
      replacements.message1 = `Vous êtes prié de passer le test BrainCore par ` + getUserName(inviter)+ ` le ou avant`;
      replacements.button = "Passer le test";
      replacements.contact_message2 = "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
      replacements.footer_text = FOOTER_TEXT['fr'];

      if (isEdu) replacements.message1 = `Vous êtes prié de passer le test BrainCore par le ou avant`;
    }

    


    let template = handlebars.compile(file)
    let html = template(replacements);
    let text = replacements.topic + " " + replacements.message1 + " " + replacements.date + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });

  });

};

exports.sendBCTestCompletionEmail = (user, callback) => {
  let filename = __dirname + "/templates/bc_test_completion.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);

    let subject = "BrainCore - Notification"
    let replacements = {
      message1: `Thank you for completing the BrainCore Test.`,
      message2: FOOTER_TEXT['en'],
      button: `See more`,
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Merci d'avoir rempli le questionnaire";
      replacements.message1 = `Merci d'avoir rempli le questionnaire ! Vous allez avoir un rendez-vous dans les 2 prochaines semaines avec notre coach pour votre débriefing.`,
        replacements.message2 = FOOTER_TEXT['fr'],
        replacements.button = `Voir plus`,
        replacements.footer_text = FOOTER_TEXT['fr'];
    }

    let template = handlebars.compile(file)
    let html = template(replacements);
    let text = subject + " " + replacements.message1 + " " + replacements.date + " " + replacements.link
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });
    let error = mail.validateSync();
    if (!error){
      mail.save((err, mail) => {
        if (err) callback(err)
        tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
      });
    }else{
      console.log({ message: "Email not sent!", error })
    }

  });

};

exports.sendBCTestCompletionEmailToInviter = (inviterEmail, user, callback) => {
  let filename = __dirname + "/templates/bc_test_completion.html"
  fs.readFile(filename, 'utf8', function (err, file) {
    if (err) callback(err);


    let subject = "BrainCore - Notification"
    let replacements = {
      message1: `User with email ${user.email} has just completed the BrainCore Test on ${user.brainCoreTest.completionDate}`,
      message2: ``,
      footer_text: FOOTER_TEXT['en']
    };
    if (user.getLanguage() == "fr") {// ####### FR #######
      subject = "BrainCore - Notification";
      replacements.message1 = `L'utilisateur avec l'e-mail ${user.email} vient de terminer le test BrainCore (${user.brainCoreTest.completionDate})`,
        replacements.message2 = ``,
        replacements.footer_text = FOOTER_TEXT['fr'];
    }

    let template = handlebars.compile(file)
    let html = template(replacements);
    let text = subject + " " + replacements.message1 + " " + replacements.date
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [inviterEmail]
    });

    mail.save((err, mail) => {
      if (err) callback(err)
      tasker.addTask({ task: "SEND_MAIL", mailId: mail._id }, 'mails', callback)
    });

  });

};