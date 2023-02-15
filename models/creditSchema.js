const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  total_universal_credits: {
    type: Number
  },
  universal_credit_bundles: [
    {
      number_of_credit: {
        type: Number
      },
      source_of_credit: {
        type: String,
        enum: [
          "Paid",
          "Admin-Login",
          "Admin-Monthly",
          "Refferal",
          "By-Admin"
        ]
      },
      credit_expiry_date: {
        type: String
      },
      credit_duration: {
        type: Number
      },
      credit_created_date: {
        type: String
      },
      credit_status: {
        type: String,
        enum: [
          "Active",
          "Empty",
          "Expired"
        ]
      },
      transaction_Id: {
        type: mongoose.Schema.Types.ObjectId,
      },
    }
  ],

  credit_usage: [
    {
      ad_id: {
        type: mongoose.Schema.Types.ObjectId
      },
      title:{
        type: String
      },
      number_of_credit: {
        type: Number
      },
      category: {
        type: String
      },
      Boost_expiry_date: {
        type: String
      },
      Highlight_expiry_date: {
        type: String
      },
      credited_on: {
        type: String
      }
    }
  ]
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;