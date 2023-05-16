const errorHandler = require("../../middlewares/errorHandler");
const BusinessAdService = require("../../services/BusinessAdService");

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

    static async changeBusinessAdStatus(req, res, next) {
        try {
            const { user_ID, body } = req;
            const BusinessAdDoc = await BusinessAdService.updateBusinessAdStatus(user_ID, body);
            if (BusinessAdDoc) {
                res.status(200).send({
                    message: "Successfully Changed Business Ad Status"
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

    static async getMyBusinessAdsByLocation(req, res, next) {
        try {
            // Premium ads are fetched from db and sent to response
            const GetBusinessAdsDocs = await BusinessAdService.GetHighLightBusinessAds(req.user_ID, req.query);
            res.status(200).json({
                data: GetBusinessAdsDocs
            });
        } catch (e) {
            errorHandler(e, res);
        };
    };

    static async getFeatureAdsBLocation(req, res, next) {
        try {
            // Premium ads are fetched from db and sent to response
            const GetBusinessAdsDocs = await BusinessAdService.GetFeatureBusinessAds(req.user_ID, req.query);
            res.status(200).json({
                data: GetBusinessAdsDocs
            });
        } catch (e) {
            errorHandler(e, res);
        };
    };

    static async repostBusinessAd(req, res, next) {
        try {
            const RepostedAd = await BusinessAdService.repostBusinessAd(req.user_ID, req.body);
            if (RepostedAd) {
                res.status(200).json({
                    message: "Successfully Reposted the Ad"
                });
            }
        } catch (e) {
            errorHandler(e, res);
        };
    };
    
    static async GetBusinessAdsAndRelatedAds(req, res, next) {
        try {
            // Related are fetched from db and sent to response
            const {FetureAndCustomised, HighLightAndPremiumAds} = await BusinessAdService.GetBusinessAdsAndRelatedAdsService( req.query,req.user_ID,req.body?.adID);
            res.status(200).json({
                    PremiumAds: HighLightAndPremiumAds,
                    FeatureAds: FetureAndCustomised,
                    TotalPremiumAds: HighLightAndPremiumAds.length,
                    TotalFeaturedAds: FetureAndCustomised.length
            });
        } catch (e) {
            errorHandler(e, res);
        };
    };

    static async getInterStatialBusinessAd(req, res, next) {
        try {
            const BusinessAdDoc = await BusinessAdService.GetInterStatialAds(req.query);
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