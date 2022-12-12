const mongoose = require("mongoose");

const genericSchema = mongoose.Schema({
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
    title:
    {
        type: String,
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
        default: [],
    },
    video_url: {
        type: Array,
        default: [],
    },
    ad_present_location: {
        type: { type: String },
        coordinates: [],
    },
    ad_posted_location: {
        type: { type: String },
        coordinates: [],
    },
    ad_posted_address:
    {
        type: String,
    },
    ad_present_address:
    {
        type: String,
    },
    ad_status: {
        type: String,
        enum: ["Selling", "Archive", "Sold", "Delete", "Draft", "Expired", "Reposted", "Suspended"],
        default: "Selling"
    },
    is_Reposted: {
        type: Boolean,
        default: false
    },
    ad_type: {
        type: String,
        enum: ["Free", "Premium"],
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
        enum: ["Boost", "Premium", ""],
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
    created_at: {
        type: String,
    },
    updated_at: {
        type: String
    },
});
const Generic = mongoose.model("Generic", genericSchema,);

module.exports = Generic;
