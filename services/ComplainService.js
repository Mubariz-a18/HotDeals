const User = require("../models/Profile/Profile");
const Complain = require("../models/complainSchema");

module.exports = class ComplainService {
  static async createComplain(bodyData, userId) {
    try {
      console.log("Inside Complain Service");
      const user = await User.findOne({ _id: userId });
      console.log(user)
      if (user) {
        const complain = bodyData.complain;
        const newCmpln = await Complain.create({
          user_id: userId,
          complain: complain,
          description: bodyData.description,
        });
        return newCmpln;
      }
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
};
