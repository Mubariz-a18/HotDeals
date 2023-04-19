const express = require('express');
const JsonDataController = require('../controllers/JsonData/jsonData.controller');
const router = express.Router();

router.get('/api/places', JsonDataController.apiGetPlaces);

module.exports = router;
