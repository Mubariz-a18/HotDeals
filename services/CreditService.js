const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");

module.exports = class CreditService {

  // Create Credit
  static async createCredit(bodyData, userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        console.log("inside credit service");
        const newCredit = await  Credit.create({
          user_id: userId,
          free_credits_info : {
            count : 200 , 
            status : bodyData.status,
            allocation : bodyData.allocation , 
            referral_Id : bodyData.referral_Id ,
            expires_on : '22-2-2023',
            allocated_on :"12-1-2022"
          } 
        });
        console.log(newCredit);
        return newCredit;
      } else {
        return res
          .status(400)
          .send({ error: "something went wrong in credit service" });
      }
    } catch (error) {
     console.log(error)
    }
  }
};
