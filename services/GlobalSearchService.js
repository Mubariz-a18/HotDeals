// const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");
const Generic = require("../models/Ads/genericSchema");
const GlobalSearch = require("../models/GlobalSearch");
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const UtilModel = require("../models/utilValuesSchema");
module.exports = class GlobalSearchService {

    static async createGlobalSearch(body) {
        //Create new Ad in GlobalSearch Model 
        const {
            ad_id,
            category,
            sub_category,
            title,
            description,
            ad_posted_address,
            ad_posted_location,
            SelectFields } = body
        const {
            Condition,
            Brand,
            Color } = SelectFields
        const createGlobalSearch = await GlobalSearch.create({
            ad_id: ad_id,
            ad_posted_location: ad_posted_location,
            Keyword: [
                category,
                sub_category,
                title,
                description,
                ad_posted_address,
                Condition,
                Brand,
                Color].join(' ')
        });
        // Mixpanel track for global Search Keywords
        await track('global search keywords', {
            category: category,
            distinct_id: createGlobalSearch._id,
            keywords: [category, sub_category, title, description]
        });
    };

    // api get global search 
    static async getGlobalSearch(queries, user_id) {
        let lng = +queries.lng;
        let lat = +queries.lat;
        const UtilValues = await UtilModel.findOne();
        let maxDistance = UtilValues.maxDistance;
        const { keyword } = queries;
        if (!keyword) {
            throw ({ status: 400, message: "Keyword is required" })
        }
        //if user exist find ads using $search and $text
        // const result = await GlobalSearch.aggregate([
        //     {
        //         $search: {
        //             "index": "Global_search_Index",
        //             "compound": {
        //                 "filter": {
        //                     "geoWithin": {
        //                         "circle": {
        //                             "center": {
        //                                 "type": "Point",
        //                                 "coordinates": [lng, lat]
        //                             },
        //                             "radius": maxDistance,
        //                         },
        //                         "path": "ad_posted_location"
        //                     },
        //                 },
        //                 "must": {
        //                     "autocomplete": {
        //                         "query": keyword,
        //                         "path": "Keyword"
        //                     }
        //                 }
        //             }
        //         }
        //     },
        //     {
        //         $project: {
        //             ad_id: 1,
        //             Keyword: 1,
        //             ad_posted_location: 1,
        //             "score": { "$meta": "searchScore" }
        //         }
        //     }]
        // );

        // let GenericAds = [];
        // result.forEach(item => {
        //     GenericAds.push(item.ad_id)
        // })
        // const searched_ads = await Generic.find({ _id: GenericAds, ad_status: "Selling" }, {
        //     _id: 1,
        //     title: 1,
        //     thumbnail_url: 1,
        //     parent_id: 1,
        //     textLanguages: 1,
        //     price: 1,
        //     created_at: 1,
        //     isPrime: -1
        // }).sort({ isPrime: -1, created_at: -1 })

        const globalSearchResult = await Generic.aggregate([
            {
                $search: {
                    'index': "generic_search_index",
                    "compound": {
                        "filter": {
                            "geoWithin": {
                                "circle": {
                                    "center": {
                                        "type": "Point",
                                        "coordinates": [lng, lat]
                                    },
                                    "radius": maxDistance,
                                },
                                "path": "ad_posted_location"
                            },
                        },
                        "must": {
                            "autocomplete": {
                                "query": keyword,
                                "path": "keywordList"
                            }
                        }
                    }
                },
            },
            {
                $match: {
                    ad_status: "Selling"
                }
            },
                {
                    $group: {
                        _id: '$parent_id',
                        doc: { $first: '$$ROOT' }
                    }
                },
                { $replaceRoot: { newRoot: '$doc' } },
            {
                $sort: {
                    isPrime: -1,
                    created_at: -1
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    thumbnail_url: 1,
                    parent_id: 1,
                    textLanguages: 1,
                    price: 1,
                    created_at: 1,
                    isPrime: -1
                }

            }
        ]);


        // mix panel track for Global search api
        await track('Global search  success !! ', {
            distinct_id: user_id || "",
            keywords: keyword
        });
        return globalSearchResult
    };

    // Api create Analytics keywords
    static async createAnalyticsKeyword(result, queries, user_ID) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const { keyword } = queries;
        //check if any analytics already exist with input keywords 
        const alreadyExist = await Analytics.findOne({
            user_id: (user_ID),
        });
        //if global search doesnot show ads keywords are saved in analytics
        if (result.length == 0) {
            // mixpanel track keyword saved !!
            await track('Global search keywords saved  ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            if (alreadyExist) {
                //if analytics doc already exist for a certian user , save other analytics in the same array 
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
                //else create another analytic doc
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
            //if global search shows ads , still save the keywords in analytcs
            if (alreadyExist) {
                // mixpanel track keyword saved !!
                await track('Global search keywords saved  ', {
                    distinct_id: user_ID,
                    keywords: keyword
                });
                // updating analytics for the particular user -- if exist
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
                // else create another analytics doc
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
    };

    // api Create Analytics for Non Users
    static async createAnalyticsForNonUsers(result, queries) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const { keyword } = queries;
        if (result.length == 0) {
            const createAnalytics = await Analytics.create({
                keywords: {
                    createdDate: currentDate,
                    values: keyword,
                    result: "Ad not found"
                }
            });
            return createAnalytics
        }
        else {
            const createAnalytics = await Analytics.create({
                keywords: {
                    createdDate: currentDate,
                    values: keyword,
                    result: "Ad found"
                }
            });
            return createAnalytics
        }
    };

    static async getAutoSuggestion(keyword) {
        if (!keyword || keyword.length < 3) {
            throw ({ status: 400, message: "Keyword of atleast 3 letter is required" })
        }
        const result = await Generic.aggregate([
            {
                $search: {
                    'index': "generic_search_index",
                    "autocomplete": {
                        "query": keyword,
                        "path": "keywordList"
                    }
                }
            },
            {
                $project: { "keywordList": 1 }

            }
        ])
        let suggestions = []
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result[i].keywordList.length; j++) {
                if (result[i].keywordList[j].toLowerCase().includes(keyword.toLowerCase())) {
                    suggestions.push(result[i].keywordList[j])
                }
            }
        }
        function removeDuplicates(arr) {
            return [...new Set(arr)];
        }

        return removeDuplicates(suggestions)
    };
};
