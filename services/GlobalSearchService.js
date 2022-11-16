// const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");
const Generic = require("../models/Ads/genericSchema");
const { currentDate } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");
const GlobalSearch = require("../models/GlobalSearch");
const ObjectId = require('mongodb').ObjectId;

module.exports = class GlobalSearchService {

    static async   createGlobalSearch(body){
    //Create new Ad in GlobalSearch Model 
        const {adId,category,sub_category,title,description} = body
        console.log([category,sub_category,title,description].join(' '))
        const createGlobalSearch = await GlobalSearch.create({
            ad_id: adId,
            Keyword:[category,sub_category,title,description].join(' ')
        });
    // Mixpanel track for global Search Keywords
    await track('global search keywords', {
        category: category,
        distinct_id: createGlobalSearch._id,
        keywords: [category, sub_category, title, description]
      });
    } 

    // api get global search 
    static async getGlobalSearch(queries, user_ID) {
        const { keyword } = queries;
        // check if user exist 
        const userExist = await Profile.findOne({ _id: user_ID })
        // if not exist throw error
        if (!userExist) {
            // mixpanel - track blobal search failed 
            await track('failed -- Global search  ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            throw ({ status: 404, message: 'USER_NOT_EXISTS' });
        } else {
            //if user exist find ads using $search and $text
            const result = await Generic.find({
                $text: { $search: `${keyword}` },
            })
            // mix panel track for Global search api
            await track('Global search  success !! ', {
                distinct_id: user_ID,
                keywords: keyword
            });
            return result
        }
    };
    // Api create Analytics keywords
    static async createAnalyticsKeyword(result, queries, user_ID) {
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
    }
};
