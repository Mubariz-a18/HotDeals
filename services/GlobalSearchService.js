// const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");
const Generic = require("../models/Ads/genericSchema");
const { currentDate } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");
const ObjectId = require('mongodb').ObjectId;

module.exports = class GlobalSearchService {
    // api get global search 
    static async getGlobalSearch(queries, user_ID) {
        const { keyword } = queries;
        const userExist = await Profile.findOne({ _id: user_ID })
        if (!userExist) {
            // mixpanel - track blobal search failed 
            await track('failed -- Global search  ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            throw ({ status: 404, message: 'USER_NOT_EXISTS' });
        } else {
            const result = await Generic.find({
                $text: { $search: `${keyword}` },
            })
            await track('Global search  success !! ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            return result
        }
    };

    static async createAnalyticsKeyword(result, queries, user_ID) {
        const { keyword } = queries;
        const alreadyExist = await Analytics.findOne({
            user_id: (user_ID),
        });
        if (result.length == 0) {
            // mixpanel track keyword saved !!
            await track('Global search keywords saved  ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            if (alreadyExist) {
                const updateAnalytics = await Analytics.findOneAndUpdate({ user_id: user_ID }, {
                    $push: {
                        keywords: {
                            createdDate: currentDate,
                            values: keyword,
                            result: "Ad not found"
                        }
                    }
                });
                return updateAnalytics
            }
            else {
                const createAnalytics = await Analytics.create({
                    user_id: ObjectId(user_ID),
                    keywords: {
                        createdDate: currentDate,
                        values: keyword,
                        result: "Ad not found"
                    }
                });
                return createAnalytics
            }
        }
        else {
            if (alreadyExist) {
                // mixpanel track keyword saved !!
                await track('Global search keywords saved  ', {
                    distinct_id: user_ID,
                    keywords: keyword
                });
                const updateAnalytics = await Analytics.findOneAndUpdate({ user_id: ObjectId(user_ID) }, {
                    $push: {
                        keywords: {
                            createdDate: currentDate,
                            values: keyword,
                            result: "Ad found"
                        }
                    }
                });
                return updateAnalytics
            }
            else {
                const createAnalytics = await Analytics.create({
                    user_id: user_ID,
                    keywords: {
                        createdDate: currentDate,
                        values: keyword,
                        result: "Ad found"
                    }
                });
                return createAnalytics
            }
        }
    }
};
