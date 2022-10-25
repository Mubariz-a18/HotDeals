const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/CredentialController/auth.controller");
const { verifyJwtToken } = require('../utils/verifyToken');


//OTP Routes
router.post("/getOtp", AuthController.apiGetOTP);
router.post("/verifyOtp", AuthController.apiVerifyOTP);
router.post("/sendOtpByEmail", verifyJwtToken, AuthController.apiSentOtpByEmail);
router.post("/verifyEmail", verifyJwtToken, AuthController.apiEmailVerficationByOtp);


module.exports = router;
