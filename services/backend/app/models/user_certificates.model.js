const mongoose = require("mongoose");
const UserCertificatesSchema =  new mongoose.Schema({
    certificationSession: {type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"},
    status: {type: Boolean, default: false }, // trainingManager
    verificationDate: {type: Date}, // trainingManager
    moduleManagerAproval: {type: Boolean, default: false }, // moduleManager
    moduleManagerAprovalDate: {type: Date}, // moduleManger
    internshipStatus: {type: Boolean, default: false },
    additionalComment: {type: String},
    blockchainStatus: {type: Boolean, default: false },
    blockchainNetworkId: {type: String, default: "" },
    blockchainContractAddress: {type: String, default: "" },
    details: [{
        examiner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        status: {type: Boolean, default: false },
        verificationDate: {type: Date}, // when do we get this date?
        comment: {type: String},
        competenceBlocks: [{
            _id: false,
            block: {type: mongoose.Schema.Types.Number, ref: "CompetenceBlock"},
            competences: [{
                _id: false,
                competence: {type: mongoose.Schema.Types.Number, ref: "Competence"},
                grade: {type: String}
            }]
        }],
        externalCompetences: [{
            _id: false,
            competence: {type: mongoose.Schema.Types.Number, ref: "Competence"},
            grade: {type: String}
        }]    
    }],
 }, { timestamps: true }
)

module.exports = UserCertificatesSchema;