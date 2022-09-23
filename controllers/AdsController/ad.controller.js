const AdService = require("../../services/AdService");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      console.log("this is the request");
      console.log(req)
      const adDocument = await AdService.createAd(req.body, req.user_ID);
      // response code is send 
      res.status(200).send({
        message: "Ad Successfully created!",
        statusCode: 200,
        Ad: adDocument,
      });
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ error: "Something went wrong in create Ad API!!" });
    }
  }

  // Get Ads -- Ads are Fetched and Returned from Adservice 
  static async apiGetMyAds(req, res, next) {
    try {
      const getDocument = await AdService.getMyAds(req.user_ID);
      // Response code is send 
      if (getDocument) {
        res.status(200).send({
          message: "success!",
          Selling: getDocument[0].Selling,
          Archived: getDocument[0].Archived,
          Drafts: getDocument[0].Drafts
        });
      }
      else {
        res.send({
          "message": "No  Ads Found!",
          "statusCode": 400,
        })
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in Get My ADS API!!" });
    }
  }

  // Get Favourite Ads -- Ads are fetched and returned from Adservice 
  static async apiGetFavouriteAds(req, res, next) {
    try {
      console.log("Inside Get Favourite Ads Controller");
      const getFavDocs = await AdService.getFavouriteAds(req.user_ID);
      // Response code is sent 
      if (getFavDocs) {
        res.send({
          "message": "success",
          "statusCode": 200,
          "FavoriteAds": getFavDocs
        })
      }
      else {
        res.send({
          "message": "No Favourite Ads Found!",
          "statusCode": 400,
        })
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in Getting Favourite ADS API!!" });
    }
  }

  // Update  Ads Status -- Ads are Updated  and returned from Adservice to updatedDoc
  static async apiChangeAdStatus(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const body = req.body;
      const userId = req.user_ID;
      const updatedDoc = await AdService.changeAdStatus(body, userId, ad_id);
      // Reponse code is sent 
      if (updatedDoc) {
        res.send({
          statusCode: 200,
          updatedAd: updatedDoc
        })
      }
      else {
        res.send({
          "message": "Unable to change ad status!",
          "statusCode": 400,
        })
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something went wrong in changing the status of AD API!!" });
    }
  }
  // Get Favourite Ads-- Ads are fetched  and returned from Adservice to favads
  static async apiFavouriteAds(req, res, next) {
    try {
      const adID = req.body.ad_id;
      const favAds = AdService.favouriteAds(req.body, req.user_ID, adID);
      if (favAds) {
        res.send({
          message: "Success",
          statusCode: 200
        })
      }
      // Reponse code is sent 
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

  // Delete Ads -- Ads are Deleted  and returned from Adservice to deleteAds
  static async apiDeleteAds(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      console.log(ad_id)
      const deleteAd = await AdService.deleteAds(req.body, req.user_ID, ad_id);
      // Reponse code is sent 
      if (deleteAd) {
        res.send({
          message: 'Ad deleted successfully',
          statusCode: 200
        })
      }
      else {
        res.send({
          message: "Something went wrong in deleting Ad API"
        })
      }
    } catch (error) {
      res.send({
        error: error.message
      })
    }
  }

  // Get Ad details -- Ad is Fetched   and returned from Adservice to getAdDetails
  static async apiGetParticularAdDetails(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const getAdDetails = await AdService.getAdDetails(req.body, req.user_ID, ad_id);
      // Response is sent 
      if (getAdDetails) {
        res.send({
          message: "success",
          statusCode: 200,
          AdDetails: getAdDetails
        })
      }
    } catch (error) {

    }
  }
};
