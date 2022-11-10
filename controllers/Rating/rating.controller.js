const RatingService = require("../../services/RatingService");
module.exports = class RatingController {
  // api creating rating Doc
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
  // Api getrating
  static async apiGetRating(req, res, next) {
    try {
      const RatingDoc = await RatingService.getRating(req.body,  req.user_ID);
      // Response code is sent with ratingdoc 
      res.status(200).json({
        message:"successfull",
       Rating :RatingDoc
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
};