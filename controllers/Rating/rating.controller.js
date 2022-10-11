const Profile = require("../../models/Profile/Profile");
const Rating = require("../../models/ratingSchema");
const RatingService = require("../../services/RatingService");

// Creating Ratings

module.exports = class RatingController {
  static async apiCreateRating(req, res, next) {
    try {
      const RatingDoc = await RatingService.createRating(req.body,  req.user_ID);
      // Response code is sent with ratingdoc 
      res.status(200).json({
        message:"successfully created",
        RatingDoc: RatingDoc
      });
    } catch (e) {
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again : ${e.message} `
          }
        });
      } else {
        res.status(e.status).json({
          error: {
            message: e.message
          }
        });
      };
    };
  }
  // static async apiUpdateRating(req,res,next){
  //   try{
  //     const RatingDoc =  await RatingService.updateRating(req.body,  req.user_ID);
  //    // Response code is sent with ratingdoc 
  //    res.status(200).json({
  //      message:"successfully created",
  //      RatingDoc: RatingDoc
  //    });
  //   }catch (e) {
  //     if (!e.status) {
  //       res.status(500).json({
  //         error: {
  //           message: ` something went wrong try again : ${e.message} `
  //         }
  //       });
  //     } else {
  //       res.status(e.status).json({
  //         error: {
  //           message: e.message
  //         }
  //       });
  //     };
  //   };
  // }
};