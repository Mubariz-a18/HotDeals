const Profile = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");
const { track } = require("./mixpanel-service");
const { DateAfter15Days, currentDate } = require("../utils/moment");
const ObjectId = require('mongodb').ObjectId;

module.exports = class AlertService {

  // Create Alert 
  static async createAlert(bodyData, userId) {
    const {
      name,
      // title,
      category,
      sub_category,
      keywords,
      // condition,
      location,
      // price,
      // age,
      // activate_status,
    } = bodyData;
    const userExist = await Profile.findOne({ _id: userId });
    // if user is authorized create a new alert
    if (!userExist) {
      //mixpanel rack fro failed to create alert
      await track('failed to create alert ', {
        distinct_id: userId,
        category: category,
        sub_category: sub_category,
        keywords: keywords,
        // condition: condition,
        // activate_status: activate_status,
        location: location,
        message: `user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // create an alert in Alerts collection with the input feilds 
      let alertDoc = await Alert.create({
        user_ID: userId,
        name,
        // title,
        category,
        sub_category,
        keywords,
        // condition,
        location,
        // price,
        // age,
        created_Date: currentDate,
        alert_Expiry_Date: DateAfter15Days
      });
      // push alertDoc._id in profile.alert
      await Profile.findByIdAndUpdate(userId, {
        $push: {
          alert: {
            alert_id: alertDoc._id,
            alert_Expire_Date: DateAfter15Days
          },
        },
      });
      // mixpanel track for create alert succesfully
      await track('create alert Successfully', {
        distinct_id: userId,
        category: category,
        sub_category: sub_category,
        keywords: keywords,
        location: location,
        message: `user_id : ${userId}  does not exist`
      })
      return alertDoc;
    }
  }

  static async GetAlert(user_id) {
    const userExist = await Profile.findById({ _id: user_id })
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const getAlerts = await Alert.find({ user_ID: user_id , activate_status:true }, {
      category: 1,
      sub_category: 1,
      name: 1,
      keywords: 1,
      created_Date: 1
    })
    if(getAlerts.length == 0){
      throw ({ status: 404, message: 'ALERT_NOT_EXISTS' });
    }
    return getAlerts
  }

  //Update Alert
  static async updateAlert(bodyData, alert_id, userId) {
    const {
      name,
      // title,
      category,
      sub_category,
      keywords,
      // condition,
      location,
      // price,
      // activate_status,
    } = bodyData
    const user = await Profile.findOne({ _id: userId });
    // if user is verified alert i updated in alert collection
    if (!user) {
      // mixpanel track - failed to update alert
      await track('failed !! to update alert ', {
        sub_category: sub_category,
        category: category,
        keyword: keywords,
        // condition: condition,
        location: location,
        distinct_id: alert_id,
        message: `user : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // update alert with input 
      const updateAds = await Alert.findOneAndUpdate({
        _id: alert_id, user_ID: userId
      }, {
        $set: {
          name,
          // title,
          category,
          sub_category,
          keywords,
          // condition,
          location,
          // price,
          // activate_status,
          updated_Date: currentDate
        },
      }, { new: true })

      // mixpanel track for update alert 
      await track('success !! update alert ', {
        sub_category: sub_category,
        category: category,
        keyword: keywords,
        // condition: condition,
        location: location,
        distinct_id: alert_id,
      })
      return updateAds;
    }
  }

  // Delete Alert
  static async deleteAlert(alert_id, userId) {
    //if user is authorized alert is removed from profile.alert[]
    const user = await Profile.findOne({ _id: userId });
    if (!user) {
      // mixpanel track for failed to delete alert
      await track('failed to delete alert ', {
        distinct_id: alert_id,
        message: `user : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // remove alert id from user profile
      await Profile.findOneAndUpdate(
        { _id: userId },
        {
          $pull: {
            "alert": {
              alert_id: ObjectId(alert_id)
            }
          }
        },
        { new: true }
      );
      await Alert.findOneAndUpdate({_id:alert_id},{
        $set:{
          activate_status:false
        }
      })
      // mixpanel - delete alert from user alert feild
      await track('delete alert ', {
        distinct_id: alert_id,
        message: `${alert_id} deleted successfully`
      })
      return "successfully deleted"
    }
  }
};
