const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");

module.exports = class GlobalSearchService {
    static async getGlobalSearch(seachKeyword1, seachKeyword2, user_ID) {
        try{
            const result = await GlobalSearch.find({
                $text: { $search: `${seachKeyword1},${seachKeyword2}` },
            });
            await track('Global search  ', { 
                distinct_id : user_ID,
                keywords: [seachKeyword1, seachKeyword2]
              });
            return result;
        }catch (e) {
            // mixpanel - track blobal search failed 
            await track('failed -- Global search  ', { 
                distinct_id : user_ID,
                keywords: [seachKeyword1, seachKeyword2]
              });
        }       
    }

    static async createAnalyticsKeyword(seachKeyword1, seachKeyword2, user_ID) {
        try{
            const User = await Analytics.findOne({
                user_id: user_ID,
            });
            if (User) {
                await User.keywords.push(seachKeyword1, seachKeyword2);
                await User.save();
            } else {
                const createAnalytics = await Analytics.create({
                    user_id: user_ID,
                    keywords: [seachKeyword1, seachKeyword2],
                });
                await track('Global search keywords saved  ', { 
                    distinct_id : user_ID,
                    keywords: [seachKeyword1, seachKeyword2]
                  });
            }
        }
     catch(e) {
        await track('failed -- Global search keywords saved  ', { 
            distinct_id : user_ID,
            keywords: [seachKeyword1, seachKeyword2]
          });
    }}
};
