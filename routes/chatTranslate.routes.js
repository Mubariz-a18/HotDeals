const express = require('express');
const router = express.Router();
const { verifyJwtTokenForBusiness } = require('../utils/verifyToken');
const ChatTranslatorController = require('../controllers/chatTranslateController/chatTranslate.controller');

router.post('/api/translateText',verifyJwtTokenForBusiness,ChatTranslatorController.apiChatTranslate)

module.exports = router;