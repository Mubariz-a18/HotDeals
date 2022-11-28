const express = require('express');
const router = express.Router();

const GlobalSearchController = require('../controllers/GlobalSearch/globalsearch.controller');
const { verifyJwtToken } = require('../utils/verifyToken');

// Get Global Search
router.get('/api/v1/ads/global-search/',verifyJwtToken,GlobalSearchController.apiGetGlobalSearch);

module.exports = router;