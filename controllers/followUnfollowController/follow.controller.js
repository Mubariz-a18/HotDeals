const FollowUnfollowService = require('../../services/FollowUnfollowService')


module.exports = class FollowController {

    // New Follow User
    static async apiFollowUser(req, res, next) {
        try {
            // console.log("inside Follow Controller:" + req.user_ID);
            const followUser = await FollowUnfollowService.followUser(req, req.body, req.user_ID);
            res.status(200).json({
                message:"successfully followed ",
                followUser
              }) 
        } catch (e) {
            if (!e.status) {
              console.log(e)
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
    static async apiUnfollowUser(req,res,next){
        try {
            const unfollowUser = await FollowUnfollowService.UnfollowUser(req.body, req.user_ID);
            res.status(200).json({
                message:"successfully unfollowed",
                unfollowUser
              }) 
        } catch (e) {
            if (!e.status) {
              console.log(e)
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