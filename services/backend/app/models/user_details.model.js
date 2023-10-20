const mongoose = require("mongoose");
const Subinterest = require("./subinterest.model")

const UserDetailsSchema =  new mongoose.Schema({
    title: {type: String}, // Mr/Dr/Engr/Prof etc?
    fullName: {type: String}, // to be removed soon
    displayName: {type: String},
    children: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    phone: {type: String},
    street: {type: String},
    buildNr: {type: String},
    postcode: {type: String},
    city: {type: String},
    country: {type: String},
    company: {type: mongoose.Schema.Types.ObjectId, ref: "Company"},
    dateOfBirth: {type: String},
    aboutMe: {type: String},
    socialMedia: {
        facebook: {type: String},
        instagram: {type: String},
        youtube: {type: String},
        linkedin: {type: String},
    },
    notifications:{
      classes: {type: Boolean, default: true },
      newCourses: {type: Boolean, default: true },
      systemNotifications: {type: Boolean, default: true },
      newsletter: {type: Boolean, default: true },
      tricks: {type: Boolean, default: true },
    },
    subinterests:  [{ type: Number, ref: "Subinterest"}],
    profileCompletedIn: {type: Number, default: 5},
 }, { timestamps: true }
)
UserDetailsSchema.pre('remove', function(next) {
 console.log("Removing Details:", this._id)
 next()
});

module.exports = UserDetailsSchema;
