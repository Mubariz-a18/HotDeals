const CreditService = require("../../services/CreditService");

module.exports = class CreditController {

  // Create Credit 
  static async apiCreateCredit(req, res, next) {
    try {
      const creditDoc = await CreditService.createCredit(req.body,  req.user_ID);
      if (creditDoc) {
        res.status(200).send({
          message: "Success",
          data: creditDoc,
        });
      }
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
  }
  static async getMyCreditsInfo(req, res, next) {
    try {
      const creditDocs = await CreditService.getMyCreditsInfo(req.user_ID);
        res.status(200).send({
          message: "Success",
          data: creditDocs,
        });
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
  }
  
};

