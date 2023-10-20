const handlebars = require('handlebars');
const fs = require('fs');
const Mail = require("./../models/mail.model");
const sendMail = require('../tasks/send_mail');
const moment = require("moment-timezone");

handlebars.registerHelper('formatDate', function(date, format, timezone = 'Europe/Paris') {
  return moment(new Date(date)).tz(timezone).format(format);
});

exports.sendBrainCoreTestReminderNotification = (user, callback) => {
    let filename = __dirname +"/templates/bc_test_reminder.html"
    fs.readFile(filename, 'utf8', function(err, file) {
      if (err) callback(err);

      //Generate link with token
      // var token = authUtils.getJwtToken(user)
      let link = '';
  
      let subject = "Braincore - Reminder"
      let replacements = {
        topic: "Reminder",
        imageLink: "https://cloud.braincore.ch/s/b8mDFqpf5Fpo9e3/preview",
        message1: "Please take test on or before",
        date: `${user.brainCoreTest.registerDate}`,
        timezone: user.settings && user.settings.timezone,
        contant_name: "Brainelem",
        contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
        contact_message2: "If you have any questions, you can contact Brainelem",
        copyright: "Copyright",
        button: "Take Test",
        link: link,
      };
      if (user.settings.language == "fr"){// ####### FR #######
        subject = "Braincore - Rappel";
        replacements.topic = "Rappel";
        replacements.message1 = "Veuillez passer le test le ou avant";
        replacements.button = "Passer le test";
        replacements.contact_message2= "Si vous avez des questions, vous pouvez contacter Brainelem";
        replacements.copyright = "droits d'auteur"
      }
  
      
      let template = handlebars.compile(file)
      let html = template(replacements);
      let text = replacements.topic + " " +replacements.message1+" "+replacements.date + " " + replacements.link
      const mail = new Mail({
        subject: subject,
        html: html,
        text: text,
        to: [user.email]
      });
    
      mail.save((err, mail) => {
        if (err) callback(err)
        sendMail(mail._id).catch(err => console.log(`Mail Notification failed mailId - ${mail._id}`));
      });
    });
};

exports.sendBrainCoreTestMissedNotification = (user, callback) => {
  let filename = __dirname +"/templates/bc_test_missed.html"
  fs.readFile(filename, 'utf8', function(err, file) {
    if (err) callback(err);

    let subject = "Braincore - Missed"
    let replacements = {
      topic: "Missed",
      imageLink: "https://cloud.braincore.ch/s/NRcw8yeKisR2Fkx/preview",
      message1: "You have missed the test on",
      date: `${user.brainCoreTest.registerDate}`,
      timezone: user.settings && user.settings.timezone,
      contant_name: "Brainelem",
      contact_message1: "At BioArk 3 Route de l’Ile-au-Bois 3, 1870 Monthey, Switzerland",
      contact_message2: "If you have any questions, you can contact Brainelem",
      copyright: "Copyright",
    };
    if (user.settings.language == "fr"){// ####### FR #######
      subject = "Braincore - Manqué";
      replacements.topic = "Manqué";
      replacements.message1 = "Vous avez raté le test du";
      replacements.contact_message2= "Si vous avez des questions, vous pouvez contacter Brainelem";
      replacements.copyright = "droits d'auteur";
    }

    
    let template = handlebars.compile(file)
    let html = template(replacements);
    let text = replacements.topic + " " +replacements.message1+" "+replacements.date;
    const mail = new Mail({
      subject: subject,
      html: html,
      text: text,
      to: [user.email]
    });
  
    mail.save((err, mail) => {
      if (err) callback(err)
      sendMail(mail._id).catch(err => console.log(`Mail Notification failed mailId - ${mail._id}`));
    });
  });
}