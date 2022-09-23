const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const ComplaintController = require('../controllers/Complaint/complaint.controller')

//Complain Route
router.post('/api/createComplaint',verifyToken,ComplaintController.apiCreateComplaint);

module.exports = router;
