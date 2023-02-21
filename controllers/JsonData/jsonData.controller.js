const errorHandler = require("../../middlewares/errorHandler");
const JsonDataService = require("../../services/JsonDataService");

module.exports = class JsonDataController {
  // Get Help
  static async apiGetJson(req, res, next) {
    try {
      const JsonData = await JsonDataService.getJsonData();
      const CreditJson = await JsonDataService.getCreditsJson();
      const Versions = await JsonDataService.getAppVersion();
      res.status(200).send({
        JsonData,
        CreditJson,
        Versions
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
};