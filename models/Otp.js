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
  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  countryCode: {
    type: String,
  },
  expire_at: {
    type: Date,
    default: Date.now(),
    expires: 120
  }
});

module.exports = mongoose.model("Otp", otpSchema);
