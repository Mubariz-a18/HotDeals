const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");

module.exports = class GlobalSearchService {
    static async getGlobalSearch(queries, user_ID) {
        try{
            const {category ,sub_category , title , description } = queries
            const result = await GlobalSearch.find({
                $text: { $search: `${category},${sub_category},${title},${description}` },
            });
            await track('Global search  ', { 
                distinct_id : user_ID,
                keywords: [category, sub_category,title,description]
              });
            return result;
        }catch (e) {
            // mixpanel - track blobal search failed 
            await track('failed -- Global search  ', { 
                distinct_id : user_ID,
                keywords: [category, sub_category,title,description]
              });
        }       
    }

    static async createAnalyticsKeyword(queries, user_ID) {
        try{
            const User = await Analytics.findOne({
                user_id: user_ID,
            });
            if (User) {
                await User.keywords.push(category, sub_category,title,description);
                await User.save();
            } else {
                const createAnalytics = await Analytics.create({
                    user_id: user_ID,
                    keywords: [category, sub_category,title,description],
                });
                await track('Global search keywords saved  ', { 
                    distinct_id : user_ID,
                    keywords: [category, sub_category,title,description]
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
