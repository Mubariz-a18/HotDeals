const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = Schema({
  otp: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
