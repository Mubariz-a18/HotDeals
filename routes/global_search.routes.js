const express = require('express');
const router = express.Router();
const GlobalSearchController = require('../controllers/GlobalSearch/globalsearch.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');
const { verifyJwtTokenForAds } = require('../utils/verifyToken');
const { getGlobalsearchTime } = globalWindowTime
const { getGlobalsearchHits } = globalApiHits

// Get Global Search
router.get(
    '/api/v1/ads/global-search/',
    rateLimiter(
        getGlobalsearchTime,
        getGlobalsearchHits
    ),
    verifyJwtTokenForAds,
    GlobalSearchController.apiGetGlobalSearch
);

module.exports = router;