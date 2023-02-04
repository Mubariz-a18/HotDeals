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
            amount: bodyData.amount,
            status: "Pending",
            order_id: order.id.toString(),
            payment_initate_date: currentDate
        });

        return TransactionOrder

    };

    static async saveTrasactionService(bodyData) {

        const orderId = bodyData.orderId;

        if(bodyData.status === "Failed"){

            await Transaction.findOneAndUpdate(

                { order_id: orderId }, {

                $set: {

                    status: "Failed",
                    payment_completion_date: currentDate

                }
            });
            throw ({ status: 403, message: "UNAUTHORIZED" });
        }

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const crypto = require("crypto");

        const key_secret = process.env.key_secret;



        const paymentId = bodyData.paymentId

        const paymentSignature = bodyData.paymentSignature;


        const text = orderId + "|" + paymentId;

        const generatedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(text)
            .digest("hex");

        if (generatedSignature === paymentSignature) {

            await Transaction.findOneAndUpdate(
                { order_id: orderId }, {
                $set: {
                    status: "Successfull",
                    payment_completion_date: currentDate
                }
            });

            return "Signature verified"
        } else {
            await Transaction.findOneAndUpdate(
                { order_id: orderId }, {
                $set: {
                    status: "Failed",
                    payment_completion_date: currentDate
                }
            });
            throw ({ status: 403, message: "UNAUTHORIZED" });
        }
    };

    static async getInvoiceService(user_ID){
        const Invoices = await Transaction.find({user_id:ObjectId(user_ID),status:"Successfull"});
        if(Invoices){
            return Invoices
        }else{
            throw ({ status: 404, message: "NO_INVOICES_FOUND" });
        }
    }
}