const errorHandler = require("../../middlewares/errorHandler");
const ChatTranslateService = require("../../services/ChatTranslatService");


module.exports = class ChatTranslatorController {
    static async apiChatTranslate(req, res, next){
        try {
            const translatedText = await ChatTranslateService.translateText(req.body);
            if(!translatedText){
                res.json({
                    message:"Could not Translate"
                }).status(500)
            }
            res.json({
                text:translatedText
            }).status(200)
        } catch (error) {
            errorHandler(error,res)
        }
    }
}