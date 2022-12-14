const GlobalSearchService = require('../../services/GlobalSearchService');
module.exports = class GlobalSearchController {
  // api get global search
  static async apiGetGlobalSearch(req, res, next) {
    try {
      // Global search -- ads are fetched and returned from global search service  && analytics are created 
      const searchResult = await GlobalSearchService.getGlobalSearch(req.query, req.user_ID);
      await GlobalSearchService.createAnalyticsKeyword(searchResult, req.query, req.user_ID);
      res.status(200).json({ data: searchResult, totalAdsSearched: searchResult.length });
    } catch (e) {
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