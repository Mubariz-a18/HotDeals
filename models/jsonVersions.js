const mongoose = require("mongoose");

const JsonVersionSchema = new mongoose.Schema({
  
});

const JsonVersionModel = mongoose.model("version", JsonVersionSchema);

module.exports = JsonVersionModel;