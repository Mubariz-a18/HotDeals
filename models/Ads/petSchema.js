const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  animal: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  special_mention:[ {
    type: String,
    required: true,
  }],
  tile: {
    type: String,
    required: true,
  },
  ad_present_location: [
    {
      type: String,
      required: true,
    },
  ],
  ad_posted_location: [
    {
      type: String,
      required: true,
    },
  ],

    //cmmon fields
    reported: {
      type: Boolean,
      default: false,
    },
    reported_ad_count: {
      type: Number,
    },
    reported_by: {
      user_id: {
        type: String,
      },
      reason: {
        type: String,
      },
      report_date: {
        type: String,
      },
    },
    ad_status:{
      type:String,
      default:"active",
    },
    ad_type:{
      type:String,
      default:"free"
    },
    ad_expire_date:{
      type:String
    },
    ad_promoted:{
      type:String
    },
    ad_promoted_type:{
      type:String,
      enum:["Boost","Premium",""],
      default:""
    },
    ad_promoted_date:{
      type:String
    }
});


const Pet = mongoose.model("Pet", petSchema,"ads");

module.exports = Pet;
