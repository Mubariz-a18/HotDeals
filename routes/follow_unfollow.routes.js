const express = require('express');
const router = express.Router();

const verifyToken = require('../utils/verifyToken').verifyJwtToken;
const Validator = require('../middlewares/validatorMiddleware');
const FollowUnfollowController = require('../controllers/followUnfollowController/follow.controller')

router.post('/user/:id/follow',verifyToken,FollowUnfollowController.apiFollowUser);
router.post('/user/:id/unfollow',verifyToken,FollowUnfollowController.apiUnfollowUser)

module.exports = router;
