const cron = require('node-cron')
const Generic = require('../models/Ads/genericSchema');
const Alert = require('../models/alertSchema');
const Credit = require('../models/creditSchema');
const { app } = require('../firebaseAppSetup');
const { default: axios } = require("axios");
const cloudMessage = require('../Firebase operations/cloudMessaging');
const navigateToTabs = require('../utils/navigationTabs');
const OfferModel = require('../models/offerSchema');
const PayoutModel = require('../models/payoutSchema');
const db = app.database(process.env.DATABASEURL);

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
            title: `Alert: We found Potential Ads for ${alert.name}`,
            body: "Click here to access it",
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
            title: `Alert: We found Potential Ads for ${alert.name}`,
            body: "Click here to access it",
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
  const Offer = await OfferModel.findOne({});

  Credits.forEach(async creditDoc => {

    /* 
 
  Cloud Notification To firebase
 
    */

    const messageBody = {
      title: `Credits: Hurray you are credited with ${Offer.monthlyCredits} free credits`,
      body: "Check Your Credit Info",
      data: {
        navigateTo: navigateToTabs.home
      },
      type: "Info"
    }

    await cloudMessage(creditDoc.user_id.toString(), messageBody);

  })
});


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


const payoutStatusChangeCron =
  // cron.schedule("0 * * * *",
  async () => {
    try {

      const username = process.env.LIVE_KEY_ID;
      const password = process.env.LIVE_KEY_SECRET;

      const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
          'Accept': 'application/json',
        }
      };
      const response = await axios.get(`https://api.razorpay.com/v1/transactions?account_number=${process.env.LIVE_ACC_NUMBER}`, config);
      const Data = response?.data?.items
      const updates = Data.map(transaction => ({
        payout_id: transaction.source.id,
        paymentStatus: transaction.source.status
      }));

      updates.forEach(async update => {
        await PayoutModel.updateOne({
          payout_id: update.payout_id,
          payment_status: "processing"
        }, {
          $set: {
            payment_status: update.paymentStatus ? update.paymentStatus : "processing"
          }
        });
      })

    } catch (e) {
      console.log(e)
    }
  }
// })




module.exports = {
  Schedule_Task_Alert_6am_to_10pm,
  Schedule_Task_Monthly_credits,
  // banuser
  // payoutStatusChangeCron
}