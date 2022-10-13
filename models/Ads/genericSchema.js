const mongoose = require("mongoose");

const genericSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
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
    SelectFields : { 
        type: Object,
        default:{}
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
    ad_present_location:{
        type: {type:String} ,
        coordinates: [],
    },
    ad_posted_location: {
        type: {type:String} ,
        coordinates: [],
    },
    ad_posted_address:
    {
        type: String,
    },
    ad_status: {
        type: String,
        enum: ["Selling", "Archive", "Sold", "Deleted", "Draft", "Expired"],
        default: "Selling"
    },
    ad_type: {
        type: String,
        default: "free",
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
    is_ad_posted: {
        type: Boolean
    },
    is_ad_favourite: {
        type: Boolean,
        default: false
    },
    is_reposted: {
        type: Boolean,
        default: false
    },
    isPrime:{
        type:Boolean,
        default:false
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String
    },
});

genericSchema.index({ category: "text", sub_category: "text", ad_posted_location: "2dsphere" });
genericSchema.index({ created_at: 1 }, { expireAfterSeconds: 30, partialFilterExpression: { ad_status: 'EXPIRED' } })
const Generic = mongoose.model("Generic", genericSchema,);

module.exports = Generic;
