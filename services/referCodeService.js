const Referral = require("../models/referelSchema");
const { createCredit } = require("./CreditService");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { expiry_date_func } = require("../utils/moment");
const navigateToTabs = require("../utils/navigationTabs");
const cloudMessage = require("../cloudMessaging");



module.exports = class ReferCodeService {

    static async checkReferCodeService(bodyData, user_ID) {

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const referCodeExist = await Referral.findOne({ referral_code: bodyData.referral_code });

        if (!referCodeExist) {

            throw ({ status: 404, message: 'INVALID_REFERRAL_CODE' });

        } else {

            await Referral.findOneAndUpdate({
                // is_used: false,
                referral_code: bodyData.referral_code
            },

                {
                    $push: {
                        used_by: user_ID,
                    },
                    // $set: {
                    //     // is_used: true,
                    //     // used_Date: currentDate
                    // }
                }
            )

            const push = {

                universal_credit_bundles: {

                    number_of_credit: 50,
                    source_of_credit: "Refferal",
                    credit_status: "Active",
                    credit_duration: 30,
                    credit_expiry_date: expiry_date_func(30),
                    credit_created_date: currentDate

                }
            }

            const Referred_Credit_Doc = await Credit.findOneAndUpdate({ user_id: user_ID }, {

                $inc: { total_universal_credits: 50 },

                $push: push

            }, {
                new: true
            })

            const messageBody = {
                title: `You Have Gained '${50}' Credits By Referral Code!!`,
                body: "Check Your Credit Info",
                data: {
                    navigateTo: navigateToTabs.home
                },
                type: "Info"
            }

            await cloudMessage(user_ID.toString(), messageBody);

            return "SUCCESSFULLY_REDEEMED_THE_REFERRALCODE"
        }
    };
}