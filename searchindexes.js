//global search index

const cloudMessage = require("./cloudMessaging")

const ad = {
    "mappings": {
      "dynamic": false,
      "fields": {
        "Keyword": {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        },
        "ad_posted_location": {
          "type": "geo"
        }
      }
    }
  }

// alert search index

 const a =  {
    "mappings": {
      "dynamic": false,
      "fields": {
        "SelectFields": {
          "dynamic": false,
          "fields": {
            "Brand": {
              "foldDiacritics": false,
              "maxGrams": 15,
              "minGrams": 2,
              "tokenization": "edgeGram",
              "type": "autocomplete"
            },
            "Color": {
              "foldDiacritics": false,
              "maxGrams": 15,
              "minGrams": 2,
              "tokenization": "edgeGram",
              "type": "autocomplete"
            },
            "Condition": {
              "foldDiacritics": false,
              "maxGrams": 15,
              "minGrams": 2,
              "tokenization": "edgeGram",
              "type": "autocomplete"
            },
            "Device": {
              "foldDiacritics": false,
              "maxGrams": 15,
              "minGrams": 2,
              "tokenization": "edgeGram",
              "type": "autocomplete"
            },
            "Gated Community": {
              "foldDiacritics": false,
              "maxGrams": 15,
              "minGrams": 2,
              "tokenization": "edgeGram",
              "type": "autocomplete"
            }
          },
          "type": "document"
        },
        "ad_posted_address": {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        },
        "ad_status": {
          "type": "string"
        },
        "category": {
          "type": "string"
        },
        "description": {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        },
        "price": {
          "type": "number"
        },
        "special_mention": {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        },
        "sub_category": {
          "type": "string"
        },
        "title": {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        }
      }
    }
  }


// ad_status_expire schedular

exports = async function() {
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');
    const Generic = context.services.get("TrueList").db("True_Dev").collection("generics");
    const Ads = await Generic.find({ad_status:"Selling"}).toArray()
    .then(ad => {
    ad.forEach(ad => {
    if (currentDate > (ad.ad_expire_date)) {
      const updateAd = Generic.updateMany({_id : ad._id},
        { $set: { ad_status: "Expired", isPrime: false, ad_Historic_Duration_Date: Ad_Historic_Duration } },
        { new: true })
        .then(res=>{
            res;
      });
    }
    });
    })
    .catch(err => console.error(`Failed to find documents: ${err}`));
}


// ad_histori_status

exports = function() {
    const Generic = context.services.get("TrueList").db("True_Dev").collection("generics");
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const Ads = Generic.find().toArray()
        .then(ad => {
            ad.forEach(ad => {
               if (currentDate > (ad.ad_Historic_Duration_Date)) {
                 const updateAd = Generic.updateMany({
                _id: ad._id,
                ad_status: "Expired" || "Sold" || "Delete"
              },
                { $set: { is_ad_Historic_Duration_Flag: true } },
                { new: true })
                  .then((res) => res)
                  .catch(e => e)
                }
           });
       })
    .catch(err => console.error(`Failed to find documents: ${err}`));
};


// alert aactivation status

exports = function() {
    const Alerts = context.services.get("TrueList").db("True_Dev").collection("alerts");
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const UpdateAlerts = Alerts.find({activate_status: true}).toArray()
        .then(allAlerts => {
            allAlerts.forEach(eachAlert => {
              if (currentDate > (eachAlert.alert_Expiry_Date)) {
                const updateAlert = Alerts.updateMany({_id:eachAlert._id},
                   { $set: { activate_status: false } },
                   { new: true });
    }
           });
       })
    .catch(err => console.error(`Failed to find documents: ${err}`));
};


//monthly credits
exports = async function() {
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
    const CreditsCollection = context.services.get("TrueList").db("True_Dev").collection("credits");
    const ProfilesCollection = context.services.get("TrueList").db("True_Dev").collection("profiles");
     const Credits = await CreditsCollection.find()
     .toArray().then(allCredits =>{
         allCredits.forEach(async creditDoc => {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    await CreditsCollection.updateOne({ _id: creditDoc._id }, {

      $inc: { total_universal_credits: 100 },

      $push: {

        universal_credit_bundles:
        {

          number_of_credit: 100,
          source_of_credit: "Admin-Monthly",
          credit_status: "Active",
          credit_created_date: currentDate,
          credit_duration: 30,
          credit_expiry_date: moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss')
        }
      }
    }, { new: true });
  })
})
}
    //nodeversion
const Schedule_Task_Monthly_credits = cron.schedule("0 0 01 * *", async () => {

    const Credits = await Credit.find({});
  
    Credits.forEach(async creditDoc => {
  
      const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
  
      await Credit.findOneAndUpdate({ _id: creditDoc._id }, {
  
        $inc: { total_universal_credits: 100 },
  
        $push: {
  
          universal_credit_bundles:
          {
  
            number_of_credit: 100,
            source_of_credit: "Admin-Monthly",
            credit_status: "Active",
            credit_created_date: currentDate,
            credit_duration: 30,
            credit_expiry_date: expiry_date_func(30)
  
          }
        }
      }, { new: true });
  
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


//credit status change

exports = async function () {
    const Credit = context.services.get("TrueList").db("True_Dev").collection("credits");
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
  
    const credits = await Credit.updateMany({
  
      "universal_credit_bundles.credit_expiry_date": { $lte: currentDate }
  
    }, {
      $set: {
  
        "universal_credit_bundles.$.credit_status": "Expired"
  
      }
    },{new:true});
    
    return "credit status working"
  };


//send alerts


const Schedule_Task_Alert_6am_to_10pm = cron.schedule('0 06,08,10,12,14,16,18,20,22 * * *', async () => {
    const Alerts = await Alert.find({ activate_status: true })
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
  });



  //ad expire
  exports = async function() {
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');
    const Generic = context.services.get("TrueList").db("True_Dev").collection("generics");
    const Ads = await Generic.find({ad_status:"Selling"}).toArray()
    .then(ad => {
    ad.forEach(ad => {
    if (currentDate > (ad.ad_expire_date)) {
      const updateAd = Generic.updateMany({_id : ad._id},
        { $set: { ad_status: "Expired", isPrime: false, ad_Historic_Duration_Date: Ad_Historic_Duration } },
        { new: true })
        .then(res=>{
            res;
      });
    }
    });
    })
    .catch(err => console.error(`Failed to find documents: ${err}`));
}


//ad Historic flag

exports = function(changeEvents) {
    const Generic = context.services.get("TrueList").db("True_Dev").collection("generics");
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

     const updateAd = Generic.updateMany({ad_status: "Expired" || "Sold" || "Delete" , ad_Historic_Duration_Date :{$lte:currentDate}},
      { $set: { is_ad_Historic_Duration_Flag: true } },
      { new: true })
        .then((res) => res)
        .catch(e => e);
};


//hoost hihlightexpire


exports = async function(changeEvent) {
    const moment = require("moment");
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const Generic = context.services.get("TrueList").db("True_Dev").collection("generics");
    try{
            await Generic.updateMany({"is_Boosted":true,"Boost_Expiry_Date":{$lte : currentDate}},{
                $unset: {
                    Boost_Days: 1,
                    Boost_Expiry_Date: 1,
                    Boosted_Date: 1
                },
                $set: {
                    "is_Boosted": false
                }
      });
           await Generic.updateMany({"is_Highlighted":true,"Highlight_Expiry_Date":{$lte : currentDate}},{
                $unset: {
                    Highlight_Days: 1,
                    Highlight_Expiry_Date: 1,
                    Highlighted_Date: 1
                },
                $set: {
                    "is_Highlighted": false
                }
      });
    }
    catch(e){
    }
}


//user recommended

exports = async function(changeEvent) {
    const Profiles = context.services.get("TrueList").db("True_Dev").collection("profiles");
    try{
        await Profiles.updateMany({
    rate_count: { $gte: 5 },
    rate_average: { $gte: 4 }
  }, {
    $set: {
      is_recommended: true
    }
  })
   console.log("Field updated successfully");
    }catch(err){
      console.error("Field update failed", err);
    }
  };