const mongoose = require("mongoose");

const mongoosastic = require('mongoosastic')
// ! {searchengine}
const {searchengine, mapping} = require("./search-engine")
const CoursePath = require("./course_path.model")
const Category = require("./category_ref.model")

const Chapter = require("./chapter.model")
const TrainingModule = require("./training_module.model")

const Group = require("../models/group.model");

const CertificationSessionSchema =  new mongoose.Schema({ 
    
    // session
    name: {type: String, es_indexed:true, es_analyzer: "autocomplete", es_search_analyzer: "default"},
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: "Group"}], 
    unassignedTrainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // 
    pastTrainees: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}], // just keeping track of those who were in template, but then moved to normal session, as this info can gone forever
    traineesCount: {type: Number, default: 0, es_indexed:true}, // unassignedTrainees.length + groups.group.trainees.length, increase only when trainees are added to groups
    traineesLimit: {type: Number, default: 0, es_indexed:true}, // maximum number of students who can attend 'session'/enquiry, set by ModuleManger
    digitalCode: {type: String},
    status: {type: Boolean, default: true, es_indexed:true}, // open/close session
    archived: {type: Boolean, default: false, es_indexed:true,}, // archived sessions won't be visible in explore/list
    isSendToCloud: {type: Boolean, default: false}, // open/close session
    isPublic: {type: Boolean, default: true, es_indexed:true}, // open/close session
    level: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED", null]},
    //format: {type: String, enum: ['WEEKENDS', 'EVERY DAY', 'ONCE A MONTH', 'IRREGULARLY']},
    format: {type: mongoose.Schema.Types.ObjectId, ref: "Format"},
    coursePath: {type: mongoose.Schema.Types.ObjectId, ref: "CoursePath", es_schema: CoursePath.schema, es_select: 'name description image courses'}, // bringing it back, as actually we use it, before groups are added
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef', es_schema: Category.schema, es_select: '_id name'},

    // session dates
    startDate: {type: Date, es_indexed:true}, // of session
    endDate: {type: Date, es_indexed:true}, // of session
    enrollmentStartDate: {type: Date, es_indexed:true}, // of enrollment
    enrollmentEndDate: {type: Date, es_indexed:true}, // of enrollment
    
    // session management
    architect: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // actually moduleManager
    trainingManager: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    
    // certificate
    certificate: {type: mongoose.Schema.Types.ObjectId, ref: "Certificate"}, 
    certificationDate: {type: Date}, // of certification inside session
    examiners: [{type: mongoose.Schema.Types.ObjectId, ref: "User" }], // trainers who are certyfing trainees
    event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"}, 

    // internship
    internships: [{type: mongoose.Schema.Types.ObjectId, ref: "Internship"}],
    coordinator: {type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // enquiry
    enquiry: {type: mongoose.Schema.Types.ObjectId, ref: "Enquiry"},
    
    // global
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module",  es_indexed:true},
    origin: { type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession", es_indexed:true},

    // payment
    price: {type: Number, default: 0, min: 0, es_indexed:true,},
    paymentEnabled: {type: Boolean, default: false, es_indexed:true,},


 }, { timestamps: true }
)

CertificationSessionSchema.plugin(mongoosastic, {
  esClient: searchengine,
  populate: [
    {
      path: 'category',
      select: "_id name"
    },
    {
      path: 'coursePath',
      select: "name description image courses",
      populate: {
        path: "courses",
        select: "name chosenChapters",
        populate: {
          path: 'chosenChapters',
          select: "chapter chosenContents",
          populate: [
            {
              path: 'chapter',
              select: 'name'
            },
            {
              path: 'chosenContents.content',
              select: 'title contentType'
            }
          ]
        }
      }
    }
  ]
})


CertificationSessionSchema.pre('remove', function(next) {
 console.log("Removing CertificationSession:", this._id)
 next()
});

CertificationSessionSchema.methods.existInModule = function(moduleId) {
    if (this.module == moduleId) return true;
};

CertificationSessionSchema.methods.existForTrainer = async function(userId) {    
    if(await Group.exists({examiner: userId, _id: this.groups})) return true;
    return false;
};

CertificationSessionSchema.methods.existForTrainee = async function(userId) { 
    // formulate this authroization logic
    if (this.unassignedTrainees?.includes(userId)) return true;
    else if (this.trainees?.includes(userId)) return true;
    else if (await Group.exists({trainees: userId, _id: this.groups})) return true;
    else return false;
};

const CertificationSession = mongoose.model("CertificationSession", CertificationSessionSchema);

module.exports = CertificationSession;
