const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AdController = require('../controllers/AdsController/ad.controller')


//Ad Routes
router.post('/api/createAd',verifyToken,Validator("genericSchemaValidator"),AdController.apiCreateAd);
router.get('/api/v1/getMyAds',verifyToken,AdController.apiGetMyAds);
router.post('/api/vi/changeAdStatus',verifyToken,AdController.apiChangeAdStatus);
router.post('/api/v1/favouriteAds',verifyToken,AdController.apiFavouriteAds);
router.get('/api/v1/getFavouriteAds',verifyToken,AdController.apiGetFavouriteAds);
router.post('/api/v1/deleteAd',verifyToken,AdController.apiDeleteAds);
router.post('/api/v1/get-particular-ad-details',verifyToken,AdController.apiGetParticularAdDetails);

module.exports = router;
 