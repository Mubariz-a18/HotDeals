const express = require("express");
const router = express.Router();
const verifyToken = require("../utils/verifyToken").verifyJwtToken;
const DashBoardCotroller = require("../controllers/DashboardController/dashboard.controller");
const Validator = require("../middlewares/validatorMiddleware");


router.post("/api/v1/ads", verifyToken, DashBoardCotroller.apiGetDashBoard);

module.exports = router;
