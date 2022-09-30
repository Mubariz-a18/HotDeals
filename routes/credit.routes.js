const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const CreditController = require('../controllers/Credit/credit.controller')


//Credit Route
router.post('/api/createCredit',verifyToken,Validator("CreditValidator"),CreditController.apiCreateCredit);

module.exports = router;