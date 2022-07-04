const User = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");

module.exports = class FollowUnfollowService {
  static async followUser(followUserId, followingUserId) {
    console.log(
      "inside FollowUnfollow Service:" + followUserId,
      followingUserId
    );

    const updatefollowUserInfo = await User.findByIdAndUpdate(followingUserId, {
      $push: {
        following_info: {
          _id: followUserId,
        },
      },
    });
    const updatefollowInfo = await Rating.findByIdAndUpdate(followingUserId, {
      $push: {
        following_info: {
          _id: followUserId,
        },
      },
    });

    console.log(updatefollowUserInfo);

    const updateFollowingUserInfo = await User.findByIdAndUpdate(followUserId, {
      $push: {
        follower_info: {
          _id: followingUserId,
        },
      },
    });

    const updateFollowingInfo = await Rating.findByIdAndUpdate(followUserId, {
      $push: {
        follower_info: {
          _id: followingUserId,
        },
      },
    });

    console.log(updateFollowingUserInfo);
  }
};
