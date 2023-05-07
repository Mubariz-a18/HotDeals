const express = require('express');
const router = express.Router();

const AlertController = require('../controllers/Alert/alert.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');
const { verifyJwtToken } = require('../utils/verifyToken');

const {
    createAlertTime,
    // updateAlertTime,
    deleteAlertTime,
} = globalWindowTime
const {
    createAlertHits,
    // updateAlertHits,
    deleteAlertHits,
} = globalApiHits
//Alert Routes
router.post('/api/createAlert',
    rateLimiter(createAlertTime, createAlertHits),
    verifyJwtToken,
    AlertController.apiCreateAlert);

// router.get('/api/getMyAlertsAlert',
//     verifyJwtToken,
//     AlertController.apiGetAlert);

// router.post('/api/updateAlert',
//     rateLimiter(updateAlertTime, updateAlertHits),
//     verifyJwtToken,
//     AlertController.apiUpdateAlert);

router.delete('/api/deleteAlert',
    rateLimiter(deleteAlertTime, deleteAlertHits),
    verifyJwtToken,
    AlertController.apiDeleteAlert)

module.exports = router;