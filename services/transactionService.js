const Razorpay = require("razorpay")
const { ObjectId } = require('mongodb');
const moment = require('moment');
const Transaction = require("../models/transactionSchema");
const crypto = require('crypto');
const fs = require('fs')
//TODO: we need to use encryption for these things
module.exports = class TransactionService {

    static async getOrderService(bodyData, user_ID) {
        try{
            const privateKey = fs.readFileSync('private-key.pem', 'utf-8')
            const encryptedData = bodyData.encryptedData
    
            const decryptedData = crypto.privateDecrypt({
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
                passphrase: process.env.CRYPTOPASSPHRASE
            }, Buffer.from(encryptedData, 'base64'));
    
            const newData = JSON.parse(decryptedData.toString('utf8'));
    
            const razorPayConfig = new Razorpay({
                key_id: process.env.LIVE_KEY_ID,
                key_secret: process.env.LIVE_KEY_SECRET,
            });
    
            const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
            const receipt_id = new ObjectId();
    
            const order = await razorPayConfig.orders.create({
                amount: newData.amount * 100,
                currency: 'INR',
                receipt: receipt_id
            });
    
            const TransactionOrder = await Transaction.create({
                _id: receipt_id,
                user_id: user_ID,
                amount: newData.amount,
                status: "Pending",
                order_id: order.id.toString(),
                payment_initate_date: currentDate
            });
    
            return TransactionOrder
    
        }catch(e){
            throw ({ status: 400, message: "Bad Request" });
        }
       
    };

    static async saveTrasactionService(bodyData) {
        //TODO: validate body
        const orderId = bodyData.orderId;

        if (bodyData.status === "Failed") {

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

        const key_secret = process.env.LIVE_KEY_SECRET;

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
                    payment_id: paymentId,
                    payment_completion_date: currentDate
                }
            });

            return "Signature verified"
        } else {
            await Transaction.findOneAndUpdate(
                { order_id: orderId }, {
                $set: {
                    status: "Failed",
                    payment_id: paymentId,
                    payment_completion_date: currentDate
                }
            });
            throw ({ status: 403, message: "UNAUTHORIZED" });
        }
    };

    static async getInvoiceService(user_ID) {
        const Invoices = await Transaction.find({ user_id: ObjectId(user_ID), status: "Successfull" });
        if (Invoices) {
            return Invoices
        } else {
            throw ({ status: 404, message: "NO_INVOICES_FOUND" });
        }
    };
}

