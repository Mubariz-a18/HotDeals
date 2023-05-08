const moment = require('moment')
const BusinessInfoModel = require("../models/Profile/BusinessDetailSchema");
const BusinessAds = require('../models/Ads/businessAdsShema');
const { expiry_date_func } = require('../utils/moment');
const { ObjectId } = require('mongodb');

module.exports = class BusinessAdService {

    static async BusinessProfile(userID) {
        try {
            return await BusinessInfoModel.findOne({ userID: userID });
        } catch (e) {
            throw ({ status: 404, message: 'Bad Request' });
        }
    };

    static async BusinessAd(adID) {
        try {
            return await BusinessAds.findOne({ _id: adID });
        } catch (e) {
            throw ({ status: 404, message: 'Bad Request' });
        }
    };

    static async updateBusinessAd(adID, body) {
        try {
            return await BusinessAds.updateOne({ _id: adID }, {
                $set: body
            });
        } catch (e) {
            throw ({ status: 404, message: 'Bad Request' });
        }
    };

    static async updateBusinessProfile(userID, body) {
        try {
            return await BusinessInfoModel.updateOne({ userID: userID }, {
                $set: body
            });
        } catch (e) {
            throw ({ status: 404, message: 'Bad Request' });
        }
    }

    static async createBusinessProfileService(userID, body) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            name,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl,
        } = body;

        const BusinessPofileDoc = await BusinessInfoModel.create({
            name,
            userID,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl,
            createdAt: currentDate,
            updatedAt: currentDate
        })
        return BusinessPofileDoc;
    };

    static async updateBusinesProfileService(userID, body) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            name,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl
        } = body;

        const bodyData = {
            name,
            address,
            phoneNumber,
            description,
            businessUrl,
            certificateUrl,
            updatedAt: currentDate
        }

        const UpdateProfileDoc = await this.updateBusinessProfile(userID, bodyData);
        if (UpdateProfileDoc.modifiedCount === 1 || UpdateProfileDoc.matchedCount === 1) {
            return true
        } else {
            throw ({ status: 404, message: 'Bad Request' });
        }
    }

    static async createBusinessAdService(userID, body) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            title,
            description,
            adType,
            location,
            address,
            imageUrl,
            subAds,
            duration
        } = body;

        const BusinessAdDoc = await BusinessAds.create({
            title,
            description,
            userID,
            adType,
            location,
            address,
            imageUrl,
            subAds,
            duration,
            adStatus: 'Pending',
            expireAt: expiry_date_func(duration),
            createdAt: currentDate,
            updatedAt: currentDate
        });

        const adID = BusinessAdDoc._id;
        await BusinessInfoModel.updateOne({ userID: ObjectId(userID) }, {
            $push: {
                businessAdList: adID
            }
        });

        return BusinessAdDoc;
    };

    static async updateBusinessAdService(userID, body) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            adID,
            title,
            description,
            adType,
            location,
            address,
            imageUrl,
            subAds,
        } = body;

        const BusinessAdDoc = await BusinessAds.updateOne({ _id: adID, userID: userID }, {
            title,
            description,
            adType,
            location,
            address,
            imageUrl,
            subAds,
            adStatus: 'Pending',
            updatedAt: currentDate
        });
        if (BusinessAdDoc.modifiedCount === 1) {
            return true
        } else {
            throw ({ status: 404, message: 'Bad Request' });
        }
    };

    static async getMyBusinessAdsService(userID) {
        const BusinessPofileDoc = await this.BusinessProfile(userID);
        const MyBusinessAds = await BusinessAds.aggregate([
            {
                $match: {
                    _id: {
                        $in: BusinessPofileDoc.businessAdList
                    }
                },
            },
            {
                $facet: {
                    "Active": [
                        {
                            $match: {
                                adStatus: "Active"
                            }
                        }
                    ],
                    "Pending": [
                        {
                            $match: {
                                adStatus: "Pending"
                            }
                        }
                    ],
                    "Archived": [
                        {
                            $match: {
                                adStatus: "Archived"
                            }
                        }
                    ],
                    "Suspended": [
                        {
                            $match: {
                                adStatus: "Suspended"
                            }
                        }
                    ],
                    "Deleted": [
                        {
                            $match: {
                                adStatus: "Deleted"
                            }
                        }
                    ],
                    "Expired": [
                        {
                            $match: {
                                adStatus: "Expired"
                            }
                        }
                    ],
                }
            }
        ]);

        return MyBusinessAds;
    };

    static async GetParticularBusinessAd(body) {
        const { adID } = body;
        const BusinessAdDoc = await this.BusinessAd(adID);
        if (BusinessAdDoc) {
            await BusinessAds.updateOne({ _id: adID }, {
                $inc: {
                    clicks: 1
                }
            })
        }
        if (!BusinessAdDoc) {
            throw ({ status: 404, message: 'Bad Request' });
        }
        return BusinessAdDoc;
    };
}