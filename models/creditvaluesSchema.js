const mongoose = require("mongoose");

const CreditValuesSchema = new mongoose.Schema({
    creditValuesForCategories: {
        type: Object
    },
    boostValues: {
        type: Object
    },
    HighLight_values: {
        type: Object
    },
    typeMultiples: {
        type: Object
    },
    businessAdMultiplier: {
        type:Object
    },
    businessAdBaseCreditValue: {
        type:Number
    }
});

const CreditValuesModel = mongoose.model("creditvalues", CreditValuesSchema);

module.exports = CreditValuesModel;