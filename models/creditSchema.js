const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  free_credits_info: [
    {
              count:{
                type:Number,
              },
              status:{
                type:String,
                enum: ['Available', "Expired"]
              },
              allocation: {
                type: String,
                enum: ["Admin","referral"],
              },
              referral_Id :{
                type: mongoose.Schema.Types.ObjectId,
              },
              expires_on: {
                type:String
              },
              allocated_on:{
                type:String
              }
  }
],
  premium_credit_info:[
    {
              count:{
                type:Number,
              },
              transaction_Id:{
                type:mongoose.Schema.Types.ObjectId
              },
              purchaseDate:{
                type:String
              },
              expires_on:{
                type:String
              }
  }
],
  available_free_credits :{
              type : Number
  },
  available_premium_credits :{
              type : Number
  },
  credit_usage : [
  {
              type_of_credit: {
                type: String,
                enum: ["free", "premium"]
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