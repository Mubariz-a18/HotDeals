const Referral = require("../models/referelSchema");
const { createCredit } = require("./CreditService");
const moment = require('moment');



module.exports = class ReferCodeService {

    static async checkReferCodeService(bodyData, user_ID) {

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const referCodeExist = await Referral.findOne({ is_used: false, referral_code: bodyData.referral_code });

        if (!referCodeExist) {

            throw ({ status: 404, message: 'INVALID_REFERRAL_CODE' });

        } else {

            await Referral.findOneAndUpdate({
                is_used: false,
                referral_code: bodyData.referral_code
            },

                {
                    $set: {
                        is_used: true,
                        used_by: user_ID,
                        used_Date: currentDate
                    }
                }
            )
            const body = {
                creditType:"Free",
                count:50,
                allocation :"Referral"
            }
            await createCredit(body,user_ID)

            return "SUCCESSFULLY_REDEEMED_THE_REFERRALCODE"
        }
    };
}