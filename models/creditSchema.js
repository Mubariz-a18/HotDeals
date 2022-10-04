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
  free_credits_info: [
    {
              count:{
                type:Number,
              },
              status:{
                type:String,
                enum: ['Available', "Expired" , "Active"]
              },
              duration:{
                type:Number,
              },
              allocation: {
                type: String,
                enum: ["Admin","Referral"],
              },
              referral_code:{
                type:String,
              },
              referral_Id :{
                type: mongoose.Schema.Types.ObjectId,
              },
              activationDate:{
                type:String
              },
              expires_on: {
                type:String
              },
              allocated_on:{
                type:String
              },
              credits_expires_on:{
                type:String
              }
  }
],
  premium_credits_info:[
    {
              count:{
                type:Number,
              },
              status:{
                type:String,
                enum: ['Available', "Expired" , "Active"]
              },
              duration:{
                type:Number,
              },
              transaction_Id:{
                type:String
              },
              purchaseDate:{
                type:String
              },
              activationDate:{
                type:String
              },
              expires_on:{
                type:String
              },
              credits_expires_on:{
                type:String
              }
  }
],
  credit_usage : [
  {
              type_of_credit: {
                type: String,
                enum: ["Free", "Premium"]
              },
              count:{
                type: Number
              },
              expires_on: {
                type: String
              },
              credited_on: {
                type: String
              },
              category: {
                type: String
              }
  }
  ]
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;