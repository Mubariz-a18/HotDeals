const errorHandler = require('../../middlewares/errorHandler');
const GlobalSearchService = require('../../services/GlobalSearchService');
module.exports = class GlobalSearchController {
  // api get global search
  static async apiGetGlobalSearch(req, res, next) {
    try {
      // Global search -- ads are fetched and returned from global search service  && analytics are created 
      if (req.user_ID) {
        const searchResult = await GlobalSearchService.getGlobalSearch(req.query, req.user_ID);
        await GlobalSearchService.createAnalyticsKeyword(searchResult, req.query, req.user_ID);
        res.status(200).json({ data: searchResult, totalAdsSearched: searchResult.length });
      } else {
        const searchResult = await GlobalSearchService.getGlobalSearch(req.query, req.user_ID);
        await GlobalSearchService.createAnalyticsForNonUsers(searchResult, req.query);
        res.status(200).json({ data: searchResult, totalAdsSearched: searchResult.length });
      }

    } catch (e) {
      errorHandler(e, res)
    };
  }
}