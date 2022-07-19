const AdService = require("../../services/AdService");

module.exports = class AdController {
  static async apiCreateAd(req, res, next) {
    try {
      console.log(req.body)
      const adDocument = await AdService.createAd(req.body,req.user_ID);
      res.status(200).send({
        message: "Ad Successfully created!",
        statusCode: 200,
        Ad: adDocument,
      });
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong in create Ad API!!" });
    }
  }

  static async apiGetMyAds(req, res, next) {
    try {
      const getDocument = await AdService.getMyAds(req.user_ID);
      if (getDocument) {
        res.status(200).send({
          message: "success!",
          Selling:getDocument[0].Selling,
          Archived:getDocument[0].Archived,
          Drafts:getDocument[0].Drafts
        });
      }
      else {
        res.send({
          "message":"No  Ads Found!",
          "statusCode":400,
        })
      }
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong in Get My ADS API!!" });
    }
  }

  static async apiGetFavouriteAds(req,res,next){
    try {
      console.log("Inside Get Favourite Ads Controller");
      const getFavDocs = await AdService.getFavouriteAds(req.user_ID);
      if(getFavDocs){
        res.send({
          "message":"success",
          "statusCode":200,
          "FavoriteAds":getFavDocs
        })
      }
      else{
        res.send({
          "message":"No Favourite Ads Found!",
          "statusCode":400,
        })
      }
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong in Getting Favourite ADS API!!" });
    }
  }

  static async apiChangeAdStatus(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const updatedDoc = await AdService.changeAdStatus(req.body, req.user_ID, ad_id);
      if(updatedDoc){
        res.send({
          statusCode:200,
          updatedAd:updatedDoc
        })
      }
      else{
        res.send({
          "message":"Unable to change ad status!",
          "statusCode":400,
        })
      }
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong in changing the status of AD API!!" });
    }
  }

  static async apiFavouriteAds(req, res, next) {
    try {
      const adID = req.body.ad_id;
      const favAds = AdService.favouriteAds(req.body, req.user_ID,adID);
      if (favAds) {
        res.send({
          message: "Success",
          statusCode: 200
        })
      }
      else {
        res.send({
          message: "Unable to make Favourite ",
          statusCode: 400
        })
      }
    } catch (error) {
      res
      .status(400)
      .json({ error: "Something went wrong in making the ads as favourite API!!" });
    }
  }
};
