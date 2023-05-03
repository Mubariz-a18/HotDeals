const mongoose = require("mongoose");

const businessAdsSchema = mongoose.Schema({
    parentID: {
        type: mongoose.Types.ObjectId,
    },
    userID: {
        type: mongoose.Types.ObjectId,
    },
    title: {
        type: String,
        required:true
    },
    description: {
        type: String,
        required:true
    },
    impressions: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    },
    adType: {
        type: String,
        enum: [
            "highlighted",
            "featured",
            "customized",
            "banner",
            "interstitial"
        ],
        required:true
    },
    location: {
        type: { type: String },
        coordinates: [],
        required:true
    },
    address: {
        type: String,
        required:true
    },
    imageUrl: {
        type: String,
        required:true
    },
    adStatus: {
        type: String,
        enum: [
            "Active",
            "Archive",
            "Delete",
            "Expired",
            "Suspended",
            "Pending"
        ]
    },
    subAds: [
        {
            title: {
                type: String
            },
            imageUrl: {
                type: String
            },
            redirectionUrl: {
                type: String
            }
        }
    ],
    translateText: {
        type: Object
    },
    duration: {
        type: Number
    },
    expireAt: {
        type: String,
    },
    activatedAt: {
        type: String
    },
    deletedAt:{
        type: String
    },
    archivedAt:{
        type: String
    },
    suspendedAt:{
        type: String
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
});

const BusinessAds = mongoose.model("businessAds", businessAdsSchema,);

module.exports = BusinessAds;