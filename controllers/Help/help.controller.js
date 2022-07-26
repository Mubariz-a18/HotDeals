const { request } = require("express");
const HelpService = require("../../services/HelpService");

module.exports = class HelpController {
  static async apiCreateHelp(req, res, next) {
    try {
      const helpData = await HelpService.createHelp(req.body,req.user_ID);
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
  static async apiDeleteHelp(req,res,next){
    try {
      const deleteHelp = await HelpService.deleteHelp(req.body,req.user_ID);
      if(deleteHelp){
        res.send({
          message:"success",
          statusCode:"200"
        })
      }
      else{
        res.send({
          error:"Something went wrong in deleting the help api/Bad Request",
          statusCode:400
        })
      }
    } catch (error) {
      res.send({
        error:"Something went wrong in deleting the help api",
        statusCode:400
      })
    }
  }
};
