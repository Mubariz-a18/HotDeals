const Referral = require("../models/referelSchema");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { expiry_date_func } = require("../utils/moment");
const navigateToTabs = require("../utils/navigationTabs");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const Profile = require("../models/Profile/Profile");
const { ObjectId } = require("mongodb");
const OfferModel = require("../models/offerSchema");

module.exports = class ReferCodeService {

    //values for promo or ReferCredits
    static ReferralCredits = async (isPromo) => {
        const Offer = await OfferModel.findOne({});

        if (isPromo) {
            const promoVal = Offer.promoCodeCredits
            return promoVal;
        } else {
            const referVal = Offer.referralCredits
            return referVal;
        }
    };

    // Get Refferral Credits
    static async checkReferCodeService(bodyData, user_ID) {

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const referCodeExist = await Referral.findOne({ referral_code: bodyData.referral_code });

        const userId_exist_in_refer_doc = referCodeExist.used_by.find(obj => obj?.userId?.toString() === user_ID);

        if (!referCodeExist) {

            throw ({ status: 404, message: 'INVALID_REFERRAL_CODE' });

        } else {

            const if_user_already_has_referred = await Profile.findOne({ _id: user_ID })

            if (if_user_already_has_referred.referrered_user || userId_exist_in_refer_doc) {

                throw ({ status: 403, message: 'YOU_CAN_ONLY_USE_ONE_REFERRED_CODE' });

            }

            await Referral.findOneAndUpdate({
                referral_code: bodyData.referral_code
            },
                {
                    $addToSet: {
                        used_by: {
                            userId: user_ID,
                            used_Date: currentDate
                        },
                    },
                }
            );

            const isPromo = referCodeExist.isPromoCode;
            const creditCount = await this.ReferralCredits(isPromo)
            const push = {

                universal_credit_bundles: {

                    number_of_credit: creditCount,
                    source_of_credit: "Refferal",
                    credit_status: "Active",
                    credit_duration: 30,
                    credit_expiry_date: expiry_date_func(30),
                    credit_created_date: currentDate

                }
            }

            const Referred_Credit_Doc = await Credit.findOneAndUpdate({ user_id: user_ID }, {

                $inc: { total_universal_credits: creditCount },

                $push: push

            }, {
                new: true
            })

            const messageFunction = async () => {
                if (isPromo) {
                  return `Credits: You are awarded with '${creditCount}' by Promo Code!`
                } else {
                  return `Credits: You are awarded with '${creditCount}' by Referral Code!`
                }
              }

            const messageBody = {
                title: await messageFunction(),
                body:"Check your credit info",
                data: {
                    navigateTo: navigateToTabs.credits
                },
                type: "Info"
            }

            await cloudMessage(user_ID.toString(), messageBody);

            return "SUCCESSFULLY_REDEEMED_THE_REFERRALCODE"
        }
    };
}