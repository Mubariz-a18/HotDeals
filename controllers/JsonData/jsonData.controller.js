const errorHandler = require("../../middlewares/errorHandler");
const JsonDataService = require("../../services/JsonDataService");

module.exports = class JsonDataController {
  // Get Help
  static async apiGetJson(req, res, next) {
    try {
      const {JsonData,JsonCredits,JsonLang,Versions} = await JsonDataService.getJsonData();
      res.status(200).send({
        JsonData,
        CreditJson:JsonCredits,
        Versions:Versions,
        JsonLang:JsonLang
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
};