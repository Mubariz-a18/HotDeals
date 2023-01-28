const TransactionService = require("../../services/TransactionService.js");


module.exports = class TransactionController {

    static async apiGetOrderId(req, res, next) {
        try {
            const TransactionOrderDoc = await TransactionService.getOrderService(req.body,req.user_ID)
            res.status(200).json({
                message : TransactionOrderDoc
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