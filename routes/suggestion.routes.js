const express = require('express');
const SuggestionController = require('../controllers/SuggestionController/suggestion.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const { reportAdTime } = globalWindowTime
const { reportAdHits } = globalApiHits


router.post('/api/v1/createSuggestion', rateLimiter(reportAdTime, reportAdHits), verifyToken, SuggestionController.apiCreateSuggestion);


module.exports = router;