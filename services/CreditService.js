const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const moment = require("moment")
const { DateAfter30Days, currentDate, Free_credit_Expiry, nearestExpiryDateFunction } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class CreditService {

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
          if (freeCrd.status !== "Expired/Empty")
            datesToBeChecked.push(freeCrd.credits_expires_on)
        })
        const date = nearestExpiryDateFunction(datesToBeChecked)
        console.log(datesToBeChecked)
        const creditDeduct = await Credit.findOneAndUpdate({ user_id: userId, "free_credits_info.credits_expires_on": date }
          , {
            $inc: { available_free_credits: - 20 },
            $set: {
              $inc: {
                "free_credits_info.$.count": -20
              }
            },
            $push: {
              credit_usage: {
                type_of_credit: "Free",
                ad_id: ad_id,
                category: category,
                count: 20
              }
            }
          }
        )
        return { message: "Deducted_Successfully" }
      }
    } else if (isPrime == true) {
      const docs = await Credit.findOne({ user_id: userId })
      if (docs.available_premium_credits == 0) {
        return { message: "Empty_Credits" }
      }
      else {
        let premium = docs.premium_credits_info
        const datesToBeChecked = []
        premium.forEach(premiumCrd => {
          if (premiumCrd.status !== "Expired/Empty")
            datesToBeChecked.push(premiumCrd.credits_expires_on)
        })
        const date = nearestExpiryDateFunction(datesToBeChecked)
        const creditDeduct = await Credit.findOneAndUpdate({ user_id: userId, "premium_credits_info.credits_expires_on": date },
          {
            $inc: { available_premium_credits: - 5 },
            $set: {             // inc not working
              $inc: {
                "premium_credits_info.$.count": -5
              }
            },
            $push: {
              credit_usage: {
                type_of_credit: "Premium",
                ad_id: ad_id,
                category: category,
                count: 5
              }
            }
          }
        )
        return { message: "Deducted_Successfully" }
      }
    }

  }
};
