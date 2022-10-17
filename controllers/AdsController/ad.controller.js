const AdService = require("../../services/AdService");
const { track } = require("../../services/mixpanel-service");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      const adDocument = await AdService.createAd(req.body, req.user_ID);
      // response code is send 
        res.status(200).send({
          message: "Ad Successfully created!",
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
      // Response code is send 
        res.status(200).send({
          message: "success!",
          Selling: getDocument[0].Selling,
          Archived: getDocument[0].Archive,
          Drafts: getDocument[0].Drafts,
          Expired:getDocument[0].Expired,
          Deleted:getDocument[0].Deleted,
          Reposted:getDocument[0].Reposted
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
      const {updateAd , owner} = await AdService.getAdDetails(req.body, req.user_ID, ad_id);
      // Response is sent
      if(updateAd == null){
        await track('viewed ad failed', {
          distinct_id: req.user_ID,
          ad_id: ad_id,
          message:`Ad_id : ${ad_id}  does not exist`
        })
        res.status(404).json({
          message:"Ad does not exist"
        })
      } 
      else{
        await track('viewed ad successfully', {
          distinct_id: req.user_ID,
          ad_id: ad_id, 
          message:`user : ${req.user_ID} viewed Ad`
        })
        res.status(200).json({
          AdDetails: updateAd ,
          owner: owner
        })
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
  
  // Get Premium Ads  -- Ad is Fetched   and returned from Adservice to getPremiumAds
  static async apiGetPremiumAds(req, res, next) {
    try {
      const getPremiumAds = await AdService.getPremiumAdsService(req.user_ID, req.query);
      // Response is sent
      if (getPremiumAds == null) {
        await track('viewed Premium ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "Ad does not exist"
        })
      }
      else {
        await track('viewed Premium ads successfully', {
          distinct_id: req.user_ID,
          message: `user : ${req.user_ID} viewed Premium Ad`
        })
        res.status(200).json({
          PremiumAds: getPremiumAds,
          TotalPremiumAds: getPremiumAds.length
        })
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
  };

  // Get recent Ads  -- Ad is Fetched   and returned from Adservice to getRecentAds
  static async apiGetRecentAds(req, res, next) {
    try {
      const user_ID = req.user_ID
      const getRecentAds = await AdService.getRecentAdsService(user_ID, req.query);
      // Response is sent
      if (getRecentAds == null) {
        await track('viewed Recent ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "Ad does not exist"
        })
      }
      else {
        await track('viewed Recent ads successfully', {
          distinct_id: req.user_ID,
          message: `user : ${req.user_ID} viewed recent Ad`
        })
        res.status(200).json({
          getRecentAds: getRecentAds,
          TotalRecentAds: getRecentAds.length
        })
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
  };
};
