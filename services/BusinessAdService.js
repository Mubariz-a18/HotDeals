const moment = require('moment')
const BusinessInfoModel = require("../models/Profile/BusinessDetailSchema");
const BusinessAds = require('../models/Ads/businessAdsShema');
const { expiry_date_func } = require('../utils/moment');
const { ObjectId } = require('mongodb');
const {
    ValidateBusinessBody,
    ValidateUpdateBusinessBody,
    ValidateBusinessProfile,
    ValidateChangeStatusBody
} = require('../validators/BusinessAds.Validators');
const { 
    ValidateQuery, 
    validateMongoID } = require('../validators/Ads.Validator');
const { 
    getPremiumAdsService, 
    getFeatureAdsService 
} = require('./AdService');
const { 
    BusinessAdsFunc, 
    FeaturedBusinessAdsFunc, 
    featureAdsFunction 
} = require('../utils/featureAdsUtil');
const Generic = require('../models/Ads/genericSchema');
const Profile = require('../models/Profile/Profile');
const { deductBusinessAdCredits } = require('./CreditService');


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
            redirectionUrl,
            imageUrl,
            subAds,
            duration
        } = body;
        for (let i = 0; i < primaryDetails.length; i++) {
            const adExist = await this.BusinessAd(primaryDetails[i].ad_id);
            if (adExist) {
                throw ({ status: 400, message: 'Bad Request' });
            }
            const creditObj = {
                adID: primaryDetails[i].ad_id,
                title,
                adType
            }
            const creditDeduction = await deductBusinessAdCredits(userID, creditObj)
            if (creditDeduction === "NOT_ENOUGH_CREDITS") {
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
                redirectionUrl,
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
            redirectionUrl,
            location,
            address,
            imageUrl,
            subAds,
        } = body;

        const BusinessAdDoc = await BusinessAds.updateOne({ _id: ObjectId(adID), userID: ObjectId(userID) }, {
            title,
            description,
            adType,
            location,
            redirectionUrl,
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
        if (!isBodyValid) {
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
            const adDoc = await BusinessAds.findOneAndUpdate(
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
        else if (status == "Active") {
            const adDoc = await BusinessAds.findOneAndUpdate(
                {
                    _id: adID,
                    adStatus: "Archive"
                },
                {
                    $set: {
                        adStatus: "Active",
                        updatedAt: currentDate
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
        return true;
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
                            'redirectionUrl': 1,
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
            if (BusinessAdsArray.length === 0) {
                return PremiumAdsArray
            }
            for (let i = 0; i < BusinessAdsArray.length; i++) {
                BusinessAdsArray[i].isBusinessAd = true
            }
            const adIds = BusinessAdsArray.map((ad) => ad._id);
            await BusinessAds.updateMany(
                { _id: { $in: adIds } },
                { $inc: { impressions: 1 } }
            );
            const HighlightedAds = BusinessAdsFunc(PremiumAdsArray, BusinessAdsArray);

            return HighlightedAds;

        } catch (e) {
            console.log(e)
        }
    };

    static async GetFeatureBusinessAds(userID, query) {
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
                            adType: {
                                $in: ['featured', 'customized']
                            }
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
                            'redirectionUrl': 1,
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

            for (let i = 0; i < BusinessAdsArray.length; i++) {
                BusinessAdsArray[i].isBusinessAd = true
            }
            const adIds = BusinessAdsArray.map((ad) => ad._id);
            await BusinessAds.updateMany(
                { _id: { $in: adIds } },
                { $inc: { impressions: 1 } }
            );

            const FeaturedAdsArray = await getFeatureAdsService(userID, query);
            const PremiumAdsArray = await getPremiumAdsService(userID, query);
            const featureAds = featureAdsFunction(FeaturedAdsArray, PremiumAdsArray);
            if (BusinessAdsArray.length === 0) {
                return featureAds
            }
            const FeaturedAds = FeaturedBusinessAdsFunc(featureAds, BusinessAdsArray);
            return FeaturedAds;

        } catch (e) {
            console.log(e)
        }
    };

    static async repostBusinessAd(userID, body) {

        if (!body) {
            throw ({ status: 400, message: 'Bad Request' });
        }
        const { adID } = body;
        const isIdValid = validateMongoID(adID);
        if (!isIdValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }

        const adCopy = await BusinessAds.findOne({ _id: adID, user_id: userID, adStatus: { $in: ["Delete", "Expired"] } });

        if (!adCopy) {
            throw ({ status: 400, message: 'Bad Request' });
        }

        const {
            title,
            description,
            parentID,
            adType,
            location,
            address,
            redirectionUrl,
            subAds,
            duration,
            imageUrl,
        } = adCopy

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const newID = ObjectId();
        const BusinessAdDoc = await BusinessAds.create({
            _id: newID,
            title,
            description,
            parentID,
            userID,
            adType,
            location,
            address,
            imageUrl,
            redirectionUrl,
            subAds,
            duration,
            adStatus: 'Pending',
            expireAt: expiry_date_func(duration),
            createdAt: currentDate,
            updatedAt: currentDate
        });

        if (BusinessAdDoc) {
            await BusinessInfoModel.updateOne({ userID: ObjectId(userID) }, {
                $push: {
                    businessAdList: newID
                }
            });
            return BusinessAdDoc;
        } else {
            throw ({ status: 400, message: 'Bad Request' });
        }
    };

    static async GetBusinessAdsAndRelatedAdsService(query, user_id, adId) {
        let category = query.category;
        let sub_category = query.sub_category;
        let lng = +query.lng;
        let lat = +query.lat;
        let maxDistance = 100000;
        let pageVal = +query.page;
        if (pageVal == 0) pageVal = pageVal + 1
        let limitval = +query.limit || 10;

        if (!lng || !lat) {
            throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
        }

        let RelatedAds = await Generic.aggregate([
            {
                '$geoNear': {
                    'near': {
                        'type': 'Point',
                        'coordinates': [
                            lng, lat
                        ]
                    },
                    'distanceField': 'dist.calculated',
                    'maxDistance': maxDistance,
                    'includeLocs': 'dist.location',
                    'spherical': true
                }
            },
            {
                '$lookup': {
                    'from': 'profiles',
                    'localField': 'user_id',
                    'foreignField': '_id',
                    'as': 'sample_result'
                }
            },
            {
                '$unwind': {
                    'path': '$sample_result'
                }
            },
            {
                '$addFields': {
                    'Seller_Name': '$sample_result.name',
                    'Seller_Id': '$sample_result._id',
                    'Seller_Joined': '$sample_result.created_date',
                    'Seller_Image': '$sample_result.profile_url',
                    'Seller_verified': '$sample_result.is_email_verified',
                    'Seller_recommended': '$sample_result.is_recommended',
                }
            },
            {
                '$match': {
                    'ad_status': 'Selling',
                    "$or": [
                        { "category": category },
                        { "sub_category": sub_category }
                    ],
                }
            },
            {
                $sort: {
                    "created_at": -1,
                    "dist.calculated": 1,
                }
            },
            {
                $skip: limitval * (pageVal - 1)
            },
            {
                $limit: limitval
            },
            {
                '$project': {
                    '_id': 1,
                    'parent_id': 1,
                    'category': 1,
                    'sub_category': 1,
                    'title': 1,
                    'views': 1,
                    'saved': 1,
                    'price': 1,
                    'textLanguages': 1,
                    "thumbnail_url": 1,
                    'ad_posted_address': 1,
                    'ad_status': 1,
                    'SelectFields': 1,
                    'ad_type': 1,
                    'created_at': 1,
                    'isPrime': 1,
                    'dist': 1,
                    'Seller_Name': 1,
                    'Seller_Id': 1,
                    'Seller_Joined': 1,
                    'Seller_Image': 1,
                    'Seller_verified': 1,
                    'Seller_recommended': 1
                }
            },
            {
                '$facet': {
                    'PremiumAds': [
                        {
                            '$match': {
                                'isPrime': true
                            }
                        }
                    ],
                    'RecentAds': [
                        {
                            '$match': {
                                'isPrime': false
                            }
                        }
                    ]
                }
            },
        ]);

        const isAdFavFunc = async (AdToCheck) => {
            AdToCheck.forEach(async relatedAd => {
                const user = await Profile.find(
                    {
                        _id: user_id,
                        "favourite_ads": {
                            $elemMatch: { "ad_id": relatedAd._id }
                        }
                    })
                if (user.length == 0) {
                    relatedAd.isAdFav = false
                } else {
                    relatedAd.isAdFav = true
                }
            })
        }

        await isAdFavFunc(RelatedAds[0].RecentAds)
        await isAdFavFunc(RelatedAds[0].PremiumAds)

        const featureAds = featureAdsFunction(RelatedAds[0].RecentAds, RelatedAds[0].PremiumAds);
        if (adId) {
            featureAds = featureAds.filter((ad) => {
                return ad._id.toString() !== adId;
            });
        } else {

        }
        const HighLightBusinessAdsArray = await BusinessAds.aggregate([
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
                        'redirectionUrl': 1,
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
        for (let i = 0; i < HighLightBusinessAdsArray.length; i++) {
            HighLightBusinessAdsArray[i].isBusinessAd = true
        }
        const FeaturedBusinessAdsArray = await BusinessAds.aggregate([
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
                        adType: {
                            $in: ['featured', 'customized']
                        }
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
                        'redirectionUrl': 1,
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
        for (let i = 0; i < FeaturedBusinessAdsArray.length; i++) {
            FeaturedBusinessAdsArray[i].isBusinessAd = true
        }

        const HighLightAndPremiumAds = BusinessAdsFunc(RelatedAds[0].PremiumAds, HighLightBusinessAdsArray);
        const FetureAndCustomised = FeaturedBusinessAdsFunc(featureAds, FeaturedBusinessAdsArray)

        return { HighLightAndPremiumAds, FetureAndCustomised }
    };

    static async GetInterStatialAds(query) {
        const isQueryValid = ValidateQuery(query);
        if (!isQueryValid) {
            throw ({ status: 400, message: 'Bad Request' });
        }
        let lng = +query.lng;
        let lat = +query.lat;
        let maxDistance = +query.maxDistance;
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
                        adType: "interstitial"
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
                        'redirectionUrl': 1,
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
                }
            ]
        ]);
        if (BusinessAdsArray.length === 0) {
            throw ({ status: 404, message: 'No Ads Found' });
        }
        const RandomAdIndex = Math.floor(Math.random() * BusinessAdsArray.length);
        await BusinessAds.updateOne(
            { _id: { $in: BusinessAdsArray[RandomAdIndex]['_id'] } },
            { $inc: { impressions: 1 } }
        );
        return BusinessAdsArray[RandomAdIndex]
    };
}