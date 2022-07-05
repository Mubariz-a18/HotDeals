const DashBoardService = require("../../services/DashBoardService");

module.exports = class DashBoardController {
  static async apiGetDashBoard(req, res, next) {
    try {
        console.log("Inside DashBoard Controller")
        console.log(req.query)
      const dashBoardData = await DashBoardService.getDashBoard(req.body);
      if (dashBoardData) {
        res.status(200).send({ DashBoardData: DashBoardData });
      }
    } catch (error) {
        console.log(error)
    }
  }
};
