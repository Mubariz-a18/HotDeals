const express = require('express');
const router = express.Router();

const AlertController = require('../controllers/Alert/alert.controller');
const { verifyJwtToken } = require('../utils/verifyToken');


//Alert Routes
router.post('/api/createAlert',verifyJwtToken,AlertController.apiCreateAlert);
// router.post('/api/getAlert',verifyJwtToken,AlertController.apiGetAlert);
router.post('/api/updateAlert',verifyJwtToken,AlertController.apiUpdateAlert);
router.delete('/api/deleteAlert',verifyJwtToken,AlertController.apiDeleteAlert)

module.exports = router;