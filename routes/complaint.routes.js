const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const ComplaintController = require('../controllers/Complaint/complaint.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');

const {createComplainTime} = globalWindowTime
const {createComplainHits} = globalApiHits
//Complain Route
router.post('/api/createComplaint', rateLimiter(createComplainTime,createComplainHits),verifyToken, ComplaintController.apiCreateComplaint);
router.post('/api/updateComplaint',rateLimiter(createComplainTime,createComplainHits), verifyToken, ComplaintController.apiUpdateController)

module.exports = router;
