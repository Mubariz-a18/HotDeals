const AlertService = require("../../services/AlertService");

module.exports = class AlertController {
  static async apiCreateAlert(req, res, next) {
    try {
      const alertData = await AlertService.createAlert(req.body,  req.user_ID);

      if (alertData) {
        res.status(200).send({
          message: "Alert created successfully",
          Data: alertData,
        });
      } else {
        res.status(404).send({
          error: "User not found",
        });
      }
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }
};
