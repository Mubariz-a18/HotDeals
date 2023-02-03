const errorHandler = require("../../middlewares/errorHandler");
const AlertService = require("../../services/AlertService");

module.exports = class AlertController {

  // create Alert --  Alert doc is created and retured from adservice  in AlertData
  static async apiCreateAlert(req, res, next) {
    try {
      const userId = req.user_ID;
      const body = req.body;
      //  Alert is created and response is sent
      const alertData = await AlertService.createAlert(body, userId);
      // Response code is sent with alertData 
      res.status(200).json({
        message: "successfully created",
        alertData: alertData
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

  // Get my alerts  -- Alerts are fetched and returned from alert service
  static async apiGetAlert(req, res, next) {
    try {
      const userId = req.user_ID;
      //  Alert is created and response is sent
      const alerts = await AlertService.GetAlert(userId);
      // Response code is sent with alertData 
      res.status(200).json({
        message: "successfully",
        alertData: alerts
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

  //Update Alert -- Alert doc is Updated and retured from adservice  in updateAlert
  static async apiUpdateAlert(req, res, next) {
    try {
      const body = req.body;
      const { alert_id } = req.body;
      const userId = req.user_ID;
      const updateAlert = await AlertService.updateAlert(body, alert_id, userId);
      // Response code is sent with updateAlert
      res.status(200).json({
        message: "successfully updated",
        alertData: updateAlert
      })
    } catch (e) {
      errorHandler(e, res)
    };
  };

  //Delete Alert --Alert doc is Deleted and retured from adservice  in deleteAlert
  static async apiDeleteAlert(req, res, next) {
    try {
      const { alert_id } = req.body;
      const userId = req.user_ID;
      //alert is removed from user profile
      const deleteAlert = await AlertService.deleteAlert(alert_id, userId);
      res.status(200).json({
        message: deleteAlert,
      });
    } catch (e) {
      errorHandler(e, res)
    };
  }
};