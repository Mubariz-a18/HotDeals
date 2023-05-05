const suggestionSchema = require("../models/suggestionSchema");
const moment = require('moment');

module.exports = class SuggestionService {
    // create suggestions by user
    static async createSuggestion(bodyData, user_id) {
        //TODO: handle invalid data from body

        const {
            suggestion
        } = bodyData;

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const SuggestionDoc = await suggestionSchema.create({

            user_id: user_id,
            suggestion_box: suggestion,
            created_date: currentDate

        })

        return SuggestionDoc;
    }
};