const translate = require("translate-google");
const validateTranslateBody = require("../validators/chatTranslate.Validators");


module.exports = class ChatTranslateService {
    static async translateText(bodyData) {
        const isBodyValid = validateTranslateBody(bodyData)
        if (!isBodyValid) {
            throw ({ status: 401, message: 'Bad Request' });
        }
        const {
            language,
            text
        } = bodyData


        const translatedText = await translate(text, { to: language });
        if (!translatedText) {
            return false
        }
        return translatedText
    }
}