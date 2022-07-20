const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const HomeCotroller = require("../controllers/HomeController/home.controller");
const Validator = require("../middlewares/validatorMiddleware");


router.post("/api/v1/home", HomeCotroller.apiGetHome);

module.exports = router;
