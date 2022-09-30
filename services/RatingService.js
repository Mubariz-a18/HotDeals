const User = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const currentDate = require("../utils/moment");

module.exports = class RatingService {
  // creating a new Rating document for a particular user
  static async createRating(bodyData, userId) {
    try {
      console.log("Inside Rating Service");
      const user = await User.findOne({
        _id: userId,
      });
      if (user) {
        // If the array of Rating Info Dosn not contain any ratings create a new object
        const alreadyexist = await Rating.findOne({ user_id: bodyData.user_id })
        if (!alreadyexist) {
          const ratDoc = await Rating.create({
            user_id: bodyData.user_id,
            average_rating: bodyData.RatingInfo.rating,
            RatingInfo: {
              rating_given_by: userId,
              rating: bodyData.RatingInfo.rating,
              rating_given_date: currentDate,
              rating_updated_date: currentDate
            }
          });

          // find the document created and update the user profile accordingly
          const Rating_doc = await Rating.find({ user_id: bodyData.user_id })
          await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
            rate_average: Rating_doc[0].average_rating,
            rate_count: Rating_doc[0].RatingInfo.length
          });
          return ratDoc;

        } else {
          // else if the array consists of any object push other objects in the array 
          const Rating_Already_exist_By_User = await Rating.findOne({ RatingInfo: { $elemMatch: { "rating_given_by": userId } } })
          if (!Rating_Already_exist_By_User) {
            const findRatedUserAndUpdate = await Rating.findOneAndUpdate({
              user_id: bodyData.user_id
            },
              {
                $push: {
                  RatingInfo: {
                    average_rating: bodyData.RatingInfo.rating,
                    rating: bodyData.RatingInfo.rating,
                    rating_given_by: userId,
                    rating_given_date: currentDate,
                    rating_updated_date: currentDate
                  }
                }
              },
              { new: true }
            )
           

            // UpdatingThe average Rating Feild in Rating Document As well as rate average Users profile
            const Rating_doc = await Rating.find({ user_id: bodyData.user_id })
            let average = 0;

            Rating_doc[0].RatingInfo.forEach(rat => {
              average += rat.rating;
            });
            Rating_doc[0].average_rating = average / Rating_doc[0].RatingInfo.length;
            await Rating_doc[0].save();

            console.log(Rating_doc[0], Rating_doc[0].RatingInfo.length)
            const update_User_avg_rating = await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
              rate_average: Rating_doc[0].average_rating,
              rate_count: Rating_doc[0].RatingInfo.length
            })
            await findRatedUserAndUpdate.save();

            return Rating_doc[0];

          } else {

            const update_User_Rating = await Rating.updateOne({
              user_id: bodyData.user_id,
              "RatingInfo.rating_given_by": userId
            },
              {
                $set: {
                  "RatingInfo.$.rating": bodyData.RatingInfo.rating,
                  "RatingInfo.$.rating_updated_date" : currentDate
                }
              })

              const Rating_doc = await Rating.find({ user_id: bodyData.user_id })
              let average = 0;
  
              Rating_doc[0].RatingInfo.forEach(rat => {
                average += rat.rating;
              });
              Rating_doc[0].average_rating = average / Rating_doc[0].RatingInfo.length;
              await Rating_doc[0].save();
  
              console.log(Rating_doc[0], Rating_doc[0].RatingInfo.length)
              const update_User_avg_rating = await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
                rate_average: Rating_doc[0].average_rating,
                rate_count: Rating_doc[0].RatingInfo.length
              })

            return  Rating_doc[0] ;
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
