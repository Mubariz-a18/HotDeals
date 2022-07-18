const User = require("../models/Profile/Profile");
const Help = require("../models/helpCenterSchema");

module.exports = class HelpService {
  static async createHelp(bodyData, userId) {
    try {
      // console.log("Inside Help Services");
      // const user = await User.findOne({ _id: userId });
      // if (user) {
        const msg = bodyData.message;
        const newCmpln = await Help.create({
          user_id: "62b6cb19c19bebde50d0ae1e",
          phone_number: bodyData.phone_number,
          title: bodyData.title,
          description: bodyData.description,
          attachment: bodyData.attachment,
          message: msg,
        });
        // console.log(newCmpln);

        return newCmpln;
      // }
    } catch (error) {
      res.status(500).send({ error: error });
    }
  }
};
