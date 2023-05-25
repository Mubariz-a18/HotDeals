const moment = require("moment");
const { default: axios } = require("axios");
const translate = require('translate-google');
const Profile = require("../models/Profile/Profile");
const Draft = require("../models/Ads/draftSchema");
const ObjectId = require('mongodb').ObjectId;
const Generic = require("../models/Ads/genericSchema");
const { track, failedTrack } = require('./mixpanel-service.js');
const { age_func, expiry_date_func } = require("../utils/moment");
const { creditDeductionFunction } = require("./CreditService");
const { createGlobalSearch } = require("./GlobalSearchService");
const { featureAdsFunction } = require("../utils/featureAdsUtil");
const { detectSafeSearch, safetext } = require("../Firebase operations/image.controller");
const imgCom = require("../Firebase operations/imageCompression");
const cloudMessage = require("../Firebase operations/cloudMessaging");
const navigateToTabs = require("../utils/navigationTabs");
const Referral = require("../models/referelSchema");
const Credit = require("../models/creditSchema");
const imageWaterMark = require("../Firebase operations/waterMarkImages");
const PayoutModel = require("../models/payoutSchema");
const OfferModel = require("../models/offerSchema");
const AdDurationModel = require("../models/durationSchema");
const { validateBody, validateUpdateAd, validateFavoriteAdBody, validateMongoID, ValidateCreateAdBody, ValidateDraftAdBody } = require("../validators/Ads.Validator");
const BusinessAds = require("../models/Ads/businessAdsShema");


module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    const isAdBodyValid = ValidateCreateAdBody(bodyData);
    if (!isAdBodyValid) {
      throw ({ status: 401, message: 'Bad Request' })
    }
    const userExist = await Profile.findById({ _id: userId });
    if (!userExist) {
      throw ({ status: 401, message: 'UnAuthorized' })
    }
    const adExist = await Generic.findById({ _id: bodyData.ad_id });
    if (adExist) {
      throw ({ status: 401, message: 'AD_ALREADY_EXISTS' })
    }
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const durationForExpiryDate = await AdDurationModel.findOne()

    // Generic AdDoc is created 
    let {
      ad_id,
      parent_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      isPrime,
      image_url,
      video_url,
      ad_present_location,
      ad_posted_location,
      ad_posted_address,
      ad_present_address,
      ad_status,
      is_negotiable,
      is_ad_posted,
    } = bodyData;
    async function doImageOperations() {
      try {
        const thumbnail_url = await imgCom(image_url[0]);
        await imageWaterMark(image_url)
        const { health, batch } = await detectSafeSearch(image_url);
        return {
          thumbnail_url,
          health,
          batch
        }
      } catch (e) {
        return error
      }
    }
    const imageoperations = await doImageOperations()
    const {
      thumbnail_url,
      health,
      batch
    } = imageoperations
    const special_mention_string = special_mention.join(" ");
    const isTextSafe = await safetext(title, description, special_mention_string);
    let age = age_func(SelectFields["Year of Purchase (MM/YYYY)"]) || bodyData.age
    const createAdFunc = async (status) => {
      const shortUrl = await this.updateShortUrl(ad_id, title, thumbnail_url[0], description)
      let adDoc = await Generic.create({
        _id: ObjectId(ad_id),
        parent_id,
        user_id: ObjectId(userId),
        category,
        sub_category,
        description,
        SelectFields,
        special_mention,
        title,
        price,
        product_age: age,
        isPrime,
        ad_type: isPrime == false ? "Free" : "Premium",
        image_url,
        video_url,
        thumbnail_url: thumbnail_url ? thumbnail_url : "'https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380'",
        shortUrl: shortUrl,
        ad_present_location: ad_present_location || {},
        ad_posted_location: ad_posted_location || {},
        ad_posted_address,
        ad_present_address,
        ad_Premium_Date: isPrime == true ? currentDate : "",
        ad_status: status,
        is_negotiable,
        is_ad_posted,
        detection: batch,
        created_at: currentDate,
        ad_expire_date: isPrime === true ? expiry_date_func(durationForExpiryDate.premiumAdDuration) : expiry_date_func(durationForExpiryDate.generalAdDuration),
        updated_at: currentDate,
      });
      return adDoc
    }
    const creditDuctConfig = {
      title: title,
      category: category,
      AdsArray: bodyData.AdsArray
    }
    const message = await creditDeductionFunction(creditDuctConfig, userId, ad_id);
    if (message === "NOT_ENOUGH_CREDITS") {
      throw ({ status: 401, message: "NOT_ENOUGH_CREDITS" })
    }

    if (health === "HEALTHY" && isTextSafe === "NotHarmFull") {
      let adDoc = await createAdFunc(ad_status)
      if (bodyData.AdsArray.isHighlighted === true) {
        await Generic.findOneAndUpdate({ _id: ObjectId(ad_id) }, {
          $set: {
            is_Highlighted: true,
            Highlight_Days: durationForExpiryDate.highlightAdDuration,
            Highlighted_Date: currentDate,
            Highlight_Expiry_Date: expiry_date_func(durationForExpiryDate.highlightAdDuration),
          }
        })
      }
      return adDoc["_doc"];
    }
    else {
      let adDoc = await createAdFunc("Pending")
      return adDoc
    }
  };

  static ReferralCredits = async (isPromo) => {
    const Offer = await OfferModel.findOne({});

    if (isPromo) {
      const promoVal = Offer.promoCodeCredits
      return promoVal;
    } else {
      const referVal = Offer.referralCredits
      return referVal;
    }
  };

  static async updateShortUrl(adID, title, url, description) {
    try {
      const payload = {
        "dynamicLinkInfo": {
          "domainUriPrefix": "https://truelist.page.link",
          "link": `https://truelist.in/ad/${adID}`,
          "androidInfo": {
            "androidPackageName": "in.truelist.app"
          },
          "iosInfo": {
            "iosBundleId": "in.truelist.app",
            "iosAppStoreId": "1666569292"
          },
          "socialMetaTagInfo": {
            "socialTitle": title,
            "socialDescription": description,
            "socialImageLink": url
          }
        },
        "suffix": {
          "option": "SHORT"
        }
      }
      const response = await axios.post(process.env.FIREBASE_DYNAMIC_URL, payload)
      const { shortLink } = response.data;
      return shortLink
    } catch (e) {
      throw ({ status: 400, message: 'Bad Request' });
    }
  };

  static async updateShortUrlForMultipleAds(parentID, title, url, description) {
    try {
      const AdsList = await Generic.find({ parent_id: parentID }, { _id: 1 });
      for (let i = 0; i < AdsList.length; i++) {
        const payload = {
          "dynamicLinkInfo": {
            "domainUriPrefix": "https://truelist.page.link",
            "link": `https://truelist.in/ad/${AdsList[i]['_id']}`,
            "androidInfo": {
              "androidPackageName": "in.truelist.app"
            },
            "iosInfo": {
              "iosBundleId": "in.truelist.app",
              "iosAppStoreId": "1666569292"
            },
            "socialMetaTagInfo": {
              "socialTitle": title,
              "socialDescription": description,
              "socialImageLink": url
            }
          },
          "suffix": {
            "option": "SHORT"
          }
        }
        const response = await axios.post(process.env.FIREBASE_DYNAMIC_URL, payload)
        const { shortLink } = response.data;
        await Generic.updateOne({ _id: AdsList[i]['_id'] }, {
          $set: {
            shortLink: shortLink
          }
        });
        return true
      }
    } catch (e) {
      throw ({ status: 400, message: 'Bad Request' });
    }
  };

  static async AfterAdIsPosted(adDoc, userId) {

    const ad_id = adDoc._id;

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    // mixpanel track -- Ad create 
    await track('Ad creation succeed', {
      category: adDoc.category,
      distinct_id: ad_id
    });

    //save the ad_id in users profile in myads
    const UpdatedUser = await Profile.findByIdAndUpdate({ _id: userId }, {
      $addToSet: {
        my_ads: ObjectId(ad_id)
      }
    }, { new: true, returnDocument: "after" });

    const {
      parent_id,
      category,
      sub_category,
      title,
      description,
      ad_posted_address,
      ad_posted_location,
      SelectFields
    } = adDoc;

    const body = {
      ad_id: ad_id,
      category,
      sub_category,
      title,
      description,
      ad_posted_address,
      ad_posted_location,
      SelectFields
    }

    await createGlobalSearch(body)

    if (UpdatedUser.my_ads.length === 1 && UpdatedUser.referrered_user) {

      const reffered_by_user = await Referral.findOne({ user_Id: UpdatedUser.referrered_user });

      if (reffered_by_user) {

        const isPromo = reffered_by_user?.isPromoCode;
        const creditVal = await this.ReferralCredits(isPromo)
        const push = {

          universal_credit_bundles: {

            number_of_credit: creditVal,
            source_of_credit: "Refferal",
            credit_status: "Active",
            credit_duration: 30,
            credit_expiry_date: expiry_date_func(30),
            credit_created_date: currentDate

          }
        }

        await Credit.findOneAndUpdate({ user_id: reffered_by_user.user_Id }, {

          $inc: { total_universal_credits: creditVal },

          $push: push

        }, {
          new: true
        });

        const messageFunction = async () => {
          if (isPromo) {
            return `Credits: You are awarded with '${creditVal}' by Promo Code!`
          } else {
            return `Credits: You are awarded with '${creditVal}' by Referral Code!`
          }
        }


        const messageBody = {
          title: await messageFunction(),
          body: "Check your credit info",
          data: {
            navigateTo: navigateToTabs.credits
          },
          type: "Info"
        }

        await cloudMessage(reffered_by_user.user_Id.toString(), messageBody);
      }
    } else { }

    const Offer = await OfferModel.findOne({});

    const {
      offerValid,
      firstAdReward,
      nextAdReward
    } = Offer

    if (offerValid === true && ad_id.toString() === parent_id.toString()) {
      await PayoutModel.create({
        user_id: userId,
        ad_id: ad_id,
        amount: UpdatedUser.my_ads.length === 1 ? firstAdReward : nextAdReward,
        payment_status: "Not_Claimed"
      });
    } else { }

    /* 
 
    Cloud Notification To firebase
 
    */
    const messageBody = {
      title: `Ad: ${title} is successfully posted!`,
      body: "Click here to access it",
      data: {
        id: ad_id.toString(),
        navigateTo: navigateToTabs.particularAd
      },
      type: "Info"
    }

    // if (adDoc.thumbnail_url.length === 0) {
    //   await Generic.findOneAndUpdate({ _id: ObjectId(ad_id) }, {
    //     $push: {
    //       thumbnail_url: 'https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380'
    //     }
    //   })
    // }

    await cloudMessage(userId.toString(), messageBody);

    await Draft.deleteOne({ _id: ad_id });
  };

  static async AfterPendingAd(adDoc, userId) {

    const ad_id = adDoc._id;
    const { category, sub_category, title, description, ad_posted_address, ad_posted_location, SelectFields } = adDoc;

    // mixpanel track -- Ad create 
    await track('Ad creation pending', {
      category: category,
      distinct_id: ad_id
    })

    //save the ad_id in users profile in myads
    await Profile.findByIdAndUpdate({ _id: userId }, {
      $addToSet: {
        my_ads: ObjectId(ad_id)
      }
    });


    const body = {
      ad_id,
      category,
      sub_category,
      title,
      description,
      ad_posted_address,
      ad_posted_location,
      SelectFields
    }

    await createGlobalSearch(body);

    /* 

    Cloud Notification To firebase

    */
    const messageBody = {
      title: `Ad: ${title} is pending`,
      body: "Click here to access it",
      data: { id: ad_id.toString(), navigateTo: navigateToTabs.myads },
      type: "Info"
    }

    await cloudMessage(userId.toString(), messageBody);

    await Draft.deleteOne({ _id: ad_id });
  };

  static async translateToLng(textObj, ad_id) {

    const { title, description, specialMentions } = textObj;

    if (!title || !description || !specialMentions) {
      throw ({ status: 400, message: 'Bad Request' });
    }

    const tranObj = {
      title,
      description,
      specialMentions
    };

    const languages = ["hi", "ta", "te", "ur", "kn", "ml", "mr", "bn", "gu"]

    try {
      async function translateStringToMultipleLanguages(tranObj, languages) {
        const translations = await Promise.all(languages.map((language) => {
          return translate(tranObj, { to: language });
        }));

        return Object.fromEntries(languages.map((language, index) => {
          return [language, translations[index]];
        }));
      }

      const translatedObj = await translateStringToMultipleLanguages(tranObj, languages)
        .then((translations) => {
          return translations
        })
      await Generic.findByIdAndUpdate({ _id: ObjectId(ad_id) }, {
        $set: {
          textLanguages: translatedObj
        }
      });
    } catch (e) {
      console.log(e)
    }





  };

  static async languageTranslation(textObj) {
    try {
      const { title, description, special_mention } = textObj;

      if (!title || !description || !special_mention) {
        throw ({ status: 400, message: 'Bad Request' });
      }

      const tranObj = {
        title,
        description,
        special_mention
      };

      const languages = ["hi", "ta", "te", "ur", "kn", "ml", "mr", "bn", "gu"]

      async function translateStringToMultipleLanguages(tranObj, languages) {
        const translations = await Promise.all(languages.map((language) => {
          return translate(tranObj, { to: language });
        }));

        return Object.fromEntries(languages.map((language, index) => {
          return [language, translations[index]];
        }));
      }

      const translatedObj = await translateStringToMultipleLanguages(tranObj, languages)

      return translatedObj;
    } catch (e) {
      console.log(e)
    }

  };

  //Update Ad
  static async updateAd(bodyData, user_id) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const userExist = await Profile.findById({ _id: user_id });
    if (!userExist) {
      throw ({ status: 401, message: 'UnAuthorized' })
    }
    const {
      parent_id,
      description,
      SelectFields,
      special_mention,
      price,
      image_url,
      video_url,
      is_negotiable,
    } = bodyData;
    const Ad = await Generic.findOne({ parent_id: parent_id, user_id: user_id, ad_status: "Selling" });
    if (!Ad) {
      throw ({ status: 401, message: 'Access_Denied' });
    }
    const isUpdateBodyValid = validateUpdateAd(bodyData, Ad.category, Ad.sub_category);
    if (!isUpdateBodyValid) {
      throw ({ status: 401, message: "Please Fill the Required Details properly" });
    }
    if (image_url.length == 0) {
      throw ({ status: 401, message: 'NO_IMAGES_IN_THIS_AD' })
    }
    async function doImageOperations() {
      try {
        const thumbnail_url = await imgCom(image_url[0]);
        await imageWaterMark(image_url)
        const { health, batch } = await detectSafeSearch(image_url);
        return {
          thumbnail_url,
          health,
          batch
        }
      } catch (e) {
        return error
      }
    }
    const imageoperations = await doImageOperations()
    const {
      thumbnail_url,
      health,
      batch
    } = imageoperations;
    const special_mention_string = special_mention.join(" ");
    const isTextSafe = await safetext(" ", description, special_mention_string);
    await this.updateShortUrlForMultipleAds(parent_id, Ad.title, thumbnail_url[0], description);
    if (health === "HEALTHY" && isTextSafe === "NotHarmFull") {
      const updateAd = await Generic.updateMany({ parent_id: parent_id, user_id: user_id, ad_status: "Selling" }, {
        $set: {
          description,
          SelectFields,
          special_mention,
          price,
          image_url,
          thumbnail_url,
          ad_status: "Selling",
          video_url,
          detection: batch,
          is_negotiable,
          updated_at: currentDate,
        }
      }, {
        new: true,
      });
      const messageBody = {
        title: `Ad: ${Ad.title} is successfully posted!`,
        body: "Click here to access it",
        data: { _id: parent_id.toString(), navigateTo: navigateToTabs.particularAd },
        type: "Info"
      }
      await cloudMessage(user_id.toString(), messageBody);
      return updateAd;
    } else {
      const updateAd = await Generic.updateMany({ parent_id: parent_id, user_id: user_id }, {
        $set: {
          description,
          SelectFields,
          special_mention,
          price,
          'ad_status': "Pending",
          image_url,
          detection: batch,
          thumbnail_url,
          shortUrl: shortUrl,
          video_url,
          is_negotiable,
          updated_at: currentDate
        }
      }, {
        new: true,
      });
      const messageBody = {
        title: `Ad: '${Ad.title}' is pending`,
        body: "Click here to access it",
        data: { _id: parent_id.toString(), navigateTo: navigateToTabs.myads },
        type: "Info"
      }
      await cloudMessage(user_id.toString(), messageBody);
      return updateAd;
    }


  };

  static async postAd(bodyData, userId) {
    const isbodyvalid = validateBody(bodyData);
    if (!isbodyvalid) {
      throw ({ status: 401, message: "Please Fill the Required Details properly" });
    }

    const userExist = await Profile.findById({ _id: userId });
    if (!userExist) {
      throw ({ status: 401, message: 'UnAuthorized' })
    }

    const { primaryDetails } = bodyData;

    const durationForExpiryDate = await AdDurationModel.findOne();

    for (let i = 0; i < primaryDetails.length; i++) {

      const ad_id = primaryDetails[i]["ad_id"];

      const AdExist = await Generic.findById({ _id: ad_id });

      if (AdExist) {
        throw ({ status: 401, message: "AD_ALREADY_EXIST" });
      }
    }

    if (!primaryDetails || primaryDetails.length === 0) {
      throw ({ status: 401, message: "Details Not Found" });
    }

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const DefaultThumbnail = "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380"
    let {
      parent_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      image_url,
      video_url,
      ad_present_location,
      ad_present_address,
      ad_status,
      is_negotiable,
    } = bodyData;
    async function doImageOperations() {
      try {

        const thumbnail_url = await imgCom(image_url[0]);

        await imageWaterMark(image_url);

        const { health, batch } = await detectSafeSearch(image_url);

        return { thumbnail_url, health, batch }
      } catch (e) {
        return e
      }
    }

    const imageoperations = await doImageOperations()

    const { thumbnail_url, health, batch } = imageoperations;

    const special_mention_string = special_mention.join(" ");

    const isTextSafe = await safetext(title, description, special_mention_string);


    let new_adStatus;
    if (health === "HEALTHY" && isTextSafe === "NotHarmFull") {

      new_adStatus = ad_status

    } else {
      new_adStatus = "Pending"
    }
    const textObj = {
      title,
      description,
      special_mention
    }
    const translatedObj = await this.languageTranslation(textObj);

    for (let i = 0; i < primaryDetails.length; i++) {
      let adDetail = primaryDetails[i];
      const {
        ad_id,
        ad_posted_location,
        ad_posted_address,
        isPrime,
        AdsArray
      } = adDetail;

      const creditDuctConfig = {

        title: title,
        category: category,
        AdsArray: AdsArray

      }
      const message = await creditDeductionFunction(creditDuctConfig, userId, ad_id);

      if (message === "NOT_ENOUGH_CREDITS") {

        throw ({ status: 401, message: "NOT_ENOUGH_CREDITS" })

      }
      const shortUrl = await this.updateShortUrl(ad_id, title, thumbnail_url[0], description);
      const ad = await Generic.create({
        user_id: ObjectId(userId),
        _id: ObjectId(ad_id),
        parent_id,
        category,
        sub_category,
        description,
        SelectFields,
        special_mention,
        title,
        price,
        image_url,
        thumbnail_url: thumbnail_url ? thumbnail_url : DefaultThumbnail,
        video_url,
        shortUrl: shortUrl,
        ad_present_location,
        ad_present_address,
        ad_posted_location: ad_posted_location || {},
        ad_posted_address: ad_posted_address,
        isPrime: isPrime,
        ad_type: isPrime == false ? "Free" : "Premium",
        ad_Premium_Date: isPrime == true ? currentDate : "",
        ad_status: new_adStatus,
        detection: batch,
        textLanguages: translatedObj ? translatedObj : {},
        is_negotiable,
        created_at: currentDate,
        ad_expire_date: isPrime === true ? expiry_date_func(durationForExpiryDate.premiumAdDuration) : expiry_date_func(durationForExpiryDate.generalAdDuration),
        updated_at: currentDate,
      });

      if (AdsArray.isHighlighted === true && new_adStatus === "Selling") {
        await Generic.findOneAndUpdate({ _id: ObjectId(ad_id) }, {
          $set: {
            is_Highlighted: true,
            Highlight_Days: durationForExpiryDate.highlightAdDuration,
            Highlighted_Date: currentDate,
            Highlight_Expiry_Date: expiry_date_func(durationForExpiryDate.highlightAdDuration),
          }
        })
      }
      if (new_adStatus === "Pending") {
        await AdService.AfterPendingAd(ad, userId)
      } else {
        await AdService.AfterAdIsPosted(ad, userId)
      }

    }
    return true;

  };

  //Get my Ads -- user is authenticated from token and  Aggregation  of Generics and Profile is created -- based on the _id in profile and generics -ads are fetched  
  static async getMyAds(userId) {

    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    });

    if (!findUsr) {
      // mixpanel -- track failed get my ads
      await track('failed !! get my ads', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      /* Finding my Ads from Generic aggregate collection  by matching ads from user profile 
        $facet is used for dividing my ads on the basis of ad_status
        $project to show the only required feilds
      */
      const myAdsList = await Generic.aggregate([
        {
          $match: { _id: { $in: findUsr.my_ads } }
        },
        {
          $facet: {
            "Selling": [
              {
                $match: {
                  $or: [
                    { ad_status: "Selling" },
                    { ad_status: "Premium" }
                  ]
                }
              },
              {
                $sort: {
                  created_at: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  category: 1,
                  description: 1,
                  saved: 1,
                  views: 1,
                  isPrime: 1,
                  thumbnail_url: 1,
                  ad_posted_address: 1,
                  is_Boosted: 1,
                  Boosted_Date: 1,
                  is_Highlighted: 1,
                  Highlighted_Date: 1,
                  textLanguages: 1,
                  created_at: 1,
                  ad_Premium_Date: 1
                }
              }
            ],
            "Archive": [
              { $match: { ad_status: "Archive" } },
              {
                $sort: {
                  ad_Archive_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  description: 1,
                  isPrime: 1,
                  ad_posted_address: 1,
                  textLanguages: 1,
                  thumbnail_url: 1,
                  saved: 1,
                  views: 1,
                  ad_Archive_Date: 1,
                }
              }
            ],
            "Expired": [
              { $match: { ad_status: "Expired", is_ad_Historic_Duration_Flag: false } },
              {
                $sort: {
                  ad_expire_date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  category: 1,
                  title: 1,
                  description: 1,
                  isPrime: 1,
                  thumbnail_url: 1,
                  textLanguages: 1,
                  saved: 1,
                  views: 1,
                  "ad_Expired_Date": "$ad_expire_date",
                  // ad_expire_date: 1,
                }
              }
            ],
            "Deleted": [
              { $match: { ad_status: "Delete", is_ad_Historic_Duration_Flag: false } },
              {
                $sort: {
                  ad_Deleted_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  category: 1,
                  title: 1,
                  isPrime: 1,
                  ad_posted_address: 1,
                  ad_Deleted_Date: 1,
                  thumbnail_url: 1,
                  textLanguages: 1,
                }
              }
            ],
            "Reposted": [
              { $match: { ad_status: "Reposted", is_ad_Historic_Duration_Flag: false } },
              {
                $sort: {
                  ad_Reposted_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  category: 1,
                  title: 1,
                  ad_posted_address: 1,
                  ad_Reposted_Date: 1,
                  thumbnail_url: 1,
                  textLanguages: 1,
                }
              }
            ],
            "Sold": [
              { $match: { ad_status: "Sold", is_ad_Historic_Duration_Flag: false } },
              {
                $sort: {
                  ad_Sold_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  category: 1,
                  isPrime: 1,
                  title: 1,
                  ad_posted_address: 1,
                  ad_Sold_Date: 1,
                  thumbnail_url: 1,
                  textLanguages: 1,
                }
              }
            ],
            "Suspended": [
              { $match: { ad_status: "Suspended", is_ad_Historic_Duration_Flag: false } },
              {
                $sort: {
                  ad_Suspended_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  price: 1,
                  ad_posted_address: 1,
                  ad_Suspended_Date: 1,
                  textLanguages: 1,
                  thumbnail_url: 1,
                }
              }
            ],
            "Pending": [
              { $match: { ad_status: "Pending" } },
              {
                $sort: {
                  created_at: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  price: 1,
                  textLanguages: 1,
                  ad_posted_address: 1,
                  thumbnail_url: 1
                }
              }
            ]
          }
        }
      ]);
      // check if my ads array is empty throw error
      if (!myAdsList) {
        // mixpanel -- track failed get my ads
        await track('failed !! get my ads', {
          distinct_id: userId,
          message: ` user_id : ${userId}  does not have ads in My_Ads`
        })
        throw ({ status: 404, message: 'ADS_NOT_EXISTS' })
      }
      else {
        // mixpanel track for Get My Ads
        await track('get my ads successfully !!', {
          distinct_id: userId
        });
        // returning myads to controller
        return myAdsList;
      }

    }
  };

  // Updating the status of Ad from body  using $set in mongodb
  static async changeAdStatus(bodyData, userId, ad_id) {
    const statuses = [
      "Selling",
      "Archive",
      "Sold",
      "Delete",
      "Reposted"
    ]

    if (!statuses.includes(bodyData.status)) {
      throw ({ status: 401, message: 'Access_Denied' });
    }
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');

    const findAd = await Generic.findOne({
      _id: ad_id,
      user_id: userId,
      ad_status: {
        $ne: "Suspended"
      }
    });

    if (!findAd) {
      await track('failed !! to chaange ad status', {
        distinct_id: userId,
        ad_id: ad_id,
        message: ` ad_id : ${ad_id}  does not exist`
      })
      throw ({ status: 401, message: 'Access_Denied' });
    }
    if (bodyData.status == "Archive") {
      const adDoc = await Generic.findOneAndUpdate(
        {
          _id: ad_id,
          ad_status: "Selling"
        },
        {
          $set: {
            ad_status: "Archive",
            ad_Archive_Date: currentDate
          }
        },
        { returnOriginal: false, new: true }
      )
      if (!adDoc) {
        throw ({ status: 401, message: 'Access_Denied' });
      }
      return adDoc;
    }
    else if (bodyData.status == "Sold") {
      const adDoc = await Generic.updateMany(
        {
          parent_id: findAd.parent_id,
          ad_status: "Selling"
        },
        {
          $set: {
            ad_status: "Sold",
            ad_Sold_Date: currentDate,
            ad_Historic_Duration_Date: Ad_Historic_Duration,
          }
        },
        { returnOriginal: false, new: true }
      );
      if (adDoc.modifiedCount === 0) {
        throw ({ status: 401, message: 'Access_Denied' });
      }
      return adDoc;
    }
    else if (bodyData.status == "Delete") {
      const adDoc = await Generic.findByIdAndUpdate(
        {
          _id: ad_id
        },
        {
          $set: {
            ad_status: "Delete",
            ad_Deleted_Date: currentDate,
            ad_Historic_Duration_Date: Ad_Historic_Duration
          }
        },
        { returnOriginal: false, new: true }
      );
      if (!adDoc) {
        throw ({ status: 401, message: 'Access_Denied' });
      }
      return adDoc;
    }
    else if (bodyData.status == "Selling") {
      const adDoc = await Generic.updateOne(
        {
          _id: ad_id,
          ad_status: "Archive"
        },
        {
          $set: {
            ad_status: "Selling",
          },
          $unset: {
            ad_Draft_Date: 1,
            ad_Deleted_Date: 1,
            ad_Sold_Date: 1,
            ad_Archive_Date: 1,
            ad_Historic_Duration_Date: 1
          },
        }
      );
      if (adDoc.modifiedCount === 0) {
        throw ({ status: 401, message: 'Access_Denied' });
      }
      return adDoc;
    }


  };

  // Make Ads favourite  or Unfavourite 
  static async favouriteAds(bodyData, userId, ad_id) {

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const isBodyValid = validateFavoriteAdBody(bodyData, ad_id);
    if (!isBodyValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }
    // Ad is find from Generics collection    if body contains "Favourite"
    if (bodyData.value == "Favourite") {

      const findAd = await Generic.findOne({
        _id: ad_id
      });
      // if Ad doesnt exists throw error
      if (!findAd) {
        // mixpanel track for failed event in make ad favourite
        await track('failed !! Make Ad favourite ', {
          distinct_id: userId,
          ad_id: ad_id,
          message: ` ad_id : ${ad_id}  does not exist`
        })
        throw ({ status: 404, message: 'AD_NOT_EXISTS' });
      }
      else {

        const isAdFav = await Profile.findOne(
          {
            _id: userId,
            "favourite_ads": {
              $elemMatch: { "ad_id": ad_id }
            }
          });
        // save the ads ino favourite ads list in user profile
        if (isAdFav == null) {
          const updatedUser = await Profile.updateOne(
            { _id: userId },
            {
              $addToSet: {
                "favourite_ads": {
                  ad_id: ObjectId(ad_id),
                  ad_Favourite_Date: currentDate
                }
              }
            })
          // increase the saved count by 1  
          if (updatedUser.modifiedCount > 0) {
            await Generic.findByIdAndUpdate(
              { _id: ad_id },
              { $inc: { saved: 1 } }
            )
            // mixpanel track make Ad favourite
            await track('Make Ad favourite successfully !! ', {
              distinct_id: userId,
              ad_id: ad_id
            })
          }
        } else {
          throw ({ status: 404, message: 'Ad_Already_Favourite' });
        }
        return findAd;
      }
    }
    // Ad is find from Generics collection if body contains "UnFavourite"  Ad _id is removed from  user`s profile (faviourite_ads)
    else if (bodyData.value == "UnFavourite") {
      const findAd = await Generic.findOne({
        _id: ad_id
      })
      // if Ad doesnt exists throw error
      if (!findAd) {
        // mixpanel track for failed event in remove ad from favourite
        await track('failed !! Make Ad favourite ', {
          distinct_id: userId,
          ad_id: ad_id,
          message: ` ad_id : ${ad_id}  does not exist`
        })
        throw ({ status: 404, message: 'AD_NOT_EXISTS' });
      }
      else {
        // remove the ads from favourite_ads  list in user profile
        const updatedUser = await Profile.updateOne(
          { _id: userId },
          {
            $pull: {
              favourite_ads: {
                ad_id: ad_id,
              }
            }
          },
          { new: true }
        );
        if (updatedUser.modifiedCount > 0) {
          // decrease the saved count by 1  
          await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $inc: { saved: -1 } }
          )
          // mixpanel track remove Ad favourite
          await track('Removed Ad from Favourites successfully', {
            distinct_id: userId,
            ad_id: ad_id
          })
        } else {
          throw ({ status: 404, message: 'Already_Unfavourite' });
        }
        return findAd
      }
    }
  };

  //Get Favourite Ads -- User is Authenticated and Aggregation is created with Profile Collection and Generics Colllections  
  static async getFavouriteAds(query, userId) {
    //check if user exist or not 
    const userExist = await Profile.findOne({
      _id: userId
    });
    // if not exists throw error 
    if (!userExist) {
      // mixpanel track -- failed to get favorite ads
      await track('failed to get favourite Ads ', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`

      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      /*
      Aggregation between Profile collection and generics collection to fetch all the favourite ads from generics
      $match is used to create a relation between User_id and Ads
      $unwind to wextract the favourite ads from profile
      $lookup to match the foriegn feilds with local field between generics and profiles
      $unwind for extrating result array from $lookup
      $addFields to add feilds from generics to ads result
      $matcto querey by category
      $project to show only the required fields 
      $sort to sort all the final ads y ad_favourite date 
      */
      let getMyFavAds = await Profile.aggregate([
        {
          '$match': {
            '_id': ObjectId(userId)
          }
        }, {
          '$unwind': {
            'path': '$favourite_ads',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$lookup': {
            'from': 'generics',
            'localField': 'favourite_ads.ad_id',
            'foreignField': '_id',
            'as': 'firstResult'
          }
        }, {
          '$unwind': {
            'path': '$firstResult',
            'preserveNullAndEmptyArrays': true
          }
        }, {
          '$addFields': {
            'saved': '$firstResult.saved',
            'views': '$firstResult.views',
            'ad_id': '$firstResult._id',
            'user_id': '$firstResult.user_id',
            'parent_id': "$firstResult.parent_id",
            'category': '$firstResult.category',
            'title': '$firstResult.title',
            'price': '$firstResult.price',
            'image_url': '$firstResult.image_url',
            'thumbnail_url': "$firstResult.thumbnail_url",
            'description': '$firstResult.description',
            'ad_status': '$firstResult.ad_status',
            'ad_promoted': '$firstResult.ad_promoted',
            'isPrime': '$firstResult.isPrime',
            'ad_posted_address': "$firstResult.ad_posted_address",
            'ad_present_address': "$firstResult.ad_present_address",
            'ad_expire_date': "$firstResult.ad_expire_date",
            'textLanguages': "$firstResult.textLanguages",
          }
        },
        {
          $sort: {
            "favourite_ads.ad_Favourite_Date": -1
          }
        },
        {
          '$project': {
            'ad_id': 1,
            'user_id': 1,
            '_id': 0,
            "parent_id": 1,
            'views': 1,
            'saved': 1,
            'category': 1,
            'title': 1,
            'price': 1,
            'ad_posted_address': 1,
            'ad_present_address': 1,
            'ad_expire_date': 1,
            'textLanguages': 1,
            "thumbnail_url": 1,
            'description': 1,
            'ad_status': 1,
            'favourite_ads.ad_Favourite_Date': 1,
            'saved': 1,
            'views': 1
          }
        }
      ]
      )
      // mixpanel - when get favourite ads
      await track('get favourite Ads !! ', {
        distinct_id: userId
      });


      // ads are filtered with ad_status
      for (var i = getMyFavAds.length - 1; i >= 0; --i) {
        if (getMyFavAds[i].ad_status !== "Selling") {
          getMyFavAds.splice(i, 1);
        }
      }

      if (getMyFavAds.length == 0) {
        await track('failed get favourite Ads !! ', {
          distinct_id: userId,
          message: ` user_id : ${userId}  have no favourite ads`
        });
        throw ({ status: 404, message: 'ADS_NOT_EXISTS' });
      }
      return getMyFavAds

    }
  };

  // Get particular Ad Detail with distance and user details
  static async getParticularAd(bodyData, query, user_id) {


    const ad_id = bodyData.ad_id;
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;


    if (bodyData.ad_status === "Pending") {
      return await Generic.findById({ _id: ad_id });
    }
    if (!lng || !lat || !maxDistance) {
      throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
    }

    const AdDetail = await Generic.aggregate([
      {
        '$geoNear': {
          'near': {
            'type': 'Point',
            'coordinates': [
              lng, lat
            ]
          },
          'distanceField': 'dist.calculated',
          'maxDistance': maxDistance,
          'includeLocs': 'dist.location',
          'spherical': true
        }
      },
      {
        '$match': {
          '_id': ObjectId(ad_id),
          'ad_status': 'Selling'
        }
      },
      {
        '$project': {
          '_id': 1,
          'parent_id': 1,
          'user_id': 1,
          'category': 1,
          'sub_category': 1,
          'title': 1,
          'views': 1,
          'saved': 1,
          'price': 1,
          'image_url': 1,
          'thumbnail_url': 1,
          'video_url': 1,
          'SelectFields': 1,
          'ad_posted_address': 1,
          'ad_present_address': 1,
          'ad_present_location': 1,
          'ad_posted_location': 1,
          'textLanguages': 1,
          'special_mention': 1,
          'description': 1,
          'is_negotiable': 1,
          'ad_status': 1,
          'ad_type': 1,
          'created_at': 1,
          'isPrime': 1,
          'dist': 1
        }
      }
    ]);

    if (AdDetail.length == 0) {
      throw ({ status: 404, message: 'NOT_FOUND' });
    }

    if (AdDetail[0].user_id.toString() !== user_id) {
      const updateAdViews = await Generic.findOneAndUpdate({ _id: ad_id }, {
        $inc: { views: 1 }
      }, { new: true });

      AdDetail[0].views = AdDetail[0].views + 1
    }

    const ownerDetails = await Profile.findById({ _id: AdDetail[0].user_id }, {
      _id: 1,
      name: 1,
      profile_url: 1,
      is_recommended: 1,
      is_email_verified: 1,
      created_date: 1
    })
    const user = await Profile.findOne(
      {
        _id: user_id,
        "favourite_ads": {
          $elemMatch: { "ad_id": ad_id }
        }
      });

    let isAdFav
    if (user) {
      isAdFav = true
    } else {
      isAdFav = false
    }
    // mixpanel -- track  get Particular ad ads
    await track('get Particular ad ads', {
      distinct_id: ad_id,
      message: `viewed ${ad_id}`
    })
    // two banner ads from business model with nearest location
    const businessAdList = await BusinessAds.aggregate([
      {
        '$geoNear': {
          'near': { type: 'Point', coordinates: [lng, lat] },
          "distanceField": "dist.calculated",
          'maxDistance': maxDistance,
          "includeLocs": "dist.location",
          'spherical': true
        }
      },
      {
        $match: {
          adStatus: "Active",
          adType: 'banner'
        }
      },
      {
        '$project': {
          '_id': 1,
          'parentID': 1,
          'userID': 1,
          'adStatus': 1,
          'title': 1,
          'description': 1,
          "adType": 1,
          'price': 1,
          "imageUrl": 1,
          'translateText': 1,
          'redirectionUrl': 1,
          'subAds': 1,
          "dist": 1,
          "createdAt": 1
        }
      },
      {
        $sort: {
          "createdAt": -1,
          "dist.calculated": -1
        }
      },
      {
        $limit: 2
      }
    ])

    businessAdList.forEach(async ad => {
      await BusinessAds.updateOne({ _id: ad._id }, {
        $inc: {
          'impressions': 1
        }
      })
    })
    return { AdDetail, ownerDetails, isAdFav, businessAdList };
  };

  // Get Premium Ads -- User is authentcated 1  1and Ads Are filtered
  static async getPremiumAdsService(userId, query) {
    // input from parameters (longitute , latitude , maxDistance ,page ,limit )
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page;
    if (pageVal == 0) pageVal = pageVal + 1
    let limitval = +query.limit || 25;
    if (!lng || !lat || !maxDistance) {
      throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
    }
    // let limitval = +query.limit || 20;
    /* 
    $geonear to find all the ads existing near the given coordinates
    $lookup for the relation between the profiles and Generics
    $unwind to extract the array from sample_result
    $addfeilds to join profile fields with sample result
    $project to show only the required fields
    $match for filtering only premium ads
    $sort to sort all the ads by order 
    $skip and limit for pagination
    */
    const premiumAdsData = await Generic.aggregate([
      [
        {
          '$geoNear': {
            'near': { type: 'Point', coordinates: [lng, lat] },
            "distanceField": "dist.calculated",
            'maxDistance': maxDistance,
            "includeLocs": "dist.location",
            'spherical': true
          }
        },
        {
          $match: {
            isPrime: true,
            ad_status: "Selling"
          }
        },
        {
          '$lookup': {
            'from': 'profiles',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'sample_result'
          }
        },
        {
          '$unwind': {
            'path': '$sample_result'
          }
        },
        {
          '$addFields': {
            'Seller_Name': '$sample_result.name',
            'Seller_Id': '$sample_result._id',
            'Seller_Joined': '$sample_result.created_date',
            'Seller_Image': '$sample_result.profile_url',
            'Seller_verified': '$sample_result.is_email_verified',
            'Seller_recommended': '$sample_result.is_recommended',
          }
        },
        {
          '$project': {
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
            'SelectFields': 1,
            "created_at": 1,
            'price': 1,
            "thumbnail_url": 1,
            'textLanguages': 1,
            'isPrime': 1,
            "dist": 1,
            "is_Boosted": 1,
            "Boosted_Date": 1,
            "is_Highlighted": 1,
            "Highlighted_Date": 1,
          }
        },
        {
          $sort: {
            "is_Highlighted": -1,
            "Highlighted_Date": -1,
            "is_Boosted": -1,
            "Boosted_Date": -1,
            "created_at": -1,
            "dist.calculated": -1,
            "Seller_verified": -1,
            "Seller_recommended": -1
          }
        },
        {
          $skip: limitval * (pageVal - 1)
        },
        {
          $limit: limitval
        },
      ]
    ])
    premiumAdsData.forEach(async premiumAd => {
      const user = await Profile.find(
        {
          _id: userId,
          "favourite_ads": {
            $elemMatch: { "ad_id": premiumAd._id }
          }
        })
      if (user.length == 0) {
        premiumAd.isAdFav = false
      } else {
        premiumAd.isAdFav = true
      }
    })
    // mix panel track for get premium ads 
    await track('get Premium Ads Successfully', {
      distinct_id: userId
    })
    return premiumAdsData;

  };

  // Get Recent Ads  -- User is authentcated and Ads Are filtered
  static async getRecentAdsService(userId, query) {
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page || 1;
    let limitval = +query.limit || 25;
    if (pageVal == 0) pageVal = pageVal + 1

    if (!lng || !lat || !maxDistance) {
      throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
    }
    /* 
$geonear to find all the ads existing near the given coordinates
$lookup for the relation between the profiles and Generics
$unwind to extract the array from sample_result
$addfeilds to join profile fields with sample result
$project to show only the required fields
$match for filtering only recent ads
$sort to sort all the ads by order 
$skip and limit for pagination
*/
    let getRecentAds = await Generic.aggregate([
      [
        {
          '$geoNear': {
            'near': { type: 'Point', coordinates: [lng, lat] },
            "distanceField": "dist.calculated",
            'maxDistance': maxDistance,
            "includeLocs": "dist.location",
            'spherical': true
          }
        },
        {
          $match: {
            isPrime: false,
            ad_status: "Selling"
          }
        },
        {
          '$lookup': {
            'from': 'profiles',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'sample_result'
          }
        },
        {
          '$unwind': {
            'path': '$sample_result'
          }
        },
        {
          '$addFields': {
            'Seller_Name': '$sample_result.name',
            'Seller_Id': '$sample_result._id',
            'Seller_Joined': '$sample_result.created_date',
            'Seller_Image': '$sample_result.profile_url',
            'Seller_verified': '$sample_result.is_email_verified',
            'Seller_recommended': '$sample_result.is_recommended',

          }
        },
        {
          $sort: {
            "is_Highlighted": -1,
            "Highlighted_Date": -1,
            "is_Boosted": -1,
            "Boosted_Date": -1,
            "created_at": -1,
            "dist.calculated": -1,
            "Seller_verified": -1,
            "Seller_recommended": -1
          }
        },
        {
          '$project': {
            '_id': 1,
            'parent_id': 1,
            "Seller_Id": 1,
            'Seller_Name': 1,
            "Seller_verified": 1,
            "Seller_recommended": 1,
            'category': 1,
            'sub_category': 1,
            'ad_status': 1,
            'SelectFields': 1,
            'title': 1,
            "created_at": 1,
            'price': 1,
            "thumbnail_url": 1,
            'textLanguages': 1,
            'isPrime': 1,
            "dist": 1,
            "is_Boosted": 1,
            "Boosted_Date": 1,
            "is_Highlighted": 1,
            "Highlighted_Date": 1
          }
        },
        {
          $skip: limitval * (pageVal - 1)
        },
        {
          $limit: limitval
        },
      ]
    ])
    getRecentAds.forEach(async recentAd => {
      const user = await Profile.find(
        {
          _id: userId,
          "favourite_ads": {
            $elemMatch: { "ad_id": recentAd._id }
          }
        })
      if (user.length == 0) {
        recentAd.isAdFav = false
      } else {
        recentAd.isAdFav = true
      }
    })

    //mix panel track get recent ads 
    await track('get recent Ads Successfully', {
      distinct_id: userId
    })

    let premiumAds = await this.getPremiumAdsService(userId, query)
    const featureAds = featureAdsFunction(getRecentAds, premiumAds)
    return featureAds;
  };

  // Get particular Ad Detail with distance and user details
  static async getRelatedAds(query, user_id, adId) {
    let category = query.category;
    let sub_category = query.sub_category;
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = 100000;
    let pageVal = +query.page;
    if (pageVal == 0) pageVal = pageVal + 1
    let limitval = +query.limit || 10;

    if (!lng || !lat) {
      throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
    }

    let RelatedAds = await Generic.aggregate([
      {
        '$geoNear': {
          'near': {
            'type': 'Point',
            'coordinates': [
              lng, lat
            ]
          },
          'distanceField': 'dist.calculated',
          'maxDistance': maxDistance,
          'includeLocs': 'dist.location',
          'spherical': true
        }
      },
      {
        '$lookup': {
          'from': 'profiles',
          'localField': 'user_id',
          'foreignField': '_id',
          'as': 'sample_result'
        }
      },
      {
        '$unwind': {
          'path': '$sample_result'
        }
      },
      {
        '$addFields': {
          'Seller_Name': '$sample_result.name',
          'Seller_Id': '$sample_result._id',
          'Seller_Joined': '$sample_result.created_date',
          'Seller_Image': '$sample_result.profile_url',
          'Seller_verified': '$sample_result.is_email_verified',
          'Seller_recommended': '$sample_result.is_recommended',
        }
      },
      {
        '$match': {
          'ad_status': 'Selling',
          "$or": [
            { "category": category },
            { "sub_category": sub_category }
          ],
        }
      },
      {
        $sort: {
          "created_at": -1,
          "dist.calculated": 1,
        }
      },
      {
        $skip: limitval * (pageVal - 1)
      },
      {
        $limit: limitval
      },
      {
        '$project': {
          '_id': 1,
          'parent_id': 1,
          'category': 1,
          'sub_category': 1,
          'title': 1,
          'views': 1,
          'saved': 1,
          'price': 1,
          'textLanguages': 1,
          "thumbnail_url": 1,
          'ad_posted_address': 1,
          'ad_status': 1,
          'SelectFields': 1,
          'ad_type': 1,
          'created_at': 1,
          'isPrime': 1,
          'dist': 1,
          'Seller_Name': 1,
          'Seller_Id': 1,
          'Seller_Joined': 1,
          'Seller_Image': 1,
          'Seller_verified': 1,
          'Seller_recommended': 1
        }
      },
      {
        '$facet': {
          'PremiumAds': [
            {
              '$match': {
                'isPrime': true
              }
            }
          ],
          'RecentAds': [
            {
              '$match': {
                'isPrime': false
              }
            }
          ]
        }
      },
    ]);

    const isAdFavFunc = async (AdToCheck) => {
      AdToCheck.forEach(async relatedAd => {
        const user = await Profile.find(
          {
            _id: user_id,
            "favourite_ads": {
              $elemMatch: { "ad_id": relatedAd._id }
            }
          })
        if (user.length == 0) {
          relatedAd.isAdFav = false
        } else {
          relatedAd.isAdFav = true
        }
      })
    }

    await isAdFavFunc(RelatedAds[0].RecentAds)
    await isAdFavFunc(RelatedAds[0].PremiumAds)

    let featureAds = featureAdsFunction(RelatedAds[0].RecentAds, RelatedAds[0].PremiumAds);


    if (adId) {
      featureAds = featureAds.filter((ad) => {
        return ad._id.toString() !== adId;
      });
    } else {

    }


    // mixpanel -- track  get Particular ad ads
    await track('get related ads', {
      distinct_id: user_id,
      message: `viewed related ads for ${category, sub_category}`
    });
    return { RelatedAds, featureAds }
  };

  // Get Ad Status -- from generics check ad_status
  static async getAdStatus(ad_id) {
    const ad_status = await Generic.findById({ _id: ad_id }, {
      _id: 0,
      ad_status: 1,
      parent_id: 1,
    })
    if (!ad_status) {
      await track('viewed ads status failed', {
        distinct_id: ad_id,
      })
      throw ({ status: 404, message: 'AD_NOT_EXISTS' });
    } else {
      return ad_status
    }
  };

  static async repostAd(ad_id, userId) {

    // only after payment is done 
    const isIdValid = validateMongoID(ad_id);
    if (!isIdValid) {
      throw ({ status: 401, message: 'Bad Request' });
    }
    const adCopy = await Generic.findOne({ _id: ad_id, user_id: userId, ad_status: { $in: ["Sold", "Delete", "Expired"] } });

    if (!adCopy) {
      throw ({ status: 401, message: 'Bad Request' });
    }

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const durationForExpiryDate = await AdDurationModel.findOne()

    const {

      user_id,
      parent_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      isPrime,
      thumbnail_url,
      image_url,
      video_url,
      ad_present_location,
      ad_posted_location,
      ad_posted_address,
      ad_present_address,
      is_negotiable,
      is_ad_posted

    } = adCopy


    let age = age_func(SelectFields["Year of Purchase (MM/YYYY)"])

    const creditDuctConfig = {

      title: title,
      category: category,
      AdsArray: {

        "isPrime": false,
        "isHighlighted": false,
        "isBoosted": false

      }

    }
    const new_id = ObjectId();

    const message = await creditDeductionFunction(creditDuctConfig, user_id, new_id);

    if (message === "NOT_ENOUGH_CREDITS") {

      throw ({ status: 401, message: "NOT_ENOUGH_CREDITS" });

    }


    const newDoc = await Generic.create({

      _id: new_id,
      user_id,
      parent_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      age: age,
      isPrime: false,
      image_url,
      thumbnail_url,
      video_url,
      ad_present_location,
      ad_posted_location,
      ad_posted_address,
      ad_present_address,
      ad_status: "Selling",
      is_negotiable,
      is_ad_posted,
      created_at: currentDate,
      updated_at: currentDate,
      ad_expire_date: expiry_date_func(durationForExpiryDate.generalAdDuration),
    });
    if (newDoc) {
      //save the ad id in users profile in myads
      await Profile.findByIdAndUpdate({ _id: user_id }, {
        $push: {
          my_ads: new_id
        }
      });
      await Generic.findByIdAndUpdate(
        { _id: ad_id },
        {
          $set:
          {
            ad_status: "Reposted",
            ad_Reposted_Date: currentDate,
            is_Reposted: true
          }
        },
        { returnOriginal: false }
      );
      // mixpanel track - when Status Of Ad changed reposted and new ad created
      await track('ad created successfully !!', {
        distinct_id: user_id,
        ad_id: new_id
      })

      /* 
      
      Cloud Notification To firebase
      
      */
      const messageBody = {

        title: `Ad: "${title}" is successfully reposted!`,
        body: "Click here to access it",
        data: { _id: new_id.toString(), navigateTo: navigateToTabs.particularAd },
        type: "Info"

      }

      await cloudMessage(user_id.toString(), messageBody);



      const body = {
        ad_id: new_id,
        category,
        sub_category,
        title,
        description,
        ad_posted_address,
        ad_posted_location,
        SelectFields
      }

      await createGlobalSearch(body)

      return newDoc
    }
  };

  static async getAdsForPayout(userId) {
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    });

    if (!findUsr) {
      // mixpanel -- track failed get my ads
      await track('failed to get ads for payouts', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      const myAdsList = await Generic.aggregate([
        {
          $match: { _id: { $in: findUsr.my_ads }, }

        },
        {
          $facet: {
            "InReview": [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$parent_id"] },
                  reviewStatus: "InReview",
                  ad_status: "Selling"
                }
              },
              {
                $sort: {
                  created_at: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  isClaimed: 1,
                  category: 1,
                  reviewStatus: 1,
                  sub_category: 1,
                  thumbnail_url: 1,
                  ad_posted_address: 1,
                  created_at: 1
                }
              }
            ],
            "Approved": [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$parent_id"] },
                  reviewStatus: "Approved",
                  ad_status: "Selling"
                }
              },
              {
                '$lookup': {
                  'from': 'payouts',
                  'localField': '_id',
                  'foreignField': 'ad_id',
                  'as': 'payoutDetails'
                }
              }, {
                '$unwind': {
                  'path': '$payoutDetails'
                }
              }, {
                '$addFields': {
                  'paymentstatus': '$payoutDetails.payment_status',
                  'paymentDate': '$payoutDetails.payment_initate_date'
                }
              },
              {
                $sort: {
                  created_at: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  isClaimed: 1,
                  "paymentstatus": 1,
                  "paymentDate": 1,
                  category: 1,
                  sub_category: 1,
                  thumbnail_url: 1,
                  ad_posted_address: 1,
                  created_at: 1
                }
              }
            ],
            "Rejected": [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$parent_id"] },
                  reviewStatus: "Rejected",
                  ad_status: "Selling"
                }
              },
              {
                $sort: {
                  created_at: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  isClaimed: 1,
                  category: 1,
                  reasonToReject: 1,
                  sub_category: 1,
                  thumbnail_url: 1,
                  ad_posted_address: 1,
                  created_at: 1
                }
              }
            ],
          }
        }
      ]);
      if (!myAdsList) {
        await track('failed to get ads for payouts', {
          distinct_id: userId,
          message: ` user_id : ${userId}  does not have ads in My_Ads`
        })
        throw ({ status: 404, message: 'ADS_NOT_EXISTS' })
      }
      else {
        // mixpanel track for Get My Ads
        await track('get ads for payouts successfully !!', {
          distinct_id: userId
        });
      }
      return myAdsList;

    }
  };

  static async claimPayout(userId, bodyData) {

    const {
      ad_id,
      phoneNumber,
      email,
      upi_id
    } = bodyData;

    if (!ad_id || !upi_id) {

      await failedTrack('Failed to Claim Payout !!', userId, ad_id)

      throw ({ status: 401, message: 'Please Enter UPI And Ad Id' });
    }

    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    if (!upiRegex.test(upi_id)) {
      throw ({ status: 401, message: 'Please Enter Proper UPI ID' });
    }
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      throw ({ status: 401, message: 'Enter Valid Mobile Number' });
    }
    if (email && !emailRegex.test(email)) {
      throw ({ status: 401, message: 'Enter Valid Email Address' });
    }

    const userDetails = await Profile.findById({ _id: userId }, {
      name: 1,
      "userNumber.text": 1,
      "email.text": 1
    });
    if (!userDetails) {
      await failedTrack('Failed to Claim Payout !!', userId, ad_id)
      throw ({ status: 403, message: 'UnAuthorized' })
    }
    const Ad = await Generic.findOne({
      _id: ObjectId(ad_id),
      user_id: ObjectId(userDetails),
      ad_status: "Selling",
      reviewStatus: "Approved",
      isClaimed: false
    });

    if (!Ad) {
      await failedTrack('Failed to Claim Payout !!', userId, ad_id)
      throw ({ status: 403, message: 'Alread_Claimed' });
    }

    const username = process.env.LIVE_KEY_ID;
    const password = process.env.LIVE_KEY_SECRET;

    const payoutDoc = await PayoutModel.findOne({
      ad_id: ObjectId(ad_id),
    });

    if (!payoutDoc) {
      await failedTrack('Failed to Claim Payout !!', userId, ad_id)
      throw ({ status: 403, message: 'UnAuthorized' })
    }
    const {
      amount
    } = payoutDoc;

    if (payoutDoc.payment_status !== "Not_Claimed") {
      throw ({ status: 403, message: 'Alread_Claimed' });
    }

    async function makePostRequest() {
      try {
        const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
        const reference_id = ObjectId()
        const data = {
          "account_number": process.env.LIVE_ACC_NUMBER,
          "amount": amount,
          "currency": "INR",
          "mode": "UPI",
          "purpose": "cashback",
          "fund_account": {
            "account_type": "vpa",
            "vpa": {
              "address": upi_id
            },
            "contact": {
              "name": userDetails.name,
              "contact": phoneNumber ? phoneNumber : userDetails.userNumber.text,
              "email": email ? email : userDetails.email.text,
              "type": "customer",
              "reference_id": reference_id,
              "notes": {
                "notes_key_1": `You have Recieved Rs: ${amount} Reward`,
                "note_key_2": `Ad ${Ad.title} , AD ID : ${ad_id}`
              }
            }
          },
          "queue_if_low_balance": true,
          "reference_id": reference_id,
          "narration": "Truelist Cash Reward"
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
            'Accept': 'application/json',
          }
        };

        const response = await axios.post('https://api.razorpay.com/v1/payouts', data, config);

        const {
          id,
          fund_account_id,
          fund_account,
          status,
          failure_reason
        } = response.data;
        const {
          contact_id,
          vpa,
        } = fund_account;

        const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

        function statusFunc(status) {
          switch (status) {
            case "pending":
            case "queued":
            case "processing":
              return "processing";
            case 'processed':
              return "Paid";
            case 'reversed':
            case "cancelled":
            case "rejected":
              return "Failed"
          }
        }
        await PayoutModel.findOneAndUpdate(
          {
            ad_id: ObjectId(ad_id),
          }, {
          $set: {
            payout_id: id,
            fund_account_id: fund_account_id,
            contact_id: contact_id,
            reference_id: reference_id,
            vpa: vpa,
            failure_reason: failure_reason,
            payment_status: statusFunc(status),
            razorpayPayoutStatus: status,
            payment_initate_date: currentDate
          }
        });

        if (status !== "Not_Claimed") {
          await Generic.findOneAndUpdate({ parent_id: Ad.parent_id }, {
            $set: {
              isClaimed: true
            }
          })
        }
        return true;

      } catch (error) {

        throw ({ status: 401, message: error });

      }
    }

    const Response = await makePostRequest();
    /* 
 
Cloud Notification To firebase
 
*/
    const messageBody = {
      title: `⭐ Your Amount Will Be Credited Soon ⭐`,
      body: "Click here to access it",
      data: {
        id: ad_id.toString(),
        navigateTo: navigateToTabs.payout
      },
      type: "Alert"
    }

    await cloudMessage(userId.toString(), messageBody);

    // mixpanel track - Successfully  Claimed Payout
    await track('Claim Payout Successfully !!', {
      distinct_id: userId,
      ad_id: ad_id
    })
    return Response

  };

  // Get Feature Ads Ads  -- User is authentcated and Ads Are filtered
  static async getFeatureAdsService(userId, query) {
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page || 1;
    let limitval = +query.limit || 25;
    if (pageVal == 0) pageVal = pageVal + 1

    if (!lng || !lat || !maxDistance) {
      throw ({ status: 401, message: 'NO_COORDINATES_FOUND' });
    }
    /* 
$geonear to find all the ads existing near the given coordinates
$lookup for the relation between the profiles and Generics
$unwind to extract the array from sample_result
$addfeilds to join profile fields with sample result
$project to show only the required fields
$match for filtering only recent ads
$sort to sort all the ads by order 
$skip and limit for pagination
*/
    let Ads = await Generic.aggregate([
      [
        {
          '$geoNear': {
            'near': { type: 'Point', coordinates: [lng, lat] },
            "distanceField": "dist.calculated",
            'maxDistance': maxDistance,
            "includeLocs": "dist.location",
            'spherical': true
          }
        },
        {
          $match: {
            isPrime: false,
            ad_status: "Selling"
          }
        },
        {
          '$lookup': {
            'from': 'profiles',
            'localField': 'user_id',
            'foreignField': '_id',
            'as': 'sample_result'
          }
        },
        {
          '$unwind': {
            'path': '$sample_result'
          }
        },
        {
          '$addFields': {
            'Seller_Name': '$sample_result.name',
            'Seller_Id': '$sample_result._id',
            'Seller_Joined': '$sample_result.created_date',
            'Seller_Image': '$sample_result.profile_url',
            'Seller_verified': '$sample_result.is_email_verified',
            'Seller_recommended': '$sample_result.is_recommended',

          }
        },
        {
          $sort: {
            "is_Highlighted": -1,
            "Highlighted_Date": -1,
            "is_Boosted": -1,
            "Boosted_Date": -1,
            "created_at": -1,
            "dist.calculated": -1,
            "Seller_verified": -1,
            "Seller_recommended": -1
          }
        },
        {
          '$project': {
            '_id': 1,
            'parent_id': 1,
            "Seller_Id": 1,
            'Seller_Name': 1,
            "Seller_verified": 1,
            "Seller_recommended": 1,
            'category': 1,
            'sub_category': 1,
            'ad_status': 1,
            'SelectFields': 1,
            'title': 1,
            "created_at": 1,
            'price': 1,
            "thumbnail_url": 1,
            'textLanguages': 1,
            'isPrime': 1,
            "dist": 1,
            "is_Boosted": 1,
            "Boosted_Date": 1,
            "is_Highlighted": 1,
            "Highlighted_Date": 1
          }
        },
        {
          $skip: limitval * (pageVal - 1)
        },
        {
          $limit: limitval
        },
      ]
    ])
    Ads.forEach(async recentAd => {
      const user = await Profile.find(
        {
          _id: userId,
          "favourite_ads": {
            $elemMatch: { "ad_id": recentAd._id }
          }
        })
      if (user.length == 0) {
        recentAd.isAdFav = false
      } else {
        recentAd.isAdFav = true
      }
    })

    //mix panel track get recent ads 
    await track('get recent Ads Successfully', {
      distinct_id: userId
    })
    return Ads;
  };

  /* 
  DRAFT ADS API SERVICES HERE
  */

  // Create Draft Ad api
  static async draftAd(bodyData, userId) {
    const isAdBodyValid = ValidateDraftAdBody(bodyData);
    if (!isAdBodyValid) {
      throw ({ status: 401, message: 'Bad Request' })
    }
    // Generic AdDoc is created 
    const {
      ad_id,
      parent_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      image_url,
      video_url,
      is_negotiable
    } = bodyData

    if (image_url.length == 0) {
      throw ({ status: 401, message: 'NO_IMAGES_IN_THIS_AD' })
    }

    /*  
    
    *************************************************
    IMAGE COMPRESSION FOR THUMBNAILS
    *************************************************


    */
    const thumbnail_url = await imgCom(image_url[0]);
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    let adDoc = await Draft.create({
      _id: ObjectId(ad_id),
      parent_id,
      user_id: ObjectId(userId),
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      image_url,
      video_url,
      thumbnail_url,
      ad_status: "Draft",
      ad_Draft_Date: currentDate,
      is_negotiable,
      created_at: currentDate
    });
    // mixpanel track -- Ad create 
    await track('Ad Draft succeed', {
      category: bodyData.category,
      distinct_id: adDoc._id,
    })
    //save the ad_id in users profile in myads
    await Profile.findByIdAndUpdate({ _id: userId }, {
      $push: {
        my_ads: ObjectId(adDoc._id)
      }
    });
    return adDoc["_doc"];
  };

  // Update Any Draft Ad
  static async updateDraft(bodyData, userId) {
    const {
      ad_id,
      category,
      sub_category,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      isPrime,
      thumbnail_url,
      image_url,
      video_url,
      ad_present_location,
      ad_posted_location,
      ad_posted_address,
      ad_present_address,
      ad_status,
      is_negotiable,
    } = bodyData

    const Ad = await Draft.findById({ _id: ad_id });

    if (!Ad) {
      throw ({ status: 404, message: 'DRAFT_NOT_FOUND' });
    }

    if (Ad.user_id.toString() !== userId) {
      throw ({ status: 401, message: 'Access_Denied' });
    }

    const updateAd = await Draft.findByIdAndUpdate({ _id: ad_id, user_id: userId }, {
      $set: {
        category,
        sub_category,
        description,
        SelectFields,
        special_mention,
        title,
        price,
        isPrime,
        image_url,
        video_url,
        thumbnail_url,
        ad_present_location,
        ad_posted_location,
        ad_posted_address,
        ad_present_address,
        ad_status,
        is_negotiable,
      }
    }, {
      new: true
    });
    await track('Update Draft Succeed', {
      distinct_id: ad_id,
    })
    return updateAd
  };

  // Get Draft Ad
  static async getDraftAd(bodyData, userId) {
    const draftAd = await Draft.findById({ _id: bodyData.ad_id, user_id: userId });
    if (draftAd) {
      await track('Get Draft event', {
        distinct_id: ad_id,
      })
      return draftAd
    } else {
      throw ({ status: 404, message: 'AD_NOT_EXISTS' });
    }
  };

  // Get All Draft Ads
  static async getAllDraft(userId) {
    const draftAds = await Draft.find({ user_id: userId });
    if (draftAds) {
      return draftAds
    } else {
      throw ({ status: 404, message: 'ADS_NOT_EXISTS' });
    }
  };

  // delete Draft Ads
  static async deleteDraft(user_Id, ad_id) {

    const Ad = await Draft.findOne({ _id: ad_id, user_id: user_Id });

    if (!Ad) {
      throw ({ status: 401, message: 'Access_Denied' });
    }
    const findandDeleteDraft = await Draft.deleteOne({
      user_id: user_Id,
      _id: ad_id
    });

    if (!findandDeleteDraft.deletedCount > 0) {
      throw ({ status: 401, message: 'DRAFT_DOEST_NOT_EXIST' })
    }
    return "SUCCESSFULLY_DELETED"
  };
};