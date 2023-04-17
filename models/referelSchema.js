

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
        userId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        used_Date: {
          type: String,
        },
        isClaimed: {
          type: Boolean,
          default: false
        },
        reviewStatus: {
          type: String,
          enum: [
            "InReview",
            "Rejected",
            "Approved"
          ],
          default: "Approved"
        },
        reasonToReject: {
          type: String
        }
      }
    ],
    isPromoCode: {
      type: Boolean
    },
  }
);

const Referral = mongoose.model('Referral.Codes', referralCodeSchema);
module.exports = Referral;