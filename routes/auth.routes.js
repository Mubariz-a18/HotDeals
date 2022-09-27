const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/CredentialController/auth.controller");
const { verifyJwtToken } = require('../utils/verifyToken');


//OTP Routes
router.post("/getOtp", AuthController.apiGetOTP);
router.post("/verifyOtp", AuthController.apiVerifyOTP);
router.post("/getOtpEmail",verifyJwtToken ,AuthController.apiGetEmailOtp);

module.exports = router;
