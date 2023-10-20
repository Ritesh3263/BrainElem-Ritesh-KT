const mongoose = require("mongoose");

const RolePermissionRefSchema =  new mongoose.Schema({
    name: {type: String},
    displayName: {type: String},
    isTrainingCenter: {type: Boolean},
    picture: {type: String},
    permissions: [
        {
            name: {type: String},
            descriptions: {type: String},
            access: {type: Boolean},
            edit: {type: Boolean}
        }
    ]
}, { timestamps: true })

RolePermissionRefSchema.pre('remove', function(next) {
 console.log("Removing Item", this._id)
 next()
});

const RolePermissionRef = mongoose.model("RolePermissionRef", RolePermissionRefSchema);

module.exports = RolePermissionRef;
