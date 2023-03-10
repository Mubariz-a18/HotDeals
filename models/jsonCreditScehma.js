const mongoose = require("mongoose");

const JsonCreditSchema = new mongoose.Schema({
  
});

const JsonCreditModel = mongoose.model("JsonCredit", JsonCreditSchema);

module.exports = JsonCreditModel;