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


  // available_free_credits: {
  //   type: Number
  // },
  // available_general_credits: {
  //   type: Number
  // },
  // available_premium_credits: {
  //   type: Number
  // },
  // available_general_boost_credits: {
  //   type: Number
  // },
  // available_premium_boost_credits: {
  //   type: Number
  // },
  // available_Highlight_credits: {
  //   type: Number
  // },


  // free_credits_info: [
  //   {
  //     count: {
  //       type: Number,
  //     },
  //     status: {
  //       type: String,
  //       enum: [
  //         'Available',
  //         "Expired",
  //         "Empty",
  //         "Active"
  //       ],
  //       default: "Available"
  //     },
  //     duration: {
  //       type: Number,
  //     },
  //     allocation: {
  //       type: String,
  //       enum: [
  //         "Admin-atLogin",
  //         "Referral",
  //         "Admin-Monthly",
  //         "By-Admin"
  //       ],
  //       default: "Admin-atLogin"
  //     },
  //     allocated_on: {
  //       type: String
  //     },
  //     credits_expires_on: {
  //       type: String
  //     }
  //   }
  // ],

  // paid_credits_info: [
  //   {
  //     count: {
  //       type: Number,
  //     },
  //     category: {
  //       type: String
  //     },
  //     status: {
  //       type: String,
  //       enum: [
  //         'Available',
  //         "Expired",
  //         "Empty",
  //         "Active"
  //       ],
  //       default: "Available"
  //     },
  //     credit_type: {
  //       type: String,
  //       enum: [
  //         "General",
  //         "Premium",
  //         "General-Boost",
  //         "Premium-Boost",
  //         "HighLight"
  //       ],
  //       default: "General"
  //     },
  //     duration: {
  //       type: Number,
  //     },
  //     transaction_Id: {
  //       type: String
  //     },
  //     purchaseDate: {
  //       type: String
  //     },
  //     activationDate: {
  //       type: String
  //     },
  //     credits_expires_on: {
  //       type: String
  //     }
  //   }
  // ],

});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;