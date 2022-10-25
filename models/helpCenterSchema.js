const mongoose = require("mongoose");

const helpCenterSchema = mongoose.Schema({
  user_id: 
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  phone_Info: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  attachment: [{
    type: String,
  }],
  created_Date:{
    type:String
  }
});

const HelpCenter = mongoose.model('HelpCenter', helpCenterSchema);
module.exports = HelpCenter;