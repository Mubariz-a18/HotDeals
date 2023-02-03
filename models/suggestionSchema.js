const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SuggestionSchema = Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
    },
    suggestion_box:{
        type:String
    },
    created_date:{
        type:String
    }
});

const Suggestion = mongoose.model("Suggestion", SuggestionSchema);
module.exports = Suggestion