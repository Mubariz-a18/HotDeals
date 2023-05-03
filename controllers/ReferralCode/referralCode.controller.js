const errorHandler = require("../../middlewares/errorHandler.js");
const InstallPayoutModel = require("../../models/InstallsPayoutSchema.js");
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
  };

  static async apiGetReferralForPayouts(req, res, next) {
    try {
      const message = await ReferCodeService.getReferralForPayouts(req.user_ID);
      res.status(200).json({
        message
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

  static async apiClaimReferralPayout(req, res, next) {
    try {
      const message = await ReferCodeService.claimReferralPayouts(req.user_ID, req.body);
      if (message) {
        res.status(200).json({
          message: "Successfully Claimed the Reward"
        });
      }
    } catch (e) {
      errorHandler(e, res)
    };
  }

  static async apiGetRandomAmount(req, res, next) {
    try {
      const amount = await ReferCodeService.generateRandomAmountAndSave(req.user_ID, req.body.friend_ID);
      if (amount) {
        res.status(200).json(
          { amount }
        );
      }
    } catch (e) {
      errorHandler(e, res)
    };
  }

  static async apiChangePaymentStatus(req, res, next){
    try{
      const payload = req.body;
      const updateDoc = await ReferCodeService.updatePayoutDoc(JSON.stringify(payload))
      if(updateDoc){
        res.status(200).json({success:"OK"})
      }else{
        res.status(201)
      }
    }catch(e){
      errorHandler(e, res)
    }
  }
};