const Referral = require("../models/referelSchema");
const { createCredit } = require("./CreditService");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { expiry_date_func } = require("../utils/moment");
const navigateToTabs = require("../utils/navigationTabs");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const Profile = require("../models/Profile/Profile");
const { ObjectId } = require("mongodb");



module.exports = class ReferCodeService {
    //values for promo or ReferCredits
    static  ReferralCredits = (isPromo)=>{
        if(isPromo){
            return 80;
        }else{
            return 50;
        }
    };
    // Get Refferral Credits
    static async checkReferCodeService(bodyData, user_ID) {
        
        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        const referCodeExist = await Referral.findOne({ referral_code: bodyData.referral_code });

        if (!referCodeExist) {

            throw ({ status: 404, message: 'INVALID_REFERRAL_CODE' });

        } else {

            const if_user_already_has_referred = await Profile.findOne({_id:user_ID })

            if(if_user_already_has_referred.referrered_user){

                throw ({ status: 403, message: 'YOU_CAN_ONLY_USE_ONE_REFERRED_CODE' });

            }

            await Referral.findOneAndUpdate({
                referral_code: bodyData.referral_code
            },
                {
                    $addToSet: {
                        used_by: user_ID,
                    },
                }
            );

            const isPromo = referCodeExist.isPromoCode;

            const push = {

                universal_credit_bundles: {

                    number_of_credit: this.ReferralCredits(isPromo),
                    source_of_credit: "Refferal",
                    credit_status: "Active",
                    credit_duration: 30,
                    credit_expiry_date: expiry_date_func(30),
                    credit_created_date: currentDate

                }
            }

            const Referred_Credit_Doc = await Credit.findOneAndUpdate({ user_id: user_ID }, {

                $inc: { total_universal_credits: this.ReferralCredits(isPromo) },

                $push: push

            }, {
                new: true
            })

            await Profile.findOneAndUpdate({_id:ObjectId(user_ID)},{
                $set:{
                    $inc:{availble_credit:this.ReferralCredits(isPromo)},
                    referrered_user:referCodeExist.user_Id
                }
            });

            const messageBody = {
                title: `You Have Gained '${this.ReferralCredits(isPromo)}' Credits By Referral Code!!`,
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