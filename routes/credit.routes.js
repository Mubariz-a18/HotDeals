const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const CreditController = require('../controllers/Credit/credit.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');

const {
    createCreditHits,
    getMyCreditsHits,
    boostAdHits,
    highlightAdHits,
} = globalApiHits
const {
    createCreditTime,
    getMycreditsTime,
    boostAdTime,
    highlightAdTime,
} = globalWindowTime

//Credit Route
router.post('/api/createCredit',
    rateLimiter(createCreditTime, createCreditHits),
    verifyToken,
    CreditController.apiCreateCredit);
router.get('/api/getMyCredits',
    rateLimiter(getMycreditsTime, getMyCreditsHits),
    verifyToken,
    CreditController.getMyCreditsInfo);
router.post('/api/BoostAd',
    rateLimiter(boostAdTime, boostAdHits),
    verifyToken,
    CreditController.apiBoostAd);
router.post('/api/HighlightAd',
    rateLimiter(highlightAdTime, highlightAdHits),
    verifyToken,
    CreditController.apiHighlightAd);

module.exports = router;