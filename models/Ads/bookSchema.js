const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    index:true,
    text:true
  },
  sub_category: {
    type: String,
    required: true,
    index:true,
    text:true
  },
  book_name: {
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
  tile: [
    {
      type: String,
    },
  ],
  ad_present_location: [
    {
      type: String,
    },
  ],
  ad_posted_location: [
    {
      type: String,
    },
  ],
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

bookSchema.index({ category: "text", sub_category: "text" });
const Book = mongoose.model("Book", bookSchema, "ads");

module.exports = Book;
