const mongoose = require("mongoose");

const genericSchema = mongoose.Schema({
    parent_id: {
        type: mongoose.Types.ObjectId,
    },
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    views: {
        type: Number,
        default: 0
    },
    saved: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
    },
    sub_category: {
        type: String,
    },
    description: {
        type: String,
    },
    SelectFields: {
        type: Object,
        default: {}
    },
    special_mention: [
        {
            type: String,
        },
    ],
    title: {
        type: String,
    },
    textLanguages: {
        type: Object
    },
    price: {
        type: Number,
        default: 0
    },
    product_age: {
        type: String
    },
    image_url: {
        type: Array,
        default: ["https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380"],
    },
    video_url: {
        type: Array,
        default: [],
    },
    thumbnail_url: {
        type: Array,
        default: ["https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380"]
    },
    shortUrl: {
        type: String
    },
    keywordList:{
        type:Array
    },
    ad_present_location: {
        type: { type: String },
        coordinates: [],
        default: {}
    },
    ad_posted_location: {
        type: { type: String },
        coordinates: [],
        default: {}
    },
    ad_posted_address: {
        type: String,
    },
    ad_present_address: {
        type: String,
    },
    ad_status: {
        type: String,
        enum: [
            "Selling",
            "Archive",
            "Sold",
            "Delete",
            "Draft",
            "Expired",
            "Reposted",
            "Suspended",
            "Pending"
        ]
    },
    is_Reposted: {
        type: Boolean,
        default: false
    },
    ad_type: {
        type: String,
        enum: [
            "Free",
            "Premium"
        ],
        default: "Free",
    },
    ad_expire_date: {
        type: String,
    },
    ad_promoted: {
        type: String,
    },
    ad_promoted_type: {
        type: String,
        enum: [
            "Boost", 
            "Premium", 
            ""],
        default: "",
    },
    ad_promoted_date: {
        type: String,
    },
    ad_promoted_expire_date: {
        type: String,
    },
    is_negotiable: {
        type: Boolean,
    },
    isPrime: {
        type: Boolean,
        default: false
    },
    detection: [
        {
            type: Object,
            default: {}
        }
    ],
    ad_Premium_Date: {
        type: String
    },
    ad_Sold_Date: {
        type: String
    },
    ad_Archive_Date: {
        type: String
    },
    ad_Draft_Date: {
        type: String
    },
    ad_Reposted_Date: {
        type: String
    },
    ad_Deleted_Date: {
        type: String
    },
    ad_Suspended_Date: {
        type: String
    },
    ad_Historic_Duration_Date: {
        type: String
    },
    is_ad_Historic_Duration_Flag: {
        type: Boolean,
        default: false
    },
    is_Boosted: {
        type: Boolean,
        default: false
    },
    Boost_Days: {
        type: Number
    },
    Boosted_Date: {
        type: String
    },
    Boost_Expiry_Date: {
        type: String
    },
    is_Highlighted: {
        type: Boolean,
        default: false
    },
    Highlight_Days: {
        type: Number
    },
    Highlighted_Date: {
        type: String
    },
    Highlight_Expiry_Date: {
        type: String
    },
    isClaimed: {
        type: Boolean,
        default: false
    },
    reviewStatus: {
        type: String,
        enum: [
            "InReview", 
            "Rejected", 
            "Approved"
        ],
        default: "InReview"
    },
    reasonToReject: {
        type: String
    },
    reviewDate: {
        type: String,
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String
    },
});
const Generic = mongoose.model("Generic", genericSchema,);

module.exports = Generic;
