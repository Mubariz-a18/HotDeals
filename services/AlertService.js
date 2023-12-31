const Profile = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");
const { track } = require("./mixpanel-service");
const ObjectId = require('mongodb').ObjectId;
const moment = require('moment');
const { app } = require("../firebaseAppSetup");
const validateAlert = require("../validators/AlertValidation");
const db = app.database(process.env.DATABASEURL)
module.exports = class AlertService {

  // Create Alert 
  static async createAlert(bodyData, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    // date after 15 days
    const DateAfter15Days = moment().add(15, 'd').format('YYYY-MM-DD HH:mm:ss');
    const isAlerValid = validateAlert(bodyData);
    if(!isAlerValid){
      throw ({ status: 401, message: 'Bad Request' });
    }
    const {
      name,
      category,
      sub_category,
      keywords,
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
        message: `user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // create an alert in Alerts collection with the input feilds 
      let alertDoc = await Alert.create({
        user_ID: userId,
        name,
        category,
        sub_category,
        keywords,
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

      /* 
      realTime DB
      */

      db.ref("Alerts")
        .child(userId.toString())
        .child("user_alerts")
        .child(alertDoc._id.toString())
        .set({
          name: name,
          category: category,
          sub_category: sub_category,
          keywords: keywords,
          created_At: moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss.ms'),
          seenByUser: true
        });

      // mixpanel track for create alert succesfully
      await track('create alert Successfully', {
        distinct_id: userId,
        category: category,
        sub_category: sub_category,
        keywords: keywords,
        message: `user_id : ${userId}  does not exist`
      })
      return alertDoc;
    }
  }

  // Get Alert
  static async GetAlert(user_id) {
    const userExist = await Profile.findById({ _id: user_id })
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const getAlerts = await Alert.find({ user_ID: user_id, activate_status: true }, {
      category: 1,
      sub_category: 1,
      name: 1,
      keywords: 1,
      alerted_Ads: 1,
      created_Date: 1
    })
    if (getAlerts.length == 0) {
      throw ({ status: 404, message: 'ALERT_NOT_EXISTS' });
    }
    return getAlerts
  }

  //Update Alert
  static async updateAlert(bodyData, alert_id, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const {
      name,
      category,
      sub_category,
      keywords,
    } = bodyData

      // update alert with input 
      const UpdateAlert = await Alert.findOneAndUpdate({
        _id: alert_id, user_ID: userId
      }, {
        $set: {
          name,
          category,
          sub_category,
          keywords,
          updated_Date: currentDate
        },
      }, { new: true })

      // mixpanel track for update alert 
      await track('success !! update alert ', {
        sub_category: sub_category,
        category: category,
        keyword: keywords,
        distinct_id: alert_id,
      });

      if(!UpdateAlert){
        throw ({ status: 401, message: 'Access_Denied' });
      }

      return UpdateAlert;
  }

  // Delete Alert
  static async deleteAlert(alert_id, userId) {
    
      const findAlert = await Alert.findOne({_id:alert_id , user_ID :userId});

      if(!findAlert){
        throw ({ status: 401, message: 'Access_Denied' });
      }

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

      await Alert.findOneAndUpdate({ _id: alert_id }, {
        $set: {
          activate_status: false
        }
      })

      await db.ref("Alerts")
        .child(userId.toString())
        .child("alert_ads")
        .child(alert_id.toString())
        .remove();

      await db.ref("Alerts")
        .child(userId.toString())
        .child("user_alerts")
        .child(alert_id.toString())
        .remove();

      // mixpanel - delete alert from user alert feild
      await track('delete alert ', {
        distinct_id: alert_id,
        message: `${alert_id} deleted successfully`
      });

      return "successfully deleted";
  }
};
