const express = require('express');
const router = express.Router();

const verifyToken = require('../../utils/verifyToken').verifyJwtToken;
const RatingCotroller = require('../controllers/Rating/rating.controller');
const Validator = require('../middlewares/validatorMiddleware');

router.post('/api/createRating',verifyToken,RatingCotroller.apiCreateRating);

module.exports = router;
