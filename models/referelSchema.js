const mongoose = require("mongoose");

const referralCodeSchema = mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referral_code: {
      type: String
    },
    used_by: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        used_Date:String,
      }
    ],
    isPromoCode:{
      type:Boolean
    },
    // used_Date: {
    //   type: String
    // }
  }
);

const Referral = mongoose.model('Referral.Codes', referralCodeSchema);
module.exports = Referral;
