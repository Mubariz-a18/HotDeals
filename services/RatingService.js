const User = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const currentDate = require("../utils/moment");

module.exports = class RatingService {
  static async createRating(bodyData, userId) { 
    try {
      console.log("Inside Rating Service");
      const user = await User.findOne({
        _id: userId,
      });
      if (user) {
        const alreadyexist = await Rating.findOne({user_id:bodyData.user_id})
        if(!alreadyexist){
          const ratDoc = await Rating.create({
            user_id: bodyData.user_id,
            RatingInfo:{
              rating_given_by: userId,
              rating: bodyData.RatingInfo.rating,
              rating_given_date:currentDate,
              rating_updated_date:currentDate
            }
          });
          return ratDoc;
        } else {
          const Rating_Already_exist_By_User = await Rating.findOne({RatingInfo:{$elemMatch:{"rating_given_by":userId}}})

          if(!Rating_Already_exist_By_User){
            const findRatedUserAndUpdate = await Rating.findOneAndUpdate({
              user_id : bodyData.user_id
            },
              {
                $push: {
                  RatingInfo: {
                    rating: bodyData.RatingInfo.rating,
                    rating_given_by: userId,
                    rating_given_date: currentDate,
                    rating_updated_date: currentDate
                  }
                }
              }
            )
            return findRatedUserAndUpdate;
          }else {
            const findRatedAndUpdate = await Rating.updateOne({user_id:bodyData.user_id, rating_given_by:userId},
              {
                $set: {
                  RatingInfo: {
                    rating: bodyData.RatingInfo.rating,
                    rating_given_by: userId,
                    rating_updated_date: currentDate
                  }
                }
              }
            )
            console.log(findRatedAndUpdate)
            return findRatedAndUpdate;
          }
        }
      } else {
        console.log("unauthorized");
      }
    } catch (error) {
      console.log("Error inside Rating Catch Block");
    }
  }
};
