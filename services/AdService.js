const moment = require("moment");
const Profile = require("../models/Profile/Profile");
const Draft = require("../models/Ads/draftSchema");
const ObjectId = require('mongodb').ObjectId;
const Generic = require("../models/Ads/genericSchema");
const { track } = require('./mixpanel-service.js');
const { age_func, expiry_date_func } = require("../utils/moment");
const { creditDeductionFunction } = require("./CreditService");
const { createGlobalSearch } = require("./GlobalSearchService");
const { featureAdsFunction } = require("../utils/featureAdsUtil");
const detectSafeSearch = require("../image.controller");
const imgCom = require("../imageCompression");
const cloudMessage = require("../cloudMessaging");
const navigateToTabs = require("../utils/navigationTabs");
const Referral = require("../models/referelSchema");
const Credit = require("../models/creditSchema");
const imageWaterMark = require("../waterMarkImages");

module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    const adExist = await Generic.findById({_id:bodyData.ad_id});

    if(adExist){
      throw ({ status: 404, message: 'AD_ALREADY_EXISTS' })
    }

    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

    const DateAfter30Days = expiry_date_func(30);

      // Generic AdDoc is created 
      let {
        ad_id,
        parent_id,
        category,
        sub_category,
        field,
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

      /*

      *************************************************
      IMAGE WATERMARK
      *************************************************
      
      */

      await imageWaterMark(image_url)

      /* 
      
      **********************************************************
      CHECKING IMAGES PROFANITY
      **********************************************************
      
      */
      const { health, batch } = await detectSafeSearch(image_url)

      let age = age_func(SelectFields["Year of Purchase (MM/YYYY)"]) || bodyData.age

      const createAdFunc = async (status) => {
        let adDoc = await Generic.create({
          _id: ObjectId(ad_id),
          parent_id,
          user_id:  ObjectId(userId),
          category,
          sub_category,
          field,
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
          ad_expire_date: DateAfter30Days,
          updated_at: currentDate,
        });

        return adDoc
      }

      if (health == "HEALTHY") {

        const creditDuctConfig = {

          title: title,
          category: category,
          AdsArray: bodyData.AdsArray

        }
        const message = await creditDeductionFunction(creditDuctConfig, userId, ad_id);

        if (message === "NOT_ENOUGH_CREDITS") {

          throw ({ status: 401, message: "NOT_ENOUGH_CREDITS" })

        }

        let adDoc = await createAdFunc(ad_status)

        return adDoc["_doc"];

      }

      else {

        let adDoc = await createAdFunc("Pending")

        return adDoc
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
      $push: {
        my_ads: ObjectId(ad_id)
      }
    }, { new: true, returnDocument: "after" });

    const { category, sub_category, title, description, ad_posted_address, ad_posted_location, SelectFields } = adDoc;

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

        const push = {

          universal_credit_bundles: {

            number_of_credit: 50,
            source_of_credit: "Refferal",
            credit_status: "Active",
            credit_duration: 30,
            credit_expiry_date: expiry_date_func(30),
            credit_created_date: currentDate

          }
        }

        await Credit.findOneAndUpdate({ user_id: reffered_by_user.user_Id }, {

          $inc: { total_universal_credits: 50 },

          $push: push

        }, {
          new: true
        });


        const messageBody = {
          title: `You Have Gained '${50}' Credits By Referral Code!!`,
          body: "Check Your Credit Info",
          data: {
            navigateTo: navigateToTabs.home
          },
          type: "Info"
        }

        await cloudMessage(reffered_by_user.user_Id.toString(), messageBody);
      }
    } else {

    }
    /* 
 
    Cloud Notification To firebase
 
    */
    const messageBody = {
      title: `Your Ad '${title}' Is Successfully Posted !!`,
      body: "Click here to check ...",
      data: {
        id: ad_id.toString(),
        navigateTo: navigateToTabs.particularAd
      },
      type: "Info"
    }

    if (adDoc.thumbnail_url.length === 0) {
      await Generic.findOneAndUpdate({ _id: ObjectId(ad_id) }, {
        $push: {
          thumbnail_url: 'https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380'
        }
      })
    }

    await cloudMessage(userId.toString(), messageBody);

    await Draft.deleteOne({ _id: ad_id });
  }

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
      $push: {
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
      title: `Your Ad '${title}' Is Pending !!`,
      body: "Click here to check ...",
      data: { id: ad_id.toString(), navigateTo: navigateToTabs.myads },
      type: "Info"
    }

    await cloudMessage(userId.toString(), messageBody);

    await Draft.deleteOne({ _id: ad_id });
  }

  //Update Ad
  static async updateAd(bodyData, user_id) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const {
      parent_id,
      description,
      SelectFields,
      special_mention,
      price,
      thumbnail_url,
      image_url,
      video_url,
      ad_status,
      is_negotiable,
    } = bodyData
    const updateAd = await Generic.updateMany({ parent_id: parent_id, user_id: user_id }, {
      $set: {
        description,
        SelectFields,
        special_mention,
        price,
        image_url,
        thumbnail_url,
        video_url,
        ad_status,
        is_negotiable,
        updated_at: currentDate,
      }
    }, {
      new: true,
    });
    /* 
    
    Cloud Notification To firebase
    
    */
    const messageBody = {
      title: `Your Ad Is '${title}' Successfully Updated !!`,
      body: "Click here to check ...",
      data: { _id: parent_id.toString(), navigateTo: navigateToTabs.particularAd },
      type: "Info"
    }

    await cloudMessage(user_id.toString(), messageBody);
    return updateAd
  };

  // Get my Ads -- user is authenticated from token and  Aggregation  of Generics and Profile is created -- based on the _id in profile and generics -ads are fetched  
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
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
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
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
                  thumbnail_url: 1,
                  saved: 1,
                  views: 1,
                  ad_Archive_Date: 1,
                }
              }
            ],
            "Expired": [
              { $match: { ad_status: "Expired" } },
              {
                $sort: {
                  ad_expire_date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  description: 1,
                  thumbnail_url: 1,
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
                  saved: 1,
                  views: 1,
                  ad_expire_date: 1,
                }
              }
            ],
            "Deleted": [
              { $match: { ad_status: "Delete" } },
              {
                $sort: {
                  ad_Deleted_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  ad_posted_address: 1,
                  ad_Deleted_Date: 1,
                  thumbnail_url: 1,
                  // image_url: { $arrayElemAt: ["$image_url", 0] }
                }
              }
            ],
            "Reposted": [
              { $match: { ad_status: "Reposted" } },
              {
                $sort: {
                  ad_Reposted_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  ad_posted_address: 1,
                  ad_Reposted_Date: 1,
                  thumbnail_url: 1,
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
                }
              }
            ],
            "Sold": [
              { $match: { ad_status: "Sold" } },
              {
                $sort: {
                  ad_Sold_Date: -1,
                }
              },
              {
                $project: {
                  _id: 1,
                  parent_id: 1,
                  title: 1,
                  ad_posted_address: 1,
                  ad_Sold_Date: 1,
                  thumbnail_url: 1,
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
                }
              }
            ],
            "Suspended": [
              { $match: { ad_status: "Suspended" } },
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
                  thumbnail_url: 1,
                  // image_url: { $arrayElemAt: ["$image_url", 0] },
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

  // Get my Ads -- user is authenticated from token and  ads are fetched from db 
  static async getMyAdsHistory(userId) {
    //check if user exist or not
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    });
    //if not exist throw error 
    if (!findUsr) {
      // mixpanel -- track failed get my ads history
      await track('failed !! get my ads', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      /*
      if user exist find ads with ad_Status delete , sold , expired
      projecting the required feilds
      */
      const myAdsList = await Generic.find({
        user_id: userId,
        $or: [
          { ad_status: "Delete" },
          { ad_status: "Sold" },
          { ad_status: "Expired" }
        ]
      }, {
        _id: 1,
        title: 1,
        description: 1,
        image_url: { $arrayElemAt: ["$image_url", 0] },
        created_at: 1,
        ad_status: 1,
        price: 1,
        ad_expire_date: 1,
        ad_Deleted_Date: 1,
        ad_Sold_Date: 1,
      }
      )
      if (!myAdsList) {
        // mixpanel -- track failed get my ads
        await track('failed !! get my ads history ', {
          distinct_id: userId,
          message: ` user_id : ${userId}  does not have ads in My_Ads historry`
        })
        throw ({ status: 404, message: 'ADS_NOT_EXISTS' })
      }
      else {
        // mixpanel track for Get My Ads
        await track('get my ads history successfully !!', {
          distinct_id: userId
        });
        return myAdsList;
      }

    }
  };

  // Updating the status of Ad from body  using $set in mongodb
  static async changeAdStatus(bodyData, userId, ad_id) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');
    // check if user exist 
    const userExist = await Profile.findOne({
      _id: userId
    });
    // if not xist throw error
    if (!userExist) {
      // mixpanel -- track failed to chane ad status 
      await track('failed !! to chaange ad status', {
        distinct_id: userId,
        ad_id: ad_id,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      /* 
      if user exists find the ad whose status is to be changed
      */
      const findAd = await Generic.findOne({
        _id: ad_id
      });

      // if ad doesnt exist throw error 
      if (!findAd) {
        await track('failed !! to chaange ad status', {
          distinct_id: userId,
          ad_id: ad_id,
          message: ` ad_id : ${ad_id}  does not exist`

        })
        throw ({ status: 404, message: 'AD_NOT_EXISTS' })
      }
      // if ad exist change the status of Ad
      else {
        // mixpanel track - when Status Of Ad changed 
        await track('ad status changed successfully !!', {
          distinct_id: userId,
          ad_id: ad_id,
          status: bodyData.status
        })
        if (bodyData.status == "Archive") {
          const adDoc = await Generic.findByIdAndUpdate(
            {
              _id: ad_id
            },
            {
              $set: {
                ad_status: "Archive",
                ad_Archive_Date: currentDate
              }
            },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "Sold") {
          const adDoc = await Generic.findByIdAndUpdate(
            {
              _id: ad_id
            },
            {
              $set: {
                ad_status: "Sold",
                ad_Sold_Date: currentDate,
                ad_Historic_Duration_Date: Ad_Historic_Duration,
              }
            },
            { returnOriginal: false, new: true }
          )
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
          )
          return adDoc;
        }
        else if (bodyData.status == "Premium") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            {
              _id: ad_id
            },
            {
              $set: {
                ad_status: "Selling",
                ad_Premium_Date: currentDate,
                isPrime: true
              }
            },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "Draft") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            {
              _id: ad_id
            },
            {
              $set: {
                ad_status: "Draft",
                ad_Draft_Date: currentDate
              }
            },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "Selling") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            {
              _id: ad_id
            },
            {
              $set: {
                ad_status: "Selling",
              }
            },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "Reposted") {
          // only after payment is done 
          const adCopy = await Generic.findById({ _id: ad_id });
          const {
            user_id,
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
            ad_posted_location,
            ad_posted_address,
          } = adCopy
          //  Create a new Doc identical to the old after status chaned to Reposted
          const newDoc = await Generic.create({
            _id: ObjectId(),
            user_id,
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
            ad_posted_location,
            ad_posted_address,
            created_at: currentDate,
            updated_at: currentDate
          });
          if (newDoc) {
            //save the ad id in users profile in myads
            await Profile.findByIdAndUpdate({ _id: userId }, {
              $push: {
                my_ads: ObjectId(newDoc._id)
              }
            })
            const updatedDoc = await Generic.findByIdAndUpdate(
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
              distinct_id: userId,
              ad_id: newDoc._id,
              $latitude: ad_posted_location.coordinates[1],
              $longitude: ad_posted_location.coordinates[0],
            })
            return updatedDoc;
          }
        };
      };
    };
  };

  // Make Ads favourite  or Unfavourite 
  static async favouriteAds(bodyData, userId, ad_id) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    // Ad is find from Generics collection    if body contains "Favourite"
    if (bodyData.value == "Favourite") {
      const findAd = await Generic.findOne({
        _id: ad_id
      })
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
            'ad_expire_date': "$firstResult.ad_expire_date"
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
            // 'image_url': 1,
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
  static async getParticularAd(ad_id, query, user_id) {
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
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
    ])
    if (AdDetail.length == 0) {
      throw ({ status: 404, message: 'NOT_FOUND' });
    }
    const updateAdViews = await Generic.findOneAndUpdate({ _id: ad_id }, {
      $inc: { views: 1 }
    }, { new: true });
    const ownerDetails = await Profile.findById({ _id: updateAdViews.user_id }, {
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
      })
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
    return { AdDetail, ownerDetails, isAdFav };
  };

  // Get Premium Ads -- User is authentcated 1  1and Ads Are filtered
  static async getPremiumAdsService(userId, query) {
    // input from parameters (longitute , latitude , maxDistance ,page ,limit )
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page;
    if (pageVal == 0) pageVal = pageVal + 1
    let limitval = 10;
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
            "created_at": 1,
            'price': 1,
            "thumbnail_url": 1,
            // 'image_url': 1,
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
    let pageVal = +query.page;
    let limitval = +query.limit || 25;
    if (pageVal == 0) pageVal = pageVal + 1
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
            'title': 1,
            "created_at": 1,
            'price': 1,
            "thumbnail_url": 1,
            // 'image_url': 1,
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
  static async getRelatedAds(query, user_id) {
    let category = query.category;
    let sub_category = query.sub_category;
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = 100000;
    let pageVal = +query.page;
    if (pageVal == 0) pageVal = pageVal + 1
    let limitval = +query.limit || 10;

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
          // 'image_url': 1,
          "thumbnail_url": 1,
          'ad_posted_address': 1,
          'ad_status': 1,
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

    const featureAds = featureAdsFunction(RelatedAds[0].RecentAds, RelatedAds[0].PremiumAds)
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


  /* 
  DRAFT ADS API SERVICES HERE
  */

  // Create Draft Ad api
  static async draftAd(bodyData, userId) {
    // Generic AdDoc is created 
    const {
      ad_id,
      parent_id,
      category,
      sub_category,
      field,
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


    let age = age_func(SelectFields["Year of Purchase (MM/YYYY)"])
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    let adDoc = await Draft.create({
      _id: ObjectId(ad_id),
      parent_id,
      user_id: ObjectId(userId),
      category,
      sub_category,
      field,
      description,
      SelectFields,
      special_mention,
      title,
      price,
      product_age: age || 0,
      isPrime,
      ad_type: isPrime == false ? "Free" : "Premium",
      image_url,
      video_url,
      thumbnail_url,
      ad_present_location,
      ad_posted_location,
      ad_posted_address,
      ad_present_address,
      ad_status,
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
};