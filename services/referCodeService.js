const Referral = require("../models/referelSchema");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { expiry_date_func } = require("../utils/moment");
const navigateToTabs = require("../utils/navigationTabs");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const Profile = require("../models/Profile/Profile");
const OfferModel = require("../models/offerSchema");
const InstallPayoutModel = require("../models/InstallsPayoutSchema");
const { ObjectId } = require("mongodb");
const { default: axios } = require("axios");

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

        }
        else {

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

            await Profile.findByIdAndUpdate({ _id: ObjectId(user_ID) }, {
                $set: {
                    referrered_user: referCodeExist.user_Id
                }
            })

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

            await Credit.findOneAndUpdate({ user_id: user_ID }, {

                $inc: { total_universal_credits: creditCount },

                $push: push

            }, {
                new: true
            })
            // checking if offer is valid or not
            const Offer = await OfferModel.findOne({});

            const {
                referralOfferValid,
                referralReward,
            } = Offer;

            // if offer is valid then create a installpayout document
            if (referralOfferValid === true) {
                const installPayoutExist = await InstallPayoutModel.findOne({ referredTo: user_ID });

                if (installPayoutExist) {
                    throw ({ status: 403, message: 'YOU_CAN_ONLY_USE_ONE_REFERRED_CODE' });
                }

                await InstallPayoutModel.create({
                    user_id: referCodeExist.user_Id,
                    referredTo: user_ID,
                    amount: referralReward,
                    payment_status: "Not_Claimed"
                });
            } else { }

            const messageFunction = async () => {
                if (isPromo) {
                    return `Credits: You are awarded with '${creditCount}' by Promo Code!`
                } else {
                    return `Credits: You are awarded with '${creditCount}' by Referral Code!`
                }
            }

            const messageBody = {
                title: await messageFunction(),
                body: "Check your credit info",
                data: {
                    navigateTo: navigateToTabs.credits
                },
                type: "Info"
            }

            await cloudMessage(user_ID.toString(), messageBody);

            return "SUCCESSFULLY_REDEEMED_THE_REFERRALCODE"
        }
    };

    static async getReferralForPayouts(user_ID) {
        const UserExist = await Profile.findOne({ _id: user_ID });
        if (!UserExist) {
            throw ({ status: 404, message: 'User_does_not_exist' });
        }
        const Referral_list = await Referral.aggregate([
            {
                '$match': {
                    'user_Id': ObjectId(user_ID),
                    'used_by.reviewStatus': {
                        '$in': [
                            'InReview',
                            'Approved',
                            'Rejected'
                        ]
                    }
                }
            }, {
                '$unwind': {
                    'path': '$used_by',
                    'preserveNullAndEmptyArrays': true
                }
            }, {
                '$facet': {
                    'InReview': [
                        {
                            '$match': {
                                'used_by.reviewStatus': 'InReview'
                            }
                        }, {
                            '$project': {
                                "_id": 0,
                                'referredToUser': '$used_by.userId',
                                'reviewStatus': '$used_by.reviewStatus',
                                'isClaimed': '$used_by.isClaimed'
                            }
                        }
                    ],
                    'Approved': [
                        {
                            '$match': {
                                'used_by.reviewStatus': 'Approved'
                            }
                        }, {
                            '$lookup': {
                                'from': 'payout.installs',
                                'localField': 'used_by.userId',
                                'foreignField': 'referredTo',
                                'as': 'payoutDetails'
                            }
                        }, {
                            '$unwind': {
                                'path': '$payoutDetails'
                            }
                        }, {
                            '$addFields': {
                                'paymentstatus': '$payoutDetails.payment_status',
                                'paymentDate': '$payoutDetails.payment_initate_date'
                            }
                        }, {
                            '$project': {
                                "_id": 0,
                                'referredToUser': '$used_by.userId',
                                'reviewStatus': '$used_by.reviewStatus',
                                'isClaimed': '$used_by.isClaimed',
                                'paymentstatus': 1,
                                'paymentDate': 1
                            }
                        }
                    ],
                    'Rejected': [
                        {
                            '$match': {
                                'used_by.reviewStatus': 'Rejected'
                            }
                        }, {
                            '$project': {
                                "_id": 0,
                                'referredToUser': '$used_by.userId',
                                'reviewStatus': '$used_by.reviewStatus',
                                'isClaimed': '$used_by.isClaimed'
                            }
                        }
                    ]
                }
            }
        ]);

        if (!Referral_list) {
            throw ({ status: 404, message: 'NO_REFERRAL_FOUND' })
        }

        return Referral_list
    };

    static async claimReferralPayout(userId, bodyData) {
        const {
            referredTo,
            phoneNumber,
            email,
            upi_id
        } = bodyData;

        if (!referredTo || !upi_id) {

            throw ({ status: 401, message: 'Please Enter UPI And Reffered-To UserId' });
        }

        const userDetails = await Profile.findById({ _id: userId }, {
            name: 1,
            "userNumber.text": 1,
            "email.text": 1
        });

        const ReferredTo_userExist = await Profile.findById({ _id: ObjectId(referredTo) });

        if (!userDetails || !ReferredTo_userExist) {
            throw ({ status: 403, message: 'UnAuthorized' })
        }

        const referCodeExist = await Referral.findOne({ user_Id: userId });

        if (!referCodeExist) {
            throw ({ status: 403, message: 'UnAuthorized' })
        }

        const userId_exist_in_refer_doc = referCodeExist.used_by.find(obj => obj?.userId.toString() === referredTo && obj?.reviewStatus === "Approved");


        if (!userId_exist_in_refer_doc) {
            throw ({ status: 403, message: 'UnAuthorized' })
        }

        const username = process.env.LIVE_KEY_ID;
        const password = process.env.LIVE_KEY_SECRET;

        const payoutDoc = await InstallPayoutModel.findOne({
            referredTo: ObjectId(referredTo),
        });

        if (!payoutDoc) {
            throw ({ status: 403, message: 'UnAuthorized' })
        }
        const {
            amount
        } = payoutDoc;

        if (payoutDoc.payment_status !== "Not_Claimed") {
            throw ({ status: 403, message: 'Alread_Claimed' });
        }

        async function makePostRequest() {
            try {
                const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                const reference_id = ObjectId()
                const data = {
                    "account_number": process.env.LIVE_ACC_NUMBER,
                    "amount": amount,
                    "currency": "INR",
                    "mode": "UPI",
                    "purpose": "cashback",
                    "fund_account": {
                        "account_type": "vpa",
                        "vpa": {
                            "address": upi_id
                        },
                        "contact": {
                            "name": userDetails.name,
                            "contact": phoneNumber ? phoneNumber : userDetails.userNumber.text,
                            "email": email ? email : userDetails.email.text,
                            "type": "customer",
                            "reference_id": reference_id,
                            "notes": {
                                "notes_key_1": `You have Recieved Rs: ${amount} Reward`
                            }
                        }
                    },
                    "queue_if_low_balance": true,
                    "reference_id": reference_id,
                    "narration": "Truelist Cash Reward"
                };

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': authHeader,
                        'Accept': 'application/json',
                    }
                };

                const response = await axios.post('https://api.razorpay.com/v1/payouts', data, config);

                const {
                    id,
                    fund_account_id,
                    fund_account,
                    status,
                    failure_reason
                } = response.data;
                const {
                    contact_id,
                    vpa,
                } = fund_account;

                const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

                function statusFunc(status) {
                    switch (status) {
                        case "pending":
                        case "queued":
                        case "processing":
                            return "processing";
                        case 'processed':
                            return "Paid";
                        case 'reversed':
                        case "cancelled":
                        case "rejected":
                            return "Failed"
                    }
                }
                await InstallPayoutModel.findOneAndUpdate(
                    {
                        referredTo: ObjectId(referredTo),
                    }, {
                    $set: {
                        payout_id: id,
                        fund_account_id: fund_account_id,
                        contact_id: contact_id,
                        reference_id: reference_id,
                        vpa: vpa,
                        failure_reason: failure_reason,
                        payment_status: statusFunc(status),
                        razorpayPayoutStatus: status,
                        payment_initate_date: currentDate
                    }
                });

                if (status !== "Not_Claimed") {
                    await Referral.findOneAndUpdate({ "used_by.userId": ObjectId(referredTo) }, {
                        $set: {
                            "used_by.$.isClaimed": true
                        }
                    })
                }
                return true;

            } catch (error) {

                throw ({ status: 401, message: error });

            }
        }

        const Response = await makePostRequest();
        /* 
     
    Cloud Notification To firebase
     
    */
        const messageBody = {
            title: `⭐ Your Amount Will Be Credited Soon ⭐`,
            body: "Click here to access it",
            data: {
                id: referredTo.toString(),
                navigateTo: navigateToTabs.payout
            },
            type: "Alert"
        }

        await cloudMessage(userId.toString(), messageBody);
        return Response
    }
}