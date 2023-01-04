const express = require('express');
const ReportController = require('../controllers/ReportController/report.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const { reportAdTime } = globalWindowTime
const { reportAdHits } = globalApiHits
//Complain Route
router.post('/api/v1/reportAd', rateLimiter(reportAdTime, reportAdHits), verifyToken, ReportController.apiReportAd);


module.exports = router;
