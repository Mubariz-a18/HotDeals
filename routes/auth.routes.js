const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/CredentialController/auth.controller");

//OTP Routes
router.post("/getOtp", AuthController.apiGetOTP);
router.post("/verifyOtp", AuthController.apiVerifyOTP);

module.exports = router;
