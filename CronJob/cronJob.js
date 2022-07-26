// const schedule = require('node-schedule');

// var moment = require('moment');
// moment().format()
// var now = moment().format('YYYY-MM-DD HH:mm:ss');;

// const ScheduleTask = schedule.scheduleJob('*/10 * * * * *', async() => {
//     const Ads =  Generic.find();
//     Ads.forEach(ad => {
//         // console.log(ad.ad_expire_date);
//         // console.log(now)
//         if (now > ad.ad_expire_date) {
//             console.log(ad)
//             const updateAd =  Generic.findByIdAndUpdate(ad._id,
//                 {
//                     $set: {
//                         ad_status: "Expired",
//                         // updated_date: moment().format('DD-MM-YY HH:mm:ss'),
//                     },
//                 },
//                 {
//                     new: true
//                 });

//         }
//         else {
//             console.log('Ad is not Expired!');
//         }
//     });
// });

// module.exports = ScheduleTask;
