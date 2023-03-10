const mongoose = require("mongoose");

const JsondataSchema = new mongoose.Schema({
  
});

const JsonDataModel = mongoose.model("Jsondata", JsondataSchema);

module.exports = JsonDataModel;