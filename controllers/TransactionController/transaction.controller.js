const errorHandler = require("../../middlewares/errorHandler.js");
const TransactionService = require("../../services/TransactionService.js");


module.exports = class TransactionController {

    static async apiGetOrderId(req, res, next) {
        try {
            const TransactionOrderDoc = await TransactionService.getOrderService(req.body, req.user_ID)
            res.status(200).json({
                message: TransactionOrderDoc
            })
        } catch (e) {
            errorHandler(e, res)
        };
    }

    static async apiSaveTransaction(req, res, next) {
        try {
            const SaveTransactionDoc = await TransactionService.saveTrasactionService(req.body, req.user_ID)
            res.status(200).json({
                message: SaveTransactionDoc
            })
        } catch (e) {
            errorHandler(e, res)
        };
    }
};