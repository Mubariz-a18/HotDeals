const express = require("express");
const router = express.Router();
const HomeCotroller = require("../controllers/HomeController/home.controller");

//Home Route
router.get("/api/v1/home", HomeCotroller.apiGetHome);

module.exports = router;
 