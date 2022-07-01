const mongoose = require("mongoose");

const houseSchema = mongoose.Schema({
  category: {
    type: String,
  },
  sub_category: {
    type: String,
  },
  facing: {
    type: String,
  },
  dimension_length: {
    type: String,
  },
  dimension_breadth: {
    type: String,
  },
  area: {
    type: Number,
  },
  carpet_area: {
    type: Number,
  },
  beds: {
    type: Number,
  },
  baths: {
    type: Number,
  },

  furnishing_type: {
    type: String,
  },
  balconies: {
    type: Number,
  },
  gated_community: {
    type: String,
  },
  property_floor_no: {
    type: Number,
  },
  number_of_floors: {
    type: Number,
  },
  car_parking: {
    type: String,
  },
  bike_parking: {
    type: String,
  },
  amenities: [
    {
      type: String,
    },
  ],
  nearly_by: [
    {
      type: String,
    },
  ],
  registration: {
    type: String,
  },
  distance_from_main_road: {
    type: Number,
  },
  front_road: {
    type: String,
  },
  special_mention: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  tile: [
    {
      type: String,
    },
  ],
  ad_present_location: {
    type: Array,
    default: [],
  },
  ad_posted_location: {
    type: Array,
    default: [],
  },

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
      type: Date,
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
});

const House = mongoose.model("House", houseSchema, "ads");

module.exports = House;
