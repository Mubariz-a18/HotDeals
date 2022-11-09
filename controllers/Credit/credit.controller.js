const CreditService = require("../../services/CreditService");

module.exports = class CreditController {

  // Create Credit 
  static async apiCreateCredit(req, res, next) {
    try {
      // create credit doc returned from service
      const creditDoc = await CreditService.createCredit(req.body,  req.user_ID);
      // response is sent
        res.status(200).send({
          message: "Success",
          data: creditDoc,
        })
    } catch  (e) {
      console.log(e)
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
    } catch  (e) {
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

