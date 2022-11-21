const cron = require('node-cron')
const moment = require("moment")
const Generic = require('../models/Ads/genericSchema');
const Alert = require('../models/alertSchema');
const Credit = require('../models/creditSchema');
const Profile = require('../models/Profile/Profile');
const { 
  currentDate, 
  Ad_Historic_Duration, 
  DateAfter30Days } = require('../utils/moment');

// (ScheduleTask_Ad_Status_Expire) will update the status the of ad to Expired after checking if the date has past the (current date)
const ScheduleTask_Ad_Status_Expire = cron.schedule('0 0 0 * * *', async () => {
  const Ads = await Generic.find({ad_status:"Selling"});
  Ads.forEach(ad => {
    if (currentDate > (ad.ad_expire_date)) {
      const updateAd = Generic.findByIdAndUpdate(ad._id,
        { $set: { ad_status: "Expired", isPrime: false, ad_Historic_Duration_Date: Ad_Historic_Duration } },
        { new: true })
        .then((res) => {
          res
        })
        .catch(e => e)
    }
  });
});
// (ScheduleTask_Display_Historic_Ads) will update the (is_ad_Historic_Duration_Flag) to "true" if the (ad_Historic_Duration_Date) has past the (current date)
const ScheduleTask_Display_Historic_Ads = cron.schedule('0 0 0 * * *', async () => {
  const Ads = await Generic.find();
  Ads.forEach(ad => {
    if (currentDate > (ad.ad_Historic_Duration_Date)) {
      const updateAd = Generic.findByIdAndUpdate(
        {
          _id: ad._id,
          ad_status: "Expired" || "Sold" || "Delete"
        },
        { $set: { is_ad_Historic_Duration_Flag: true } },
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
//(Schedule_Task_Alert_6am_to_10pm)                  '0 0 6-22 * * *'     '* * * * * *'
const Schedule_Task_Alert_6am_to_10pm = cron.schedule('0 0 6-22 * * *', async () => {
  const Alerts = await Alert.find({ activate_status: true })
  Alerts.forEach(async (alert) => {
    const {
      name,
      category,
      sub_category,
      keywords,
    } = alert
    const alertNotificationDoc = await Generic.find({
      ad_status: "Selling",
      category: category,
      sub_category: sub_category,
      $text: {
        $search: `${keywords[2]} ${keywords[3]} ${keywords[4]}`
      },
      $or: [
        {
          $in: {
            "ad_posted_address": { "$regex": keywords[0], "$options": "i" },
          },
          $in: {
            "title": { "$regex": name, "$options": "i" }
          },
        }
      ],
      "price": {
        $lte: keywords[1] + 1000
      }
    })
    const ad_Ids = []
    alertNotificationDoc.forEach(e => {
      ad_Ids.push(e._id)
    })
    await Profile.updateOne(
      { _id: alert.user_ID, "alert.alert_id": alert["_id"] },
      {
        $addToSet: { "alert.$.alerted_Ads": ad_Ids }
      })
  })
});
//(Schedule_Task_Monthly_credits) will credit monthly credits into users credit doc
const Schedule_Task_Monthly_credits = cron.schedule("0 0 01 * *", async () => {
  const Credits = await Credit.find()
  Credits.forEach(async creditDoc => {
    await Credit.findOneAndUpdate({ _id: creditDoc._id }, {
      $inc: { available_free_credits: 100 ,  available_premium_credits:10 },
      $push: {
        free_credits_info: {
          count: 100,
          allocation: "Admin-Monthly",
          status:"Available",
          allocated_on: currentDate,
          duration: moment(DateAfter30Days).diff(currentDate, "days"),
          credits_expires_on: DateAfter30Days
        }
      },
      $push: {
        premium_credits_info: {
          count: 10,
          allocation: "Admin-Monthly",
          status:"Available",
          allocated_on: currentDate,
          duration: moment(DateAfter30Days).diff(currentDate, "days"),
          credits_expires_on: DateAfter30Days
        }
      }
    }, { new: true })
    await Profile.findOneAndUpdate({ _id: creditDoc.user_id }, {
      $inc: {
        free_credit: 100,
        premium_credit: 10
      }
    })
  })
});
// (Schedule_Task_Credit_Status_Update) will change the status to expire if the credit expiry date exceeds the curent date
const Schedule_Task_Credit_Status_Update = cron.schedule("0 0 * * *", async () => {
  const credits = await Credit.find();

  credits.map(async credit => {
    const { free_credits_info, premium_credits_info, user_id } = credit;

    //free
    free_credits_info.map(async info => {
      const { credits_expires_on, status, count } = info

      if (currentDate > credits_expires_on && status == "Available") {

        await Credit.findOneAndUpdate({
          user_id: user_id,
          "free_credits_info.credits_expires_on": credits_expires_on,
        }, {
          $set: {
            "free_credits_info.$.status": "Expired"
          }
        }, { new: true })
          .then(async res => {
            if (res !== null) {
              await Credit.findOneAndUpdate({ user_id: user_id }, {
                $inc: { available_free_credits: - count }
              })
              await Profile.findOneAndUpdate({_id:user_id},{
                $inc: { free_credit: - count }
              })
            } else { }
          }).catch(e => {
            e
          })
      } else { }
    })
    // premium
    premium_credits_info.map(async info => {
      const { credits_expires_on, status, count } = info

      if (currentDate > credits_expires_on && status == "Available") {

        await Credit.findOneAndUpdate({
          user_id: user_id,
          "premium_credits_info.credits_expires_on": credits_expires_on
        }, {
          $set: {
            "premium_credits_info.$.status": "Expired"
          }
        }, { new: true })
          .then(async res => {
            if (res !== null) {
              await Credit.findOneAndUpdate({ user_id: user_id }, {
                $inc: { available_premium_credits: - count }
              })
              await Profile.findOneAndUpdate({_id:user_id},{
                $inc: { premium_credit: - count }
              })
            } else { }
          }).catch(e => {
            e
          })
      } else {

      }
    })
  })

});
// (Schedule_Task_Is_user_Recommended) which change the is_recommended to true if user have more than or eqa; tp 5 rate count and rate average
const Schedule_Task_Is_user_Recommended = cron.schedule('0 0 0 * * *', async () => {
  await Profile.updateMany({
    rate_count: { $gte: 5 },
    rate_average: { $gte: 4 }
  }, {
    $set: {
      is_recommended: true
    }
  })
})
//Starting the schedular
// ScheduleTask_Ad_Status_Expire.start()
// ScheduleTask_Display_Historic_Ads.start()
// ScheduleTask_Alert_activation.start()
// Schedule_Task_Alert_6am_to_10pm.start()
// Schedule_Task_Monthly_credits.start()
// Schedule_Task_Credit_Status_Update.start()
// Schedule_Task_Is_user_Recommended.start()