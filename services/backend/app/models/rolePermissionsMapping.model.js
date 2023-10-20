const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleMasterModel = require("./roleMaster.model");
const PermissionsModel = require("./permissions.model")

const rolePermissionsMappingSchema = new Schema( {
    roleMaster: {
        type: Schema.Types.ObjectId,
        ref: "roleMaster"
    },
    permissions: [{
        type: Schema.Types.ObjectId,
        ref: "permissions"
    }]
}, { timestamps: true});

module.exports = mongoose.model("rolePermissionsMapping", rolePermissionsMappingSchema);