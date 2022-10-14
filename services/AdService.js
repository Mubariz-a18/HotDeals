const Profile = require("../models/Profile/Profile");
const GlobalSearch = require("../models/GlobalSearch");
const ObjectId = require('mongodb').ObjectId;
const { track } = require('../services/mixpanel-service.js');
const mixpanel = require('mixpanel').init('a2229b42988461d6b1f1ddfdcd9cc8c3');
const Generic = require("../models/Ads/genericSchema");
const { currentDate, DateAfter30Days } = require("../utils/moment");
module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    })
    if (!findUsr) {
      // Mixpanel -- ad creation failed
      await track('ad creation failed !!', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      if (bodyData.ad_id) {
        const findAd = Generic.findOneAndUpdate({ _id: bodyData.ad_id },
          {
            $set: {
              ad_status: 'Selling',
              ad_expire_date: DateAfter30Days,
              created_at: currentDate,
              updated_at: currentDate,
            }
          })
      }
      // Generic AdDoc is created 
      else {
        const {
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
          ad_status,
          is_negotiable,
          is_ad_posted,
        } = bodyData
        let adDoc = await Generic.create({
          user_id: findUsr._id,
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
          ad_status,
          is_negotiable,
          is_ad_posted,
          created_at: currentDate,
          ad_expire_date: DateAfter30Days,
          updated_at: currentDate
        });
        // mixpanel track -- Ad create 
        await track('Ad creation succeed', {
          category: bodyData.category,
          distinct_id: adDoc._id,
          $latitude: bodyData.ad_posted_location.coordinates[1],
          $longitude: bodyData.ad_posted_location.coordinates[0],
        })
        const updateMyAdsInUser = await Profile.findByIdAndUpdate({ _id: userId }, {
          $push: {
            my_ads: ObjectId(adDoc._id)
          }
        })
        //Create new Ad in GlobalSearch Model 
        const createGlobalSearch = await GlobalSearch.create({
          ad_id: adDoc._id,
          category: bodyData.category,
          sub_category: bodyData.sub_category,
          title: bodyData.title,
          description: bodyData.description,
        });

        // Mixpanel track for global Search Keywords

        await track('global search keywords', {
          category: bodyData.category,
          distinct_id: createGlobalSearch._id,
          keywords: [bodyData.category, bodyData.sub_category, bodyData.title, bodyData.description]
        })
        return adDoc["_doc"];
      }
    }
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
      const myAdsList = await Generic.aggregate([
        {
          $match: { _id: { $in: findUsr.my_ads } }
        },
        {
          $facet: {
            "Selling": [
              { $match: { ad_status: "Selling" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  saved: 1,
                  views: 1,
                  isPrime: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  createdAt: 1,
                  ad_promoted_date: 1
                }
              }
            ],
            "Archived": [
              { $match: { ad_status: "Archive" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  saved: 1,
                  views: 1,
                  ad_Archive_Date: 1,
                }
              }
            ],
            "Drafts": [
              { $match: { ad_status: "Draft" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  ad_Draft_Date: 1,
                }
              }
            ],
            "Expired": [
              { $match: { ad_status: "Expired" } },
              {
                $project: {
                  _id: 1,

                  title: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  saved: 1,
                  views: 1,
                  ad_expire_date: 1,

                }
              }
            ]
          }
        },
      ]);
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
        return myAdsList;
      }

    }
  };

  // Updating the status of Ad from body  using $set in mongodb
  static async changeAdStatus(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
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
      // check if ad exist 
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
      else {
        // mixpanel track - when Status Of Ad changed 
        await track('ad status changed successfully !!', {
          distinct_id: userId,
          ad_id: ad_id,
          status: bodyData.status
        })

        if (bodyData.status == "ARCHIVED") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Archive", ad_Archive_Date: currentDate } },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        } else if (bodyData.status == "SOLD") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Sold" } },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "DELETE") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Deleted" } },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "PREMEIUM") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "PREMEIUM", ad_Premium_Date: currentDate, isPrime: true } },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "DRAFT") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Draft", ad_Draft_Date: currentDate } },
            { returnOriginal: false, new: true }
          )
          return adDoc;
        }
        else if (bodyData.status == "REPOSTED") {
          // only after payment is done 
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            {
              $set:
              {
                ad_status: "Reposted",
                ad_Reposted_Date: currentDate,
                is_Reposted: true
              }
            },
            { returnOriginal: true  }
          )
          return adDoc;
        };
      };
    };
  };

  // Make Ads favourite  or Unfavourite 
  static async favouriteAds(bodyData, userId, ad_id) {
    const findUser = await Profile.findOne({ _id: userId });
    if (!findUser) {
      await track('failed !! Make Ad favourite ', {
        distinct_id: userId,
        ad_id: ad_id,
        message: ` user_id : ${userId}  does not exist`
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      // mixpanel Track - when Ad is selected for favourite

      // Ad is find from Generics collection    if body contains "Favourite"
      if (bodyData.value == "Favourite") {
        const findAd = await Generic.findOne({
          _id: ad_id
        })
        if (!findAd) {
          await track('failed !! Make Ad favourite ', {
            distinct_id: userId,
            ad_id: ad_id,
            message: ` ad_id : ${ad_id}  does not exist`
          })
          throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        }
        else {
          //Ad _id is pushed in user`s profile (faviourite_ads)
          const makeFavAd = await Profile.findOneAndUpdate(
            { _id: userId },
            { $push: { favourite_ads: { _id: ad_id } } },
            { new: true }
          )
          const updateAd = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $inc: { saved: 1 } }
          )
          await track('Make Ad favourite successfully !! ', {
            distinct_id: userId,
            ad_id: ad_id
          })
          return findAd;
        }
      }
      // Ad is find from Generics collection if body contains "UnFavourite"  Ad _id is removed from  user`s profile (faviourite_ads)
      else if (bodyData.value == "UnFavourite") {
        const findAd = await Generic.findOne({
          _id: ad_id
        })
        if (!findAd) {
          await track('failed !! Make Ad favourite ', {
            distinct_id: userId,
            ad_id: ad_id,
            message: ` ad_id : ${ad_id}  does not exist`
          })
          throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        }
        else {
          const makeUnFavAd = await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { favourite_ads: ad_id } },
            { new: true }
          );
          // Generic collection is also updated with the count of saved favourite ads
          const updateAd = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $inc: { saved: -1 } }
          )
          await track('Removed Ad from Favourites successfully !! ', {
            distinct_id: userId,
            ad_id: ad_id
          })
          return {
            findAd
          };
        }
      }
    }
  };

  //Get Favourite Ads -- User is Authenticated and Aggregation is created with Profile Collection and Generics Colllections  
  static async getFavouriteAds(userId) {
    const userExist = await Profile.findOne({
      _id: userId
    });

    //-- $match is used to create a relation between User_id and Ads 
    // favourite ads are Fetched
    if (!userExist) {
      // mixpanel track -- failed to get favorite ads
      await track('failed to get favourite Ads ', {
        distinct_id: userId,
        message: ` user_id : ${userId}  does not exist`

      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      const getMyFavAds = await Generic.aggregate([
        {
          $match: { _id: { $in: userExist.favourite_ads } }
        },
      ]);

      // mixpanel - when get favourite ads
      await track('get favourite Ads !! ', {
        distinct_id: userId
      });

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

  // Delete Ads -- User is authentcated and base on the body ad is deleted
  static async deleteAds(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    // checking whether the ad exists or not
    if (!userExist) {
      // mix-panel Track for -Failed  Removing Ad
      await track(' failed to remove  Ad', {
        distinct_id: userId,
        ad_id: ad_id,
        message: ` user_id : ${userId}  does not exist`
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    else {
      //if exist checking the body whether it conataon : FAVOURITE or MY_ADS then ads are removed from user`s profile
      const findAd = await Generic.findOne({
        _id: ad_id, user_id: userId
      });
      if (!findAd) {
        // mix-panel Track for -Failed  Removing Ad
        await track(' failed to remove  Ad', {
          distinct_id: userId,
          ad_id: ad_id,
          message: `ad_id : ${ad_id}  does not exist`
        });
        throw ({ status: 404, message: 'AD_NOT_EXISTS' });
      }
      if (findAd) {
        if (bodyData.AD_SECTION == 'FAVOURITE') {
          const remove_fav_ad = await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { favourite_ads: ad_id } },
            { new: true }
          );
          return {
            message: "removed ad successfully", remove_fav_ad
          }
        }
        else if (bodyData.AD_SECTION == 'MY_ADS') {
          const remove_my_ad = await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { my_ads: ad_id } },
            { new: true }
          );
          // mix-panel Track for - Removing Ad
          await track(' ad removed', {
            distinct_id: userId,
            ad_id: ad_id
          })
          return {
            message: "removed ad successfully", remove_my_ad
          }
        }
      }
    }
  };

  // Get Detail from Ad --  user is authenticated - Aggregation is created between Profile and Generic 
  static async getAdDetails(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    // if user Exist-- and _ids are matched Ads is returned 
    if (!userExist) {
      await track('failed viewed ad', {
        distinct_id: userId,
        ad_id: ad_id
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const findAd = await Generic.aggregate([{
      $match: { _id: ObjectId(ad_id) }
    },
    ])

    if (findAd) {
      //Ad doc will be updated , veiw count is incremented
      const updateAd = await Generic.findByIdAndUpdate(
        { _id: ad_id },
        { $inc: { views: 1 } },
        { new: true }
      )
      const owner = await Profile.findById(
        { _id: updateAd.user_id }, {
        _id: 0,
        name: 1,
        // profile_url:0
      }
      );
      console.log(owner)

      // mix panel tack - when Particular ad is viewed 
      await track('viewed ad', {
        distinct_id: userId,
        ad_id: ad_id
      })
      //Mixpanel increment of user views count on ad view count
      mixpanel.people.increment(userId, 'views particular ad');
      return { updateAd, owner };
    }
  };

  // Get Premium Ads -- User is authentcated and Ads Are filtered
  static async getPremiumAdsService(userId, query) {
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page || 1;
    let limitval = +query.limit || 20;
    //  check if user exist 
    const userExist = await Profile.findOne({ _id: userId });
    //if not exist throw error
    if (!userExist) {
      await track('failed To get Premium Ads', {
        distinct_id: userId
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    //else find Premium ads byfiltering isPrime true
    else {
      // .limit  &  .skip for pagination
      const premiumAdsData = await Generic.aggregate([
        [
          {
            '$geoNear': {
              'near': { type: 'Point', coordinates: [+lng, +lat] },
              "distanceField": "dist.calculated",
              'maxDistance': maxDistance,
              "includeLocs": "dist.location",
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
            }
          },
          {
            '$project': {
              '_id': 1,
              'Seller_Id': 1,
              'Seller_Name': 1,
              'Seller_Joined': 1,
              'Seller_Image': 1,
              'category': 1,
              'sub_category': 1,
              'title': 1,
              'price': 1,
              'image_url': 1,
              'special_mention': 1,
              'description': 1,
              'reported': 1,
              'reported_by': 1,
              'ad_status': 1,
              'ad_type': 1,
              'ad_expire_date': 1,
              'ad_promoted': 1,
              'isPrime': 1,
              "dist": 1
            }
          },
          {
            '$match': {
              'isPrime': true,
              'ad_status': "Selling"
            }
          },

        ]
      ]).skip(pageVal * (limitval - 1)).limit(limitval)
      await track('get Premium Ads Successfully', {
        distinct_id: userId
      })
      return premiumAdsData;
    };
  };
  // Get Recent Ads  -- User is authentcated and Ads Are filtered
  static async getRecentAdsService(userId, query) {

    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page || 1;
    let limitval = +query.limit || 20;
    //  check if user exist 
    const userExist = await Profile.findOne({ _id: userId });
    //if not exist throw error
    if (!userExist) {
      await track('failed To get Recent Ads', {
        distinct_id: userId
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    //else find recent ads by filtering isPrime false
    else {
      // .limit  &  .skip for pagination
      const getRecentAds = await Generic.aggregate([
        [
          {
            '$geoNear': {
              'near': { type: 'Point', coordinates: [+lng, +lat] },
              "distanceField": "dist.calculated",
              'maxDistance': maxDistance,
              "includeLocs": "dist.location",
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
            }
          },
          {
            '$project': {
              '_id': 1,
              'Seller_Id': 1,
              'Seller_Name': 1,
              'Seller_Joined': 1,
              'Seller_Image': 1,
              'category': 1,
              'sub_category': 1,
              'title': 1,
              'price': 1,
              'image_url': 1,
              'special_mention': 1,
              'description': 1,
              'reported': 1,
              'reported_by': 1,
              'ad_status': 1,
              'ad_type': 1,
              'ad_expire_date': 1,
              'ad_promoted': 1,
              'isPrime': 1,
              "dist": 1
            }
          },
          {
            '$match': {
              'isPrime': false,
              'ad_status': "Selling"
            }
          },

        ]
      ]).skip(pageVal * (limitval - 1)).limit(limitval)
      await track('get recent Ads Successfully', {
        distinct_id: userId
      })
      return getRecentAds;
    };
  };
};