const ComplaintService = require("../../services/ComplaintService");

module.exports = class ComplainController {

  //Create Complain
  static async apiCreateComplaint(req, res, next) {
    try {
      console.log("Inside Complai Controller")
      const complnData = await ComplaintService.createComplaint(
        req.body,
        req.user_ID,
      );
      if (complnData) {
        res.send({
          statusCode: 200,
          message: "Complaint created successfully"
        })
      } else {
        res.send({
          statusCode: 201,
          message: "Something went wrong creating theComplaint"
        })
      }
    } catch (error) {
      res.send({
        statusCode: 500,
        message: error.message
      })
    }
  }
};
