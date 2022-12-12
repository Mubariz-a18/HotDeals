const User = require("../models/Profile/Profile");
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const Report = require("../models/reportSchema");
const Generic = require("../models/Ads/genericSchema");



module.exports = class ReportService {

    // Create Report
    static async apiCreateReportDoc(userId) {
        const findReport = await Report.findOne({ user_id: userId });
        if (!findReport) {
            await Report.create({
                user_id: userId,
            })
        } else {
        }
    }

    static async reportAd(bodyData, user_ID) {
        const { ad_id , reason} = bodyData;
        const findAd = await Generic.findById({ _id: ad_id });

        if (!findAd) {
            throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        }
        else {
            const FindReportDoc = await Report.findOne({
                user_id: findAd.user_id,
                "reports_box.ad_id": ad_id
            })
            console.log(FindReportDoc)
            if (!FindReportDoc) {
                const Push_Report = await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                }, {
                    $push: {
                        "reports_box": {
                            "ad_id": ad_id,
                            "ad_report_counter": 1
                        }                        
                    }                   
                })
                const Push_Report_Update = await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                    "reports_box.ad_id": ad_id
                }, {
                    $push:{
                        "reports_box.$.reports_list":{
                            "reported_user_id":user_ID,
                            "reason": reason
                        }
                    }        
                })
                console.log(Push_Report_Update)
                return Push_Report_Update
            }
        }
    }
};