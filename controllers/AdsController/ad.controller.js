const { getAdDetails } = require("../../services/AdService");
const AdService = require("../../services/AdService");
const ErrorHandler = require("../../utils/ErrorHandler");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      console.log("this is the request");
      const adDocument = await AdService.createAd(req.body, req.user_ID);
      // response code is send 
      if(adDocument){
        res.status(200).send({
          message: "Ad Successfully created!",
          statusCode: 200,
          Ad: adDocument,
        });  
      }
      
    } catch (error) {
      res.status(400)
        .json({
          message: "Something went Wrong try again "
        });
    }
  }

  // Get Ads -- Ads are Fetched and Returned from Adservice 
  static async apiGetMyAds(req, res, next) {
    try {
      const getDocument = await AdService.getMyAds(req.user_ID);
      console.log(getDocument)
      // Response code is send 
      if (!getDocument.message) {
        res.status(200).send({
          message: "success!",
          Selling: getDocument[0].Selling,
          Archived: getDocument[0].Archived,
          Drafts: getDocument[0].Drafts
        });
      }
      else {
        res.status(400).send({
          message:getDocument.message
        })
      }
    } catch (error) {
      res.status(400)
        .json({
          message: "Something went Wrong try again "
        });
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
      const { type, message, statusCode} = await AdService.deleteAds(req.body, req.user_ID, ad_id);
      // Reponse code is sent 
      if (type == "sucesss") {
        res.status(statusCode).send({
          message
        })
      }
      else {
        res.status(statusCode).send(
          {
            message,
          }
        )
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
      const { type, findAd, message, statusCode } = await AdService.getAdDetails(req.body, req.user_ID, ad_id);
      // Response is sent 
      if (type == "success") {
        res.send({
          message: "success",
          statusCode: 200,
          AdDetails: findAd
        })
      }else if(type == "Error"){
        res.status(statusCode).send({
          message })
      }
    } catch (error) {
      res.status(500).send({
        message:"something gone wrong try again"
      })
    }
  }
};
