const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    keywords: {
        type: Array
    }
},
{timestamps:true});

const Analytics = mongoose.model('Analytics', AnalyticsSchema);
module.exports = Analytics;