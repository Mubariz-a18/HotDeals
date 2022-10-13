const HomeService = require("../../services/HomeService");

module.exports = class HomeController {

  // Get Home
  
  static async apiGetHome(req, res, next) {
    try {
      const page = +req.query.page;
      const limit = +req.query.limit ;
      const homeData = await HomeService.getHome(req.query , page , limit);
      console.log(homeData[0]["PremiumAds"].length)
      if (homeData) {
        res.status(200).json([
        { TotalPremiumAds: homeData[0]["PremiumAds"].length ,
          PremiumAds: homeData[0]["PremiumAds"],},

        {TotalRecentAds :homeData[0]["RecentAds"].length,
          RecentAds :homeData[0]["RecentAds"]}
        ])
      }
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
};

