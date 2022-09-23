const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const GlobalSearchController = require('../controllers/GlobalSearch/globalsearch.controller')

// Get Global Search
router.post('/api/v1/ads/global-search/',verifyToken,GlobalSearchController.apiGetGlobalSearch);

module.exports = router;
