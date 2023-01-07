const mongoose = require("mongoose");

const GlobalSearchSchema = mongoose.Schema({
  ad_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  Keyword: {
    type: String
  },
  ad_posted_location: {
    type:Array
  },
});

GlobalSearchSchema.index({ category: "text", sub_category: "text" });
const GlobalSearch = mongoose.model("GlobalSearch", GlobalSearchSchema);
module.exports = GlobalSearch;
