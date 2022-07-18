const AdService = require("../../services/AdService");

module.exports = class AdController {
  static async apiCreateAd(req, res, next) {
    try {
      console.log(req.body)
      const adDocument = await AdService.createAd(req.body);
      res.status(200).send({
        message: "Ad Successfully created!",
        statusCode: 200,
        Ad: adDocument,
      });
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in creating the Ad" });
    }
  }

  static async apiGetMyAds(req, res, next) {
    try {
      const getDocument = await AdService.getMyAds(req.user_ID);
      if (getDocument) {
        res.status(200).send({
          message: "success!",
          MyAds: getDocument,
        });
      }
      else {
        res.status(400).send("No Ads!!");
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in creating the Ad" });
    }
  }

  static async apiChangeAdStatus(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const updatedDoc = await AdService.changeAdStatus(req.body, req.user_ID, ad_id)
      // console.log(updatedDoc)
    } catch (error) {

    }
  }

  static async apiFavouriteAds(req, res, next) {
    try {
      const favAds = AdService.favouriteAds(req.body, req.user_ID);
      if (favAds) {
        res.send({
          message: "Success",
          statusCode: 200
        })
      }
      else {
        res.send({
          message: "Ad Not Found",
          statusCode: 400
        })
      }
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong!!" });
    }
  }
};
