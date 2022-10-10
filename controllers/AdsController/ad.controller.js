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
      const updated_Ad = await AdService.favouriteAds(req.body, req.user_ID, adID);
      res.status(200).send({ message: "success" , updated_Ad })
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

  // Get Favourite Ads -- Ads are fetched and returned from Adservice 
  static async apiGetFavouriteAds(req, res, next) {
    try {
      console.log("Inside Get Favourite Ads Controller");
      const Get_My_Fav_Ads= await AdService.getFavouriteAds(req.user_ID);
      // Response code is sent 
      res.status(200).send({ message: "My Favourite Ads " , Get_My_Fav_Ads })
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

  // Delete Ads -- Ads are Deleted  and returned from Adservice to deleteAds
  static async apiDeleteAds(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      const deletedAd = await AdService.deleteAds(req.body, req.user_ID, ad_id);
      // Reponse code is sent 
      res.status(200).send({ message: "Ad deleted successfully !" , deletedAd })
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
