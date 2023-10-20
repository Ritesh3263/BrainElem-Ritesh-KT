const Event = require("./event.model");
const Content = require("./content.model");
const ModuleCore = require("./module_core.model");
const UserTipSchema = require("./user_tip.model");

const mongoose = require("mongoose");
const { content } = require(".");

const ResultSchema =  new mongoose.Schema({
 content: { type: mongoose.Schema.Types.ObjectId, ref: "Content"}, // not mendatory as external exams may be available without the need of content ID
 event: { type: mongoose.Schema.Types.ObjectId, ref: "Event"},
 user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
 timeSpent: {type: Number},
 awayTime: {type: Number, default: 0},// how long user was away(eg. left website)
 inactiveTime: {type: Number, default: 0},// how long user was inactive (no mouse/keyboard activity)
 awayCount: {type: Number, default: 0},// how many times user was away
 inactiveCount: {type: Number, default: 0},// how many times user was inactive
 points: {type: Number},
 totalPoints: {type: Number},
 percentage: {type: Number},
 grade: {type: String, async validate(value){
        var result = this;
        // When updating, validator does not have object loaded
        // So we use _id from query $set
        if (!result?._id){ 
            let id = this.getUpdate().$set._id
            result = await Result.findById(id).exec()
        }
        
        // In case this is event, use default gradingScale in the module
        if (result.event){
            let event = await Event.findById(result.event).populate({path: 'assignedGroup'}).exec()
            let moduleId = (await event?.assignedGroup?.getModulesIds())[0]
            let moduleCore = await ModuleCore.findOne({moduleId: moduleId}).populate(['defaultGradingScale', 'gradingScales']).exec()
            let gradingScale = moduleCore?.defaultGradingScale ? moduleCore.defaultGradingScale : moduleCore?.gradingScales[0]||null;
            if (!gradingScale?.grades?.some(g=>g.shortLabel==value)) throw new Error(`Incorrect grade!`)
            
        // In case this is not an event use gradingScale assigned to content, 
        }else if (result.content){
            let content = await Content.findById(result.content).populate({path: 'gradingScale'}).exec()
            if (content?.gradingScale && !content.gradingScale.grades.some(g=>g.shortLabel==value)) throw new Error(`Incorrect grade!`)
        }

        
    }
 }, // added for possibility to update manually by the trainer in the gradebook
 published: {type: Boolean, default: false}, // implies that results have been published by a trainer
 publishedAt: { type:Date}, // date of publication
 comment: {type: String, default: ""}, // comment about the result from a trainer
 data: {type: mongoose.Schema.Types.Mixed, default: {}},
 assignedPoints: {type: mongoose.Schema.Types.Mixed, default: {}},   // points manually assigned to each question by the teacher
 assignedComments: {type: mongoose.Schema.Types.Mixed, default: {}}, // comments manually assigned to each question by the teacher
 updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, // if exist, it means it was manually updated by humans! 
 usersWhoReceivedMail: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // list of users (parents) who received emails when result was PUBLISHed in examinate
 
 
 // Properties below are only appied for BrainCore Pedagogy and Adult tests
 blockedByCredits: {type: Boolean, default: false},//if true, this result will be blocked until cretis are not provided
 notConfirmedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//users who were not logged-in while taking the test. While confirmed via email link, it will be changed into `user` property 
 inviter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },//user who invited to take the test
 profiles: {type: mongoose.Schema.Types.Mixed},   // cognitive profiles assigned
 traits: {type: mongoose.Schema.Types.Mixed},   // normalized values of cognitive traits
 opportunities: {type: mongoose.Schema.Types.Mixed},   // assigned opportunities in order from the most relevant
 tips: [ UserTipSchema ], // assigned tips from the most relevant
 reportDownloaded: {type: Number, default: 0},// how many times report was downloaded
}, { timestamps: true, minimize: false })

ResultSchema.pre('remove', function(next) {
    // Please remember about removing all resultFile referenced inside data.
    // Using resultFile.remove() will automatically remove the file from the disk. 
    console.log(`Removing result ${this._id}. Please remember about removing all contaied resultFiles.`)
    next()
});

const Result = mongoose.model("Result", ResultSchema);

module.exports = Result;
