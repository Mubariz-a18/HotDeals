const moment = require('moment');
const { ObjectId } = require("mongodb");
const Credit = require("../models/creditSchema");
const CreditValuesModel = require("../models/creditvaluesSchema");
const Profile = require("../models/Profile/Profile");
const Generic = require("../models/Ads/genericSchema");
const Transaction = require("../models/transactionSchema");
const OfferModel = require("../models/offerSchema");
const AdDurationModel = require("../models/durationSchema");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const navigateToTabs = require("../utils/navigationTabs");
const { expiry_date_func } = require("../utils/moment");
const validateTransaction = require("../validators/transactionValidator");
const {
  validateBoostMyAd,
  validateHighlightMyAdbody,
  validateCheckCreditBodyForArray,
  ValidateMakeAdPremiumBody,
  ValidateCheckBusinessCreditBody
} = require("../validators/CreditValidations");

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
  static async createCreditForNewUser(user_id, cred, status) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const AdDuration = await AdDurationModel.findOne()
    const Free_credit_Expiry = expiry_date_func(AdDuration.freeCreditDuration);

    // creating a document

    await Credit.create({

      user_id: user_id,
      total_universal_credits: cred,

      universal_credit_bundles: {

        number_of_credit: cred,
        source_of_credit: "Admin-Login",
        credit_created_date: currentDate,
        credit_status: status,
        credit_duration: AdDuration.freeCreditDuration,
        credit_expiry_date: Free_credit_Expiry

      }

    });

    const Offer = await OfferModel.findOne({});

    /* 
   
    Cloud Notification To firebase
   
    */

    const messageBody = {
      title: `Credits: Hurray you are credited with '${Offer.onLoginCredits}' credits for signup`,
      body: "Check Your Credit Info",
      data: {
        navigateTo: navigateToTabs.credits
      },
      type: "Info"
    }

    await cloudMessage(user_id.toString(), messageBody);
  };

  // Create Credit for old users
  static async createCredit(bodyData, userId) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const creditsArray = bodyData;

    const isValid = validateTransaction(creditsArray);
    if (!isValid) {
      throw ({ status: 404, message: 'Bad Request' });
    }
    const isTransactionValid = await Transaction.findOne({
      _id: ObjectId(creditsArray[0].transaction_Id),
      user_id: ObjectId(userId),
      status: 'Successfull',
      isTransactionUsed: false
    });

    if (!isTransactionValid) {
      throw ({ status: 404, message: 'Bad Request' });
    }

    creditsArray.forEach(async credit => {
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

      await Credit.findOneAndUpdate({ user_id: ObjectId(userId) }, {

        $inc: { total_universal_credits: credit.number_of_credit },

        $push: push

      }, {
        new: true
      })

      await Transaction.findOneAndUpdate({ _id: ObjectId(credit.transaction_Id) }, {
        $push: {
          credits_bundle: {
            number_of_credit: credit.number_of_credit,
            credit_duration: credit.credit_duration
          }
        }
      })

    });

    await Transaction.findOneAndUpdate({ _id: ObjectId(creditsArray[0].transaction_Id) }, {
      $set: {
        isTransactionValid: true
      }
    });

    /* 
 
  Cloud Notification To firebase
 
*/
    let creditCount = 0;

    creditsArray.forEach(crd => {
      creditCount = creditCount + crd.number_of_credit
    })

    const messageBody = {

      title: `Purchased: Thanks for purchasing '${creditCount}' credits!`,
      body: "Check Your Credit Info",
      data: {
        navigateTo: navigateToTabs.credits
      },
      type: "Info"
    }

    await cloudMessage(userId.toString(), messageBody);

    return "SUCCESSFULLY_PURCHASED"

  };

  //check Credit Function
  static async CreditCheckFunction(bodyData, user_Id) {
    const CreditValuesDocument = await CreditValuesModel.findOne();
    const typeMultiples = CreditValuesDocument.typeMultiples;
    const { category, AdsArray } = bodyData;

    const isCheckCreditBodyValid = validateCheckCreditBodyForArray(bodyData);
    if (!isCheckCreditBodyValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }

    const userExist = await Profile.findById({ _id: user_Id });
    if (!userExist) {
      throw ({ status: 401, message: 'UnAuthorised' });
    }

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


    const CategoryCreditBaseValue = CreditValuesDocument.creditValuesForCategories[category];

    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })


    AdsArray.forEach((eachAd, i) => {

      const credittype = getCreditType(eachAd);

      let creditTypeMultiple = typeMultiples[credittype];

      if (credittype === "HighLight") {
        creditTypeMultiple = creditTypeMultiple + typeMultiples.Premium
      }

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

  //Credit Deduction Function
  static async creditDeductionFunction(bodyData, user_Id, ad_id) {

    const CreditValuesDocument = await CreditValuesModel.findOne();

    const typeMultiples = CreditValuesDocument.typeMultiples;

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const { category, title } = bodyData;

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


    const CategoryCreditBaseValue = CreditValuesDocument.creditValuesForCategories[category];

    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })

    let creditValue_for_usage = 0

    AdsArray.forEach((eachAd, i) => {

      const credittype = getCreditType(eachAd);

      let creditTypeMultiple = typeMultiples[credittype];


      if (credittype === "HighLight") {
        creditTypeMultiple = creditTypeMultiple + typeMultiples.Premium
      }

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

    if (tempArray.includes(false)) {
      return "NOT_ENOUGH_CREDITS"
    } else {
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
      });

      await Credit.updateOne({

        user_id: ObjectId(user_Id),

      }, {
        $inc: { "total_universal_credits": -creditValue_for_usage },
        $push: {
          credit_usage: {
            ad_id: ad_id,
            title: title,
            number_of_credit: creditValue_for_usage,
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
      const CreditDocs = await Credit.aggregate([
        {
          '$match': {
            'user_id': ObjectId(user_id)
          }
        }, {
          '$project': {
            'universal_credit_bundles': {
              '$filter': {
                'input': '$universal_credit_bundles',
                'as': 'item',
                'cond': {
                  '$eq': [
                    '$$item.credit_status', 'Active'
                  ]
                }
              }
            },
            credit_usage: 1
          }
        }
      ]
      );
      return CreditDocs
    }
  };

  //boost Ad 
  static async boost_MyAd(user_Id, body) {
    //DONE: validate body
    const isBoostbodyValid = validateBoostMyAd(body);
    if (!isBoostbodyValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }
    const { ad_id, category, boost_duration } = body

    //DONE: check if ad is in Selling state
    const Ad = await Generic.findOne({ _id: ObjectId(ad_id), user_id: user_Id, ad_status: "Selling" });

    if (!Ad) {
      throw ({ status: 401, message: 'Access Denied' });
    }

    const AdsArray = Array(body.AdsArray);

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

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

    const CreditValuesDocument = await CreditValuesModel.findOne();

    const CategoryCreditBaseValue = CreditValuesDocument.creditValuesForCategories[category];
    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })

    let creditValue_for_usage = 0

    AdsArray.forEach((eachAd, i) => {

      const credittype = getCreditType(eachAd);

      const creditTypeMultiple = CreditValuesDocument.boostValues[credittype][boost_duration];
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

    if (tempArray.includes(false)) {

      return "NOT_ENOUGH_CREDITS"

    } else {
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
      });

      let Days = await AdDurationModel.findOne()

      await Credit.updateOne({

        user_id: ObjectId(user_Id),

      }, {

        $inc: { "total_universal_credits": -creditValue_for_usage },

        $push: {
          credit_usage: {
            ad_id: ad_id,
            title: Ad.title,
            number_of_credit: creditValue_for_usage,
            category: category,
            credited_on: currentDate,
            Boost_expiry_date: boost_duration === "Days7" ? expiry_date_func(Days.boostAdDuration7Days) : expiry_date_func(Days.boostAdDuration14Days)
          }
        }
      })


      if (boost_duration == "Days7") {
        Days = Days.boostAdDuration7Days
      } else {
        Days = Days.boostAdDuration14Days
      }

      await Generic.findOneAndUpdate({ _id: ad_id }, {
        $set: {
          is_Boosted: true,
          Boost_Days: Days,
          Boosted_Date: currentDate,
          Boost_Expiry_Date: expiry_date_func(Days),
        }
      })
    }
    return "SUCCESSFULLY_BOOSTED"
  };

  // Make Ad Premium
  static async MakeAdPremium(user_Id, body) {

    //DONE: validate body
    const isPremiumbodyValid = ValidateMakeAdPremiumBody(body);
    if (!isPremiumbodyValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }
    const { ad_id, category } = body


    const CreditValuesDocument = await CreditValuesModel.findOne();

    const typeMultiples = CreditValuesDocument.typeMultiples;

    //DONE: check if ad is in Selling state
    const Ad = await Generic.findOne({ _id: ObjectId(ad_id), user_id: user_Id, ad_status: "Selling" });

    if (!Ad) {
      throw ({ status: 401, message: 'Access_Denied' });
    }

    if (Ad.isPrime === true) {
      throw ({ status: 401, message: 'AD_IS_ALREADY_PREMIUM' })
    }

    const AdsArray = Array(body.AdsArray);

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

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

    const CategoryCreditBaseValue = CreditValuesDocument.creditValuesForCategories[category];

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

    if (tempArray.includes(false)) {

      return "NOT_ENOUGH_CREDITS"

    } else {
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
      });

      await Credit.updateOne({

        user_id: ObjectId(user_Id),

      }, {

        $inc: { "total_universal_credits": -creditValue_for_usage },

        $push: {
          credit_usage: {
            ad_id: ad_id,
            title: Ad.title,
            number_of_credit: creditValue_for_usage,
            category: category,
            credited_on: currentDate
          }
        }
      })

      await Generic.findOneAndUpdate({ _id: ad_id }, {
        $set: {
          isPrime: true,
          ad_Premium_Date: currentDate,
          ad_type: "Premium",
          updated_at: currentDate,
        }
      })
    }
    return "SUCCESSFULLY_UPDATED_TO_PREMIUM"
  };

  //HIGHLIGHTAD
  static async HighLight_MyAd(user_Id, body) {

    //DONE: validate body
    const isHighlightAdValid = validateHighlightMyAdbody(body);
    if (!isHighlightAdValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }
    const { ad_id, category, HighLight_Duration } = body

    const AdsArray = Array(body.AdsArray);

    //DONE: check if ad is in Selling state
    const adDetail = await Generic.findOne({ _id: ad_id, user_id: user_Id, ad_status: "Selling" });

    if (!adDetail) {
      throw ({ status: 401, message: 'Access_Denied' });
    }

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

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

    const CreditValuesDocument = await CreditValuesModel.findOne();
    const CategoryCreditBaseValue = CreditValuesDocument.creditValuesForCategories[category];

    const tempArray = [];

    AdsArray.forEach(ad => {
      tempArray.push(false)
    })

    let creditValue_for_usage = 0

    AdsArray.forEach((eachAd, i) => {

      // const credittype = getCreditType(eachAd);

      const creditTypeMultiple = CreditValuesDocument.HighLight_values.value;

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

    if (tempArray.includes(false)) {

      return "NOT_ENOUGH_CREDITS"

    } else {
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
      });
      let Days = await AdDurationModel.findOne()

      await Credit.updateOne({

        user_id: ObjectId(user_Id),

      }, {

        $inc: { "total_universal_credits": -creditValue_for_usage },

        $push: {
          credit_usage: {
            ad_id: ad_id,
            title: adDetail.title,
            number_of_credit: creditValue_for_usage,
            category: category,
            credited_on: currentDate,
            Highlight_expiry_date: expiry_date_func(Days.highlightAdDuration),
          }
        }
      })

      await Generic.findOneAndUpdate({ _id: ad_id }, {
        $set: {
          is_Highlighted: true,
          Highlight_Days: HighLight_Duration,
          Highlighted_Date: currentDate,
          Highlight_Expiry_Date: expiry_date_func(Days.highlightAdDuration),
        }
      })
    }
    return "SUCCESSFULLY_HIGHLIGHTED"
  };

  static async CreditBusinessAdCheckFunction(userID, bodyData) {
    const isBodyValid = ValidateCheckBusinessCreditBody(bodyData);
    if (!isBodyValid) {
      throw ({ status: 400, message: 'Bad Request' });
    }
    const {
      adType,
      numberOfAds
    } = bodyData;
    const creditModel = await CreditValuesModel.findOne()
    const baseValueForAdType = creditModel.businessAdBaseCreditValue;
    const adTypeMultiplier = creditModel.businessAdMultiplier;
    const creditsRequired = numberOfAds * (baseValueForAdType * adTypeMultiplier[adType]);
    const user_credit_Document = await Credit.findOne({
      user_id: userID
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
    let tempRequiredCredits = creditsRequired;
    let tempBundles = universal_credit_bundles;
    console.log(tempBundles.length)
    let usingUniversalBundle = false;
    for (var j = 0; j < tempBundles.length; j++) {
      let bundle = tempBundles[j];
      let creditCount = bundle["number_of_credit"];
      if (creditCount >= tempRequiredCredits) {
        creditCount = creditCount - tempRequiredCredits;
        tempRequiredCredits = 0;
        usingUniversalBundle = true;
        tempBundles[j]['number_of_credit'] = creditCount;
        break;
      } else {
        tempRequiredCredits = tempRequiredCredits - creditCount;
        creditCount = 0;
      }
      tempBundles[j]['number_of_credit'] = creditCount;
    }
    if (usingUniversalBundle) {
      return true;
    }
    return false;
  };

  static async deductBusinessAdCredits(userID, body) {
    const {
      adID,
      title,
      adType
    } = body
    const creditModel = await CreditValuesModel.findOne()
    const baseValueForAdType = creditModel.businessAdBaseCreditValue;
    const adTypeMultiplier = creditModel.businessAdMultiplier;
    let creditValue_for_usage = 0
    const creditsRequired = (baseValueForAdType * adTypeMultiplier[adType]);
    creditValue_for_usage = creditValue_for_usage + creditsRequired
    const user_credit_Document = await Credit.findOne({
      user_id: userID
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
    let tempRequiredCredits = creditsRequired;
    let tempBundles = universal_credit_bundles;
    let usingUniversalBundle = false;
    for (var j = 0; j < tempBundles.length; j++) {
      let bundle = tempBundles[j];
      let creditCount = bundle["number_of_credit"];
      if (creditCount >= tempRequiredCredits) {
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
    if (!usingUniversalBundle) {
      return "NOT_ENOUGH_CREDITS"
    }
    universal_credit_bundles = tempBundles;
    universal_credit_bundles.forEach(async bundle => {
      await Credit.updateOne({
        user_id: ObjectId(userID),
        "universal_credit_bundles._id": bundle._id
      }, {
        $set: {
          'universal_credit_bundles.$.number_of_credit': bundle.number_of_credit,
          'universal_credit_bundles.$.credit_status': bundle.number_of_credit == 0 ? "Empty" : "Active"
        }
      })
    });
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    await Credit.updateOne({
      user_id: ObjectId(userID),
    }, {
      $inc: { "total_universal_credits": - creditValue_for_usage },
      $push: {
        credit_usage: {
          ad_id: adID,
          title: title,
          number_of_credit: creditValue_for_usage,
          adType,
          isBusinessAd: true,
          credited_on: currentDate
        }
      }
    })

  };

};