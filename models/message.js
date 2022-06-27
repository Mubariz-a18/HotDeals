const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  Username: {
    type: String,
  },
  message:{
    type: String,
  },
  sender:{
    type:String
  },
  Date: {
    type: String,
  },
  Time: {
    type: String,
  },
});

const ChatUser = mongoose.model("ChatUser", userSchema);

module.exports = ChatUser;
