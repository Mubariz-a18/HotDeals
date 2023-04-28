const mongoose = require("mongoose");

const AdDurationSchema = new mongoose.Schema({
    generalAdDuration: {
        type: Number
    },
    boostAdDuration7Days: {
        type: Number
    },
    boostAdDuration14Days: {
        type: Number
    },
    premiumAdDuration: {
        type: Number
    },
    highlightAdDuration: {
        type: Number
    },
    freeCreditDuration:{
        type:Number
    }

});

const AdDurationModel = mongoose.model("adDuration", AdDurationSchema);

module.exports = AdDurationModel;