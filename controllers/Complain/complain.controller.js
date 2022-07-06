const ComplainService = require("../../services/ComplainService");

module.exports = class ComplainController {
  static async apiCreateComplain(req, res, next) {
    try {
        console.log("Inside Complai Controller")
      const complnData = await ComplainService.createComplain(
        req.body,
        req.user_ID
      );
      if (complnData) {
        res
          .status(200)
          .send({ message: "Complain created successfully", data: complnData });
      } else {
        res.status(404).send({ error: "Something went wrong" });
      }
    } catch (error) {}
  }
};
