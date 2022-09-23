const catF = require("../models/catFields");

module.exports = class CatFieldController {

  static async apiGetCatFields(req, res, next) {
    try {
      const result = await catF.find({})
    
      console.log(result);
  
      res.status(200).send( 
result

      );
    } catch (error) {
      console.log(error);
    }



}
  }