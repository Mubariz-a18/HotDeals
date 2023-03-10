const mongoose = require("mongoose");

const JsonLangMapSchema = new mongoose.Schema({
  
});

const JsonLangMapModel = mongoose.model("Jsonlangmap", JsonLangMapSchema);

module.exports = JsonLangMapModel;