const mongoose = require("mongoose");

const referralCodeSchema = mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referral_code:{
      type:String
    },
    is_used:{
      type:Boolean,
      default:false
    }
  }
);

const Referral = mongoose.model('Referral', referralCodeSchema);
module.exports = Referral;
