const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema({
  ad_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  complaint: [{
    _id: false,
    user_id: mongoose.Schema.Types.ObjectId,
    reason: String,
    complaint_date: String,
    description: String,
    attachement: String
  }
  ],
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
