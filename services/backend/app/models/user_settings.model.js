const mongoose = require("mongoose");
const RoleMaster = require("./roleMaster.model");
const roles = ['Root','EcoManager','CloudManager','NetworkManager','ModuleManager','Assistant','Partner','Architect','TrainingManager', 'Librarian', 'Trainer', 'Parent', 'Inspector', 'Trainee','Coordinator','Other']; // other is when user alter role/ when role is undefined
const levels = ['1','2','3','4','5','6','7','8','9A','9B','10A','10B','11A','11B','12','13','14']
const moduleManagersActionList = [ // this list needs to be updated
    // 'create-user',
    // 'update-user',
    // 'remove-user',
    // 'assign-role',
    'manage-user',
    'create-company',
    'create-subjects-and-chapters',
    // 'create-subjects',
    // 'create-chapters',
    'answer-to-inquiry',
    'create-competences',
    'create-course',
    'create-course-path', 
    'create-internship',  
    'manage-session', 
    // 'create-class', // shall be used in session, was in SCHOOL
    // 'remove-class', // shall be used in session, was in SCHOOL
    // 'assign-training-manager',
    // 'assign-price',
    // 'assign-course',
]
const UserSettingsSchema =  new mongoose.Schema({
    isActive: {type: Boolean, default: 0 },
    emailConfirmed: {type: Boolean, default: false },
    hideTutorial: {type: Boolean, default: false }, // show tutorial on first login // turn this on when user has seen tutorial, // may trun this off again when user has not seen tutorial for a long time/wish to see it again
    selfRegistered: {type: Boolean, default: false },
    agreedForMarketing: {type: Boolean, default: false },
    level: {type: String, enum: levels, default: '1' }, // setting default level 1
    language: {type: String, enum: ['fr', 'en', 'pl'], default: "en"},
    origin: {type: String, enum: ['fr_FR', 'en_GB','pl_PL'], default: "fr_FR"},
    role: {type: String, enum: roles, required: true, default: 'Other'}, // current role
    defaultRole: {type: String, enum: roles},
    assignedCompany: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
    availableRoles: [{type: String, enum: roles }],
    connectedDevices:[{type: mongoose.Schema.Types.ObjectId, ref: "ConnectedDevice"}],
    userNotifications:[{
        notification: {type: mongoose.Schema.Types.ObjectId, ref: 'Notification'},
        isRead: {type: Boolean, default: false},
    }],
    completed: {
        _id: false,
        courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
        chapters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
        contents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Content'}],
    },
    hide:{
        _id: false,
        // // future idea of some possible attributes to hide data, 
        // modules: [{type: mongoose.Schema.Types.ObjectId, ref: 'Module'}],
        // trainingPaths: [{type: mongoose.Schema.Types.ObjectId, ref: 'TrainingPath'}],
        // trainingModules: [{type: mongoose.Schema.Types.ObjectId, ref: 'TrainingModule'}],
        // chapters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}],
        // contents: [{type: mongoose.Schema.Types.ObjectId, ref: 'Content'}],
        courses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
        // Results: [{type: mongoose.Schema.Types.ObjectId, ref: 'Result'}],
        // interests: [{type: mongoose.Schema.Types.Number, ref: 'Interest'}],
        // subinterests: [{type: mongoose.Schema.Types.Number, ref: 'SubInterest'}],
    },
    //  limit access to some features/ actions : limitation
    permissions: {
        _id: false,
        assistant: [{
            module: {type: mongoose.Schema.Types.ObjectId, ref: 'Module'},
            // enabledList: [{type: String, enum: moduleManagersActionList}], // for future use
            disallowed: [{type: String, enum: moduleManagersActionList}],
        }]
        // add other roles when needed
    },
    feedback: {
        tips: [{
            _id: false,
            tip: {type: mongoose.Schema.Types.ObjectId, ref: 'Tip'},
            reaction: {type: String, enum: ['useful', 'notUseful', 'neutral'], default: 'neutral'},
            date: {type: Date, default: Date.now},
        }],
        // feedback on other things
    },
    prevLogin: {
        time: {type: Date}, // time of last login
        deviceType: {type: String, enum: ['desktop','ultrabook','mobile','tablet'], default: 'desktop'}, 
        deviceId: {type: String}, 
        ip: {type: String}, // ip address
        city: {type: String}, // location
    }, // if it doesn't exist, it means it's the very first login for this user
    currentLogin: {
        time: {type: Date}, // time of this login
        deviceType: {type: String, enum: ['desktop','ultrabook','mobile','tablet'], default: 'desktop'}, 
        deviceId: {type: String}, 
        ip: {type: String}, // ip address
        city: {type: String}, // location
    },
    roleMaster: { type: mongoose.Schema.Types.ObjectId, ref: "roleMaster"},
    availableRoleMasters: [{ type: mongoose.Schema.Types.ObjectId, ref: "roleMaster"}],
    defaultRoleMaster: { type: mongoose.Schema.Types.ObjectId, ref: "roleMaster"},
    timezone: {
        type: String,
        default: 'Europe/Paris'
    }
}, { timestamps: true, toJSON: { virtuals: false } })

UserSettingsSchema.pre('remove', function(next) {
    console.log("Removing Settings:", this._id)
    next()
});

// UserSettingsSchema.virtual('roles').get(function () {
//     return roles;
// });

module.exports = UserSettingsSchema;