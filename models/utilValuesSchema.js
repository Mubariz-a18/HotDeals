const mongoose = require("mongoose");

const UtilValues = new mongoose.Schema({
    maxDistance: {
        type: Number
    }
});

const UtilModel = mongoose.model("utilvalues", UtilValues);

module.exports = UtilModel;