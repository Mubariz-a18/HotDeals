const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  offerValid: {
    type: Boolean
  },
  firstAdReward: {
    type: Number
  },
  nextAdReward: {
    type: Number
  },
  monthlyCredits: {
    type: Number
  },
  referralCredits: {
    type: Number
  },
  promoCodeCredits: {
    type: Number
  },
  onLoginCredits: {
    type: Number
  },
  referralOfferValid: {
    type: Boolean
  },
  referralReward: {
    type: Number
  }
});

const OfferModel = mongoose.model("offer", OfferSchema);

module.exports = OfferModel;