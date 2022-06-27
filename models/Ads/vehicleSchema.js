const mongoose = require("mongoose");

const vehicleSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  condition: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
  },
  year_of_make: {
    type: String,
    required: true,
  },
  year_of_purchase: {
    type: String,
    required: true,
  },
  mileage: {
    type: String,
    required: true,
  },
  contact_of_owner: {
    type: String,
    required: true,
  },
  accidental: {
    type: Boolean,
    default: false,
  },
  vehicle_registered_at: {
    type: String,
    required: true,
  },
  vehicle_present_at: {
    type: String,
    required: true,
  },
  special_mention: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tile: {
    type: String,
    required: true,
  },
  ad_present_location: [
    {
      type: String,
      required: true,
    },
  ],
  ad_posted_location: [
    {
      type: String,
      required: true,
    },
  ],

  //cmmon fields
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
      type: String,
    },
  },
  ad_status: {
    type: String,
    default: "active",
  },
  ad_type: {
    type: String,
    default: "free",
  },
  ad_expire_date: {
    type: String,
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
    type: String,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema, "ads");

module.exports = Vehicle;
