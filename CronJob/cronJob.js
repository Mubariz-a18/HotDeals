const cron = require('node-cron')
const Generic = require('../models/Ads/genericSchema');
const Alert = require('../models/alertSchema');
const Profile = require('../models/Profile/Profile');
const ObjectId = require('mongodb').ObjectId;
const { currentDate, Ad_Historic_Duration } = require('../utils/moment');

// (ScheduleTask_Ad_Status_Expire) will update the status the of ad to Expired after checking if the date has past the (current date)
const ScheduleTask_Ad_Status_Expire = cron.schedule('0 0 0  * * *', async () => {
  const Ads = await Generic.find();
  Ads.forEach(ad => {
    if (currentDate > (ad.ad_expire_date)) {
      const updateAd = Generic.findByIdAndUpdate(ad._id,
        { $set: { ad_status: "Expired", isPrime: false ,  ad_Historic_Duration_Date : Ad_Historic_Duration } },
        { new: true })
        .then((res) => {
          res
        })
        .catch(e => e)
    }
  });
});

// (ScheduleTask_Display_Historic_Ads) will update the (is_ad_Historic_Duration_Flag) to "true" if the (ad_Historic_Duration_Date) has past the (current date)
const ScheduleTask_Display_Historic_Ads = cron.schedule('0 0 0  * * *', async () => {
  const Ads = await Generic.find();
  Ads.forEach(ad => {
    if (currentDate > (ad.ad_Historic_Duration_Date)) {
      const updateAd = Generic.findByIdAndUpdate(
      {
        _id : ad._id ,
        ad_status: "Expired" || "Sold" || "Delete"
      },
      { $set: { is_ad_Historic_Duration_Flag : true } },
      { new: true })
      .then((res) => res)
      .catch(e => e)
    }
  });
});
//(ScheduleTask_Alert_activation) will update the (activate_status) to "false" if the (alert_Expiry_Date) has past the (current date)  * * 01 * * *  '* * * * * *'
const ScheduleTask_Alert_activation = cron.schedule('* * 01 * * *', async () => {
  const Alerts = await Alert.find();
  Alerts.forEach(async (alert) => {
    if (currentDate > (alert.alert_Expiry_Date)) {
      const updateAlert = Alert.findByIdAndUpdate(alert._id,
        { $set: { activate_status: false } },
        { new: true })
    }
  });
});
//(Schedule_Task_Alert_6am_to_10pm)                  '* * 06-22 * * *'     '* * * * * *'
const Schedule_Task_Alert_6am_to_10pm = cron.schedule('* * 06-22 * * *', async () => {
    const Alerts = await Alert.find({activate_status:true})
    Alerts.forEach(async (alert) =>{
        const {
          title,
          category,
          sub_category,
          keywords,
          location,
          price,
          condition
        } = alert
      const alertNotificationDoc = await Generic.find(
        {
          "category": category,
          "sub_category": sub_category,
          "title": { "$regex": title, "$options": "i" },
          "ad_posted_address": { "$regex": location, "$options": "i" },
          "$or": [
            { "SelectFields.Condition": { "$regex": condition, "$options": "i" } },
            {
              $or: [
                { "description": { "$regex": keywords[0], "$options": "i" } },
                { "description": { "$regex": keywords[1], "$options": "i" } },
                { "description": { "$regex": keywords[2], "$options": "i" } }
              ]
            }
          ]
        }
        )
        const ad_Ids = []
        alertNotificationDoc.forEach(e => {
          ad_Ids.push(e._id)
        })
        await Profile.updateOne(
          { _id: alert.user_ID, "alert.alert_id": ObjectId(alert["_id"]) },
          {
            $addToSet: { "alert.$.alerted_Ads": ad_Ids }
          })
    })
});

//Starting the schedular
ScheduleTask_Ad_Status_Expire.start()
ScheduleTask_Display_Historic_Ads.start()
ScheduleTask_Alert_activation.start()
Schedule_Task_Alert_6am_to_10pm.start()

module.exports = {
  ScheduleTask_Ad_Status_Expire,
  ScheduleTask_Display_Historic_Ads,
  ScheduleTask_Alert_activation,
  Schedule_Task_Alert_6am_to_10pm
};