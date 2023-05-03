const express = require('express');
const BusinessAdsController = require('../controllers/BusinessAdsController/businessAds.controller');
const { verifyJwtToken } = require('../utils/verifyToken');

const router = express.Router();

router.post('/createBusinessProfile', verifyJwtToken, BusinessAdsController.createBusinessProfile);
router.post('/createBusinessAd', verifyJwtToken, BusinessAdsController.createBusinessAd);
router.post('/updateBusinessAd', verifyJwtToken, BusinessAdsController.updateBusinessAd);
router.get('/getMyBusinessAds', verifyJwtToken, BusinessAdsController.getMyBusinessAds);
router.get('/getParticularBusinessAd', verifyJwtToken, BusinessAdsController.getParticularBusinessAd);

module.exports = router;