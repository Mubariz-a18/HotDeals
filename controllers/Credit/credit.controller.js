const errorHandler = require("../../middlewares/errorHandler");
const CreditService = require("../../services/CreditService");

module.exports = class CreditController {

  // Create Credit 
  static async apiCreateCredit(req, res, next) {
    try {
      // create credit doc returned from service
      const creditDoc = await CreditService.createCredit(req.body, req.user_ID);
      // response is sent
      res.status(200).send({
        message: creditDoc,
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };
  // Api getmyCreditsInfo 
  static async getMyCreditsInfo(req, res, next) {
    try {
      // return the doc from service 
      const creditDoc = await CreditService.getMyCreditsInfo(req.user_ID);
      // response is sent
      res.status(200).send({
        message: "Success",
        data: creditDoc,
      });
    } catch (e) {
      errorHandler(e, res)
    };
  }

  static async apiBoostAd(req, res, next) {
    try {
      // return the doc from service 
      const creditDoc = await CreditService.boost_MyAd(req.user_ID, req.body);
      // response is sent
      res.status(200).send({
        message: creditDoc

      });
    } catch (e) {
      errorHandler(e, res)
    };
  }

  static async apiHighlightAd(req, res, next) {
    try {
      // return the doc from service 
      const creditDoc = await CreditService.HighLight_MyAd(req.user_ID, req.body);
      // response is sent
      res.status(200).send({
        message: creditDoc

      });
    } catch (e) {
      errorHandler(e, res)
    };
  }

  static async apicheckCredits(req, res, next) {
    try {
      // create credit doc returned from service
      const creditDoc = await CreditService.CreditCheckFunction(req.body, req.user_ID);
      // response is sent
      res.status(200).send({
        data: creditDoc,
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

};