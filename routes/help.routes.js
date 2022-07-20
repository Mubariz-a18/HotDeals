const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const HelpController = require('../controllers/Help/help.controller')

router.post('/api/createHelp',HelpController.apiCreateHelp);

module.exports = router;
