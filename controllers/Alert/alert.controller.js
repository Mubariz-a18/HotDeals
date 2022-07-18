const AlertService = require("../../services/AlertService");

module.exports = class AlertController {
  static async apiCreateAlert(req, res, next) {
    try {
      // console.log(req.user_ID)
      const alertData = await AlertService.createAlert(req.body);

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

  static async apiGetAlert(req, res, next) {
    try {
      const getAlert = await AlertService.getAlert(req.body);
      if (getAlert) {
        res.status(200).send({
          Alerts: getAlert,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          error: "Alert not found",
        });
      }
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }

  static async apiUpdateAlert(req, res, next) {
    try {
      const updateAlert = await AlertService.updateAlert(req.body);
      if (updateAlert) {
        res.status(200).send({
          Alerts: updateAlert,
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          error: "Alert not found",
        });
      }
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }

  static async apiDeleteAlert(req, res, next) {
    try {
      const deleteAlert = await AlertService.deleteAlert(req.body);
      if (deleteAlert) {
        res.status(200).send({
          message:"SuccessFully Deleted Alert",
          statusCode: 200,
        });
      } else {
        res.status(404).send({
          error: "Alert not found",
        });
      }
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }
};
