const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    // unique: true,
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  // user_id: {
  //   type: mongoose.Schema.Types.ObjectId
  // },
  // countryCode: {
  //   type: String,
  // },
  expire_at: {
    type: Date,
    expires: 200
  }
});

const OtpModel = mongoose.model("Otp", otpSchema);

module.exports = OtpModel;
