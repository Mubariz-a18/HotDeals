const RatingService = require("../../services/RatingService");

// Creating Ratings

module.exports = class RatingController {
  static async apiCreateRating(req, res, next) {
    try {
      const ratDoc = await RatingService.createRating(req.body,  req.user_ID);
      if (ratDoc) {
        res.status(200).send({
          message: "Success",
          data: ratDoc,
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
};
