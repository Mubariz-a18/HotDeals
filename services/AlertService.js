const Profile = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");
const { track } = require("./mixpanel-service");
const { DateAfter15Days, currentDate } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class AlertService {

  // Create Alert 
  static async createAlert(bodyData, userId) {
    const userExist = await Profile.findOne({ _id: userId });
    // if user is authorized create a new alert
    if (!userExist) {
      await track('failed to create alert ', {
        distinct_id: userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        keyword: bodyData.keyword,
        message: `user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      let alertDoc = await Alert.create({
        userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        name: bodyData.name,
        keywords: bodyData.keywords,
        activate_status: bodyData.activate_status,
        created_Date:currentDate,
        alert_Expiry_Date:DateAfter15Days
      });
      // push alertDoc._id in profile.alert
      await Profile.findByIdAndUpdate(userId, {
        $push: {
          alert: {
            _id: alertDoc._id,
          },
        },
      });

      // mixpanel track for create alert 
      await track('alert created ', {
        distinct_id: userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        keyword: bodyData.keyword,
      });

      return alertDoc;
    }
  }
  // get Alert
  static async getAlert(bodyData, userId) {

    const userExist = await Profile.findOne({ _id: userId });
    // if user is verified alerts are fetched from alert collection 
    if (!userExist) {
      await track('failed !! get alert ', {
        distinct_id: bodyData._id,
        message: `user : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const myAlert = await Alert.find({ _id: [bodyData._id] })
      if (myAlert.length == 0) {
        await track('failed !! get alert ', {
          distinct_id: userId,
          message: ` alert_id : ${bodyData._id}  does not exist`
        })
        throw ({ status: 404, message: 'ALERT_NOT_EXISTS' });
      }
      else {
        for (let i = 0; i <= userExist.alert.length; i++) {
          if (userExist.alert[i] == bodyData._id) {

            // mixpanel - tracker for get alert
            await track('get alert ', {
              distinct_id: bodyData._id,
            })
            return myAlert
          }
        };
      };
    };
  };

  //Update Alert
  static async updateAlert(bodyData, alert_id, userId) {

    const user = await Profile.findOne({ _id: userId });
    // if user is verified alert i updated in alert collection
    if (!user) {
      // mixpanel track - failed to update alert
      await track('failed !! to update alert ', {
        sub_category: bodyData.sub_category,
        category: bodyData.category,
        keyword: bodyData.keyword,
        distinct_id: alert_id,
        message: `user : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const updateAds = await Alert.findOneAndUpdate({
        _id: alert_id
      }, {
        $set: {
          category: bodyData.category,
          sub_category: bodyData.sub_category,
          name: bodyData.name,
          keyword: bodyData.keyword,
          activate_status: bodyData.activate_status,
          updated_Date:currentDate
        },
      }, { new: true })

      // mixpanel track for update alert 
      await track('success !! update alert ', {
        sub_category: bodyData.sub_category,
        category: bodyData.category,
        keyword: bodyData.keyword,
        distinct_id: alert_id,
      })
      return updateAds;
    }
  }

  // Delete Alert
  static async deleteAlert(alert_id, userId) {
    const user = await Profile.findOne({ _id: userId });
    //if user is authorized alert is removed from profile.alert[]
    if (!user) {
      await track('failed to delete alert ', {
        distinct_id: alert_id,
        message: `user : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const deleteAlert = await Profile.findOneAndUpdate(
        { _id: userId },
        { $pull: { alert: ObjectId(alert_id) } },
        { new: true }
      );
      // mixpanel - delete alert from user alert feild
      await track('delete alert ', {
        distinct_id: alert_id,
        message: `${alert_id} deleted successfully`
      })
      return "successfully deleted"
    }
  }
};
