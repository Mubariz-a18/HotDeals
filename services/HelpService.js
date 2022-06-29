const User = require("../models/Profile/userProfile");
const Help = require("../models/helpCenterSchema");

module.exports = class HelpService {
  static async createHelp(bodyData, userId) {
    try {
      console.log("Inside Help Services");
      const user = await User.findOne({ _id: userId });
      if (user) {
        const msg = bodyData.message;
        const newCmpln = await Help.create({
          user_id: userId,
          phone_number: bodyData.phone_number,
          title: bodyData.title,
          description: bodyData.description,
          attachment: bodyData.attachment,
          message: msg,
        });
        console.log(newCmpln);

        return newCmpln;
      }
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
};
