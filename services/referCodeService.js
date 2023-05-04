const Referral = require("../models/referelSchema");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { expiry_date_func, daysAgo } = require("../utils/moment");
const navigateToTabs = require("../utils/navigationTabs");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const Profile = require("../models/Profile/Profile");
const OfferModel = require("../models/offerSchema");
const InstallPayoutModel = require("../models/InstallsPayoutSchema");
const { ObjectId } = require("mongodb");
const { default: axios } = require("axios");
const User = require("../models/Profile/User");

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
        const isUserExist = await User.findById({ _id: user_ID, isDeletedOnce: false })
        if (!isUserExist) {
            throw ({ status: 400, message: 'Bad Request' });
        }
        const referCodeExist = await Referral.findOne({ referral_code: bodyData.referral_code });

        if (!referCodeExist) {

            throw ({ status: 404, message: 'INVALID_REFERRAL_CODE' });

        }

        else {
            const userId_exist_in_refer_doc = referCodeExist.used_by.find(obj => obj?.userId?.toString() === user_ID);

            const if_user_already_has_referred = await Profile.findOne({ _id: user_ID })

            if (if_user_already_has_referred.referrered_user || userId_exist_in_refer_doc) {

                throw ({ status: 403, message: 'YOU_CAN_ONLY_USE_ONE_REFERRED_CODE' });

            }

            const {
                userNumber,
                name
            } = if_user_already_has_referred;

            const phoneNumber = userNumber.text;

            await Referral.findOneAndUpdate({
                referral_code: bodyData.referral_code
            },
                {
                    $addToSet: {
                        used_by: {
                            userId: user_ID,
                            used_Date: currentDate,
                            phoneNumber: phoneNumber,
                            name: name
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
                minReferralReward,
                maxReferralReward,
            } = Offer;

            // if offer is valid then create a installpayout document
            if (referralOfferValid === true) {
                const installPayoutExist = await InstallPayoutModel.findOne({ referredTo: user_ID });

                if (installPayoutExist) {
                    throw ({ status: 403, message: 'YOU_CAN_ONLY_USE_ONE_REFERRED_CODE' });
                }

                const min = minReferralReward / 100;
                const max = maxReferralReward / 100;
                const amount = (Math.floor(Math.random() * (max - min + 1)) + min) * 100;

                await InstallPayoutModel.create({
                    user_id: referCodeExist.user_Id,
                    referredTo: user_ID,
                    amount: amount,
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

    // Get Referral for payout docs
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
            },
            // {
            // '$facet': {
            // 'InReview': [
            //     {
            //         '$match': {
            //             'used_by.reviewStatus': 'InReview'
            //         }
            //     }, {
            //         '$project': {
            //             "_id": 0,
            //             'referredToUser': '$used_by.userId',
            //             'reviewStatus': '$used_by.reviewStatus',
            //             'isClaimed': '$used_by.isClaimed'
            //         }
            //     }
            // ],
            // 'Approved': [
            // {
            //     '$match': {
            //         'used_by.reviewStatus': 'Approved'
            //     }
            // }, 
            {
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
                    'paymentDate': '$payoutDetails.payment_initate_date',
                    'amount': '$payoutDetails.amount',
                    'showAmount': "$payoutDetails.showAmount"
                }
            }, {
                '$project': {
                    "_id": 0,
                    'referredToUser': '$used_by.userId',
                    'isClaimed': '$used_by.isClaimed',
                    'used_Date': '$used_by.used_Date',
                    'phoneNumber': '$used_by.phoneNumber',
                    'name': '$used_by.name',
                    'paymentstatus': 1,
                    'paymentDate': 1,
                    'amount': {
                        $cond: {
                            if: { $eq: ["$showAmount", true] },
                            then: "$amount",
                            else: "$$REMOVE"
                        }
                    }
                }
            }
            // ],
            // 'Rejected': [
            //     {
            //         '$match': {
            //             'used_by.reviewStatus': 'Rejected'
            //         }
            //     }, {
            //         '$project': {
            //             "_id": 0,
            //             'referredToUser': '$used_by.userId',
            //             'reviewStatus': '$used_by.reviewStatus',
            //             'isClaimed': '$used_by.isClaimed'
            //         }
            //     }
            // ]
            // }
            // }
        ]);

        if (!Referral_list) {
            throw ({ status: 404, message: 'NO_REFERRAL_FOUND' })
        }

        return Referral_list
    };

    // Get Amount
    static async generateRandomAmountAndSave(user_ID, friend_ID) {

        const Offer = await OfferModel.findOne();

        if (Offer.referralOfferValid === false) {
            throw ({ status: 401, message: 'OFFER NOT VALID' });
        }

        const UserDoc = await Profile.findById({ _id: user_ID });
        if (!UserDoc) {
            throw ({ status: 401, message: 'UNAUTHORIZED' });
        }

        const FriendDoc = await Profile.findById({ _id: friend_ID });
        if (!FriendDoc) {
            throw ({ status: 401, message: 'Friend Id Doesnot Exist' });
        }

        const UserRefferal = await Referral.findOne({
            user_Id: ObjectId(user_ID),
            "used_by.userId": ObjectId(friend_ID),
            "used_by.isClaimed": false
        });

        const threeDaysAgo = daysAgo(3);

        const isReferralOld = UserRefferal?.used_by.find(obj => obj.userId.toString() === friend_ID.toString() && moment(obj.used_Date).isBefore(threeDaysAgo))
        if (moment(FriendDoc.created_date).isAfter(threeDaysAgo) || isReferralOld === undefined) {
            throw ({ status: 400, message: 'Referral is not Old Enough' });
        }

        if (FriendDoc?.referrered_user?.toString() !== user_ID) {
            throw ({ status: 401, message: 'Bad Request' });
        }

        const payoutDoc = await InstallPayoutModel.findOneAndUpdate({
            user_id: ObjectId(user_ID),
            referredTo: ObjectId(friend_ID),
            payment_status: "Not_Claimed"
        },
            {
                $set: {
                    showAmount: true
                }
            })

        if (payoutDoc) {
            return payoutDoc.amount;
        } else {
            throw ({ status: 401, message: 'Bad Request' });
        }

    };

    // claim Reward
    static async claimReferralPayouts(userId, bodyData) {

        const Offer = await OfferModel.findOne();

        if (Offer.referralOfferValid === false) {
            throw ({ status: 401, message: 'OFFER NOT VALID' });
        }

        let {
            friend_ID,
            phoneNumber,
            email,
            upi_id
        } = bodyData;

        if (!friend_ID || !upi_id) {

            throw ({ status: 401, message: 'Please Enter UPI And Reffered-To UserId ' });
        }

        const userDetails = await Profile.findById({ _id: userId }, {
            name: 1,
            "userNumber.text": 1,
            "email.text": 1
        });



        if (!userDetails) {
            throw ({ status: 401, message: 'UNAUTHORIZED' });
        }

        const FriendDoc = await User.findById({ _id: ObjectId(friend_ID), isDeletedOnce: false });
        const FriendProfile = await Profile.findById({ _id: friend_ID });
        if (!FriendDoc) {
            throw ({ status: 401, message: 'Friend Id Doesnot Exist' });
        }

        const referCodeExist = await Referral.findOne({
            user_Id: userId,
            "used_by.userId": ObjectId(friend_ID),
            "used_by.isClaimed": false
        });

        if (!referCodeExist) {
            throw ({ status: 401, message: 'Bad request' })
        }

        const threeDaysAgo = daysAgo(3);

        const isReferralOld = referCodeExist?.used_by.find(obj => obj.userId.toString() === friend_ID.toString() && moment(obj.used_Date).isBefore(threeDaysAgo))
        if (moment(FriendProfile.created_date).isAfter(threeDaysAgo) || isReferralOld === undefined) {
            throw ({ status: 400, message: 'Referral is not Old Enough' });
        }

        const payoutDoc = await InstallPayoutModel.findOne({
            user_id: ObjectId(userId),
            referredTo: ObjectId(friend_ID),
            payment_status: "Not_Claimed",
            showAmount: true
        });

        if (!payoutDoc) {
            throw ({ status: 401, message: 'Payout Doc not found' })
        }

        const {
            amount
        } = payoutDoc;


        async function makePaymentRequest(amount) {
            try {
                const username = process.env.LIVE_KEY_ID;
                const password = process.env.LIVE_KEY_SECRET;
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

                const paymentDetails = {
                    id,
                    fund_account_id,
                    fund_account,
                    status,
                    failure_reason,
                    contact_id,
                    vpa,
                    reference_id
                }



                return paymentDetails;

            } catch (error) {

                throw ({ status: 401, message: error });

            }
        }

        async function updateInstallDoc(paymentDetails) {
            const {
                id,
                fund_account_id,
                status,
                failure_reason,
                contact_id,
                vpa,
                reference_id
            } = paymentDetails

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
                    user_id: ObjectId(userId),
                    referredTo: ObjectId(friend_ID),
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
                await Referral.findOneAndUpdate({ user_Id: userId, "used_by.userId": ObjectId(friend_ID) }, {
                    $set: {
                        "used_by.$.isClaimed": true
                    }
                })
            }


        }

        const Response = await makePaymentRequest(amount);

        await updateInstallDoc(Response)
        /*

        Cloud Notification To firebase

        */
        const messageBody = {
            title: `⭐ Your Amount Will Be Credited Soon ⭐`,
            body: "Click here to access it",
            data: {
                navigateTo: navigateToTabs.payout
            },
            type: "Alert"
        }

        await cloudMessage(userId.toString(), messageBody);
        return true
    };

    // update Payout doc
    static async updatePayoutDoc(rawbody) {
        const body = JSON.parse(rawbody)
        const event = body?.event
        const status = body?.payload?.payout?.entity?.status;
        const id = body?.payload?.payout?.entity.id
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
        const payoutTransactionStatus = (event) => {
            switch (event) {
                case 'payout.rejected':
                case "payout.reversed":
                case "payout.failed":
                    return "PayoutFailed";
                case "payout.processed":
                    return "payoutSuccess";
                case "payout.pending":
                case "payout.queued":
                case "payout.initiated":
                case "payout.updated":
                    return "PayoutProcessing"
            }
        }
        const statusVal = statusFunc(status);
        const payoutStat = payoutTransactionStatus(event)
        if (payoutStat === "payoutSuccess") {
            await InstallPayoutModel.findOneAndUpdate({ payout_id: id , payment_status: { $nin: ["Paid", "Failed"] }}, {
                $set: {
                    payment_status: statusVal,
                    razorpayPayoutStatus: status
                }
            });
        }
        if (payoutStat === "PayoutProcessing") {
            await InstallPayoutModel.findOneAndUpdate({ payout_id: id , payment_status: { $nin: ["Paid"] }}, {
                $set: {
                    payment_status: statusVal,
                    razorpayPayoutStatus: status
                }
            });
        }
        if (payoutStat === "PayoutFailed") {
            if (statusVal === "Failed") {
                const payoutDoc = await InstallPayoutModel.findOneAndUpdate({ payout_id: id, payment_status: { $nin: ["Paid"] }}, {
                    $set: {
                        payment_status: 'Not_Claimed',
                    },
                    $unset: {
                        "contact_id": "",
                        "failure_reason": "",
                        "fund_account_id": "",
                        "razorpayPayoutStatus": "",
                        "reference_id": "",
                        "payout_id": "",
                        "payment_initate_date": "",
                        "vpa": ""
                    }
                });

                const updateReferralDoc = await Referral.updateOne({user_Id: payoutDoc.user_id, 'used_by.userId':payoutDoc.referredTo},{
                    $set:{
                        "used_by.$.isClaimed": false
                    }
                })
            }
        }

        return true
    };
}