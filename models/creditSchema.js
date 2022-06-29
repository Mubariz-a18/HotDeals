const mongoose = require("mongoose");

const creditSchema = mongoose.Schema({
  user_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  credit_type: {
    type: String,
    default: "premium",
  },
  transcation_id: {
    type: String,
  },
  purchase_mode: {
    type: String,
  },
  purchase_date: {
    type: Date,
  },
  expiray_date: {
    type: Date,
  },
  activate_status: {
    type: Boolean,
  },
});

const Credit = mongoose.model("Credit", creditSchema);
module.exports = Credit;
