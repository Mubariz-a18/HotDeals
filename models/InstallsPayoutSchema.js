const mongoose = require("mongoose");

const InstallsPayoutSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        referredTo: {
            type: mongoose.Schema.Types.ObjectId,
        },
        payout_id: {
            type: String,
        },
        fund_account_id: {
            type: String,
        },
        contact_id: {
            type: String,
        },
        reference_id: {
            type: String,
        },
        amount: {
            type: Number
        },
        showAmount: {
            type: Boolean,
            default:false
        },
        vpa: {
            type: Object
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
        razorpayPayoutStatus: {
            type: String,
            enum: [
                'pending',
                'queued',
                'processing',
                'processed',
                'reversed',
                'cancelled',
                'rejected'
            ]
        },
        failure_reason: {
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

const InstallPayoutModel = mongoose.model('payout.installs', InstallsPayoutSchema);
module.exports = InstallPayoutModel;