const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema({
    subject: {type: String, required: true},
    // If template exists in sendGrid - use template id
    sendgridTemplateId: {type: String},
    sendgridDynamicTemplateData: {type: mongoose.Schema.Types.Mixed},
    // Otherwise use html/text properties
    html: {type: String},
    text: {type: String},
    to: [{type: String, required: true}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    status: {type: String, required: true, default: "PENDING", enum: ['PENDING', 'SENT', 'ERROR']},
  }, { timestamps: true }
)


const Mail = mongoose.model("Mail", MailSchema);

module.exports = Mail;
