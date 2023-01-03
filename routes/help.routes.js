const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const HelpController = require('../controllers/Help/help.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');
const {
    createHelpTime,
    deletehelpTime,
    getHelpTime,
} = globalWindowTime
const {
    createHelpHits,
    deletehelpHits,
    getHelpHits,
} = globalApiHits
//Help Routes
router.post('/api/createHelp', rateLimiter(createHelpTime, createHelpHits), verifyToken, HelpController.apiCreateHelp);
router.post('/api/deleteHelp', rateLimiter(deletehelpTime, deletehelpHits), verifyToken, HelpController.apiDeleteHelp);
router.get('/api/getHelp', rateLimiter(getHelpTime, getHelpHits), verifyToken, HelpController.apiGetHelp);

module.exports = router;

