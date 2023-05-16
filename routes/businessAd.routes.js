const express = require('express');
const BusinessAdsController = require('../controllers/BusinessAdsController/businessAds.controller');
const { verifyJwtToken } = require('../utils/verifyToken');
const router = express.Router();

router.post('/createBusinessProfile', verifyJwtToken, BusinessAdsController.createBusinessProfile);
router.post('/updateBusinessProfile', verifyJwtToken, BusinessAdsController.updateBusinessProfile);
router.post('/changeBusinessAdStatus', verifyJwtToken, BusinessAdsController.changeBusinessAdStatus);
router.post('/createBusinessAd', verifyJwtToken, BusinessAdsController.createBusinessAd);
router.post('/updateBusinessAd', verifyJwtToken, BusinessAdsController.updateBusinessAd);
router.post('/repostBusinessAd', verifyJwtToken, BusinessAdsController.repostBusinessAd);
router.get('/getMyBusinessAds', verifyJwtToken, BusinessAdsController.getMyBusinessAds);
router.get('/getInterstitialAd', verifyJwtToken, BusinessAdsController.getInterStatialBusinessAd);
router.post('/getParticularBusinessAd',BusinessAdsController.getParticularBusinessAd);
router.post('/checkBusinessAdCredits', verifyJwtToken,BusinessAdsController.checkBusinessAdCredits);

module.exports = router;