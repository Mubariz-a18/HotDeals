const errorHandler = require("../../middlewares/errorHandler");
const AdService = require("../../services/AdService");
const CreditService = require("../../services/CreditService");
const { track } = require("../../services/mixpanel-service");

module.exports = class AdController {
  // Ad Created -- data is saved &  retured from AdService  
  static async apiCreateAd(req, res, next) {
    try {
      // created ad is saved in db and sent to response 
      const adDocument = await AdService.createAd(req.body, req.user_ID);
      if (adDocument.ad_status == "Pending") {
        const AfterAdPosted = await AdService.AfterPendingAd(adDocument, req.user_ID)
      } else {
        const AfterAdPosted = await AdService.AfterAdIsPosted(adDocument, req.user_ID)
      }
      // response code is send 
      res.status(200).send({
        message: "Ad Successfully created!",
        Ad: adDocument,
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }

  // Get Ads -- Ads are Fetched and Returned from Adservice 
  static async apiGetMyAds(req, res, next) {
    try {
      // My ads are fetched from db abd sent to response
      const getDocument = await AdService.getMyAds(req.user_ID);
      const DraftAds = await AdService.getAllDraft(req.user_ID)
      // Response code is send 
      res.status(200).send({
        message: "success!",
        Selling: getDocument[0].Selling,
        Archived: getDocument[0].Archive,
        Drafts: DraftAds,
        Expired: getDocument[0].Expired,
        Deleted: getDocument[0].Deleted,
        Reposted: getDocument[0].Reposted,
        Sold: getDocument[0].Sold,
        Suspended: getDocument[0].Suspended,
        Pending: getDocument[0].Pending
      });
    } catch (e) {
      errorHandler(e, res);
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
      errorHandler(e, res)
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
      errorHandler(e, res);
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
      errorHandler(e, res);
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
      errorHandler(e, res);
    };
  }

  // Get Ad details -- Ad is Fetched   and returned from Adservice to getAdDetails
  static async apiGetParticularAdDetails(req, res, next) {
    try {
      const ad_id = req.body.ad_id;
      // AD detail is fetched from db and sent to response
      if (req.body.ad_status && req.body.ad_status === "Pending") {
        const AdDetail = await AdService.getParticularAd(req.body, req.query, req.user_ID);
        res.status(200).json({
          AdDetails: [AdDetail]
        })
      } else {
        const { AdDetail, ownerDetails, isAdFav } = await AdService.getParticularAd(req.body, req.query, req.user_ID)
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
        })
      }
    } catch (e) {
      errorHandler(e, res);
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
      errorHandler(e, res);
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
        res.status(200).send({
          FeaturedAds: getRecentAds,
          TotalFeaturedAds: getRecentAds.length
        })
      }
      if (getRecentAds.length == 0) {
        res.status(204).json({})
      }
    } catch (e) {
      errorHandler(e, res);
    };
  };


  static async apiGetRelatedAds(req, res, next) {
    try {
      // Premium ads are fetched from db and sent to response
      const { RelatedAds, featureAds } = await AdService.getRelatedAds(req.query, req.user_ID, req.body.ad_id);
      // Response is sent
      if (RelatedAds == null) {
        // mixpanel track for get premium ads failed
        await track('viewed Related ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(404).json({
          message: "ADS_NOT_FOUND"
        })
      }
      if (RelatedAds.length > 0) {
        res.status(200).send(
          {
            PremiumAds: RelatedAds[0].PremiumAds,
            FeatureAds: featureAds,
            TotalPremiumAds: RelatedAds[0].PremiumAds.length,
            TotalFeaturedAds: featureAds.length
          }
        )
      }
      if (RelatedAds.length == 0) {
        await track('viewed Premium ads failed', {
          distinct_id: req.user_ID,
        })
        res.status(204).json({})
      }
    } catch (e) {
      errorHandler(e, res);
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
      errorHandler(e, res);
    };
  };

  // api for UpdateAd
  static async apiUpdateAd(req, res, next) {
    try {
      // const { ad_id } = req.body;
      const user_id = req.user_ID;
      const Updated_Ad = await AdService.updateAd(req.body, user_id);
      res.status(200).json({
        message: "Successfully_Updated",
        data: Updated_Ad
      })

    } catch (e) {
      errorHandler(e, res);
    };
  };

  static async apiMakeAdPremuium(req, res, next) {
    try {
      // const { ad_id } = req.body;
      const user_id = req.user_ID;
      const Updated_Ad = await CreditService.MakeAdPremium(user_id, req.body);
      res.status(200).json({
        data: Updated_Ad
      })

    } catch (e) {
      errorHandler(e, res);
    };
  };

  static async apiRepostAd(req, res, next) {
    try {
      const adID = req.body.ad_id;
      // Ad is saved in Favourite and sent to responce
      const updated_Ad = await AdService.repostAd(adID, req.user_ID);
      res.status(200).send(
        {
          message: "success",
          updated_Ad
        }
      )
    } catch (e) {
      errorHandler(e, res);
    };
  }

  /* 
    Draft Ad APIS From Here
  */

  // CreateDraftAd
  static async apiDraftAds(req, res, next) {
    try {
      const user_id = req.user_ID;
      const Drafted_Ad = await AdService.draftAd(req.body, user_id);
      res.status(200).json({
        message: "Successfully Drafted",
        data: Drafted_Ad
      })
    } catch (e) {
      errorHandler(e, res);
    };
  };

  // update DraftApi
  static async apiUpdateDraftAds(req, res, next) {
    try {
      const user_id = req.user_ID;
      const Drafted_Ad = await AdService.updateDraft(req.body, user_id);
      res.status(200).json({
        message: "Successfully Drafted",
        data: Drafted_Ad
      })
    } catch (e) {
      errorHandler(e, res);
    };
  };

  // Get One Draft
  static async apiGetDraftAd(req, res, next) {
    try {
      const user_id = req.user_ID;
      const Drafted_Ad = await AdService.getDraftAd(req.body, user_id);
      res.status(200).json({
        data: Drafted_Ad
      })
    } catch (e) {
      errorHandler(e, res);
    };
  };

  // Delete One Draft
  static async apiDeleteDraft(req, res, next) {
    try {
      const user_id = req.user_ID;
      const deleteDraft = await AdService.deleteDraft(user_id, req.body.ad_id);
      res.status(200).json({
        data: deleteDraft
      })
    } catch (e) {
      errorHandler(e, res);
    };
  };
};