const nodemailer = require("nodemailer")
const Mail = require('../models/mail.model')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWithNodemailer = async (mail) => {
  try {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: '"BrainCore" <' + process.env.EMAILS_FROM_EMAIL + '>', // sender address
      to: mail.to.join(), // list of receivers
      subject: mail.subject, // Subject line
      text: mail.text, // plain text body
      html: mail.html, // html body
    });
    console.log(" -> Mail was sent %s;", mail._id);
    mail.status = "SENT"
  } catch (error) {
    console.error(" -> Failed to send mail %s; Error code: %s", mailId, error.message);
    if (mail) mail.status = "ERROR"
  }
  if (mail) mail.save()
}


const sendWithSendgrid = async (mail, onError) => {
  const msg = {
    to: mail.to.join(),
    from: process.env.SENDGRID_FROM,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log(" -> Mail was sent with SENDGRID %s;", mail._id);
      mail.status = "SENT"
      mail.save()
    })
    .catch((error) => {
      console.error(error)
      mail.status = "ERROR"
      mail.save()
      onError()

    })
}

const sendWithSendgridTemplate = async (mail) => {
  const msg = {
    to: mail.to.join(),
    from: process.env.SENDGRID_FROM,
    subject: mail.subject,
    templateId: mail.sendgridTemplateId,
    dynamicTemplateData: mail.sendgridDynamicTemplateData,
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log(" -> Mail was sent with SENDGRID TEMPLATE %s;", mail._id);
      mail.status = "SENT"
      mail.save()
    })
    .catch((error) => {
      mail.status = "ERROR"
      mail.save()
      console.error(error)

    })
}


async function sendMail(mailId) {
  let mail = await Mail.findById(mailId)

  if (mail?.sendgridTemplateId) {
    sendWithSendgridTemplate(mail)
  }
  else if (mail) {
    sendWithSendgrid(mail, () => { sendWithNodemailer(mail) })
  }

}

module.exports = sendMail;
