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
router.post(
  "/createAd",
  verifyToken,
  createAdController
);

const sraechAdController =
  require("../controllers/AdsController/getAd/searchAd").searchAds;
router.get("/Ads/search", sraechAdController);
module.exports = router;
