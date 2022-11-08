const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const moment = require("moment")
const { DateAfter30Days, currentDate, Free_credit_Expiry, nearestExpiryDateFunction } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class CreditService {

  static async createCreditForNewUser(user_id){
            // create a default credit for new user
            await Credit.create({
              user_id: user_id,
              available_free_credits:200,
              available_premium_credits:10,
              free_credits_info:{
                count:200,
                allocation:"Admin-atLogin",
                allocated_on:currentDate,
                duration:moment(Free_credit_Expiry).diff(currentDate,"days"),
                credits_expires_on: Free_credit_Expiry
              },
              premium_credits_info:{
                count:10,
                allocation:"Admin-atLogin",
                allocated_on:currentDate,
                duration:moment(DateAfter30Days).diff(currentDate,"days"),
                credits_expires_on:DateAfter30Days
              }
            });
  }
  // Create Credit
  static async createCredit(bodyData, userId) {

    const user = await User.findOne({ _id: userId });
    if (user) {
      if (bodyData.creditType == "Free") {
        const newCredit = await Credit.findOneAndUpdate({ user_id: userId }, {
          $inc: { available_free_credits: bodyData.count },
          $push: {
            free_credits_info: {
              count: bodyData.count,
              allocation: bodyData.allocation,
              allocated_on: currentDate,
              duration: moment(Free_credit_Expiry).diff(currentDate, "days"),
              credits_expires_on: Free_credit_Expiry
            }
          }
        },
          {
            new: true
          }
        );
        return newCredit;
      } else if (bodyData.creditType == "Premium") {
        console.log(bodyData.creditType, bodyData.count, bodyData.allocation)
        const newCredit = await Credit.findOneAndUpdate({ user_id: userId }, {
          $inc: { available_premium_credits: bodyData.count },
          $push: {
            premium_credits_info: {
              count: bodyData.count,
              allocation: bodyData.allocation,
              allocated_on: currentDate,
              duration: moment(DateAfter30Days).diff(currentDate, "days"),
              credits_expires_on: DateAfter30Days,
              purchaseDate: currentDate
            }
          }
        }, { new: true });
        return newCredit;
      }
    }
    else {
      return res
        .status(400)
        .send({ error: "something went wrong in credit service" });
    }
  }

  static async creditDeductFuntion(isPrime, ad_id, userId, category) {
    if (isPrime == false) {
      const docs = await Credit.findOne({ user_id: userId })
      if (docs.available_free_credits == 0) {
        return { message: "Empty_Credits" }
      }
      else {
        let All_free = docs.free_credits_info

        const datesToBeChecked = []

        All_free.forEach(freeCrd => {

          if (freeCrd.count <= 0)
            freeCrd.status = "Expired/Empty"


          if (freeCrd.status !== "Expired/Empty")
            datesToBeChecked.push(freeCrd.credits_expires_on)

        })
        docs.save()
        const date = nearestExpiryDateFunction(datesToBeChecked)

        // const creditDeduct = await Credit.aggregate([
        //   {
        //     '$match': {
        //       'user_id': ObjectId(userId),
        //       'free_credits_info.credits_expires_on': date
        //     }
        //   }, {
        //     '$unwind': {
        //       'path': '$free_credits_info'
        //     }
        //   }, {
        //     '$set': {
        //       'available_free_credits': {
        //         '$let': {
        //           'vars': {
        //             'sample1': {
        //               '$add': [
        //                 '$available_free_credits', -20
        //               ]
        //             }
        //           },
        //           'in': '$$sample1'
        //         }
        //       },
        //       'free_credits_info.count': {
        //         '$let': {
        //           'vars': {
        //             'sample': {
        //               '$add': [
        //                 '$free_credits_info.count', -20
        //               ]
        //             }
        //           },
        //           'in': '$$sample'
        //         }
        //       }
        //     }
        //   }, {
        //     '$set': {
        //       'free_credits_info.status': {
        //         '$cond': {
        //           'if': {
        //             '$eq': [
        //               '$free_credits_info.count', 0
        //             ]
        //           },
        //           'then': 'Expired/Empty',
        //           'else': '$free_credits_info.status'
        //         }
        //       }
        //     }
        //   },
        //   { $merge : { into : "credits" } }
        // ])

        await Credit.findOneAndUpdate({ user_id: userId, 'free_credits_info.credits_expires_on': date }, {
          $inc: { "free_credits_info.$.count": -20 },
          $push: {
            type_of_credit: "Free",
            ad_id: ad_id,
            count: 20,
            category: category,
            credited_on: currentDate
          }
        }).then(async res => {
          await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: { available_free_credits: -20 }
          })
        })
        return { message: "Deducted_Successfully" }
      }
    }

    else if (isPrime == true) {
      const docs = await Credit.findOne({ user_id: userId })
      if (docs.available_premium_credits <= 0) {
        return { message: "Empty_Credits" }
      }
      else {
        let premium = docs.premium_credits_info;

        const datesToBeChecked = [];
        premium.forEach(premiumCrd => {

          if (premiumCrd.count <= 0)
            premiumCrd.status = "Expired/Empty"

          if (premiumCrd.status !== "Expired/Empty")
            datesToBeChecked.push(premiumCrd.credits_expires_on)
        })
        await docs.save();
        const date = nearestExpiryDateFunction(datesToBeChecked)

        // const updateCredit = await Credit.aggregate([
        //   {
        //     '$match': {
        //       'user_id': ObjectId(userId),
        //       'premium_credits_info.credits_expires_on': date
        //     }
        //   }, {
        //     '$unwind': {
        //       'path': '$premium_credits_info'
        //     }
        //   }, {
        //     '$set': {
        //       'available_premium_credits': {
        //         '$let': {
        //           'vars': {
        //             'sample1': {
        //               '$add': [
        //                 '$available_premium_credits', -5
        //               ]
        //             }
        //           },
        //           'in': '$$sample1'
        //         }
        //       },
        //       'premium_credits_info.count': {
        //         '$let': {
        //           'vars': {
        //             'sample': {
        //               '$add': [
        //                 '$premium_credits_info.count', -5
        //               ]
        //             }
        //           },
        //           'in': '$$sample'
        //         }
        //       }
        //     }
        //   }, {
        //     '$set': {
        //       'premium_credits_info.status': {
        //         '$cond': {
        //           'if': {
        //             '$eq': [
        //               '$premium_credits_info.count', 0
        //             ]
        //           },
        //           'then': 'Expired/Empty',
        //           'else': '$premium_credits_info.status'
        //         }
        //       }
        //     }
        //   },
        //   { $merge : { into : "credits" } }
        // ])

        await Credit.findOneAndUpdate({ user_id: userId, 'premium_credits_info.credits_expires_on': date }, {
          $inc: { "premium_credits_info.$.count": -5 },
          $push: {
            type_of_credit: "Premium",
            ad_id: ad_id,
            count: 5,
            category: category,
            credited_on: currentDate
          }
        }).then(async res => {
          await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: { available_premium_credits: -5 }
          })
        })
        return { message: "Deducted_Successfully" }
      }
    }

  }
};
