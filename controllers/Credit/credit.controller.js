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
      } else {
        res.status(400).json({ error: "Something went wrong in controller" });
      }
    } catch (error) {
      res.send(error.message).status(401)
    }
  }
};

