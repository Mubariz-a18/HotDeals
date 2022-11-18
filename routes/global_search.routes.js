const express = require('express');
const router = express.Router();

const GlobalSearchController = require('../controllers/GlobalSearch/globalsearch.controller')

// Get Global Search
router.post('/api/v1/ads/global-search/',GlobalSearchController.apiGetGlobalSearch);

module.exports = router;