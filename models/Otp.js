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
  email:{
    type:String,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  countryCode: {
    type: String,
  },
});

module.exports = mongoose.model("Otp", otpSchema);
