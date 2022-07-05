const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");

module.exports = class CreditService {
  static async createCredit(bodyData, userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        console.log("inside credit service");
        console.log(bodyData,userId);
        const newCredit = await  Credit.create({
          user_id: userId,
          credit_type: bodyData.credit_type,
          transcation_id: bodyData.transcation_id,
          purchase_mode: bodyData.purchase_mode,
          purchase_date: bodyData.purchase_date,
          expiray_date: bodyData.expiray_date,
          activate_status: bodyData.activate_status,
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
