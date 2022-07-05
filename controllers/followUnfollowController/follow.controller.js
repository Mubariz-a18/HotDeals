const FollowUnfollowService = require('../../services/FollowUnfollowService')

module.exports = class FollowController {
    static async apiFollowUser(req, res, next) {
        try {
            console.log("inside Follow Controller:" + req.params.id);
            const followerId = req.params.id;
            const followingId =req.user_ID;
            console.log(followerId, followingId)

            const followUser = await FollowUnfollowService.followUser(followerId, followingId)

        } catch (error) {
            return res.status(500).send({ error: "User Follow Failed" });

        }
    }

    static async apiUnfollowUser(req,res,next){
        try {
            console.log("inside Follow Controller:" + req.params.id);
            const UnfollowerId = req.params.id;
            const UnfollowingId =req.user_ID;
            console.log(UnfollowerId, UnfollowingId)

            const followUser = await FollowUnfollowService.UnfollowUser(UnfollowerId, UnfollowingId)
        } catch (error) {
            return res.status(500).send({ error: "User Follow Failed" });

        }
    }
}