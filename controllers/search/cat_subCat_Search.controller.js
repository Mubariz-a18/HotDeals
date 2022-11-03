const Cat_SubCat_Search_service = require('../../services/cat_subCat_search_service')
module.exports = class Cat_SubCat_Search{

static async get_Ads_category_subcategory(req, res, next) {
    try {
      const cat_docs = await Cat_SubCat_Search_service.get_cat_subCat_ads(req.query);
      // Response code is send 
        res.status(200).send({
          message: "success!",
          cat_docs
        });
    } catch (e) {
      console.log(e)
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

}