const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/CredentialController/auth.controller");
const Validator = require("../middlewares/validatorMiddleware");
router.post("/getOtp", Validator("getOTP"), AuthController.apiGetOTP);
router.post("/verifyOtp", Validator("verifyOTP"), AuthController.apiVerifyOTP);

module.exports = router;
