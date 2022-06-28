const express = require('express');
const router = express.Router();

const verifyToken = require('../../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AdController = require('../controllers/AdsController/ad.controller')

router.post('/api/createAd',verifyToken,Validator("CreateAdsValidator"),AdController.apiCreateAd);

module.exports = router;
