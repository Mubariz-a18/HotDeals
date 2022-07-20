const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const AlertController = require('../controllers/Alert/alert.controller')

router.post('/api/createAlert',AlertController.apiCreateAlert);
router.get('/api/getAlert',AlertController.apiGetAlert);
router.post('/api/updateAlert',AlertController.apiUpdateAlert);
router.delete('/api/deleteAlert',AlertController.apiDeleteAlert)

module.exports = router;
