const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");

module.exports = class GlobalSearchService {
    static async getGlobalSearch(seachKeyword1, seachKeyword2, user_ID) {

        const result = await GlobalSearch.find({
            $text: { $search: `${seachKeyword1},${seachKeyword2}` },
        });
        return result;
        
        // const result = await GlobalSearch.find({
        //     $text: { $search: `${seachKeyword1},${seachKeyword2}` },
        // });
        // return result;
    }

    static async createAnalyticsKeyword(seachKeyword1, seachKeyword2, user_ID) {
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
        }
    }
};
