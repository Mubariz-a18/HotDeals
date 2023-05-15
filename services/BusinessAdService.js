const moment = require('moment')
const BusinessInfoModel = require("../models/Profile/BusinessDetailSchema");
const BusinessAds = require('../models/Ads/businessAdsShema');
const { expiry_date_func } = require('../utils/moment');
const { ObjectId } = require('mongodb');
const { ValidateBusinessBody, ValidateUpdateBusinessBody, ValidateBusinessProfile, ValidateChangeStatusBody } = require('../validators/BusinessAds.Validators');
const { ValidateQuery } = require('../validators/Ads.Validator');
const { getPremiumAdsService } = require('./AdService');
const { BusinessAdsFunc } = require('../utils/featureAdsUtil');


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
        const isCreateBusinessProfileValid = ValidateBusinessProfile(body);
        if (!isCreateBusinessProfileValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }
        const isBusinessOwner = await this.BusinessProfile(userID);
        if (isBusinessOwner) {
            throw ({ status: 400, message: 'You Already Have a Business Account' });
        }
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
        if (BusinessPofileDoc) {
            return BusinessPofileDoc;
        }
        else throw ({ status: 400, message: 'Bad Request' });
    };

    static async updateBusinesProfileService(userID, body) {
        const isCreateBusinessProfileValid = ValidateBusinessProfile(body);
        if (!isCreateBusinessProfileValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }
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
    };

    static async createBusinessAdService(userID, body) {
        const isCreateBusinessAdValid = ValidateBusinessBody(body);
        if (!isCreateBusinessAdValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const {
            parentID,
            title,
            description,
            adType,
            primaryDetails,
            imageUrl,
            subAds,
            duration
        } = body;
        for (let i = 0; i < primaryDetails.length; i++) {
            const adExist = await this.BusinessAd(primaryDetails[i].ad_id);
            if (adExist) {
                throw ({ status: 400, message: 'Bad Request' });
            }
            const BusinessAdDoc = await BusinessAds.create({
                _id: primaryDetails[i].ad_id,
                title,
                description,
                parentID,
                userID,
                adType,
                location: primaryDetails[i].location,
                address: primaryDetails[i].address,
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
        }

        return true;
    };

    static async updateBusinessAdService(userID, body) {
        const isUpdateBusinessAdValid = ValidateUpdateBusinessBody(body);
        if (!isUpdateBusinessAdValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }
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
            throw ({ status: 400, message: 'Bad Request' });
        }
    };

    static async updateBusinessAdStatus(userID, body) {
        const isBodyValid = ValidateChangeStatusBody(body); 
        if(!isBodyValid){
            throw ({ status: 400, message: 'Bad Request' }); 
        }
        const {
            adID,
            status
        } = body
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const findAd = await BusinessAds.findOne({
            _id: adID,
            user_id: ObjectId(userID),
            adStatus: {
                $ne: "Suspended"
            }
        });

        if (!findAd) {
            throw ({ status: 401, message: 'Access_Denied' });
        }

        if (status == "Archive") {
            const adDoc = await BusinessAds.findOneAndUpdate(
                {
                    _id: adID,
                    adStatus: "Active"
                },
                {
                    $set: {
                        adStatus: "Archive",
                        archivedAt: currentDate
                    }
                },
                { returnOriginal: false, new: true }
            )
            if (!adDoc) {
                throw ({ status: 401, message: 'Access_Denied' });
            }
            return adDoc;
        }
        else if (status == "Delete") {
            const adDoc = await BusinessAds.findByIdAndUpdate(
                {
                    _id: adID
                },
                {
                    $set: {
                        adStatus: "Delete",
                        deletedAt: currentDate
                    }
                },
                { returnOriginal: false, new: true }
            );
            if (!adDoc) {
                throw ({ status: 401, message: 'Access_Denied' });
            }
            return adDoc;
        }
        else {
            throw ({ status: 400, message: 'Bad Request' });
        }
    };

    static async getMyBusinessAdsService(userID) {
        const BusinessPofileDoc = await this.BusinessProfile(userID)
        if (!BusinessPofileDoc) {
            throw ({ status: 401, message: 'Unauthorized' });
        }
        console.log(BusinessPofileDoc.businessAdList)
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
                                adStatus: "Archive"
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
                                adStatus: "Delete"
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

    static async GetHighLightBusinessAds(userID, query) {
        try {
            const isQueryValid = ValidateQuery(query);
            if (!isQueryValid) {
                throw ({ status: 400, message: 'Bad Request' });
            }

            let lng = +query.lng;
            let lat = +query.lat;
            let maxDistance = +query.maxDistance;
            let pageVal = +query.page;
            if (pageVal == 0) pageVal = pageVal + 1
            let limitval = +query.limit || 25;
            const BusinessAdsArray = await BusinessAds.aggregate([
                [
                    {
                        '$geoNear': {
                            'near': { type: 'Point', coordinates: [lng, lat] },
                            "distanceField": "dist.calculated",
                            'maxDistance': maxDistance,
                            "includeLocs": "dist.location",
                            'spherical': true
                        }
                    },
                    {
                        $match: {
                            adStatus: "Active",
                            adType: 'highlighted'
                        }
                    },
                    {
                        '$project': {
                            '_id': 1,
                            'parentID': 1,
                            'userID': 1,
                            'adStatus': 1,
                            'title': 1,
                            'description': 1,
                            "adType": 1,
                            'price': 1,
                            "imageUrl": 1,
                            'translateText': 1,
                            'subAds': 1,
                            "dist": 1,
                            "createdAt": 1
                        }
                    },
                    {
                        $sort: {
                            "createdAt": -1,
                            "dist.calculated": -1
                        }
                    },
                    {
                        $skip: limitval * (pageVal - 1)
                    },
                    {
                        $limit: limitval
                    },
                ]
            ]);

            const PremiumAdsArray = await getPremiumAdsService(userID, query)

            // const Highlighted = 

            if (BusinessAdsArray.length === 0 && PremiumAds.length === 0) {
                throw ({ status: 204, message: '' });
            }
            const HighlightedAds = BusinessAdsFunc(PremiumAdsArray, BusinessAdsArray);

            return HighlightedAds

        } catch (e) {
            console.log(e)
        }
    };
}