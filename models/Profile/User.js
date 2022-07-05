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
});

module.exports = mongoose.model("user", userSchema);
