const errorHandler = require("../../middlewares/errorHandler.js");
const ReferCodeService = require("../../services/referCodeService.js");


module.exports = class ReferralCodeController {

  static async apiReferralCode(req, res, next) {
    try {
      const message = await ReferCodeService.checkReferCodeService(req.body, req.user_ID);
      res.status(200).json({
        message
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
};