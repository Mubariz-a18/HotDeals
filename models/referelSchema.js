const mongoose = require("mongoose");

const referralCodeSchema = mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referral_code: {
      type: String
    },
    is_used: {
      type: Boolean,
      default: false
    },
    used_by: {
      type: mongoose.Schema.Types.ObjectId,
    },
    used_Date: {
      type: String
    }
  }
);

const Referral = mongoose.model('Referral.Codes', referralCodeSchema);
module.exports = Referral;
