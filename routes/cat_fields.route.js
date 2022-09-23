const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const CatFieldController = require('../controllers/catFieldController')
router.get('/api/v1/getcatfields', verifyToken,CatFieldController.apiGetCatFields);
module.exports = router;