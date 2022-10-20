const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");
const { DateAfter30Days, currentDate } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class CreditService {

  // Create Credit
  static async createCredit(bodyData, userId) {
 
      const user = await User.findOne({ _id: userId });
      if (user) {
        const newCredit = await  Credit.create({
          user_id: userId,
          free_credits_info : {
            count : 200 , 
            status : bodyData.status,
            allocation : bodyData.allocation , 
            referral_Id : bodyData.referral_Id,
            expires_on : DateAfter30Days,
            allocated_on :currentDate
          } ,
          premium_credits_info :{
            count : 0 ,
            transaction_Id: "1234567890",
            parchaseDate :"12-12-2022",
            expires_on:"22-9-2023"
          },
        });
        return newCredit;
      } else {
        return res
          .status(400)
          .send({ error: "something went wrong in credit service" });
      }
  }
};
