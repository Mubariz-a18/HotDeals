const Profile = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const ObjectId = require('mongodb').ObjectId;
const {currentDate} = require('../utils/moment');
const { track } = require("./mixpanel-service");

module.exports = class FollowUnfollowService {
  static async followUser(res,bodyData, userId) {
    try {
        const dbUser = await Profile.findById({ _id: userId })
        if (dbUser) {
            const user_to_follow = await Profile.findById({ _id: bodyData.following_id })
            if (user_to_follow) {

                const alreadyExistInFollowers = user_to_follow.followers.includes(dbUser._id)
                const alreadyExistInfollowing = dbUser.followings.includes(bodyData.following_id)

                console.log(alreadyExistInFollowers, alreadyExistInfollowing)

                if (alreadyExistInFollowers == false && alreadyExistInfollowing == false) {
                    const user_followed = await Profile.findByIdAndUpdate(bodyData.following_id,
                        {
                            $push: {
                                followers: ObjectId(userId),
                            }
                        }
                    )
                    const user_update = await Profile.findByIdAndUpdate(dbUser._id,
                        {
                            $push: {
                                followings:
                                    ObjectId(bodyData.following_id),

                            }
                        })
                    const followInfo = {
                        user_followed, user_update
                    }
                       await track("user followed",{
                            distinct_id : userId,
                            message:`${dbUser.name} followed ${user_followed.name}`,
                            userfollowed : bodyData.following_id 
                        })

                    return (followInfo)
                } else {
                    return ({
                        statusCode: 403,
                        message: "already following"
                    })
                }
            } else {
                return ({
                    statusCode: 403,
                    message: "Following Info Not Found"
                })
            }
        } else {
            return ({
                statusCode: 403,
                message: "unauthorized"
            })
        }
    }
    catch (e) {
        res.send(e)
    }
}

static async UnfollowUser(bodyData, userId) {
    try {
        const dbUser = await Profile.findById({ _id: userId })
        console.log(dbUser)
        if (dbUser) {
            const user_to_unfollow = await Profile.findById({ _id: bodyData.unfollowing_id })
            if (user_to_unfollow) {

                const alreadyExistInFollowers = user_to_unfollow.followers.includes(dbUser._id)
                const alreadyExistInfollowing = dbUser.followings.includes(bodyData.unfollowing_id)

                if (alreadyExistInFollowers == true && alreadyExistInfollowing == true) {
                    const user_unfollowed = await Profile.findByIdAndUpdate(bodyData.unfollowing_id,
                        {
                            $pull: {
                                followers: ObjectId(userId),
                            }
                        }
                    )
                    const user_update = await Profile.findByIdAndUpdate(dbUser._id,
                        {
                            $pull: {
                                followings:
                                    ObjectId(bodyData.unfollowing_id),

                            }
                        })
                    const followInfo = {
                        user_unfollowed,
                        user_update
                    }
                    await track("user unfollowed",{
                        distinct_id : userId,
                        message:`${dbUser.name} unfollowed ${user_unfollowed.name}`,
                        userUnfollowed : bodyData.Unfollowing_id 
                    });
                    return (followInfo)
                } else {
                    return ({
                        statusCode: 403,
                        message: "already removed"
                    })
                }
            } else {
                return ({
                    statusCode: 403,
                    message: "Following Info Not Found"
                })
            }
        } else {
            return ({
                statusCode: 403,
                message: "unauthorized"
            })
        }
    }
    catch (e) {
        console.log(e.message)
    }
}
  

  // Rating A User
  static async RatingToUser(bodyData, userId) {
    console.log("here in f2uf")
    const findUsr = await Profile.find({
      _id: userId,
    })
    if (findUsr) {
      const findRatedUsr = await Profile.findOne({
        user_id: bodyData.rated_user_id
      })
      if (findRatedUsr) {
        console.log(userId)
        console.log(bodyData.rated_user_id)
        const findRatedUsr = await Rating.findOneAndUpdate({
          user_id: bodyData.rated_user_id
        },
          {
            $push: {
              RatingInfo: {
                rating: bodyData.rating,
                rating_given_by: userId,
                rating_given_date: currentDate,
                rating_updated_date: currentDate
              }
            }
          }
        );
        await track("user rating",{
            distinct_id : userId,
            rating_given_to :  bodyData.rated_user_id
        });
        return findRatedUsr;
      }
    }

  }
};

