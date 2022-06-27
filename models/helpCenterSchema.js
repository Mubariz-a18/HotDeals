const mongoose = require("mongoose");

const helpCenterSchema = mongoose.Schema({
  user_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  phone_number: {
    type: Number,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  attachment: {
    type: String,
  },
  message: {
    sender_message: {
      type: String,
    },
    replied_mssage: {
      type: String,
    },
  },
});

const HelpCenter = mongoose.model('HelpCenter', helpCenterSchema);
module.exports = HelpCenter;