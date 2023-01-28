const Razorpay = require("razorpay")
const { ObjectId } = require('mongodb');

const moment = require('moment');
const Transaction = require("../models/transactionSchema");

module.exports = class TransactionService {

    static async getOrderService(bodyData, user_ID) {

        const razorPayConfig = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const receipt_id = new ObjectId();

        const order = await razorPayConfig.orders.create({
            amount: bodyData.amount * 100,
            currency: 'INR',
            receipt: receipt_id
        });

        const TransactionOrder = await Transaction.create({
            _id: receipt_id,
            user_id: user_ID,
            amount: bodyData.amount ,
            status: "Pending",
            order_id: order.id.toString(),
            payment_initate_date: currentDate
        });

        return TransactionOrder

    };
}


