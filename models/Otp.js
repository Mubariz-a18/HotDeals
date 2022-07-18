const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = Schema({
  otp: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  countryCode: {
    type: String,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
