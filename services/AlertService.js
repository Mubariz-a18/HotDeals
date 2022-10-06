const Profile = require("../models/Profile/Profile");
const Alert = require("../models/alertSchema");
const { track } = require("./mixpanel-service");
const ObjectId = require('mongodb').ObjectId;

module.exports = class AlertService {

  // Create Alert 
  static async createAlert(bodyData, userId) {
    console.log("Inside Alert Service");

    let user = await Profile.findOne({ _id: userId });
   // console.log(user);
    if (user) {
      let alertDoc = await Alert.create({
        userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        name: bodyData.name,
        keyword: bodyData.keyword,
        activate_status: bodyData.activate_status,
      });

      await Profile.findByIdAndUpdate(userId, {
        $push: {
          alert: {
            _id: alertDoc._id,
          },
        },
      });
      await track('alert created ', { 
        distinct_id: userId,
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        keyword: bodyData.keyword,
      })
      return alertDoc;
    }
    else{
      res.send({
        statusCode:403,
        
      })
    }
  }
    // get Alert
  static async getAlert(bodyData, userId) {
    try {
      const user = await Profile.findOne({ _id: userId });
      if (user) {
        const myAlert = await Alert.find({_id: [bodyData._id]})
        console.log(user.alert.length , bodyData._id , ".......")
        for (let i = 0 ;i<=user.alert.length ;i++){
          if(user.alert[i]== bodyData._id){
            
            await track('get alert ', { 
              distinct_id: bodyData._id,
            })
            return user.alert[i] , myAlert;
          }
        }
      } else {
        res.send({
          statusCode: 403,
        })
      }} catch (e) {
      return e
    }
  }

  //Update Alert
  static async updateAlert(bodyData, alert_id, userId) {
    console.log("Inside Alert update Service");
    try {
      const user = await Profile.findOne({ _id: userId });
      if (user) {
        const updateAds = await Alert.findOneAndUpdate({
          _id: alert_id
        }, {
          $set: {
            category: bodyData.category,
            sub_category: bodyData.sub_category,
            name: bodyData.name,
            keyword: bodyData.keyword,
            activate_status: bodyData.activate_status,
          },
        }, { new: true })
        await track('update  alert ', { 
          distinct_id: alert_id,
        })
        return updateAds;
      }
    } catch (e) {
      console.log(e);
    }
  }

  // Delete Alert
  static async deleteAlert(alert_id, userId) {
    console.log("I'm inside Delete Alert")
    try {
      const user = await Profile.findOne({ _id: userId });
      if (user) {
        const deleteAlert = await Profile.findOneAndUpdate(
          { _id: userId },
          { $pull: { alert: ObjectId(alert_id) } },
          { new: true }
        );
        await track('delete alert  alert ', { 
          distinct_id: alert_id,
        })
        return deleteAlert;
      }

    } catch (e) {
      console.log(e);
    }

  }
};
