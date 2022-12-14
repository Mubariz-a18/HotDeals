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
