const Profile = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const ObjectId = require('mongodb').ObjectId;
const { currentDate } = require('../utils/moment');
const { track } = require("./mixpanel-service");

module.exports = class FollowUnfollowService {
    // follow user
    static async followUser(bodyData, userId) {
        // finding user if exist
        const dbUser = await Profile.findById({ _id: userId })
        if (dbUser) {
            if (userId == bodyData.following_id) {
                throw ({ status: 401, message: 'ACCESS_DENIED' });
            }
            // if user exist find user_to_follow 
            const user_to_follow = await Profile.findById({ _id: bodyData.following_id })
            if (user_to_follow) {
                //if user_to_follow exist -- check if user is  already following
                const alreadyExistInFollowers = user_to_follow.followers.includes(dbUser._id)
                const alreadyExistInfollowing = dbUser.followings.includes(bodyData.following_id)

                // if not user_id is saved in users profile -- increase follower count
                if (alreadyExistInFollowers == false && alreadyExistInfollowing == false) {
                    const user_followed = await Profile.findByIdAndUpdate(bodyData.following_id,
                        {
                            $push: {
                                followers: ObjectId(userId),
                            },
                            $inc: {
                                followers_count: 1
                            }
                        }
                    )
                    // update user`s prfile  - increase following count
                    const user_update = await Profile.findByIdAndUpdate(dbUser._id,
                        {
                            $push: {
                                followings: ObjectId(bodyData.following_id),
                            },
                            $inc: {
                                followings_count: 1
                            }
                        })
                    const followInfo = {
                        user_followed, user_update
                    }
                    // mix panel track for user folowed
                    await track("user followed", {
                        distinct_id: userId,
                        message: `${dbUser.name} followed ${user_followed.name}`,
                        userfollowed: bodyData.following_id
                    })

                    return (followInfo)
                } else {
                    // mixpanel track -user already following
                    await track("user already following", {
                        distinct_id: userId,
                        message: `${dbUser.name} already follows ${user_to_follow.name} `,
                        userfollowed: bodyData.following_id
                    })
                    throw ({ status: 200, message: 'USER_ALREADY_FOLLOWED' });
                }
            } else {
                // mix panel track for user folowed
                await track("user failed to  followed", {
                    distinct_id: userId,
                    message: `${dbUser.name} tried to follow ${user_to_follow.name} -- FAILED`,
                    userfollowed: bodyData.following_id
                })
                throw ({ status: 404, message: 'USER_TO_FOLLOW_NOT_EXISTS' });
            }
        } else {
            // mix panel track for user folowed
            await track("user failed to  followed", {
                distinct_id: userId,
                userfollowed: bodyData.following_id,
                message: `${userId} doesnt exist`
            })
            throw ({ status: 404, message: 'USER_NOT_EXISTS' });
        }

    }
    // unfollow user
    static async UnfollowUser(bodyData, userId) {
        const dbUser = await Profile.findById({ _id: userId })
        // finding user if exist
        if (dbUser) {
            if (userId == bodyData.unfollowing_id) {
                throw ({ status: 401, message: 'ACCESS_DENIED' });
            }
            // if user exist find user_to_unfollow 
            const user_to_unfollow = await Profile.findById({ _id: bodyData.unfollowing_id })
            if (user_to_unfollow) {

                //if user_to_unfollow exist -- check users exist in following
                const alreadyExistInFollowers = user_to_unfollow.followers.includes(dbUser._id)
                const alreadyExistInfollowing = dbUser.followings.includes(bodyData.unfollowing_id)

                // if exist user_id is removed from  users profile -  followers feild -  decrease he follower count
                if (alreadyExistInFollowers == true && alreadyExistInfollowing == true) {
                    const user_unfollowed = await Profile.findByIdAndUpdate(bodyData.unfollowing_id,
                        {
                            $pull: {
                                followers: ObjectId(userId),
                            },
                            $inc: {
                                followers_count: -1
                            }
                        }
                    )
                    // and users following is also updated -- decrease he following count
                    const user_update = await Profile.findByIdAndUpdate(dbUser._id,
                        {
                            $pull: {
                                followings:
                                    ObjectId(bodyData.unfollowing_id),
                            },
                            $inc: {
                                followings_count: -1
                            }
                        })
                    const followInfo = {
                        user_unfollowed,
                        user_update
                    }
                    // mix panel track for user unfolowed
                    await track("user unfollowed", {
                        distinct_id: userId,
                        message: `${dbUser.name} unfollowed ${user_unfollowed.name}`,
                        userUnfollowed: bodyData.Unfollowing_id
                    });
                    return (followInfo)
                } else {
                    //if user is already unfollowed throw error
                    throw ({ status: 404, message: 'USER_ALREADY_REMOVED' });
                }
            } else {
                await track("user failed to unfollowed", {
                    distinct_id: userId,
                    userUnfollowed: bodyData.Unfollowing_id,
                    message: `${bodyData.unfollowing_id} doesnot exist`
                });
                // if user_to_unfollow doesnot exists throw error
                throw ({ status: 404, message: 'USER_INFO_NOT_EXISTS' });
            }
        } else {
            //mixpanel track -- failed to unfollow
            await track("user failed to followed", {
                distinct_id: userId,
                userUnfollowed: bodyData.Unfollowing_id,
                message: `${userId} doesnt exist`
            });
            // if user doesnot exist throw error
            throw ({ status: 404, message: 'USER_NOT_EXISTS' });
        }

    };
};

