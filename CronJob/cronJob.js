const cron = require('node-cron')
const Generic = require('../models/Ads/genericSchema')
var moment = require('moment');
moment().format()
var now = moment().format('YYYY-MM-DD HH:mm:ss'); 

 const ScheduleTask = cron.schedule('0 0 0  * * *', async() => {
    const Ads = await Generic.find();
    Ads.forEach(ad => {   
        if (now > (ad.ad_expire_date) ) {
            const updateAd =  Generic.findByIdAndUpdate(ad._id,
              { $set: { ad_status: "Expired" } },
                {new: true})
                .then((res)=>{
                 res
                })
                .catch(e=>e)

        }

    });
});
  setInterval(()=>{
    ScheduleTask.start()
  },1000)

module.exports = ScheduleTask;