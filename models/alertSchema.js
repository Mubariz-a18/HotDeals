const mongoose = require("mongoose");

const alertSchema = mongoose.Schema(
  {
    user_ID: {
      type: mongoose.Schema.Types.ObjectId,
    },
    title:{
      type:String
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
    keywords: [
      {
        type: String,
      },
    ],
    condition:{
        type:String
    },
    location:{
      type:String
    },
    price:{
      type:String
    },
    activate_status: {
      type: Boolean,
      default:true
    },
    alert_Expiry_Date:{
      type:String
    },
    created_Date:{
    type:String
    },
    updated_Date:{
      type:String
      }
  },

);

const Alert = mongoose.model('Alert',alertSchema);
module.exports = Alert;
