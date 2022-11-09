const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const { DateAfter30Days, currentDate, Free_credit_Expiry, nearestExpiryDateFunction, durationInDays } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");

module.exports = class CreditService {
  // create Default Credit for new user 
  static async createCreditForNewUser(user_id){
            // creating a document
            await Credit.create({
              user_id: user_id,
              available_free_credits:200,
              available_premium_credits:10,
              free_credits_info:{
                count:200,
                allocation:"Admin-atLogin",
                allocated_on:currentDate,
                duration:durationInDays(Free_credit_Expiry),
                credits_expires_on: Free_credit_Expiry
              },
              premium_credits_info:{
                count:10,
                allocation:"Admin-atLogin",
                allocated_on:currentDate,
                duration:durationInDays(DateAfter30Days),
                credits_expires_on:DateAfter30Days
              }
            });
            // updating the user profile with default values
            await Profile.findOneAndUpdate({_id:user_id},{
              $set:{
                free_credit : 200,
                premium_credit: 10
              }
            })
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
              duration: durationInDays(Free_credit_Expiry),
              credits_expires_on: Free_credit_Expiry
            }
          }
        },
          {
            new: true
          }
        )
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            free_credit: bodyData.count
          }
        })
        return newCredit;
      } else if (bodyData.creditType == "Premium") {
        const newCredit = await Credit.findOneAndUpdate({ user_id: userId }, {
          $inc: { available_premium_credits: bodyData.count },
          $push: {
            premium_credits_info: {
              count: bodyData.count,
              allocation: bodyData.allocation,
              allocated_on: currentDate,
              duration:durationInDays(DateAfter30Days),
              credits_expires_on: DateAfter30Days,
              purchaseDate: currentDate
            }
          }
        }, { new: true });
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            premium_credit: bodyData.count
          }
        })
        return newCredit;
      }
    }
    else {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
  }

  static async creditDeductFuntion(creditParams) {

    const {isPrime, _id, userId, category} = creditParams ;
    console.log(isPrime, _id, userId, category)

    if (isPrime == false) {
      const docs = await Credit.findOne({ user_id: userId })
      if (docs.available_free_credits == 0) {
        return { message: "Empty_Credits" }
      }
      else {
        let All_free = docs.free_credits_info;
        const datesToBeChecked = [];

        All_free.forEach(freeCrd => {
          if (freeCrd.count <= 0)
            freeCrd.status = "Expired/Empty"

          if (freeCrd.status !== "Expired/Empty" && freeCrd.count !== 0)
            datesToBeChecked.push(freeCrd.credits_expires_on);
        })
        docs.save();
        const date = nearestExpiryDateFunction(datesToBeChecked);

        await Credit.findOneAndUpdate({ user_id: userId, 'free_credits_info.credits_expires_on': date }, {
          $inc: { "free_credits_info.$.count": -20 },
        }).then(async res => {
          await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: { available_free_credits: -20 },
            $push: {
              credit_usage: {
                type_of_credit: "Free",
                ad_id: _id,
                count: 20,
                category: category,
                credited_on: currentDate
              }
            }
          });
        });
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            free_credit: -20
          }
        });
        return { message: "Deducted_Successfully" }
      };
    } 

    else if (isPrime == true) {
      const docs = await Credit.findOne({ user_id: userId });
      if (docs.available_premium_credits <= 0) {
        return { message: "Empty_Credits" }
      }
      else {
        let premium = docs.premium_credits_info;

        const datesToBeChecked = [];
        premium.forEach(premiumCrd => {
          if (premiumCrd.count <= 0)
            premiumCrd.status = "Expired/Empty"

          if (premiumCrd.status !== "Expired/Empty" && premiumCrd.count !== 0)
            datesToBeChecked.push(premiumCrd.credits_expires_on)
        });
        await docs.save();
        const date = nearestExpiryDateFunction(datesToBeChecked);

        await Credit.findOneAndUpdate({ user_id: userId, 'premium_credits_info.credits_expires_on': date }, {
          $inc: { "premium_credits_info.$.count": -5 },
        })
          .then(async res => {
            await Credit.findOneAndUpdate({ user_id: userId }, {
              $inc: { available_premium_credits: -5 },
              $push: {
                credit_usage: {
                  type_of_credit: "Premium",
                  ad_id: _id,
                  count: 5,
                  category: category,
                  credited_on: currentDate
                }
              }
            });
          })
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            premium_credit: -5
          }
        });
        return { message: "Deducted_Successfully" }
      };
    };
  };

  static async getMyCreditsInfo(user_id){
    const userExist = await Profile.findOne({_id:user_id})
    if(!userExist){
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else{
      const CreditDocs = await Credit.findOne({user_id:user_id},{
        _id:0,
        available_free_credits:1,
        available_premium_credits:1
      })
      return CreditDocs
    }
  }
};
