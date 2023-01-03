const express = require("express");
const JsonDataController = require("../controllers/JsonData/jsonData.controller");
const { rateLimiter } = require("../middlewares/rateLimiterMiddleWare");
const { globalWindowTime, globalApiHits } = require("../utils/globalRateLimits");
const router = express.Router();

const { jsonDataTime } = globalWindowTime
const { jsonDataHits } = globalApiHits

router.get("/api/v1/jsonData", rateLimiter(jsonDataTime, jsonDataHits), JsonDataController.apiGetJson);



module.exports = router;