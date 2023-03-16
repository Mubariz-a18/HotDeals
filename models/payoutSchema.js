const mongoose = require("mongoose");

const payoutSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        ad_id: {
            type: String
        },
        order_id: {
            type: String,
        },
        payment_id: {
            type:  String,
        },
        amount: {
            type: Number
        },
        review_status: {
            type: String,
            enum: [
                'Pending',
                'Checkout',
                'Paid',
                'Failed',
            ]
        },
        payment_initate_date: {
            type: String,
        },
        payment_completion_date: {
            type: String,
        }
    }
);

const Payout = mongoose.model('payout', payoutSchema);
module.exports = Payout;