const mongoose = require("mongoose");

const OfferSchema = new mongoose.Schema({
  offerValid:{
    type:Boolean
  },
  firstAdReward:{
    type:Number
  },
  nextAdReward:{
    type:Number
  }
});

const OfferModel = mongoose.model("offer", OfferSchema);

module.exports = OfferModel;