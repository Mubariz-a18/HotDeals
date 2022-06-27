const mongoose = require("mongoose");

const complainSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  complain: {
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    reason: {
      type: String,
    },
    complain_date: {
      type: Date,
    },
  },
  description: {
    type: String,
  },
});

const Complain = mongoose.model("Complain", complainSchema);

module.exports = Complain;
