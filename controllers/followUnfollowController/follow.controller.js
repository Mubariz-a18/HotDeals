const errorHandler = require('../../middlewares/errorHandler');
const FollowUnfollowService = require('../../services/FollowUnfollowService')


module.exports = class FollowController {

  // New Follow User
  static async apiFollowUser(req, res, next) {
    try {
      await FollowUnfollowService.followUser(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully followed "
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }

  //Unfollow Existing User
  static async apiUnfollowUser(req, res, next) {
    try {
      const unfollowUser = await FollowUnfollowService.UnfollowUser(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully unfollowed"
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
}