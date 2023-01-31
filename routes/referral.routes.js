const express = require("express");

const router = express.Router();

const ReferralCodeController = require("../controllers/ReferralCode/referralCode.controller.js");
const { verifyJwtToken } = require("../utils/verifyToken.js");

router.post("/api/v1/referralcode",verifyJwtToken, ReferralCodeController.apiReferralCode);



module.exports = router;