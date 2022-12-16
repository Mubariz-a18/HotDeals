const ComplaintService = require("../../services/ComplaintService");

module.exports = class ComplainController {

  //Create Complain
  static async apiCreateComplaint(req, res, next) {
    try {
      const complaintData = await ComplaintService.createComplaint(req.body, req.user_ID,);
      res.status(200).json({
        message: "successfully created",
        complaintData
      })
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
  //Update Complain
  static async apiUpdateController(req, res, next) {
    try {
      const updatedComplain = await ComplaintService.updateComplain(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully updated",
        updatedComplain
      })
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
