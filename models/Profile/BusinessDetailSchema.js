const mongoose = require("mongoose");

const BusinessInfoSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    userID: {
        type: mongoose.Types.ObjectId
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    businessAdList: {
        type: Array
    },
    businessUrl: {
        type: String,
        required: true,
    },
    certificateUrl: {
        type: String,
        required: true,
    },
    isBusinessVerified: {
        type: String,
        default: false
    },
    verifiedAt: {
        type: String,
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

const BusinessInfoModel = mongoose.model("businessInfo", BusinessInfoSchema);
module.exports = BusinessInfoModel;