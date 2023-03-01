const cron = require('node-cron')
const moment = require("moment")
const Generic = require('../models/Ads/genericSchema');
const Alert = require('../models/alertSchema');
const Credit = require('../models/creditSchema');
const Profile = require('../models/Profile/Profile');
const Report = require('../models/reportSchema');
const {
  Ad_Historic_Duration,
  DateAfter30Days,
  expiry_date_func } = require('../utils/moment');
const { app, userRef } = require('../firebaseAppSetup');
const { ObjectId } = require('mongodb');
const cloudMessage = require('../Firebase operations/cloudMessaging');
const navigateToTabs = require('../utils/navigationTabs');
const db = app.database("https://true-list-default-rtdb.firebaseio.com");

// (ScheduleTask_Ad_Status_Expire) will update the status the of ad to Expired after checking if the date has past the (current date)
// const ScheduleTask_Ad_Status_Expire = cron.schedule('0 0 0 * * *', async () => {
//   const Ads = await Generic.find({ad_status:"Selling"});
//   Ads.forEach(ad => {
//     if (currentDate > (ad.ad_expire_date)) {
//       const updateAd = Generic.findByIdAndUpdate(ad._id,
//         { $set: { ad_status: "Expired", isPrime: false, ad_Historic_Duration_Date: Ad_Historic_Duration } },
//         { new: true })
//         .then((res) => {
//           res
//         })
//         .catch(e => e)
//     }
//   });
// });
// // (ScheduleTask_Display_Historic_Ads) will update the (is_ad_Historic_Duration_Flag) to "true" if the (ad_Historic_Duration_Date) has past the (current date)
// const ScheduleTask_Display_Historic_Ads = cron.schedule('0 0 0 * * *', async () => {
//   const Ads = await Generic.find();
//   Ads.forEach(ad => {
//     if (currentDate > (ad.ad_Historic_Duration_Date)) {
//       const updateAd = Generic.findByIdAndUpdate(
//         {
//           _id: ad._id,
//           ad_status: "Expired" || "Sold" || "Delete"
//         },
//         { $set: { is_ad_Historic_Duration_Flag: true } },
//         { new: true })
//         .then((res) => res)
//         .catch(e => e)
//     }
//   });
// });

// //(ScheduleTask_Alert_activation) will update the (activate_status) to "false" if the (alert_Expiry_Date) has past the (current date)  * * 01 * * *  '* * * * * *'
// const ScheduleTask_Alert_activation = cron.schedule('* * 01 * * *', async () => {
//   const Alerts = await Alert.find();
//   Alerts.forEach(async (alert) => {
//     if (currentDate > (alert.alert_Expiry_Date)) {
//       const updateAlert = Alert.findByIdAndUpdate(alert._id,
//         { $set: { activate_status: false } },
//         { new: true })
//     }
//   });
// });


// (Schedule_Task_Alert_6am_to_10pm)                   '0 06,08,10,12,14,16,18,20,22 * * *'     '* * * * * *'   '0 * * * * *'

// (Schedule_Task_Credit_Status_Update) will change the status to expire if the credit expiry date exceeds the curent date
// const Schedule_Task_Credit_Status_Update = cron.schedule("0 0 * * *", async () => {
//   const credits = await Credit.find();

//   credits.map(async credit => {
//     const { free_credits_info, premium_credits_info, user_id } = credit;

//     //free
//     free_credits_info.map(async info => {
//       const { credits_expires_on, status, count } = info

//       if (currentDate > credits_expires_on && status == "Available") {

//         await Credit.findOneAndUpdate({
//           user_id: user_id,
//           "free_credits_info.credits_expires_on": credits_expires_on,
//         }, {
//           $set: {
//             "free_credits_info.$.status": "Expired"
//           }
//         }, { new: true })
//           .then(async res => {
//             if (res !== null) {
//               await Credit.findOneAndUpdate({ user_id: user_id }, {
//                 $inc: { available_free_credits: - count }
//               })
//               await Profile.findOneAndUpdate({_id:user_id},{
//                 $inc: { free_credit: - count }
//               })
//             } else { }
//           }).catch(e => {
//             e
//           })
//       } else { }
//     })
//     // premium
//     premium_credits_info.map(async info => {
//       const { credits_expires_on, status, count } = info

//       if (currentDate > credits_expires_on && status == "Available") {

//         await Credit.findOneAndUpdate({
//           user_id: user_id,
//           "premium_credits_info.credits_expires_on": credits_expires_on
//         }, {
//           $set: {
//             "premium_credits_info.$.status": "Expired"
//           }
//         }, { new: true })
//           .then(async res => {
//             if (res !== null) {
//               await Credit.findOneAndUpdate({ user_id: user_id }, {
//                 $inc: { available_premium_credits: - count }
//               })
//               await Profile.findOneAndUpdate({_id:user_id},{
//                 $inc: { premium_credit: - count }
//               })
//             } else { }
//           }).catch(e => {
//             e
//           })
//       } else {

//       }
//     })
//   })

// });
// // (Schedule_Task_Is_user_Recommended) which change the is_recommended to true if user have more than or eqa; tp 5 rate count and rate average
// const Schedule_Task_Is_user_Recommended = cron.schedule('0 0 0 * * *', async () => {
//   await Profile.updateMany({
//     rate_count: { $gte: 5 },
//     rate_average: { $gte: 4 }
//   }, {
//     $set: {
//       is_recommended: true
//     }
//   })
// })

// const expiry_boost = cron.schedule("* * * * * *", async () => {
//     const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
//     const ads = await Generic.find({ is_Boosted: true ,"Boost_Expiry_Date": { $lte: currentDate }})
// ads.forEach(async ad => {
//     if (currentDate > ad.Boost_Expiry_Date) {
//         await Generic.findByIdAndUpdate({ _id: ad._id }, {
//             $unset: {
//                 Boost_Days: 1,
//                 Boost_Expiry_Date: 1,
//                 Boosted_Date: 1
//             },
//             $set: {
//                 "is_Boosted": false
//             },
//         })
//     }
// })
// })



//Starting the schedular
// ScheduleTask_Ad_Status_Expire.start()
// ScheduleTask_Display_Historic_Ads.start()
// ScheduleTask_Alert_activation.start()
// Schedule_Task_Alert_6am_to_10pm.start()
// Schedule_Task_Monthly_credits.start()
// Schedule_Task_Credit_Status_Update.start()
// Schedule_Task_Is_user_Recommended.start()



const Schedule_Task_Alert_6am_to_10pm = cron.schedule('0 06,08,10,12,14,16,18,20,22 * * *', async () => {
  const Alerts = await Alert.find({ activate_status: true });
  if (Alerts.length > 0) {
    Alerts.forEach(async (alert) => {
      const {
        name,
        category,
        sub_category,
        keywords,
      } = alert
      let price = Number(keywords[1])
      let myFilterArray = keywords.filter(Boolean);

      const alertNotificationDoc = await Generic.aggregate(
        [
          {
            $search: {
              "index": "generic_search_index",

              "compound": {
                "filter": {
                  "text": {
                    "query": category,
                    "path": "category"
                  },
                  "text": {
                    "query": sub_category,
                    "path": "sub_category"
                  },
                },
                "should": {
                  "autocomplete": {
                    "query": name,
                    "path": "title"
                  },
                  "autocomplete": {
                    "query": keywords[0],
                    "path": "ad_posted_address"
                  },
                },
                "must": {
                  "range": {
                    "path": "price",
                    "lte": price
                  }
                },
                "should": {
                  "text": {
                    "query": myFilterArray,
                    "path": ["SelectFields.Condition", "SelectFields.Brand", "SelectFields.Color", "SelectFields.Gated Community", "SelectFields.Device", "description", "special_mention"]
                  }
                },
              }
            }

          },
          {
            $match: {
              ad_status: "Selling"
            }
          },
          {
            $project: {
              '_id': 1,
              'parent_id': 1,
              "Seller_Id": 1,
              'Seller_Name': 1,
              "Seller_verified": 1,
              "Seller_recommended": 1,
              'category': 1,
              'sub_category': 1,
              'ad_status': 1,
              'title': 1,
              "created_at": 1,
              'price': 1,
              "thumbnail_url": 1,
              'isPrime': 1,
              "dist": 1,
              "is_Boosted": 1,
              "Boosted_Date": 1,
              "is_Highlighted": 1,
              "Highlighted_Date": 1
            }
          }
        ]
      )

      alertNotificationDoc.forEach(async (eachAd, i) => {

        eachAd._id = eachAd._id.toString()
        eachAd.parent_id = eachAd.parent_id.toString()

        await Alert.updateOne(
          { _id: alert._id },
          {
            $addToSet: { "alerted_Ads": eachAd }
          });

      });


      const alertRef = db.ref(`Alerts/${alert.user_ID.toString()}/alert_ads/${alert._id.toString()}`);

      const snapshot = await alertRef.once('value')

      const alertData = await snapshot.val();

      if (alertData !== null) {

        const arrayOfadIds = []

        alertData.forEach(element => {

          arrayOfadIds.push(element._id)

        });

        let flag = true;

        alertNotificationDoc.forEach(alert => {

          if (!arrayOfadIds.includes(alert._id)) {

            flag = false

          }
        })
        if (flag == false) {

          db.ref("Alerts")
            .child(alert.user_ID.toString())
            .child("user_alerts")
            .child(alert._id.toString())
            .update({
              seenByUser: false
            });

          /* 
   
            Cloud Notification To firebase
   
          */

          const messageBody = {
            title: `Potential Ads For Your '${alert.name}' Ad Alert !!`,
            body: "Click here to check ...",
            data: {
              id: alert._id.toString(),
              navigateTo: navigateToTabs.alert
            },
            type: "Alert"
          }

          await cloudMessage(alert.user_ID.toString(), messageBody);

        }

      } else {
        if (alertNotificationDoc.length !== 0) {
          db.ref("Alerts")
            .child(alert.user_ID.toString())
            .child("user_alerts")
            .child(alert._id.toString())
            .update({
              seenByUser: false
            });

          /* 
      
            Cloud Notification To firebase
      
          */
          const messageBody = {
            title: `Potential Ads For Your ${alert.name} Ad Alert !!`,
            body: "Click here to check ...",
            data: {
              id: alert._id.toString(),
              navigateTo: navigateToTabs.alert
            },
            type: "Alert"
          }

          await cloudMessage(alert.user_ID.toString(), messageBody);
        }

      }

      db.ref("Alerts")
        .child(alert.user_ID.toString())
        .child("alert_ads")
        .child(alert._id.toString())
        .set(alertNotificationDoc)
    })
  } else {

  }
});


//(Schedule_Task_Monthly_credits) will credit monthly credits into users credit doc "0 0 01 * *"  "* * * * *"
const Schedule_Task_Monthly_credits = cron.schedule("0 0 01 * *", async () => {

  const Credits = await Credit.find({});

  Credits.forEach(async creditDoc => {

    // const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    // await Credit.findOneAndUpdate({ _id: creditDoc._id }, {

    //   $inc: { total_universal_credits: 100 },

    //   $push: {

    //     universal_credit_bundles:
    //     {

    //       number_of_credit: 100,
    //       source_of_credit: "Admin-Monthly",
    //       credit_status: "Active",
    //       credit_created_date: currentDate,
    //       credit_duration: 30,
    //       credit_expiry_date: expiry_date_func(30)

    //     }
    //   }
    // }, { new: true });

    /* 
 
  Cloud Notification To firebase
 
*/

    const messageBody = {
      title: `You Earned 100 Free Credits!!`,
      body: "Check Your Credit Info",
      data: {
        navigateTo: navigateToTabs.home
      },
      type: "Info"
    }

    await cloudMessage(creditDoc.user_id.toString(), messageBody);

  })
});


const creditExpire = cron.schedule("0 0 0 * * *", async () => {

  const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

  const Credits = await Credit.updateMany({

    "universal_credit_bundles.credit_expiry_date": { $lte: currentDate }

  }, {
    $set: {

      "universal_credit_bundles.$.credit_status": "Expired"

    }
  }, { new: true });
});

//0 12 2,5,10,15,20,25,30 * *     * * * * *
// const sendPromotingNotification = cron.schedule('* * * * *', async()=> {
//   var date = moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')

//   await Generic.find({ created_at: { $gte: date } }, function(err, docs) {
//     if (err) throw err;
//     fs.writeFileSync("./text.json",docs.toString())
//   });
// });

//*************************************************************** */

                                                                              //'0 0 0 * * *'
// const banuser = cron.schedule("* * * * * *", async () => {

//   const Reports = await Report.find({ flag: { $ne: "Green" } })

//   const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

//   const Date_Before_Two_Months = moment().add(-61, 'd').format('YYYY-MM-DD HH:mm:ss');

//   if (Reports.length > 0) {

//     Reports.forEach(async report => {

//       let reported_Date = [];

//       let { reports_box } = report;

//       if (reports_box.length > 0) {

//         reports_box.forEach(

//           reportList => {
//             reported_Date.push(reportList.report_action_date)
//           }

//         );

//         reported_Date.sort();

//         let last_report_Date = reported_Date.pop()


//         //01012021        <   01122022
//         if (last_report_Date < Date_Before_Two_Months && report.total_Ads_suspended >= 2) {

//           if (report.grace_count_latest_date && report.grace_count_latest_date > Date_Before_Two_Months) {

//           } else {
//             const Update_Report = await Report.findOneAndUpdate({ user_id: report.user_id }, {
//               $inc: {
//                 grace_counter: 2
//               },
//               $inc: {
//                 total_Ads_suspended: -2,
//               },
//               $set: {
//                 grace_count_latest_date: currentDate
//               }

//             }, { new: true })



//             const Update_flag_func = async (flag) => {

//               if (flag === "Red") {

//                 const Updated_flag = await Report.findOneAndUpdate({

//                   user_id: report.user_id

//                 }, {
//                   $set: {

//                     "flag": flag,

//                     "flag_Date": currentDate

//                   },
//                 }, {
//                   new: true
//                 });

//                 return Updated_flag
//               }
//               else {
//                 if (Update_Report["flag"] !== flag) {

//                   const Updated_flag = await Report.findOneAndUpdate({
//                     user_id: report.user_id
//                   }, {
//                     $set: {
//                       "flag": flag,
//                       "flag_Date": currentDate
//                     },
//                   }, {
//                     new: true
//                   });

//                   return Updated_flag
//                 }
//               }
//             }

//             if (Update_Report["total_Ads_suspended"] >= 10 && Update_Report["total_Ads_suspended"] <= 14) {

//               Update_flag_func("Yellow");

//               userRef(report.user_id.toString()).update({ isBanned: false });

//             } else if (Update_Report["total_Ads_suspended"] >= 15 && Update_Report["total_Ads_suspended"] <= 19) {

//               Update_flag_func("Orange");

//               userRef(report.user_id.toString()).update({ isBanned: false });


//             } else if (Update_Report["total_Ads_suspended"] <= 10) {

//               Update_flag_func("Green");

//               userRef(report.user_id.toString()).update({ isBanned: false });

//             }
//             else if (Update_Report["total_Ads_suspended"] >= 20) {

//               const Updated_flag = Update_flag_func("Red");

//               if (Updated_flag) {

//                 await Profile.findByIdAndUpdate({ _id: report.user_id }, {

//                   $set: {
//                     user_Banned_Flag: true,
//                     user_Banned_Date: currentDate
//                   },
//                   $inc: {
//                     user_Banned_Times: 1
//                   }

//                 })

//                 userRef(report.user_id.toString()).update({ isBanned: true });
//               }
//             }
//           }
//         }
//       }
//     })
//   } else {

//   }
// });



//************************************************************** */

module.exports = {
  Schedule_Task_Alert_6am_to_10pm,
  Schedule_Task_Monthly_credits,
  // creditExpire
  // sendPromotingNotification
  // banuser
}