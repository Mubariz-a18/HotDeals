// const errorHandler = require("../../middlewares/errorHandler");
// const ComplaintService = require("../../services/ComplaintService");

// module.exports = class ComplainController {

//   //Create Complain
//   static async apiCreateComplaint(req, res, next) {
//     try {
//       const complaintData = await ComplaintService.createComplaint(req.body, req.user_ID,);
//       res.status(200).json({
//         message: "successfully created",
//         complaintData
//       })
//     } catch (e) {
//       errorHandler(e, res)
//     };
//   }
//   //Update Complain
//   static async apiUpdateController(req, res, next) {
//     try {
//       const updatedComplain = await ComplaintService.updateComplain(req.body, req.user_ID);
//       res.status(200).json({
//         message: "successfully updated",
//         updatedComplain
//       })
//     } catch (e) {
//       errorHandler(e, res)
//     };
//   }
// };
