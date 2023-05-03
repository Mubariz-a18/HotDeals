const errorHandler = require("../../middlewares/errorHandler");
const BusinessAdService = require("../../services/BuisinessAdService");

module.exports = class BusinessAdsController {
    static async createBusinessProfile(req, res, next) {
        try {
            const { user_ID, body } = req;
            const BusinessProfile = await BusinessAdService.createBusinessProfileService(user_ID, body);
            if (BusinessProfile) {
                res.status(200).send({
                    message: "Successfully Created Business profile"
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    }
}