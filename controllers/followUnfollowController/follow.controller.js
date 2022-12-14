const FollowUnfollowService = require('../../services/FollowUnfollowService')


module.exports = class FollowController {

  // New Follow User
  static async apiFollowUser(req, res, next) {
    try {
      const followUser = await FollowUnfollowService.followUser(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully followed "
      })
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
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
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
}