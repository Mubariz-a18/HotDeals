const mongoose = require("mongoose");

const GlobalSearchSchema = mongoose.Schema({
  ad_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  category: {
    type: String,
    required: true,
  },
  sub_category: {
    type: String,
    required: true,
  },
  title:{
      type: String,
    },
  description:{
    type: String,
  }
});

GlobalSearchSchema.index({ category: "text", sub_category: "text"});
const GlobalSearch = mongoose.model("GlobalSearch", GlobalSearchSchema);
module.exports = GlobalSearch;
