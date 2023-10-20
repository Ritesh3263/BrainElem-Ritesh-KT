const mongoose = require("mongoose");
const User = require("./user.model");

const connectedDeviceSchema = new mongoose.Schema({
    name:{
        type: String,
        default: '-',
    },
    brand:{
        type: String,
        default: '-',
    },
    os:{
        type: String,
        default: '-',
    },
    osVersion:{
        type: String,
        default: '-',
    },
    modelName:{
        type: String,
        default: '-',
    },
    productName:{
        type: String,
        default: '-',
    },
    platformApiLevel:{
        type: String,
        default: '-',
    },
    osBuildId:{
        type: String,
        default: '-',
    },
    modelId:{
        type: String,
        default: '-',
    },
    deviceToken:{
        type: String,
        default: '-',
        unique: true,
    },
    isNotificationOn:{
        type: Boolean,
        default: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

const ConnectedDevice = mongoose.model("ConnectedDevice",connectedDeviceSchema);

module.exports = ConnectedDevice;