const errorHandler = require("../../middlewares/errorHandler");
const JsonDataService = require("../../services/JsonDataService");

module.exports = class JsonDataController {
  // Get Help
  static async apiGetJson(req, res, next) {
    try {
      const { JsonData, JsonCredits, JsonLang, Versions ,businessAdMultiplier} = await JsonDataService.getJsonData();
      res.status(200).send({
        CreditJson: JsonCredits,
        Versions: Versions,
        JsonLang: JsonLang,
        businessAdsCredits:businessAdMultiplier
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
  static async apiGetPlaces(req, res, next) {
    try {
      const { input } = req.query;
      const Data = await JsonDataService.getPlaces(input);
      res.status(200).send(Data)
    } catch (e) {
      errorHandler(e, res)
    };
  }
};