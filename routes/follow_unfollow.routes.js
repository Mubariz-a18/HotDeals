const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const FollowUnfollowController = require('../controllers/followUnfollowController/follow.controller')


// Follow & Unfollow
router.post('/user/follow', verifyToken, FollowUnfollowController.apiFollowUser);
router.post('/user/unfollow', verifyToken, FollowUnfollowController.apiUnfollowUser);

module.exports = router;
