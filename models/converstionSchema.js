const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
  chatId: {
      type: String,
      required: true,
  },
  from: {
      type: ObjectId,
      required: true,
      ref: 'User',
  },
  to: {
      type: ObjectId,
      required: true,
      ref: 'User',
  },
  message: {
      type: String,
      required: true,
  },
  triedToGet: {
      type: Boolean,
      default: false,
      select: false,
  },
  sendAt: {
      type: Number,
      default: Date.now
  }
});

const Conversation = mongoose.model("Conversation", MessageSchema,);

module.exports = Conversation;
