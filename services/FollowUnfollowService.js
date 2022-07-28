const Profile = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");

module.exports = class FollowUnfollowService {
  static async followUser(followerId, followingId) {
    console.log(
      "inside FollowUnfollow Service:" + followerId,
      followingId
    );

    const whomFollowed = await Profile.findByIdAndUpdate(followingId, {
      $push: {
        following_info: {
          _id: followerId,
        },
      },
    });
    const updatewhomFollowed = await Rating.findByIdAndUpdate(followingId, {
      $push: {
        following_info: {
          user_id: followerId,
        },
      },
    });

    const whoFollowedMe = await Profile.findByIdAndUpdate(followerId, {
      $push: {
        follower_info: {
          _id: followingId,
        },
      },
    });

    const updatewhoFollowedMe = await Rating.findByIdAndUpdate(followerId, {
      $push: {
        follower_info: {
          user_id: followingId,
        },
      },
    });
    const followerInfo = {
      whomFollowed:whomFollowed,
      updatewhomFollowed:updatewhomFollowed,
      whoFollowedMe:whoFollowedMe,
      updatewhoFollowedMe:updatewhoFollowedMe
    }
    return followerInfo;
  }


  static async UnfollowUser(UnfollowerId, UnfollowingId) {

    console.log("inside unfollow")
    console.log(UnfollowerId, UnfollowingId)

    const whomUnFollowed = await Profile.findByIdAndUpdate(UnfollowingId, {
      $pull: {
        following_info: {
          _id: UnfollowerId,
        },
      },
    });

    const whoUnFollowedMe = await Profile.findByIdAndUpdate(UnfollowerId, {
      $pull: {
        follower_info: {
          _id: UnfollowingId,
        },
      },
    });

    const followerInfo = {
      whomFollowed:whomUnFollowed,
      whoUnFollowedMe:whoUnFollowedMe,
    }
    return followerInfo;


  }
};
