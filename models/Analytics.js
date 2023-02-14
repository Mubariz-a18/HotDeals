const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    keywords: [
        {
            _id: false,
            values: String,
            createdDate: String,
            result: {
                type: String,
                enum: ["Ad found", "Ad not found"]
            }
        }
    ]
})

const Analytics = mongoose.model('Analytics', AnalyticsSchema);
module.exports = Analytics;

