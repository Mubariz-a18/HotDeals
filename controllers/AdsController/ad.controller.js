const AdService = require("../../services/AdService");
const { track } = require("../../services/mixpanel-service");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      // created ad is saved in db and sent to response 
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
      // My ads are fetched from db abd sent to response
      const getDocument = await AdService.getMyAds(req.user_ID);
      // Response code is send 
      res.status(200).send({
        message: "success!",
        Selling: getDocument[0].Selling,
        Archived: getDocument[0].Archive,
        Drafts: getDocument[0].Drafts,
        Expired: getDocument[0].Expired,
        Deleted: getDocument[0].Deleted,
        Reposted: getDocument[0].Reposted,
        Sold: getDocument[0].Sold,
        Suspended: getDocument[0].Suspended
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

  static async apiGetMyAdsHistory(req, res, next) {
    try {
      // My ads History  are fetched from db and sent to response
      const getHistoryAds = await AdService.getMyAdsHistory(req.user_ID);
      // Response code is send 
      res.status(200).send({
        message: "success!",
        getHistoryAds
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
      //  Ad status is changed and sent to respose
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
      // Ad is saved in Favourite and sent to responce
      const updated_Ad = await AdService.favouriteAds(req.body, req.user_ID, adID);
      res.status(200).send(
        {
          message: "success",
          updated_Ad
        }
      )
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
      // Ad is fetched from db & sent to responce
      const Get_My_Fav_Ads = await AdService.getFavouriteAds(req.query, req.user_ID);
      // Response code is sent 
      res.status(200).send({
        message: "My Favourite Ads ",
        Get_My_Fav_Ads,
        Total_Fav_Ads: Get_My_Fav_Ads.length
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

  // Delete Ads -- Ads are Deleted  and returned from Adservice to deleteAds
  static async apiDeleteAds(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      // Ad is Removed &  response is sent
      const deletedAd = await AdService.deleteAds(req.user_ID, ad_id);
      // Reponse code is sent 
      res.status(200).send({ message: deletedAd })
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
      // AD detail is fetched from db and sent to response
      const { AdDetail, ownerDetails, isAdFav } = await AdService.getParticularAd(ad_id, req.query, req.user_ID)
      // Response is sent
      await track('viewed ad successfully', {
        distinct_id: req.user_ID,
        ad_id: ad_id,
        message: `user : ${req.user_ID} viewed Ad`
      })
      res.status(200).json({
        AdDetails: AdDetail,
        Owner: ownerDetails,
        isAdFav: isAdFav
        // owner: owner
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

  // Get Premium Ads  -- Ad is Fetched   and returned from Adservice to getPremiumAds
  static async apiGetPremiumAds(req, res, next) {
    try {
      // Premium ads are fetched from db and sent to response
      const getPremiumAds = await AdService.getPremiumAdsService(req.user_ID, req.query);
      // Response is sent
      if (getPremiumAds == null) {
        // mixpanel track for get premium ads failed
        await track('viewed Premium ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "ADS_NOT_FOUND"
        })
      }
      if (getPremiumAds.length > 0) {
        res.status(200).json({
          PremiumAds: getPremiumAds,
          TotalPremiumAds: getPremiumAds.length
        })
      }
      if (getPremiumAds.length == 0) {
        await track('viewed Premium ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(204).json({})
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
      // premium ads are fetched from db and sent to response
      const getRecentAds = await AdService.getRecentAdsService(user_ID, req.query);
      // Response is sent
      if (getRecentAds == null) {
        // mixpanel track for get Recent ads failed
        await track('viewed Recent ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "ADS_NOT_FOUND"
        })
      }
      if (getRecentAds.length > 0) {
        res.status(200).json({
          getRecentAds: getRecentAds,
          TotalRecentAds: getRecentAds.length
        })
      }
      if (getRecentAds.length == 0) {
        res.status(204).json({})
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

  // Get Ads -- Ads are Fetched and Returned from Adservice 
  static async apiGetMyAdDetails(req, res, next) {
    try {
      const { ad_id } = req.body;
      const user_ID = req.user_ID;
      // My ads are fetched from db abd sent to response
      const { myAdDetail, ownerDetails, isAdFav } = await AdService.getMyAdDetails(ad_id, user_ID);
      // Response code is send 
      res.status(200).send({
        message: "success!",
        AdDetail: myAdDetail,
        ownerDetails: ownerDetails,
        isAdFav: isAdFav
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
  };

  static async apiGetRelatedAds(req, res, next) {
    try {
      // Premium ads are fetched from db and sent to response
      const getRelatedAds = await AdService.getRelatedAds(req.query, req.user_ID);
      // Response is sent
      if (getRelatedAds == null) {
        // mixpanel track for get premium ads failed
        await track('viewed Related ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "ADS_NOT_FOUND"
        })
      }
      if (getRelatedAds.length > 0) {
        res.status(200).json({
          Featured_Ads: getRelatedAds,
          Total_Featured_Ads: getRelatedAds.length
        })
      }
      if (getRelatedAds.length == 0) {
        await track('viewed Premium ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(204).json({})
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

  // api for checking ad_status
  static async apiCheckAdStatus(req, res, next) {
    try {
      const adstatus = await AdService.getAdStatus(req.body.ad_id);
      // Response is sent
      if (adstatus == null) {
        // mixpanel track for get premium ads failed
        await track('viewed ads status ', {
          distinct_id: req.body.ad_id,
        })
        res.status(404).json({
          message: "ADS_NOT_FOUND"
        })
      }
      else {
        res.status(200).send(adstatus)
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