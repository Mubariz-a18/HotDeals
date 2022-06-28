const express = require('express');
const router = express.Router();

const verifyToken = require('../../utils/verifyToken').verifyJwtToken;
const ProfileCotroller = require('../controllers/profileController/pofile.controller');
const Validator = require('../middlewares/validatorMiddleware');

router.post('/api/createProfile',verifyToken,Validator("updatePofile"),ProfileCotroller.apiCreateProfileWithPhone);

module.exports = router;
