const express = require('express');
const BusinessAdsController = require('../controllers/BusinessAdsController/businessAds.controller');
const { verifyJwtToken } = require('../utils/verifyToken');

const router = express.Router();

router.post('/createBusinessProfile', verifyJwtToken, BusinessAdsController.createBusinessProfile)

module.exports = router;