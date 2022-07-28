const HomeService = require("../../services/HomeService");

module.exports = class HomeController {
  static async apiGetHome(req, res, next) {
    try {
        console.log("Inside home Controller")
        console.log(req.query)
      const homeData = await HomeService.getHome(req.query);
      if (homeData) {
        res.send({
          PremmeiumAds:homeData[0].PremiumAds,
          RecentAds:homeData[0].RecentAds,
        })
      }
    } catch (error) {
        console.log(error)
    }
  }
};
