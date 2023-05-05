const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile phone number!`
    }
  },
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  sentAt: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
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
