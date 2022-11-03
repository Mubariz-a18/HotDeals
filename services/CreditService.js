const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const moment = require("moment")
const { DateAfter30Days, currentDate, Free_credit_Expiry } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class CreditService {

  // Create Credit
  static async createCredit(bodyData, userId) {
  
      const user = await User.findOne({ _id: userId });
      if (user) {
        if(bodyData.creditType == "Free"){
          const newCredit = await  Credit.findOneAndUpdate({user_id:userId},{
            $inc: {available_free_credits: bodyData.count},
            $push :{
             free_credits_info :{
               count:bodyData.count,
               allocation:bodyData.allocation,
               allocated_on:currentDate,
               duration:moment(Free_credit_Expiry).diff(currentDate,"days"),
               credits_expires_on: Free_credit_Expiry
             }
            }
          },
            {
              new: true
            }
          );
           return newCredit;
        }else if(bodyData.creditType == "Premium"){
          const newCredit = await  Credit.findOneAndUpdate({user_id:userId },{
            $inc: {premium_credits_info: bodyData.count},
            $push :{
              premium_credits_info :{
                count:bodyData.count,
                duration:moment(DateAfter30Days).diff(currentDate,"days"),
                credits_expires_on:DateAfter30Days
              }
            }
           },{ new: true });
           return newCredit;
        }
      } else {
        return res
          .status(400)
          .send({ error: "something went wrong in credit service" });
      }
  }
};
