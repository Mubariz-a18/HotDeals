const User = require("../models/Profile/userProfile");
const Rating = require("../models/ratingSchema");

module.exports = class RatingService {
  static async createRating(bodyData, userId) {
    try {
      console.log("Inside Rating Service");
      const user = await User.findOne({
        _id: userId,
      });
      if (user) {
        const follower_info = bodyData.follower_info;
        const following_info = bodyData.following_info;
        const ratDoc = await Rating.create({
          user_id: userId,
          follower_info: follower_info,
          following_info: following_info,
        });
        return ratDoc;
      } else {
        console.log("Error inside Rating Service");
      }
    } catch (error) {
      console.log("Error inside Rating Catch Block");
    }
  }
};
