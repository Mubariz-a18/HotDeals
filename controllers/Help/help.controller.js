const { request } = require("express");
const HelpService = require("../../services/HelpService");

module.exports = class HelpController {
  static async apiCreateHelp(req, res, next) {
    try {
      const helpData = await HelpService.createHelp(req.body, req.userId);
      console.log(helpData);
      if (helpData) {
        res.status(200).send({
          message: "Success",
          data: helpData,
        });
      }
      else{
        res
        .status(400)
        .json({ error: "Something went wrong" });
      }
    } catch (error) {}
  }
};
