const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const FollowUnfollowController = require('../controllers/followUnfollowController/follow.controller')


// Follow Unfollow  & Ratings Route
router.post('/user/follow',verifyToken,FollowUnfollowController.apiFollowUser);
router.post('/user/unfollow/:id',verifyToken,FollowUnfollowController.apiUnfollowUser);
router.post('/user/rating',verifyToken,FollowUnfollowController.apiRatingUser)

module.exports = router;
