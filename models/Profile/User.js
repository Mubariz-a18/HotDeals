const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = Schema({
  uid: String,
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

module.exports = mongoose.model("user", userSchema);
