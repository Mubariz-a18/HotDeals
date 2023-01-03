const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const FollowUnfollowController = require('../controllers/followUnfollowController/follow.controller');
const { rateLimiter } = require('../middlewares/rateLimiterMiddleWare');
const { globalApiHits, globalWindowTime } = require('../utils/globalRateLimits');

const {
    followuserHts,
    unfollowuserHits,
} = globalApiHits
const {
    followuserTime,
    unfollowuserTime,
} = globalWindowTime
// Follow & Unfollow
router.post('/user/follow', rateLimiter(followuserTime,followuserHts), verifyToken, FollowUnfollowController.apiFollowUser);
router.post('/user/unfollow', rateLimiter(unfollowuserTime,unfollowuserHits), verifyToken, FollowUnfollowController.apiUnfollowUser);

module.exports = router;
