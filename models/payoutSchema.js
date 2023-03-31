const mongoose = require("mongoose");

const payoutSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        ad_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        payout_id: {
            type: String,
        },
        fund_account_id: {
            type:  String,
        },
        contact_id: {
            type:  String,
        },
        reference_id:{
            type:  String,
        },
        amount: {
            type: Number
        },
        vpa:{
            type:Object
        },
        payment_status: {
            type: String,
            enum: [
                'Not_Claimed',
                'processing',
                'Paid',
                'Failed',
            ]
        },
        failure_reason:{
            type: String,
        },
        payment_initate_date: {
            type: String,
        },
        payment_completion_date: {
            type: String,
        }
    }
);

const PayoutModel = mongoose.model('payout', payoutSchema);
module.exports = PayoutModel;