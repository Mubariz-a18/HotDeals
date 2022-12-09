const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  available_free_credits: {
    type: Number
  },
  available_premium_credits: {
    type: Number
  },
  available_boost_credits: {
    type: Number
  },
  available_premium_boost_credits: {
    type: Number
  },
  free_credits_info: [
    {
      count: {
        type: Number,
      },
      category:{
        type:String
      },
      sub_category:{
        type:String
      },
      status: {
        type: String,
        enum: ['Available', "Expired", "Empty", "Active"],
        default: "Available"
      },
      duration: {
        type: Number,
      },
      allocation: {
        type: String,
        enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchased-Credits", "Purchased-Boost"],
        default: "Admin-atLogin"
      },
      referral_code: {
        type: String,
      },
      referral_Id: {
        type: String,
      },
      allocated_on: {
        type: String
      },
      credits_expires_on: {
        type: String
      }
    }
  ],
  premium_credits_info: [
    {
      count: {
        type: Number,
      },
      category:{
        type:String
      },
      sub_category:{
        type:String
      },
      status: {
        type: String,
        enum: ['Available', "Expired", "Empty", "Active"],
        default: "Available"
      },
      allocation: {
        type: String,
        enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchased-PremiumCredits", "Purchased-PremiumBoost"],
        default: "Admin-atLogin"
      },
      referral_code: {
        type: String,
      },
      duration: {
        type: Number,
      },
      transaction_Id: {
        type: String
      },
      purchaseDate: {
        type: String
      },
      activationDate: {
        type: String
      },
      allocated_on: {
        type: String
      },
      credits_expires_on: {
        type: String
      }
    }
  ],
  boost_credits_info: [
    {
      count: {
        type: Number,
      },
      category:{
        type:String
      },
      sub_category:{
        type:String
      },
      status: {
        type: String,
        enum: ['Available', "Expired", "Empty", "Active"],
        default: "Available"
      },
      duration: {
        type: Number,
      },
      allocation: {
        type: String,
        enum: ["Admin-atLogin", "Referral", "Admin-Monthly","Purchased-Boost"],
        default: "Admin-atLogin"
      },
      transaction_Id: {
        type: String
      },
      referral_Id: {
        type: String,
      },
      allocated_on: {
        type: String
      },
      purchaseDate: {
        type: String
      },
      credits_expires_on: {
        type: String
      }
    }
  ],
  premium_boost_credits_info: [
    {
      count: {
        type: Number,
      },
      category:{
        type:String
      },
      sub_category:{
        type:String
      },
      status: {
        type: String,
        enum: ['Available', "Expired", "Empty", "Active"],
        default: "Available"
      },
      duration: {
        type: Number,
      },
      allocation: {
        type: String,
        enum: ["Admin-atLogin", "Referral", "Admin-Monthly","Purchased-premium-Boost"],
        default: "Admin-atLogin"
      },
      transaction_Id: {
        type: String
      },
      referral_Id: {
        type: String,
      },
      allocated_on: {
        type: String
      },
      purchaseDate: {
        type: String
      },
      credits_expires_on: {
        type: String
      }
    }
  ],
  credit_usage: [
    {
      type_of_credit: {
        type: String,
        enum: ["Free", "Premium","Boost","Premium-Boost"]
      },
      ad_id: {
        type: mongoose.Schema.Types.ObjectId
      },
      count: {
        type: Number
      },
      category: {
        type: String
      },
      sub_category:{
        type: String
      },
      boost_expiry_date :{
        type:String
      },
      credited_on: {
        type: String
      }
    }
  ]
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;