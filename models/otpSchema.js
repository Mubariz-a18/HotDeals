const mongoose = require("mongoose");

const otpSchema = mongoose.Schema({
  phone_number: {
    type: String,
  },
  country_code: {
    type: String,
  },
  otp: {
    type: String,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
