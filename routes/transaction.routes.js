const express = require("express");

const router = express.Router();

const TransactionController = require("../controllers/TransactionController/transaction.controller.js");

const { verifyJwtToken } = require("../utils/verifyToken.js");

router.post("/api/v1/getOrderId",verifyJwtToken, TransactionController.apiGetOrderId);
router.post("/api/v1/saveTrasaction",verifyJwtToken, TransactionController.apiSaveTransaction);
router.get("/api/v1/getInvoices",verifyJwtToken, TransactionController.apigetInvoices);



module.exports = router;