const Credit = require("../models/creditSchema");
const {  durationInDays, expiry_date_func } = require("../utils/moment");
const Profile = require("../models/Profile/Profile");
const credit_value = require("../utils/creditValues");
const moment = require('moment');
const { ObjectId } = require("mongodb");

const creditType = {
  Premium: "Premium",
  Premium_Boost: "Premium_Boost",
  HighLight: "HighLight",
  General: "General",
  General_Boost: "General_Boost"
}

const getCreditType = (ad) => {

  const isPrime = ad['isPrime'];

  const isHighlighted = ad['isHighlighted'];

  const isBoosted = ad['isBoosted'];

  if (isHighlighted) {
    return creditType.HighLight
  }
  if (!isPrime && !isBoosted) {
    return creditType.General
  }
  if (!isPrime && isBoosted) {
    return creditType.General_Boost
  }
  if (isPrime && !isBoosted) {
    return creditType.Premium
  }
  if (isPrime && isBoosted) {
    return creditType.Premium_Boost
  }
  return
}



module.exports = class CreditService {
  // create Default Credit for new user 
  static async createCreditForNewUser(user_id) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const Free_credit_Expiry = expiry_date_func(180);

    // creating a document

    await Credit.create({

      user_id: user_id,
      total_universal_credits:200,

      universal_credit_bundles: {

        number_of_credit: 200,
        source_of_credit: "Admin-Login",
        credit_created_date: currentDate,
        credit_status: "Active",
        credit_duration: durationInDays(Free_credit_Expiry),
        credit_expiry_date: Free_credit_Expiry

      }

    });

    // updating the user profile with default values

    await Profile.findOneAndUpdate({ _id: user_id }, {

      $set: {
        availble_credit: 200
      }

    })
  };

  // Create Credit for old users
  static async createCredit(bodyData, userId) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const creditsArray = bodyData;

    creditsArray.forEach(async credit=>{

      const push = {

        universal_credit_bundles: {
  
          number_of_credit: credit.number_of_credit,
          source_of_credit: "Paid",
          credit_status: "Active",
          credit_duration: credit.credit_duration,
          credit_expiry_date: expiry_date_func(+credit.credit_duration),
          transaction_Id: credit.transaction_Id,
          credit_created_date: currentDate
  
        }
      }
  
      const Purchased_Credit_Doc = await Credit.findOneAndUpdate({ user_id: userId }, {
  
        $inc: { total_universal_credits: credit.number_of_credit },
  
        $push: push
  
      }, {
        new: true
      })

    });

    return "SUCCESSFULLY_PURCHASED"

  };

  static async CreditCheckFunction(bodyData, user_Id) {

    const typeMultiples = {
      General: 1,
      Premium: 3,
      General_Boost: 2,
      Premium_Boost: 4,
      Highlight: 7
    };
    const { category, AdsArray } = bodyData;

    const user_credit_Document = await Credit.findOne({
      user_id: user_Id
    })


    let universal_credit_bundles = user_credit_Document.universal_credit_bundles;

    universal_credit_bundles = universal_credit_bundles.filter(elem => {
      if (elem.credit_status !== "Expired") {
        return elem
      }
    })


    universal_credit_bundles.sort((a, b) => {
      return new Date(a.credit_expiry_date) - new Date(b.credit_expiry_date)
    })


    const CategoryCreditBaseValue = credit_value[category];

    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })


    AdsArray.forEach((eachAd, i) => {

      const credittype = getCreditType(eachAd);

      const creditTypeMultiple = typeMultiples[credittype];

      const requiredCredits = CategoryCreditBaseValue * creditTypeMultiple

      let tempRequiredCredits = requiredCredits;

      let tempBundles = universal_credit_bundles;

      let usingUniversalBundle = false;

      for (var j = 0; j < tempBundles.length; j++) {

        let bundle = tempBundles[j];

        let creditCount = bundle["number_of_credit"];

        /// if this bundle has enough credit all the requirenment will be fulfilled
        if (creditCount >= requiredCredits) {

          creditCount = creditCount - tempRequiredCredits;
          tempRequiredCredits = 0;
          usingUniversalBundle = true;
          tempBundles[j]['number_of_credit'] = creditCount;

          break;
        } else {
          /// else using all the credits of this bundle and move to the next after reducing required credits
          tempRequiredCredits = tempRequiredCredits - creditCount;
          creditCount = 0;
        }
        tempBundles[j]['number_of_credit'] = creditCount;
      }

      // if this ad can be posted using universal credits
      if (usingUniversalBundle) {

        tempArray[i] = true;

        universal_credit_bundles = tempBundles;
      }

    })
    return tempArray
  };

  static async creditDeductionFunction(bodyData, user_Id, ad_id) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const typeMultiples = {
      General: 1,
      General_Boost: 2,
      Premium: 3,
      Premium_Boost: 4,
      Highlight: 5
    };

    const { category } = bodyData;

    const AdsArray = Array(bodyData.AdsArray);

    const user_credit_Document = await Credit.findOne({
      user_id: user_Id
    })


    let universal_credit_bundles = user_credit_Document.universal_credit_bundles;

    universal_credit_bundles = universal_credit_bundles.filter(elem => {
      if (elem.credit_status !== "Expired") {
        return elem
      }
    })


    universal_credit_bundles.sort((a, b) => {
      return new Date(a.credit_expiry_date) - new Date(b.credit_expiry_date)
    })


    const CategoryCreditBaseValue = credit_value[category];

    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })

    let creditValue_for_usage = 0

    AdsArray.forEach((eachAd, i) => {

      const credittype = getCreditType(eachAd);

      const creditTypeMultiple = typeMultiples[credittype];

      const requiredCredits = CategoryCreditBaseValue * creditTypeMultiple

      creditValue_for_usage = creditValue_for_usage + requiredCredits

      let tempRequiredCredits = requiredCredits;

      let tempBundles = universal_credit_bundles;

      let usingUniversalBundle = false;

      for (var j = 0; j < tempBundles.length; j++) {

        let bundle = tempBundles[j];

        let creditCount = bundle["number_of_credit"];

        /// if this bundle has enough credit all the requirenment will be fulfilled
        if (creditCount >= requiredCredits) {

          creditCount = creditCount - tempRequiredCredits;
          tempRequiredCredits = 0;
          usingUniversalBundle = true;
          tempBundles[j]['number_of_credit'] = creditCount;

          break;
        } else {
          /// else using all the credits of this bundle and move to the next after reducing required credits
          tempRequiredCredits = tempRequiredCredits - creditCount;
          creditCount = 0;
        }
        tempBundles[j]['number_of_credit'] = creditCount;
      }

      // if this ad can be posted using universal credits
      if (usingUniversalBundle) {

        tempArray[i] = true;

        universal_credit_bundles = tempBundles;
      }

    })

    if(tempArray.includes(false)){
      return "NOT_ENOUGH_CREDITS"
    }else{
      universal_credit_bundles.forEach(async bundle => {

        await Credit.updateOne({
  
          user_id: ObjectId(user_Id),
  
          "universal_credit_bundles._id": bundle._id
  
        }, {
          $set: {
  
            'universal_credit_bundles.$.number_of_credit': bundle.number_of_credit,
  
            'universal_credit_bundles.$.credit_status': bundle.number_of_credit == 0 ? "Empty" : "Active"
          }
        })
  
        console.log(creditValue_for_usage)
      });
  
      await Credit.updateOne({
  
        user_id: ObjectId(user_Id),
  
      }, {
  
        $inc: { "total_universal_credits": -creditValue_for_usage },
       
       
       
        $push: {
          credit_usage: {
            ad_id: ad_id,
            number_of_credit: creditValue_for_usage ,
            category: category,
            credited_on: currentDate
          }
        }
  
      })
    }

  };

  //Get My Credits function
  static async getMyCreditsInfo(user_id) {
    // check if user exist 
    const userExist = await Profile.findOne({ _id: user_id })
    // if not exist throw error 
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    // else fnd the user`s credit doc and project the required feilds
    else {
      const CreditDocs = await Credit.findOne({ user_id: user_id }, {
        _id: 0,
        available_free_credits: 1,
        available_premium_credits: 1,
        available_boost_credits: 1,
        available_premium_boost_credits: 1,
        available_Highlight_credits: 1
      })
      return CreditDocs
    }
  };

  //boost Ad 
  static async boost_MyAd(userId, body) {

    const { ad_id , category } = body

    const AdsArray = Array(body.AdsArray);

    const bodyData = {
      category,
      AdsArray
    }

    const message = this.creditDeductionFunction(bodyData , userId , ad_id);
    
  };
};