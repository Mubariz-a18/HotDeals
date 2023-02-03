const errorHandler = require("../../middlewares/errorHandler.js");
const SuggestionService = require("../../services/SuggestionService.js");


module.exports = class SuggestionController {

    static async apiCreateSuggestion(req, res, next) {
        try {
            const SuggestionDoc = await SuggestionService.createSuggestion(req.body, req.user_ID)
            res.status(200).json({
                message: SuggestionDoc
            })
        } catch (e) {
            errorHandler(e, res)
        };
    }
};
