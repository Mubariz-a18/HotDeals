const express = require("express");
const JsonDataController = require("../controllers/JsonData/jsonData.controller");
const router = express.Router();

router.get("/api/v1/jsonData",JsonDataController.apiGetJson );



module.exports = router;