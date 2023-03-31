const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AdController = require('../controllers/AdsController/ad.controller');
const { verifyJwtTokenForAds } = require('../utils/verifyToken');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');

const {
    getPremiumAdsTime,
    getFeaturedAdsTime,
    createAdTime,
    updateAdTime,
    getMyAdTime,
    claimPayoutTime,
    getFavouriteAdsTime,
    changeAdStatusTime,
    makeAdFavouriteTime,
    getParticularAdsTime,
    getRelatedAdTime,
    getadStatusTime
} = globalWindowTime
const {
    getPremiumAdsHits,
    getFeaturedAdsHits,
    claimPayoutHits,
    updateAdHits,
    createAdHits,
    getMyAdHits,
    getFavouriteAdsHits,
    changeAdStatusHits,
    makeAdFavouriteHits,
    getParticularAdsHits,
    getRelatedAdHits,
    getadStatusHits,
} = globalApiHits

//Ad Routes
router.post('/api/createAd',
    // rateLimiter(createAdTime, createAdHits),
    verifyToken, Validator("genericSchemaValidator"),
    AdController.apiCreateAd);

router.post('/api/v1/updateAd',
    rateLimiter(updateAdTime, updateAdHits),
    verifyToken,
    AdController.apiUpdateAd);

router.post('/api/v1/makeAdPremium',
    rateLimiter(updateAdTime, updateAdHits),
    verifyToken,
    AdController.apiMakeAdPremuium);

router.get('/api/v1/getMyAds',
    rateLimiter(getMyAdTime, getMyAdHits),
    verifyToken,
    AdController.apiGetMyAds);

// router.get('/api/v1/getMyAdsHistory',
//     rateLimiter(getMyAdTime, getMyAdHits),
//     verifyToken,
//     AdController.apiGetMyAdsHistory);

router.post('/api/vi/changeAdStatus',
    rateLimiter(changeAdStatusTime, changeAdStatusHits),
    verifyToken,
    AdController.apiChangeAdStatus);

router.post('/api/v1/favouriteAds',
    rateLimiter(makeAdFavouriteTime, makeAdFavouriteHits), verifyToken,
    AdController.apiFavouriteAds);

router.get('/api/v1/getFavouriteAds',
    rateLimiter(getFavouriteAdsTime, getFavouriteAdsHits),
    verifyToken,
    AdController.apiGetFavouriteAds);
router.post('/api/v1/get-particular-ad-details',
    rateLimiter(getParticularAdsTime, getParticularAdsHits),
    verifyJwtTokenForAds,
    AdController.apiGetParticularAdDetails);
router.get('/api/v1/getPremiumAds',
    rateLimiter(getPremiumAdsTime, getPremiumAdsHits),
    verifyJwtTokenForAds,
    AdController.apiGetPremiumAds);
router.get('/api/v1/getFeaturedAds',
    // rateLimiter(getFeaturedAdsTime, getFeaturedAdsHits),
    verifyJwtTokenForAds,
    AdController.apiGetRecentAds);
router.post('/api/v1/getRelatedAd',
    rateLimiter(getRelatedAdTime, getRelatedAdHits),
    verifyJwtTokenForAds,
    AdController.apiGetRelatedAds);
router.post('/api/v1/checkAdStatus',
    rateLimiter(getadStatusTime, getadStatusHits),
    AdController.apiCheckAdStatus);

router.post('/api/repostAd',
    rateLimiter(createAdTime, createAdHits),
    verifyToken,
    AdController.apiRepostAd);

router.get('/api/v1/getPayoutAds',
    rateLimiter(getMyAdTime, getMyAdHits),
    verifyToken,
    AdController.apiGetMyAdsForPayout);

router.post('/api/v1/claimPayout',
    rateLimiter(claimPayoutTime, claimPayoutHits),
    verifyToken,
    AdController.apiClaimPayout);

/* 
Draft Ad Apis Here
*/

router.post('/api/createDraftAd',
    rateLimiter(createAdTime, createAdHits),
    verifyToken,
    AdController.apiDraftAds);

router.post('/api/getDraftAd',
    rateLimiter(getMyAdTime, getMyAdHits),
    verifyToken,
    AdController.apiGetDraftAd);

router.post('/api/updateDraftAd',
    rateLimiter(createAdTime, createAdHits),
    verifyToken,
    AdController.apiUpdateDraftAds);

router.post('/api/deleteDraft',
    rateLimiter(getMyAdTime, getMyAdHits),
    verifyToken,
    AdController.apiDeleteDraft);
module.exports = router;