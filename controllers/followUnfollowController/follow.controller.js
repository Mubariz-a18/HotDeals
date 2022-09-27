const FollowUnfollowService = require('../../services/FollowUnfollowService')


module.exports = class FollowController {

    // New Follow User
    static async apiFollowUser(req, res, next) {
        try {
            // console.log("inside Follow Controller:" + req.user_ID);
            const followerId = req.user_ID;

            const followUser = await FollowUnfollowService.followUser(req, req.body, req.user_ID);
            console.log(followUser)
            if(followUser){
                console.log("inside if")
                res.send({
                    message:"success",
                    statusCode:200
                })
            }else {
                return res.send("user not found")
            }

        } catch (error) {
            return res.status(500).send({ error: "User Follow Failed" });

        }
    }


    //Unfollow Existing User
    static async apiUnfollowUser(req,res,next){
        try {
            const unfollowUser = await FollowUnfollowService.UnfollowUser(req.body, req.user_ID)
            if(unfollowUser){
                console.log("inside if")
                res.send({
                    message:"successfully unfollowed",
                    statusCode:200
                })
            }else{
                res.send("user not found")
            }
        } catch (error) {
            return res.status(500).send({ error: "User Follow Failed" });

        }
    }


    //Give Ratings to a User
    static async apiRatingUser(req,res,next){
        try {
            const RatingResult = await FollowUnfollowService.RatingToUser(req.body, req.user_ID);
            if(RatingResult){
                res.send({
                    statusCode:"200",
                    message:"Success"
                })
            }
        } catch (error) {
            
        }
    }
}