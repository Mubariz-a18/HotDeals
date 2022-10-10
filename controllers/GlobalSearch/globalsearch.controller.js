const GlobalSearchService = require('../../services/GlobalSearchService');
module.exports = class GlobalSearchController {
    static async apiGetGlobalSearch(req, res, next) {
        try {

            const searchResult = await GlobalSearchService.getGlobalSearch(req.query, req.user_ID);
            console.log(searchResult);
            if (searchResult.length !== 0) {
                res.status(200).send({
                    message: "Successfull",
                    result: searchResult
                })
            }
            else {
                const createAnalytics = await GlobalSearchService.createAnalyticsKeyword(req.query, req.user_ID);
                console.log(createAnalytics)
                res.status(200).send({
                    message: "Keywords Successfully Stored!"
                })
            }
        }  catch (e) {
            if (!e.status) {
              console.log(e)
              res.status(500).json({
                error: {
                  message: ` something went wrong try again :try giving other keywords `
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