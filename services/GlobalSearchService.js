const GlobalSearch = require("../models/GlobalSearch");
const Analytics = require("../models/Analytics");
const { track } = require("./mixpanel-service");
const Generic = require("../models/Ads/genericSchema");
const { currentDate } = require("../utils/moment");

module.exports = class GlobalSearchService {
    static async getGlobalSearch(queries, user_ID) {
        const {category ,sub_category , title , description } = queries;
        try{
            
            // const result = await GlobalSearch.find({
            //     $text: { $search: `${category},${sub_category},${title},${description}` },
            // });
            const result = await Generic.find({
                    $text: { $search: `${category},${sub_category},${title},${description}` },
                })

                await track('Global search  ', { 
                    distinct_id : user_ID,
                    keywords: [category, sub_category,title,description]
                  });

                if(result){
                    updateAnalytics = await Analytics.findByIdAndUpdate({user_id:user_ID},{
                        $push :{
                            "keywords.$.result":"found",
                            createdDate:currentDate
                        }
                    })
                }else{
                    updateAnalytics = await Analytics.findByIdAndUpdate({user_id:user_ID},{
                        $push :{
                            "keywords.$.result":"not found",
                            createdDate:currentDate
                        }
                    })
                }
                console.log(result)
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
        const searched = queries;
        console.log(searched , "............")
        try{
            const User = await Analytics.findOne({
                user_id: user_ID,
            });
            if (User) {
                await User.keywords.values.push(searched);
                await User.save();
            } else {
                const createAnalytics = await Analytics.create({
                    user_id: user_ID,
                    keywords: {
                        values : searched
                    }
                });
                await track('Global search keywords saved  ', { 
                    distinct_id : user_ID,
                    keywords: searched
                  });
            }
        }
     catch(e) {
        await track('failed -- Global search keywords saved  ', { 
            distinct_id : user_ID,
            keywords: searched
          });
    }}
};
