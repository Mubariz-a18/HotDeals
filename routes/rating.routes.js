const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const RatingCotroller = require('../controllers/Rating/rating.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalWindowTime, globalApiHits } = require('../utils/globalRateLimits');

const {
    createRatingTime,
    getRatingTime,
} = globalWindowTime
const {
    createRatingHits,
    getRatingHits
} = globalApiHits
//Rating Route

router.post('/api/createRating', 
rateLimiter(createRatingTime,createRatingHits), 
verifyToken, 
RatingCotroller.apiCreateRating);
router.post('/api/getRating', 
rateLimiter(getRatingTime,getRatingHits), 
verifyToken, 
RatingCotroller.apiGetRating);

module.exports = router;
