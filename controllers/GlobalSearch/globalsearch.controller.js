const GlobalSearchService = require('../../services/GlobalSearchService');
module.exports = class GlobalSearchController {
  static async apiGetGlobalSearch(req, res, next) {
    try {
      const searchResult = await GlobalSearchService.getGlobalSearch(req.query, req.user_ID);
      await GlobalSearchService.createAnalyticsKeyword(searchResult, req.query, req.user_ID);
      res.status(200).send({ searchResult });

    } catch (e) {
      console.log(e)
      if (!e.status) {
        res.status(500).json({
          error: {
            message: ` something went wrong try again :try giving other keywords ${e.message} `
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