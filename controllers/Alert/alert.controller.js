const AlertService = require("../../services/AlertService");

module.exports = class AlertController {

  // create Alert --  Alert doc is created and retured from adservice  in AlertData
  static async apiCreateAlert(req, res, next) {
    try {
      console.log(req.user_ID)
      const userId = req.user_ID
      const body = req.body
      const alertData = await AlertService.createAlert(body , userId);
      // Response code is sent with alertData 
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
  };


  //Get Alert --  Alert docs is Fetched and retured from adservice  in getAlert
  static async apiGetAlert(req, res, next) {
    try {
      const userId = req.user_ID
      const body = req.body
      const getAlert = await AlertService.getAlert(body,userId);
      
      // Response code is sent with getAlert
      if (getAlert) {
        res.status(200).send({
          statusCode: 200,
          Alerts: getAlert,
        });
      } else {
        res.status(404).send({
          error: "Alert not found",
        });
      }
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  };

  //Update Alert -- Alert doc is Updated and retured from adservice  in updateAlert
  static async apiUpdateAlert(req, res, next) {
    try {
      const body = req.body;
      const {alert_id} = req.body;
      const userId = req.user_ID;
      const updateAlert = await AlertService.updateAlert(body, alert_id,userId);
     // Response code is sent with updateAlert
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
  };


  //Delete Alert --Alert doc is Deleted and retured from adservice  in deleteAlert
  static async apiDeleteAlert(req, res, next) {
    try {
      const { alert_id } = req.body;
      const userId = req.user_ID;
      const deleteAlert = await AlertService.deleteAlert(alert_id, userId);
      if (deleteAlert) {
        res.status(200).send({
          message: "SuccessFully Deleted Alert",
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