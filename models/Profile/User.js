const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userNumber: {
    type: String,
    unique: true,
    required: true,
  },
  displayName: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  photoURL: {
    type: String,
    default: "",
  },
  created_at:{
    type:String
  },
  updated_at:{
    type:String
  }
});

const User =  mongoose.model("user", userSchema);
module.exports = User;