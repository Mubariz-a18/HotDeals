const User = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");

module.exports = class AlertService {
  static async createAlert(bodyData, userId) {
    console.log("Inside Alert Service");

    let usr = await User.findOne({ _id: userId });
    console.log(usr);
    if (usr) {
      let alertDoc = await Alert.create({
        user_id: userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        name: bodyData.name,
        keyword: bodyData.keyword,
        activate_status: bodyData.activate_status,
      });

      console.log(alertDoc);

      await User.findByIdAndUpdate(userId, {
        $push: {
          alert: {
            _id: alertDoc._id,
          },
        },
      });

      return alertDoc;
    }
  }
};
