const moment = require('moment');
const Report = require("../models/reportSchema");
const Generic = require("../models/Ads/genericSchema");
const Reason_points = require("../utils/reason_points");
const { expiry_date_func } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");
const { userRef } = require("../firebaseAppSetup");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const navigateToTabs = require("../utils/navigationTabs");



module.exports = class ReportService {

    // Create Report
    static async apiCreateReportDoc(userId) {
        const findReport = await Report.findOne({ user_id: userId });
        if (!findReport) {
            await Report.create({
                user_id: userId,
                flag: "Green"
            })
        } else {
        }
    };

    // Api Report On an Ad
    static async reportAd(bodyData, user_ID) {

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const { ad_id, reason, description , attachment } = bodyData;

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
                            "attachment":attachment,
                            "description": description,
                            "reported_date": currentDate,
                        }
                    }
                }, {
                    new: true, returnDocument: "after"
                });
                return Push_Report_With_Reason
            } else {

                const User_report_already_exist = await Report.findOne({
                    user_id: findAd.user_id,
                    "reports_box.ad_id": ad_id,
                    "reports_box.reports_list.reported_user_id":user_ID
                })

                if(User_report_already_exist){
                    throw ({ status: 401, message: 'REPORT_ALREADY_EXISTS' });
                }

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
                            "attachment":attachment,
                            "description": description,
                            "reported_date": currentDate,
                        }
                    }
                }, {
                    new: true
                });
                if (findAd.ad_status != "Suspended") {
                    const Update_Action_Flag = await Report.findOneAndUpdate({
                        user_id: findAd.user_id,
                        "reports_box.ad_id": ad_id,
                        "reports_box.ad_report_counter": {
                            $gte: 40
                        }
                    }, {
                        $set: {
                            "reports_box.$.report_action_status": true,
                            "reports_box.$.report_action_date": currentDate
                        }
                    }, {
                        new: true
                    })

                    if (Update_Action_Flag) {
                        await this.check_ad_suspended(ad_id, findAd.user_id, findAd.title)
                    } else {

                    }
                    return Push_Report_If_ReportList_exist
                } else {
                    throw ({ status: 404, message: 'AD_ALREADY_SUSPENDED' });
                }
            }
        }
    };

    // Check Ad Suspended
    static async check_ad_suspended(ad_id, user_id, title) {

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        await Generic.findByIdAndUpdate({ _id: ad_id }, {
            $set: {
                ad_status: "Suspended",
                ad_Suspended_Date: currentDate,
                ad_Historic_Duration_Date: expiry_date_func(183)
            }
        }, {
            new: true
        });
        const messageBody = {
            title: `Warning: Ad '${title}' is Suspended`,
            body: "Click here to check",
            data: {
                navigateTo: navigateToTabs.myads
            },
            type: "Warning"
        }

        await cloudMessage(user_id.toString(), messageBody);

        const Update_Report = await Report.findOneAndUpdate({
            user_id: user_id
        }, {
            $inc: {
                "total_Ads_suspended": 1
            },
        }, {
            new: true
        });

        const Update_flag_func = async (flag) => {
            if (flag === "Red") {

                const Updated_flag = await Report.findOneAndUpdate({

                    user_id: user_id

                }, {

                    $set: {

                        "flag": flag,
                        "flag_Date": currentDate

                    },
                }, {
                    new: true
                });

                if (Updated_flag) {

                    await Profile.findByIdAndUpdate({ _id: user_id }, {

                        $set: {
                            user_Banned_Flag: true,
                            user_Banned_Date: currentDate
                        },
                        $inc: {
                            user_Banned_Times: 1
                        }

                    }, {
                        new: true
                    })

                    userRef(user_id.toString()).update({ isBanned: true });
                }

                return Updated_flag
            }
            else {
                if (Update_Report["flag"] !== flag) {

                    const Updated_flag = await Report.findOneAndUpdate({

                        user_id: user_id

                    }, {
                        $set: {

                            "flag": flag,

                            "flag_Date": currentDate
                        },
                    }, {
                        new: true
                    });

                    return Updated_flag
                }
            }
        }

        if (Update_Report["total_Ads_suspended"] >= 10 && Update_Report["total_Ads_suspended"] <= 14) {

            Update_flag_func("Yellow")

        } else if (Update_Report["total_Ads_suspended"] <= 10) {

            Update_flag_func("Green");

        } else if (Update_Report["total_Ads_suspended"] >= 15 && Update_Report["total_Ads_suspended"] <= 19) {

            Update_flag_func("Orange")

        } else if (Update_Report["total_Ads_suspended"] >= 20) {

            Update_flag_func("Red");

        }
    };
};