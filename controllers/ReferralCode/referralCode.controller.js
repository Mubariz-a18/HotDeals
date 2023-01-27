const ReferCodeService = require("../../services/referCodeService.js");


module.exports = class ReferralCodeController {

  static async apiReferralCode(req, res, next) {
    try {
      const message = await ReferCodeService.checkReferCodeService(req.body, req.user_ID);
      res.status(200).json({
        message
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