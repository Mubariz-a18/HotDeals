const HelpService = require("../../services/HelpService");

module.exports = class HelpController {

  // Create New Help
  static async apiCreateHelp(req, res, next) {
    try {
      const Help_Doc = await HelpService.createHelp(req.body, req.user_ID);
      res.status(200).json({
        message:"successfully created",
        Help_Doc
      }) 
    }  catch (e) {
      if (!e.status) {
        console.log(e)
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

  // Delete Help
  static async apiDeleteHelp(req, res, next) {
    try {
      const deleteHelp_doc = await HelpService.deleteHelp(req.body, req.user_ID);
      res.status(200).json({
        message:"successfully deleted",
        deleteHelp_doc
      }) 
    } catch (e) {
      if (!e.status) {
        console.log(e)
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
