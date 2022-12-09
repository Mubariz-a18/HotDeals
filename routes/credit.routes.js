const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const CreditController = require('../controllers/Credit/credit.controller')


//Credit Route
router.post('/api/createCredit', verifyToken, CreditController.apiCreateCredit);
router.get('/api/getMyCredits', verifyToken, CreditController.getMyCreditsInfo);
router.post('/api/BoostAd', verifyToken, CreditController.apiBoostAd);
router.post('/api/HighlightAd', verifyToken, CreditController.apiHighlightAd);

module.exports = router;