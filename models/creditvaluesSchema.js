const mongoose = require("mongoose");

const CreditValuesSchema = new mongoose.Schema({
  
});

const CreditValuesModel = mongoose.model("creditvalues", CreditValuesSchema);

module.exports = CreditValuesModel;