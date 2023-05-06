const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        order_id: {
            type: String,
        },
        payment_id: {
            type:  String,
        },
        bundle_id: {
            type: String
        },
        amount: {
            type: Number
        },
        status: {
            type: String,
            enum: [
                'Pending',
                'Successfull',
                'Failed',
            ]
        },
        isTransactionUsed: {
            type:Boolean,
            default: false
        },
        credits_bundle: [
            {
                number_of_credit: {
                    type: Number
                },
                credit_duration: {
                    type: Number
                },
            }
        ],
        payment_initate_date: {
            type: String,
        },
        payment_completion_date: {
            type: String,
        }
    }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;