const HomeService = require("../../services/HomeService");

module.exports = class HomeController {
  static async apiGetHome(req, res, next) {
    try {
        console.log("Inside home Controller")
        console.log(req.query)
      const homeData = await HomeService.getHome(req.query);
      if (homeData) {
        res.status(200).send(homeData);
      }
    } catch (error) {
        console.log(error)
    }
  }
};
