const errorHandler = require("../../middlewares/errorHandler");
const ReportService = require("../../services/reportService");


module.exports = class ReportController {

  //Create Complain
  static async apiReportAd(req, res, next) {
    try {
      const ReportData = await ReportService.reportAd(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully created",
        ReportData
      })
    } catch (e) {
      errorHandler(e, res)
    };
  }
};
