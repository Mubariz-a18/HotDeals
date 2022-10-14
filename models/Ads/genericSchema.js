const mongoose = require("mongoose");

const genericSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    views:{
        type:Number,
        default : 0
    },
    saved:{
        type:Number,
        default : 0
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
        enum: ["Selling", "Archive", "Sold", "Deleted", "Draft", "Expired" , "Reposted"],
        default: "Selling"
    },
    is_Reposted :{
        type:Boolean,
        default:false
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
    // is_ad_posted: {
    //     type: Boolean
    // },
    isPrime:{
        type:Boolean,
        default:false
    },
    ad_Premium_Date :{
        type:String
    },
    ad_Sold_Date:{
        type:String
    },
    ad_Archive_Date:{
        type:String
    },
    ad_Draft_Date:{
        type:String
    },
    ad_Reposted_Date:{
        type:String
    },
    created_at: {
        type: String,
    },
    updated_at: {
        type: String
    },
});

genericSchema.index({ category: "text", sub_category: "text", ad_posted_location: "2dsphere" });
const Generic = mongoose.model("Generic", genericSchema,);

module.exports = Generic;
