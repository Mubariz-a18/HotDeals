const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
  category: {
    type: String,
  },
  sub_category: {
    type: String,
  },
  animal: {
    type: String,
  },
  breed: {
    type: String,
  },
  condition: {
    type: String,
  },
  description: {
    type: String,
  },
  special_mention: [
    {
      type: String,
    },
  ],
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
  ad_promoted_expire_date: {
    type: Date,
  },
  is_negotiable: {
    type: Boolean,
  },
  is_ad_posted: {
    type: Boolean
  }
},
  { timestamps: true });

const Pet = mongoose.model("Pet", petSchema, "ads");

module.exports = Pet;
