const cron = require('node-cron')
const Generic = require('../models/Ads/genericSchema')
const { currentDate, Ad_Historic_Duration } = require('../utils/moment');

// (ScheduleTask) will update the status the of ad to Expired after checking if the date has past the (current date)
const ScheduleTask = cron.schedule('0 0 0  * * *', async () => {
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
//Starting the schedular
ScheduleTask.start()
ScheduleTask_Display_Historic_Ads.start()

module.exports = { ScheduleTask , ScheduleTask_Display_Historic_Ads };