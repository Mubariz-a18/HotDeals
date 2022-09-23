const Profile = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const ObjectId = require('mongodb').ObjectId;

module.exports = class FollowUnfollowService {

  // Following a New User 
  static async followUser(bodyData, userId) {
    //authentication 
    const findUser = await Profile.findOne({
      _id: userId
    })
    //if user is authenticated find the person(other users) who the user is going to follow 
    if (findUser) {
      const findFollowingInfo = await Profile.findOne({
        _id: bodyData.following_id
      });
      // if the person(other users) exist  update the person(other user)`s profile with users_id in followers  
      if (findFollowingInfo) {

        // updating followers
        const who_Following_Me = await Profile.findByIdAndUpdate(bodyData.following_id,
          {
            $push: {
              followers: {
                _id: ObjectId(userId),
              },
            }
          }
        )

        //updating followings
        const whom_I_following = await Profile.findByIdAndUpdate(userId,
          {
            $push: {
              followings: {
                _id: ObjectId(bodyData.following_id),
              },
            }
          }
        )

        const follower_following = {
          following: who_Following_Me,
          follower: whom_I_following
        }
        return follower_following;
      }
      else {
        res.send({
          statusCode: 403,
          message: "Following Info Not Found"
        })
      }
    }
    else {
      res.send({
        statusCode: 403,
        message: "User Not Found"
      })
    }
  }

  // Unfollowing a User
  static async UnfollowUser(UnfollowerId, UnfollowingId) {

    console.log("inside unfollow")
    console.log(UnfollowerId, UnfollowingId)

    // Unfollowing a User
    const whomUnFollowed = await Profile.findByIdAndUpdate(UnfollowingId, {
      $pull: {
        following_info: {
          _id: UnfollowerId,
        },
      },
    });

    //Unfollowed By a User
    const whoUnFollowedMe = await Profile.findByIdAndUpdate(UnfollowerId, {
      $pull: {
        follower_info: {
          _id: UnfollowingId,
        },
      },
    });

    const followerInfo = {
      whomFollowed: whomUnFollowed,
      whoUnFollowedMe: whoUnFollowedMe,
    }
    return followerInfo;
  }

  // Rating A User
  static async RatingToUser(bodyData, userId) {
    const findUsr = await Profile.find({
      _id: userId,
    })
    if (findUsr) {
      const findRatedUsr = await Profile.findOne({
        user_id: bodyData.rated_user_id
      })
      if (findRatedUsr) {
        console.log("here" + findUsr[0].name)
        const findRatedUsr = await Rating.findOneAndUpdate({
          user_id: bodyData.rated_user_id
        },
          {
            $push: {
              RatingInfo: {
                rating: bodyData.rating,
                rating_given_by: findUsr[0].name,
                rating_given_date: "2022-07-27 18:29:15"
              }
            }
          }
        )
        return findRatedUsr;
      }
    }

  }
};
