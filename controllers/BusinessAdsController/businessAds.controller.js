const errorHandler = require("../../middlewares/errorHandler");
const BusinessAdService = require("../../services/BuisinessAdService");

module.exports = class BusinessAdsController {
    static async createBusinessProfile(req, res, next) {
        try {
            const { user_ID, body } = req;
            const BusinessProfile = await BusinessAdService.createBusinessProfileService(user_ID, body);
            if (BusinessProfile) {
                res.status(200).send({
                    message: "Successfully Created Business Profile"
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };

    static async updateBusinessProfile(req, res, next) {
        try {
            const { user_ID, body } = req;
            const BusinessProfile = await BusinessAdService.updateBusinesProfileService(user_ID, body);
            if (BusinessProfile) {
                res.status(200).send({
                    message: "Successfully Updated Business Profile"
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };

    static async createBusinessAd(req, res, next) {
        try {
            const { user_ID, body } = req;
            const BusinessAdDoc = await BusinessAdService.createBusinessAdService(user_ID, body);
            if (BusinessAdDoc) {
                res.status(200).send({
                    message: "Successfully Created Business Ad"
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };

    static async getMyBusinessAds(req, res, next) {
        try {
            const { user_ID, body } = req;
            const getMyBusinessAdDoc = await BusinessAdService.getMyBusinessAdsService(user_ID, body);
            if (getMyBusinessAdDoc) {
                res.status(200).send({
                    data: getMyBusinessAdDoc[0]
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };

    static async updateBusinessAd(req, res, next) {
        try {
            const { user_ID, body } = req;
            const UpdatedBusinessAd = await BusinessAdService.updateBusinessAdService(user_ID, body);
            if (UpdatedBusinessAd) {
                res.status(200).send({
                    message: "Successfully Updated Business Ad"
                })
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };

    static async getParticularBusinessAd(req, res, next) {
        try {
            const { body } = req;
            const BusinessAdDoc = await BusinessAdService.GetParticularBusinessAd(body);
            if (BusinessAdDoc) {
                res.status(200).send({
                    data: BusinessAdDoc
                });
            }
        } catch (e) {
            errorHandler(e, res)
        }
    };
}