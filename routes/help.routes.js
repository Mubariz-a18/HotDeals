const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const HelpController = require('../controllers/Help/help.controller')

router.post('/api/createHelp',verifyToken,HelpController.apiCreateHelp);
router.post('/api/deleteHelp',verifyToken,HelpController.apiDeleteHelp)

module.exports = router;
