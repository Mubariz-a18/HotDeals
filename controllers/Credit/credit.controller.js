const CreditService = require("../../services/CreditService");

module.exports = class CreditController {

  // Create Credit 
  static async apiCreateCredit(req, res, next) {
    try {
      const creditData = await CreditService.createCredit(req.body,  req.user_ID);
      if (creditData) {
        res.status(200).send({
          message: "Success",
          data: creditData,
        });
      } else {
        res.status(400).json({ error: "Something went wrong in controller" });
      }
    } catch (error) {}
  }
};

