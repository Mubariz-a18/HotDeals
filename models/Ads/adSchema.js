const mongoose = require("mongoose");


const AdSchema = mongoose.Schema({});

AdSchema.index({ category: "text", sub_category: "text" });
const Ad = mongoose.model("Ad", AdSchema,"ads");

module.exports = Ad;