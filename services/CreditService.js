const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const { DateAfter30Days, currentDate, Free_credit_Expiry, nearestExpiryDateFunction, durationInDays } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");
const credit_value = require("../utils/creditValues");

module.exports = class CreditService {
  // create Default Credit for new user 
  static async createCreditForNewUser(user_id) {
    // creating a document
    await Credit.create({
      user_id: user_id,
      available_free_credits: 200,
      available_premium_credits: 10,
      free_credits_info: {
        count: 200,
        allocation: "Admin-atLogin",
        allocated_on: currentDate,
        duration: durationInDays(Free_credit_Expiry),
        credits_expires_on: Free_credit_Expiry
      },
      premium_credits_info: {
        count: 10,
        allocation: "Admin-atLogin",
        allocated_on: currentDate,
        duration: durationInDays(DateAfter30Days),
        credits_expires_on: DateAfter30Days
      }
    });
    // updating the user profile with default values
    await Profile.findOneAndUpdate({ _id: user_id }, {
      $set: {
        free_credit: 200,
        premium_credit: 10
      }
    })
  };
  // Create Credit for old users
  static async createCredit(bodyData, userId) {
    // check if user exist
    const user = await User.findOne({ _id: userId });
    // if exist
    if (user) {
      // check if the credit type is free
      if (bodyData.creditType == "Free") {
        // if credit type from body is free push credit into free_credit_info
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
        //update user profile total credits
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            free_credit: bodyData.count
          }
        })
        return newCredit;
        //else if credit type is Premium push the credit into premium_credit_info
      } else if (bodyData.creditType == "Premium") {
        const newCredit = await Credit.findOneAndUpdate({ user_id: userId }, {
          $inc: { available_premium_credits: bodyData.count },
          $push: {
            premium_credits_info: {
              count: bodyData.count,
              allocation: bodyData.allocation,
              allocated_on: currentDate,
              duration: durationInDays(DateAfter30Days),     // this function return duration in days
              credits_expires_on: DateAfter30Days,
              purchaseDate: currentDate
            }
          }
        }, { new: true });
        // update the users profile total Premium Credit
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            premium_credit: bodyData.count
          }
        })
        return newCredit;
      }
    }
    // if user not exists throw error
    else {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
  };
  //creditDeduaction function calls when user uploads an Ad
  static async creditDeductFuntion(creditParams) {
    const { isPrime, _id, userId, category } = creditParams;
    // if isPrime is false ad type is free
    if (isPrime == false) {
      // find the credit doc with users id
      const docs = await Credit.findOne({ user_id: userId })
      if (docs.available_free_credits == 0 || docs.available_free_credits <= credit_value(category)) {   //if users available_free_credits == 0 return message "empty_ credits"
        return { message: "Empty_Credits" }
      }
      //if user available_free_credits < 0
      else {    // find all the credits inside free_credits_info
        let All_free = docs.free_credits_info;
        const datesToBeChecked = [];      // array of dates to be checked
        //loop through all the credits users have
        All_free.forEach(freeCrd => {
          if (freeCrd.count <= 0)     // if any credit count is == 0 update the credit status to "Expired/Empty"
            freeCrd.status = "Empty"
          // check if credit status is not equal to "Expired/Empty" and count is not equal to 0
          if (freeCrd.status !== "Empty" && freeCrd.status !== "Expired" && freeCrd.count !== 0)
            datesToBeChecked.push(freeCrd.credits_expires_on);    // if the check is true push the dates into datestobechecked array
        })
        docs.save();      // SAVE the credit doc
        const date = nearestExpiryDateFunction(datesToBeChecked);     // this function returns nearest expiry date
        // update the credit doc (deduct the count from the  free_credits_info.count)
        await Credit.findOneAndUpdate({ user_id: userId, 'free_credits_info.credits_expires_on': date }, {
          $inc: { "free_credits_info.$.count": - credit_value(category) },
        }).then(async res => {            //push the credit usage in the credit doc and update the available_free_credits
          await Credit.findOneAndUpdate({ user_id: userId }, {
            $inc: { available_free_credits: -credit_value(category) },
            $push: {
              credit_usage: {
                type_of_credit: "Free",
                ad_id: _id,
                count: credit_value(category),
                category: category,
                credited_on: currentDate
              }
            }
          });
        });
        // users profile is updated (free_credit)
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            free_credit: -credit_value(category)
          }
        });
        // success message is sent to AdService
        return { message: "Deducted_Successfully" }
      };
    }
    // else if isPrime is false the adType is Premium
    else if (isPrime == true) {
      // find the credit doc with users id
      const docs = await Credit.findOne({ user_id: userId });
      if (docs.available_premium_credits <= 0 || docs.available_premium_credits <= credit_value(category)) {      //if users available_premium_credits == 0 return message "empty_ credits"
        return { message: "Empty_Credits" }
      }
      //if user available_premium_credits < 0
      else {
        // find all the credits inside premium_credits_info
        let premium = docs.premium_credits_info;
        const datesToBeChecked = [];    // array of dates to be checked
        //loop through all the credits users have
        premium.forEach(premiumCrd => {
          if (premiumCrd.count <= 0)       // if any credit count is == 0 update the credit status to "Expired/Empty"
            premiumCrd.status = "Empty"
          // check if credit status is not equal to "Expired/Empty" and count is not equal to 0
          if (premiumCrd.status !== "Empty" && premiumCrd.status !== "Expired" && premiumCrd.count !== 0)
            datesToBeChecked.push(premiumCrd.credits_expires_on)       // if the check is true push the dates into datestobechecked array
        });
        await docs.save();
        const date = nearestExpiryDateFunction(datesToBeChecked);  // this function returns nearest expiry date
        // update the credit doc (deduct the count from the  premium_credits_info.count)
        await Credit.findOneAndUpdate({ user_id: userId, 'premium_credits_info.credits_expires_on': date }, {
          $inc: { "premium_credits_info.$.count": -credit_value(category) },
        })
          .then(async res => {        //push the credit usage in the credit doc and update the available_premium_credits
            await Credit.findOneAndUpdate({ user_id: userId }, {
              $inc: { available_premium_credits: -credit_value(category) },
              $push: {
                credit_usage: {
                  type_of_credit: "Premium",
                  ad_id: _id,
                  count: credit_value(category),
                  category: category,
                  credited_on: currentDate
                }
              }
            });
          })
        // users profile is updated (premium_credit)
        await Profile.findOneAndUpdate({ _id: userId }, {
          $inc: {
            premium_credit: -credit_value(category)
          }
        });
        // success message is sent to AdService
        return { message: "Deducted_Successfully" }
      };
    };
  };
  //Get My Credits function
  static async getMyCreditsInfo(user_id) {
    // check if user exist 
    const userExist = await Profile.findOne({ _id: user_id })
    // if not exist throw error 
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    // else fnd the user`s credit doc and project the required feilds
    else {
      const CreditDocs = await Credit.findOne({ user_id: user_id }, {
        _id: 0,
        available_free_credits: 1,
        available_premium_credits: 1
      })
      return CreditDocs
    }
  };
};
