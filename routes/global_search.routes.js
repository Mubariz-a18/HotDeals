const express = require('express');
const router = express.Router();

const GlobalSearchController = require('../controllers/GlobalSearch/globalsearch.controller');
const { verifyJwtTokenForAds } = require('../utils/verifyToken');

// Get Global Search
router.get('/api/v1/ads/global-search/', verifyJwtTokenForAds, GlobalSearchController.apiGetGlobalSearch);

module.exports = router;