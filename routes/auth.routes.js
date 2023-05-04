const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/CredentialController/auth.controller");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleWare");
const { globalWindowTime, globalApiHits } = require("../utils/globalRateLimits");
const { verifyJwtToken } = require('../utils/verifyToken');
const blockIPsMiddleware = require("../middlewares/ipVerificationMiddleware");

const {
    getOtpTime,
    verifyOtpTime,
    getOtpEmailTime,
    verifyOtpEmailTime,
} = globalWindowTime
const {
    getOtpHits,
    verifyOtpHits,
    getOtpEmailHits,
    verifyOtpEmailHits,
} = globalApiHits

//OTP Routes
router.post("/getOtp", blockIPsMiddleware, rateLimiter(getOtpTime, getOtpHits), AuthController.apiGetOTP);
router.post("/verifyOtp", rateLimiter(verifyOtpTime, verifyOtpHits), AuthController.apiVerifyOTP);
router.post("/sendOtpByEmail", rateLimiter(getOtpEmailTime, getOtpEmailHits), verifyJwtToken, AuthController.apiSentOtpByEmail);
router.post("/verifyEmail", rateLimiter(verifyOtpEmailTime, verifyOtpEmailHits), verifyJwtToken, AuthController.apiEmailVerficationByOtp);


module.exports = router;
