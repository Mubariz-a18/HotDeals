const express = require('express');
const ReportController = require('../controllers/ReportController/report.controller');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;


//Complain Route
router.post('/api/v1/reportAd', verifyToken, ReportController.apiReportAd);


module.exports = router;
