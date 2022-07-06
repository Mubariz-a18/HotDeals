const GlobalSearchService = require('../../services/GlobalSearchService');
module.exports = class GlobalSearchController {
    static async apiGetGlobalSearch(req, res, next) {
        try {
            const seachKeyword1 = req.query.category;
            const seachKeyword2 = req.query.sub_category;
            const searchResult = await GlobalSearchService.getGlobalSearch(seachKeyword1, seachKeyword2, req.user_ID);
            console.log(searchResult.length);
            if (searchResult.length !== 0) {
                res.status(200).send({
                    message: "Successfull",
                    result: searchResult
                })
            }
            else {
                const createAnalytics = await GlobalSearchService.createAnalyticsKeyword(seachKeyword1, seachKeyword2, req.user_ID);
                res.status(200).send({
                    message: "Keywords Successfully Stored!"
                })
            }
        } catch (error) {
            res.status(400).send({
                error: "Error in Search!"
            })
        }
    }
}