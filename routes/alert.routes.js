const express = require('express');
const router = express.Router();

const verifyToken = require('../../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AlertController = require('../controllers/Alert/alert.controller')

router.post('/api/createAlert',verifyToken,Validator("AlertValidator"),AlertController.apiCreateAlert);

module.exports = router;
