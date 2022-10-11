const mongoose = require('mongoose');

const AnalyticsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
    },
    keywords:[{
        values :String,
        createdDate:String,
        result:{
            type:String,
            enum:["found","not found"]
        }
    }]
})

const Analytics = mongoose.model('Analytics', AnalyticsSchema);
module.exports = Analytics;