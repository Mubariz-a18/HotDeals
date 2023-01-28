const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  available_free_credits: {
    type: Number
  },
  available_general_credits: {
    type: Number
  },
  available_premium_credits: {
    type: Number
  },
  available_general_boost_credits: {
    type: Number
  },
  available_premium_boost_credits: {
    type: Number
  },
  available_Highlight_credits: {
    type: Number
  },
  free_credits_info: [
    {
      count: {
        type: Number,
      },
      status: {
        type: String,
        enum: [
          'Available',
          "Expired",
          "Empty",
          "Active"
        ],
        default: "Available"
      },
      duration: {
        type: Number,
      },
      allocation: {
        type: String,
        enum: [
          "Admin-atLogin",
          "Referral",
          "Admin-Monthly",
          "By-Admin"
        ],
        default: "Admin-atLogin"
      },
      allocated_on: {
        type: String
      },
      credits_expires_on: {
        type: String
      }
    }
  ],

  paid_credits_info: [
    {
      count: {
        type: Number,
      },
      category: {
        type: String
      },
      status: {
        type: String,
        enum: [
          'Available',
          "Expired",
          "Empty",
          "Active"
        ],
        default: "Available"
      },
      credit_type: {
        type: String,
        enum: [
          "General",
          "Premium",
          "General-Boost",
          "Premium-Boost",
          "HighLight"
        ],
        default: "General"
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
      credits_expires_on: {
        type: String
      }
    }
  ],
  // boost_credits_info: [
  //   {
  //     count: {
  //       type: Number,
  //     },
  //     category: {
  //       type: String
  //     },
  //     sub_category: {
  //       type: String
  //     },
  //     status: {
  //       type: String,
  //       enum: ['Available', "Expired", "Empty", "Active"],
  //       default: "Available"
  //     },
  //     duration: {
  //       type: Number,
  //     },
  //     allocation: {
  //       type: String,
  //       enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchased-Boost", "By-Admin"],
  //       default: "Admin-atLogin"
  //     },
  //     transaction_Id: {
  //       type: String
  //     },
  //     referral_Id: {
  //       type: String,
  //     },
  //     allocated_on: {
  //       type: String
  //     },
  //     purchaseDate: {
  //       type: String
  //     },
  //     credits_expires_on: {
  //       type: String
  //     }
  //   }
  // ],
  // premium_boost_credits_info: [
  //   {
  //     count: {
  //       type: Number,
  //     },
  //     category: {
  //       type: String
  //     },
  //     sub_category: {
  //       type: String
  //     },
  //     status: {
  //       type: String,
  //       enum: ['Available', "Expired", "Empty", "Active", "By-Admin"],
  //       default: "Available"
  //     },
  //     duration: {
  //       type: Number,
  //     },
  //     allocation: {
  //       type: String,
  //       enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchased-premium-Boost"],
  //       default: "Admin-atLogin"
  //     },
  //     transaction_Id: {
  //       type: String
  //     },
  //     referral_Id: {
  //       type: String,
  //     },
  //     allocated_on: {
  //       type: String
  //     },
  //     purchaseDate: {
  //       type: String
  //     },
  //     credits_expires_on: {
  //       type: String
  //     }
  //   }
  // ],
  // Highlight_credit_info: [
  //   {
  //     count: {
  //       type: Number,
  //     },
  //     category: {
  //       type: String
  //     },
  //     sub_category: {
  //       type: String
  //     },
  //     status: {
  //       type: String,
  //       enum: ['Available', "Expired", "Empty", "Active"],
  //       default: "Available"
  //     },
  //     duration: {
  //       type: Number,
  //     },
  //     allocation: {
  //       type: String,
  //       enum: ["Admin-atLogin", "Referral", "Admin-Monthly", "Purchase_Highlight", "By-Admin"],
  //       default: "Admin-atLogin"
  //     },
  //     transaction_Id: {
  //       type: String
  //     },
  //     referral_Id: {
  //       type: String,
  //     },
  //     allocated_on: {
  //       type: String
  //     },
  //     purchaseDate: {
  //       type: String
  //     },
  //     credits_expires_on: {
  //       type: String
  //     }
  //   }
  // ],

  credit_usage: [
    {
      type_of_credit: {
        type: String,
        enum: [
          "Free",
          "Premium",
          "General-Boost",
          "Premium-Boost",
          "Premium-Pro",
          "General"
        ]
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
      sub_category: {
        type: String
      },

      General_Boost_expiry_date: {
        type: String
      },
      Premium_Pro_expiry_date: {
        type: String
      },
      Premium_Boost_expiry_date: {
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