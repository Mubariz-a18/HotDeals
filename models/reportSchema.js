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
    // Yellow_flag: {
    //     type: Boolean,
    //     default:false
    // },
    // Orange_flag: {
    //     type: Boolean,
    //     default:false
    // },
    // Red_flag: {
    //     type: Boolean,
    //     default:false
    // },
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