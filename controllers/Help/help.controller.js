const errorHandler = require("../../middlewares/errorHandler");
const HelpService = require("../../services/HelpService");

module.exports = class HelpController {

  // Create New Help
  static async apiCreateHelp(req, res, next) {
    try {
      const Help_Doc = await HelpService.createHelp(req.body, req.user_ID);
      res.status(200).json({
        message: "successfully created",
        Help_Doc
      })
    } catch (e) {
      errorHandler(e,res)
    };
  }

  // Delete Help
  static async apiDeleteHelp(req, res, next) {
    try {
      const deleteHelp_doc = await HelpService.deleteHelp(req.body, req.user_ID);
      res.status(200).json({
        deleteHelp_doc
      })
    } catch (e) {
     errorHandler(e,res)
    };
  }

  // Get Help
  static async apiGetHelp(req, res, next) {
    try {
      const getHelp = await HelpService.getHelp(req.user_ID);
      res.status(200).json({
        message: "successfully",
        getHelp
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
