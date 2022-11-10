const User = require("../models/Profile/Profile");
const Rating = require("../models/ratingSchema");
const {currentDate} = require("../utils/moment");
const { track } = require("./mixpanel-service");

module.exports = class RatingService {
  // creating a new Rating document for a particular user
  static async createRating(bodyData, userId) {
    // check if user exist 
      const user = await User.findOne({
        _id: userId,
      });
      // if user doesnot exist throw error
      if(!user){
        //mixpanel track for failed to create rating 
        await track('failed to create Rating !! ', { 
          distinct_id: userId,
          message:`user : ${userId}  does not exist`
        })
        throw ({ status: 404, message: 'USER_NOT_EXISTS' });
      }
      // else find the user_to_rate  
      else {
        
        const user_to_rate_exist = await User.findOne({
          _id: bodyData.user_id
        });
        // if user_to_rate doesnot exist throw error
        if(!user_to_rate_exist){
          //mixpanel track for failed to create rating
          await track('failed to create Rating !! ', { 
            distinct_id: userId,
            message:`user_id : ${userId} to rate does not exist`
          })
          throw ({ status: 404, message: 'USER_TO_RATE_NOT_EXISTS' });
          //else find if the rating exist
        }
        else{
          if(userId == bodyData.user_id){
            throw ({ status: 401, message: 'ACCESS_DENIED' });
          }
        // If RatingInfo doesnot exist for a user create new one
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
          //updating the rating feilds in ratedUser
          const ratedUser = await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
            rate_average: Rating_doc[0].average_rating,
            rate_count: Rating_doc[0].RatingInfo.length
          });
          //mixpanel create rating track 
          await track('  create Rating successfully !! ', { 
            distinct_id: userId,
            message:` ${user.name} gave "${bodyData.RatingInfo.rating}" rating to ${ratedUser.name}`
          })
          return ratDoc;
        } else {
          // else if the ratingInfo Exist push other rating inside the array
          const Rating_Already_exist_By_User = await Rating.findOne({ user_id :bodyData.user_id ,"RatingInfo.rating_given_by": userId})

          if (!Rating_Already_exist_By_User) {
            const findRatedUserAndUpdate = await Rating.findOneAndUpdate({
              user_id: bodyData.user_id
            },
              {
                $push: {
                  RatingInfo: {
                    // average_rating: bodyData.RatingInfo.rating,
                    rating: bodyData.RatingInfo.rating,
                    rating_given_by: userId,
                    rating_given_date: currentDate,
                    rating_updated_date: currentDate
                  }
                }
              },
              { new: true }
            )
            // UpdatingThe average Rating Feild in Rating Document As well as rate average count in  Users profile
            const Rating_doc = await Rating.find({ user_id: bodyData.user_id })
            let average = 0;
            // finding the average rating for a user
            Rating_doc[0].RatingInfo.forEach(rat => {
              average += rat.rating;
            });
            Rating_doc[0].average_rating = average / Rating_doc[0].RatingInfo.length;
            await Rating_doc[0].save();
            //saving the average rating in user profile
            const update_User_avg_rating = await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
              rate_average: Rating_doc[0].average_rating,
              rate_count: Rating_doc[0].RatingInfo.length
            },  { new: true })
            await findRatedUserAndUpdate.save();
            await track('  create Rating successfully !! ', { 
              distinct_id: userId,
              message:` ${user.name} gave "${bodyData.RatingInfo.rating}" rating to ${update_User_avg_rating.name}`
            })
            return Rating_doc[0]
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
              const update_User_avg_rating = await User.findByIdAndUpdate({ _id: bodyData.user_id }, {
                rate_average: Rating_doc[0].average_rating,
                rate_count: Rating_doc[0].RatingInfo.length
              })
            return Rating_doc[0];
          }
        }
      }
    }
  };
  // Get Rating for a user
  static async getRating(bodyData,userId) {
    // check if user exist or not
    const userExist = await User.findById({_id :userId});
    //if not exist throw error
    if(!userExist){
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }else{
      //if exist find Rating doc for the user in bodyData 
      if(userId == bodyData.user_id){
        throw ({ status: 401, message: 'ACCESS_DENIED' });
      }
      const RatingDoc = await Rating.find({user_id:bodyData.user_id},{_id:0,"RatingInfo": {$elemMatch: {"rating_given_by": userId}}})
      let ratingInfo = RatingDoc[0].RatingInfo[0]
      //if rating found return to controller
      if(ratingInfo){
        return ratingInfo.rating
        //else throw error
      }else{
        throw ({ status: 404, message: 'RATING_NOT_EXISTS' });
      }
    }
  }
};
