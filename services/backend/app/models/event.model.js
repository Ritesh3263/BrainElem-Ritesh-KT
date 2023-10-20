const { Timestamp } = require("bson");
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String }, // NOTE
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // trainer who added the event, in case of TrainingCenter it would be the Trainer selected by TrainingManager
    eventType: { type: String, enum: ['Online Class', 'Exam', 'Quiz', 'Homework', 'Certification']}, // quiz doesnt exist in surveyJS, it's just info for gradebook, quizes don't have grades 
    assignedGroup: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    assignedPeriod: { type: String }, // get corresponding period from academicYear via assignedGroup above^
    assignedSubject: { type: mongoose.Schema.Types.ObjectId, ref: "TrainingModule" }, // in content, we have trainingModuleId, and chapterId
    assignedChapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }, // in content, we have trainingModuleId, and chapterId
    assignedContent: { type: mongoose.Schema.Types.ObjectId, ref: "Content" }, // in content, we have trainingModuleId, and chapterId
    assignedCourse: {type: mongoose.Schema.Types.ObjectId, ref: "Course"}, // for events added inside session, in TrainingCenter, actually it can be more useful than: `assignedSession`
    assignedTrainer: {type: mongoose.Schema.Types.ObjectId, ref: "User"}, // for events added by architect, in TrainingCenter
    assignedSession: {type: mongoose.Schema.Types.ObjectId, ref: "CertificationSession"}, // for events added inside session, in TrainingCenter
    assignedCompany: {type: mongoose.Schema.Types.ObjectId, ref: "Company"}, // for certification event
    allDay: { type: Boolean },
    addedFromGradebook: { type: Boolean },
    date: { type: Date },
    endDate: { type: Date },
    durationTime: { type: Number, default: 0 },
    examCoefficient: { type: Number, default: 1 },
    urlToEvent: { type: String },

    // Video meeting associated with this event,
    // Used only for meetings with custom URL provided by trainer 
    // when meetingUrl is not provided, default integration with BigBlueButton will be used
    // default integration does not require those properties
    meetingUrl: { type: String },
    meetingDetails: { type: String },
    // User with extra attempt can take a test once more
    allowExtraAttemptFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", es_indexed: true}], 
    // For tracking activity - time spent, time away etc.
    // lastEmit is a date of last emmited message - it's used to prevent excessive socket traffic
    attendees: {type: [mongoose.Schema.Types.Mixed], es_indexed:false },
    lastEmit: { type: Date },
  },
  { timestamps: true }
);
EventSchema.pre('remove', function(next) {
  console.log("Removing Event:", this._id)
  next()
 });
 
const Event = mongoose.model("Event", EventSchema);

module.exports = Event;