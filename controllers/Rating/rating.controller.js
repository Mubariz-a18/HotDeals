const Profile = require("../../models/Profile/Profile");
const Rating = require("../../models/ratingSchema");
const RatingService = require("../../services/RatingService");

// Creating Ratings

module.exports = class RatingController {
  static async apiCreateRating(req, res, next) {
    try {
      const RatingDoc = await RatingService.createRating(req.body,  req.user_ID);
      if (RatingDoc) {
        res.status(200).send({
          message: "Success",
          data: RatingDoc,
        });
      } else {
        res.status(400).send({
          error: "Something went wrong in Rating Controller",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  static async apiUpdateRating(req,res,next){
    try{
      const RatingDoc =  await RatingService.updateRating(req.body,  req.user_ID);
      if (RatingDoc) {
        res.status(200).send({
          message: "Success",
          data: RatingDoc,
        });
      } else {
        res.status(400).send({
          error: "Something went wrong in update Rating Controller",
        });
      }
    }catch (error) {
      console.log(error);
    }
  }
};