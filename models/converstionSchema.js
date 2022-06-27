const mongoose = require("mongoose");

const conversationSchema = mongoose.Schema({
  to:{
    type:String,
    requird:true
  },
  from:{
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  senderID:{
    type:String,
    required:true
  },
  receiverID:{
    type:String,
    required:true
  },
  sent: {
    type: Date,
    default: () => Date.now(),
  },
});

const Conversation = mongoose.model("Conversation", conversationSchema,"conversations");

module.exports = Conversation;
