const ComplaintService = require("../../services/ComplaintService");

module.exports = class ComplainController {

  //Create Complain
  static async apiCreateComplaint(req, res, next) {
    try {
      console.log("Inside Complaint Controller")
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
  static async apiUpdateController(req,res,next){
    try{
      const updatedComplain = await ComplaintService.updateComplain(req.body,req.user_ID);
      if(updatedComplain){
        res.send({
          statusCode:200,
          message:"Complain updated successfully"
        })
      } else {
        res.send({
          statusCode:201,
          message:"something went wrong in updatecomplaint"
        })
      }
    } catch(error){
      res.send({
        statusCode:500,
        message:error.message
      })
    }
  }
};
