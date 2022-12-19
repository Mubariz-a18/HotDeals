const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    total_Ads_suspended: {
        type: Number,
        default: 0
    },
    flag: {
        type: String,
        enum: ["Yellow", "Orange", "Red", "Green"],
        default: "Green"
    },
    flag_Date: {
        type: String,
    },
    grace_counter: {
        type: String
    },
    reports_box: [
        {
            _id: false,
            ad_id: {
                type: mongoose.Types.ObjectId,
            },
            ad_report_counter: {
                type: Number,
                default: 0
            },
            report_action_status: {
                type: Boolean
            },
            report_action_date: {
                type: String
            },
            reports_list: [
                {
                    _id: false,
                    reported_user_id: {
                        type: mongoose.Types.ObjectId
                    },
                    reason: {
                        type: String
                    },
                    description: {
                        type: String
                    },
                    reported_date: {
                        type: String
                    }
                }
            ]
        }
    ]
})

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;