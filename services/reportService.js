const User = require("../models/Profile/Profile");
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const Report = require("../models/reportSchema");
const Generic = require("../models/Ads/genericSchema");
const Reason_points = require("../utils/reason_points");
const { expiry_date_func } = require("../utils/moment");



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
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        const { ad_id, reason, description } = bodyData;
        const points = Reason_points(reason)
        const findAd = await Generic.findById({ _id: ad_id });

        if (!findAd) {
            throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        }
        else {
            const FindReportDoc = await Report.findOne({
                user_id: findAd.user_id,
                "reports_box.ad_id": ad_id
            });
            if (!FindReportDoc) {
                await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                }, {
                    $push: {
                        "reports_box": {
                            "ad_id": ad_id,
                        }
                    }
                }, {
                    new: true
                })
                const Push_Report_With_Reason = await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                    "reports_box.ad_id": ad_id
                }, {
                    $inc: {
                        "reports_box.$.ad_report_counter": points
                    },
                    $push: {
                        "reports_box.$.reports_list": {
                            "reported_user_id": user_ID,
                            "reason": reason,
                            "description": description,
                            "reported_date": currentDate,
                        }
                    }
                }, {
                    new: true
                })
                return Push_Report_With_Reason
            } else {
                const Push_Report_If_ReportList_exist = await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                    "reports_box.ad_id": ad_id
                }, {
                    $inc: {
                        "reports_box.$.ad_report_counter": points
                    },
                    $push: {
                        "reports_box.$.reports_list": {
                            "reported_user_id": user_ID,
                            "reason": reason,
                            "description": description,
                            "reported_date": currentDate,
                        }
                    }
                }, {
                    new: true
                });

                const Update_Action_Flag = await Report.findOneAndUpdate({
                    user_id: findAd.user_id,
                    "reports_box.ad_id": ad_id,
                    "reports_box.ad_report_counter": {
                        $gte: 40
                    }
                }, {
                    $set: {
                        "reports_box.$.report_action_status": true
                    }
                }, {
                    new: true
                })

                if (Update_Action_Flag) {
                    this.check_ad_suspended(ad_id,findAd.user_id)
                } else {
                }
                return Push_Report_If_ReportList_exist
            }
        }
    }

    static async check_ad_suspended(ad_id,user_id) {
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
        await Generic.findByIdAndUpdate({ _id: ad_id }, {
            $set: {
                ad_status: "Suspended",
                ad_Suspended_Date: currentDate,
                ad_Historic_Duration_Date: expiry_date_func(183)
            }
        },{
            new:true
        })
        await Report.findOneAndUpdate({
            user_id: user_id
        }, {
            $inc: {
                "total_Ads_suspended": 1
            },
        },{
            new:true
        })
    }
};