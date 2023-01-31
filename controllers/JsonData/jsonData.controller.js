const JsonDataService = require("../../services/JsonDataService");

module.exports = class JsonDataController {
 // Get Help
  static async apiGetJson(req, res, next) {
    try {
      const JsonData = await JsonDataService.getJsonData();
      const CreditJson = await JsonDataService.getCreditsJson()
      res.status(200).send({
        JsonData,
        CreditJson:CreditJson
      })
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
};