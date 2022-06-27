const express = require("express");
const router = express.Router();
const verifyToken = require("../../utils/verifyToken").verifyJwtToken;
const { validate } = require("express-validation");
const signUpSignInController =
  require("../controllers/credentialController/signUpSignIn").signUpSignIn;
router.post("/signInSignUp", signUpSignInController);

const postSampleController =
  require("../controllers/postSample").postSampleController;
router.post("/sample", postSampleController);

const getSampleController =
  require("../controllers/getSample").getSampleController;
router.get("/sample", getSampleController);

const getMessageController =
  require("../controllers/getMessage").getMessageController;
router.get("/messages", getMessageController);

const postMessageController =
  require("../controllers/postMessage").postMessageController;
router.post("/messages", postMessageController);

const signUpUsingOTP = require("../controllers/signUpUsingOTP").signUpUsingOTP;
router.post("/signUpUsingOTP", signUpUsingOTP);

const chatController = require("../controllers/chat-app").chat_app;
router.post("/chat", chatController);

const dummyDataController =
  require("../controllers/dummySearch").dummySearchController;
router.post("/search", dummyDataController);

const getDummySearchController =
  require("../controllers/getDummySearch").getDummySearchController;
router.get("/search", getDummySearchController);

const createProfileController =
  require("../controllers/profileController/createProfile").createProfile;
router.post("/createProfile", verifyToken, createProfileController);

const createAdController =
  require("../controllers/AdsController/postAd/createAd").createAd;
const createAdMiddleware = require('../middlewares/Ads/AdsValidation').petValidation;
router.post(
  "/createAd",
  verifyToken,
  createAdMiddleware,
  createAdController
);

const sraechAdController =
  require("../controllers/AdsController/getAd/searchAd").searchAds;
router.get("/Ads/search", sraechAdController);

const rating_given = require('../controllers/RatingController/rating').rating_given;
router.post('/rating',verifyToken, rating_given);

const helpController = require('../controllers/Help/help').helpCenterController;
router.post('/helpCenter',verifyToken, helpController);

const complainController = require('../controllers/Complain/complain').ComplainController;
router.post('/complain',verifyToken, complainController);

const alertController = require('../controllers/Alert/alert').alertController;
router.post('/alert',verifyToken, alertController);
module.exports = router;
