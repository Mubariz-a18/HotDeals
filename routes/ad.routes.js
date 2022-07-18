const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AdController = require('../controllers/AdsController/ad.controller')

router.post('/api/createAd',Validator("genericSchemaValidator"),AdController.apiCreateAd);
router.get('/api/v1/getMyAds',AdController.apiGetMyAds);
router.post('/api/vi/changeAdStatus',verifyToken,AdController.apiChangeAdStatus);
router.post('/api/v1/favouriteAds',AdController.apiFavouriteAds);

module.exports = router;
