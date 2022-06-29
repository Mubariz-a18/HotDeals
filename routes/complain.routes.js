const express = require('express');
const router = express.Router();

const verifyToken = require('../../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const ComplainController = require('../controllers/Complain/complain.controller')

router.post('/api/createComplain',verifyToken,Validator("complainValidator"),ComplainController.apiCreateComplain);

module.exports = router;
