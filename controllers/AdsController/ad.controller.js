const AdService = require("../../services/AdService");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      const adDocument = await AdService.createAd(req.body, req.user_ID);
      // response code is send 
        res.status(200).send({
          message: "Ad Successfully created!",
          statusCode: 200,
          Ad: adDocument,
      })
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

  // Get Ads -- Ads are Fetched and Returned from Adservice 
  static async apiGetMyAds(req, res, next) {
    try {
      const getDocument = await AdService.getMyAds(req.user_ID);
      console.log(getDocument)
      // Response code is send 
        res.status(200).send({
          message: "success!",
          Selling: getDocument[0].Selling,
          Archived: getDocument[0].Archived,
          Drafts: getDocument[0].Drafts
        });
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

  // Update  Ads Status -- Ads are Updated  and returned from Adservice to updatedDoc
  static async apiChangeAdStatus(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const body = req.body;
      const userId = req.user_ID;
      const updatedAd = await AdService.changeAdStatus(body, userId, ad_id);
      // Reponse code is sent
      res.status(200).json({ data: updatedAd })
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
  };

  // Get Favourite Ads-- Ads are fetched  and returned from Adservice to favads
  static async apiFavouriteAds(req, res, next) {
    try {
      const adID = req.body.ad_id;
      const { type, findAd, message, statusCode } = await AdService.favouriteAds(req.body, req.user_ID, adID);
      if ( type !== "Error") {
        res.status(statusCode).send({
          message : "success", findAd
        })
      }
      // Reponse code is sent 
      else {
        res.status(statusCode).send({
          message
        })
      }
    } catch (error) {
      res
        .status(500)
        .json({ error: "something went wrong try again "});
    }
  }

  // Get Favourite Ads -- Ads are fetched and returned from Adservice 
  static async apiGetFavouriteAds(req, res, next) {
    try {
      console.log("Inside Get Favourite Ads Controller");
      const {type , message , getMyFavAds , statusCode} = await AdService.getFavouriteAds(req.user_ID);
      // Response code is sent 
      if (type !== "Error") {
        res.status(statusCode).send({
          "message": message,
          "FavoriteAds": getMyFavAds
        })
      }
      else if(type == "No Ads"){
        res.status(statusCode).send({
          message : message
        })
      }
      else {
        res.status(statusCode).send({
          "message": message,
        })
      }
    } catch (error) {
      res
        .status(400)
        .json({ error: "Something Went Wrong try again" });
    }
  }

  // Delete Ads -- Ads are Deleted  and returned from Adservice to deleteAds
  static async apiDeleteAds(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      await AdService.deleteAds(req.body, req.user_ID, ad_id);
      // Reponse code is sent 
      res.status(200).send({ message: "Ad deleted successfully !" })
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

  // Get Ad details -- Ad is Fetched   and returned from Adservice to getAdDetails
  static async apiGetParticularAdDetails(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const getAdDetails = await AdService.getAdDetails(req.body, req.user_ID, ad_id);
      // Response is sent 
        res.status(200).json({
          AdDetails: getAdDetails
        })
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
