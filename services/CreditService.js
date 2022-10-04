const User = require("../models/Profile/Profile");
const Credit = require("../models/creditSchema");

module.exports = class CreditService {

  // Create Credit
  static async createCredit(bodyData, userId) {
    try {
      const user = await User.findOne({ _id: userId });
      if (user) {
        console.log("inside credit service");
        console.log(bodyData,userId);
        const newCredit = await  Credit.create({
          user_id: userId,
         
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
