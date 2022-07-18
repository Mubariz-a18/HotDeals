const mongoose = require("mongoose");
var GeoJSON = require("mongoose-geojson-schema");

const artsAndAntiqueSchema = mongoose.Schema({
  // any: mongoose.Schema.Types.GeoJSON,
  // point: mongoose.Schema.Types.Point,
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  state: {
    type: String,
  },

  //commo fields

  special_mention: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  title: [
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
  loc: {
    type: { type: String },
    coordinates: [],
  },
  is_premium:{
    type: Boolean,
    default: "false",
  }
});


const ArtsAndAntique = mongoose.model(
  "ArtsAndAntique",
  artsAndAntiqueSchema,
  "ads"
);

module.exports = ArtsAndAntique;
