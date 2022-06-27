const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  facing: {
    type: String,
    required: true,
  },
  dimension_length: {
    type: String,
    required: true,
  },
  dimension_breadth: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  carpet_area: {
    type: Number,
    required: true,
  },
  beds: {
    type: Number,
    required: true,
  },
  baths: {
    type: Number,
    required: true,
  },

  furnishing_type: {
    type: String,
    required: true,
  },
  balconies: {
    type: Number,
    required: true,
  },
  gated_community: {
    type: String,
    required: true,
  },
  property_floor_no: {
    type: Number,
    required: true,
  },
  number_of_floors: {
    type: Number,
    required: true,
  },
  car_parking: {
    type: String,
    required: true,
  },
  bike_parking: {
    type: String,
    required: true,
  },
  amenities: [
    {
      type: String,
      required: true,
    },
  ],
  nearly_by: [
    {
      type: String,
      required: true,
    },
  ],
  registration: {
    type: String,
    required: true,
  },
  distance_from_main_road: {
    type: Number,
    required: true,
  },
  front_road: {
    type: String,
    required: true,
  },
  special_mention: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
    required: true,
  },
  tile: [
    {
      type: String,
    },
  ],
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


const House = mongoose.model("House", houseSchema, "ads");

module.exports = House;
