const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String
  },
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  sentAt: {
    type: String
  },
  isVerified: {
    type:Boolean,
    default:false
  },
  ipAddress: {
    type: String
  },
  createdAt: {
    type: Date,
    expires: 86400
  },
  expireAt: {
    type: String
  }
});

const OtpModel = mongoose.model("Otp", otpSchema);

module.exports = OtpModel;
