const errorHandler = require("../../middlewares/errorHandler");
const RatingService = require("../../services/RatingService");
module.exports = class RatingController {
  // api creating rating Doc
  static async apiCreateRating(req, res, next) {
    try {
      const RatingDoc = await RatingService.createRating(req.body, req.user_ID);
      // Response code is sent with ratingdoc 
      res.status(200).json({
        message: "successfully created",
        RatingDoc: RatingDoc
      });
    } catch (e) {
      errorHandler(e, res)
    };
  }
  // Api getrating
  static async apiGetRating(req, res, next) {
    try {
      const RatingDoc = await RatingService.getRating(req.body, req.user_ID);
      // Response code is sent with ratingdoc 
      res.status(200).json({
        message: "successfull",
        Rating: RatingDoc
      });
    } catch (e) {
      errorHandler(e, res)
    };
  }
};