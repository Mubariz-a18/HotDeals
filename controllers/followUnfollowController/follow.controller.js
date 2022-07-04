const FollowUnfollowService = require('../../services/FollowUnfollowService')

module.exports = class FollowController{
    static async apiFollowUser(req,res,next){
        try {
            console.log("inside Follower Controller:" +req.params.id);
            const followUserId = req.params.id;
            const followingUserId = req.userId;
            console.log(followUserId,followingUserId)

            const followUser = await FollowUnfollowService.followUser(followUserId,followingUserId)
        } catch (error) {
            
        }
    }
}