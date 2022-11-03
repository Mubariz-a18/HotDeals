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
      count: {
        type: Number,
      },
      status: {
        type: String,
        enum: ['Available', "Expired", "Active"],
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
      // credits_detail_list: [{
      //   general_id: mongoose.Schema.Types.ObjectId,
      //   category: {
      //     type: String
      //   },
      //   general_count: {
      //     type: String
      //   }
      // }],
      referral_code: {
        type: String,
      },
      referral_Id: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
      },
      activationDate: {
        type: String
      },
      // expires_on: {
      //   type:String
      // },
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
      status: {
        type: String,
        enum: ['Available', "Expired", "Active"],
        default: "Available"
      },
      allocation: {
        type: String,
        enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchased-PremiumCredits", "Purchased-PremiumBoost"],
        default: "Admin-atLogin"
      },
      // credits_detail_list: [{
      //   general_id: mongoose.Schema.Types.ObjectId,
      //   category: {
      //     type: String
      //   },
      //   general_count: {
      //     type: String
      //   }
      // }],
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
      // expires_on: {
      //   type: String
      // },
      credits_expires_on: {
        type: String
      }
    }
  ],
  credit_usage: [
    {
      type_of_credit: {
        type: String,
        enum: ["Free", "Premium"]
      },
      ad_id:{
        type:mongoose.Schema.Types.ObjectId
      },
      count: {
        type: Number
      },
      category:{
        type:String
      },
      // expires_on: {
      //   type: String
      // },
      credited_on: {
        type: String
      }
    }
  ]
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;