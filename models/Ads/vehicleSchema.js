const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema({
  category: {
    type: String
  },
  sub_category: {
    type: String
  },
  make: {
    type: String
  },
  model: {
    type: String
  },
  colour: {
    type: String
  },
  condition: {
    type: String
  },
  transmission: {
    type: String
  },
  year_of_make: {
    type: String
  },
  year_of_purchase: {
    type: String
  },
  mileage: {
    type: String
  },
  contact_of_owner: {
    type: String
  },
  accidental: {
    type: Boolean,
    default: false,
  },
  vehicle_registered_at: {
    type: String
  },
  vehicle_present_at: {
    type: String
  },
  special_mention: [{
    type: String
  }],
  description: {
    type: String
  },
  title: {
    type: String
  },
  ad_present_location: {
    type: Array,
    default: [],
  },
  ad_posted_location: {
    type: Array,
    default: [],
  },

  //common fields
  reported: {
    type: Boolean,
    default: false,
  },
  reported_ad_count: {
    type: Number,
  },
  reported_by: {
    user_id: {
      type: String,
    },
    reason: {
      type: String,
    },
    report_date: {
      type: Date,
    },
  },
  ad_status: {
    type: String,
    enum: ["Selling", "Archive", "Sold", "Deleted","Draft",],
  },
  ad_type: {
    type: String,
    default: "free",
  },
  ad_expire_date: {
    type: Date,
  },
  ad_promoted: {
    type: String,
  },
  ad_promoted_type: {
    type: String,
    enum: ["Boost", "Premium", ""],
    default: "",
  },
  ad_promoted_date: {
    type: Date,
  },
},
  { timestamps: true });

const Vehicle = mongoose.model("Vehicle", vehicleSchema, "ads");

module.exports = Vehicle;
