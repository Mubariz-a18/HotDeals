const mongoose = require("mongoose");

const complaintSchema = mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  complaint: [{
        complaint_id: {
          type: mongoose.Schema.Types.ObjectId
        },
        _id:false,
        ad_id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        reason: String,
        complaint_date: String,
        complaint_updated_date:String,
        description: String,
        attachment: {
          type: Array,
          default: [],
        },
        status: {
          type: String,
          enum: ['OPEN', "PENDING", "RESOLVED"],
          default: "OPEN"
        }
}]
});

const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;