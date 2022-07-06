const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
    user_id: {
        type: String,
    },
    keywords: {
        type: Array
    }
});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);
module.exports = Analytics;