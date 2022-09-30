const mongoose = require("mongoose");

const alertSchema = mongoose.Schema(
  {
    user_ID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    category: {
      type: String,
    },
    sub_category: {
      type: String,
    },
    name: {
      type: String,
    },
    keyword: [
      {
        type: String,
      },
    ],
    activate_status: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

const Alert = mongoose.model('Alert',alertSchema);
module.exports = Alert;
