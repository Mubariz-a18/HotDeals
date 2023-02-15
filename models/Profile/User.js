const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userNumber: {
    type: String,
    unique: true,
    required: true,
  },
  isDeletedOnce:{
    type:Boolean,
    default:false
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
});

const User =  mongoose.model("user", userSchema);
module.exports = User;