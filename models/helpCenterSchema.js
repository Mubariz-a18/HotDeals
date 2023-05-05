const mongoose = require("mongoose");

const helpCenterSchema = mongoose.Schema({
  user_id:
  {
    type: mongoose.Schema.Types.ObjectId,
  },
  phone_Info: {
    type: String,
    required:true,
    maxLength: [64, 'max 64 charecters'],
  },
  title: {
    type: String,
    required:true,
    maxLength: [30, 'max 30 charecters'],
  },
  description: {
    type: String,
    required:true,
    maxLength: [300, 'max 300 charecters'],
  },
  attachment: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 3;
      },
      message: props => `${props.value} exceeds the maximum allowed length of 3`
    }
  },
  created_Date: {
    type: String
  }
});

const HelpCenter = mongoose.model('HelpCenter', helpCenterSchema);
module.exports = HelpCenter;