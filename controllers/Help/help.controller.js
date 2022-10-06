const { request } = require("express");
const HelpService = require("../../services/HelpService");

module.exports = class HelpController {

  // Create New Help
  static async apiCreateHelp(req, res, next) {
    try {
      const { type, message, newCmpln, statusCode } = await HelpService.createHelp(req.body, req.user_ID);
      if (type !== "Error") {
        res.status(200).send({
          message: "Success",
          data: newCmpln,
        });
      }
      else {
        res
          .status(statusCode)
          .json({ message: message });
      }
    } catch (error) {
      res.send(error.message).status(500)
    }
  }

  // Delete Help
  static async apiDeleteHelp(req, res, next) {
    try {
      const { type, message, deleteHelp, statusCode } = await HelpService.deleteHelp(req.body, req.user_ID);
      if (type !== "Error") {
        res.status(200).send({
          message: "success"
        });
      }
      else {
        res.send({
          message
        }).status(statusCode)
      }
    } catch (error) {
      res.send({
        message
      }).status(statusCode)
    }
  }
};
