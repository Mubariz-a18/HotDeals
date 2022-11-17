const Profile = require("../models/Profile/Profile");
const ObjectId = require('mongodb').ObjectId;
const { track } = require('../services/mixpanel-service.js');
const Generic = require("../models/Ads/genericSchema");
const { currentDate, DateAfter30Days, Ad_Historic_Duration, age_func } = require("../utils/moment");
const { creditDeductFuntion } = require("./CreditService");
const { createGlobalSearch } = require("./GlobalSearchService");

module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    // check if user exist or not
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    })
    //if usere doesnot exist throw error 
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
        Generic.findOneAndUpdate({ _id: bodyData.ad_id },
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
          ad_present_address,
          ad_status,
          is_negotiable,
          is_ad_posted,
        } = bodyData
        let age = age_func(SelectFields["Year of Purchase (MM/YYYY)"])

        // create an Ad document in generics collection with body 
        const _id = ObjectId()
        const creditParams = { isPrime, _id, userId, category }
        const balance = await creditDeductFuntion(creditParams)

        if (balance.message == "Empty_Credits") {
          throw ({ status: 401, message: 'NOT_ENOUGH_CREDITS' })
        }
        else if (balance.message == "Deducted_Successfully") {
          let adDoc = await Generic.create({
            _id: _id,
            user_id: findUsr._id,
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
            ad_present_location,
            ad_posted_location,
            ad_posted_address,
            ad_present_address,
            ad_status,
            is_negotiable,
            is_ad_posted,
            created_at: currentDate,
            ad_expire_date: DateAfter30Days,
            updated_at: currentDate,
          });
          // mixpanel track -- Ad create 
          await track('Ad creation succeed', {
            category: bodyData.category,
            distinct_id: adDoc._id,
            $latitude: bodyData.ad_posted_location.coordinates[1],
            $longitude: bodyData.ad_posted_location.coordinates[0],
          })
          //save the ad_id in users profile in myads
          await Profile.findByIdAndUpdate({ _id: userId }, {
            $push: {
              my_ads: ObjectId(adDoc._id)
            }
          });
          const adId = adDoc._id
          const body = {adId,
            category,
            sub_category,
            title,
            description,
            ad_posted_address,
            SelectFields
          }
          await createGlobalSearch(body)
          return adDoc["_doc"];
        }
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
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  saved: 1,
                  views: 1,
                  isPrime: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  created_at: 1,
                  ad_Premium_Date: 1
                }
              }
            ],
            "Archive": [
              { $match: { ad_status: "Archive" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
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
                  description: 1,
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
                  description: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                  saved: 1,
                  views: 1,
                  ad_expire_date: 1,
                }
              }
            ],
            "Deleted": [
              { $match: { ad_status: "Delete" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  ad_Deleted_Date: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] }
                }
              }
            ],
            "Reposted": [
              { $match: { ad_status: "Reposted" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  ad_Reposted_Date: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
                }
              }
            ],
            "Sold": [
              { $match: { ad_status: "Sold" } },
              {
                $project: {
                  _id: 1,
                  title: 1,
                  description: 1,
                  ad_Sold_Date: 1,
                  image_url: { $arrayElemAt: ["$image_url", 0] },
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
    // check if user exist 
    const findUser = await Profile.findOne({ _id: userId });
    //if user doesnt exist throw error 
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
          // save the ads ino favourite ads list in user profile
          await Profile.updateOne(
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
          await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $inc: { saved: 1 } }
          )
          // mixpanel track make Ad favourite
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
          await Profile.findOneAndUpdate(
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
          return {
            findAd
          };
        }
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
      const getMyFavAds = await Profile.aggregate([
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
            'ad_id': '$firstResult._id',
            'category': '$firstResult.category',
            'title': '$firstResult.title',
            'price': '$firstResult.price',
            'image_url': '$firstResult.image_url',
            'description': '$firstResult.description',
            'ad_status': '$firstResult.ad_status',
            'ad_promoted': '$firstResult.ad_promoted',
            'isPrime': '$firstResult.isPrime'
          }
        },
        // {
        //   $match:
        //     { "category": query.category },
        // },
        {
          $sort: {
            "favourite_ads.ad_Favourite_Date": -1
          }
        },
        {
          '$project': {
            'ad_id': 1,
            '_id': 0,
            'category': 1,
            'title': 1,
            'price': 1,
            'image_url': 1,
            'description': 1,
            'ad_status': 1,
            'favourite_ads.ad_Favourite_Date': 1,
          }
        }
      ]
      )
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
    // check if user exists
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
      // check if body contains "FAVOURITE" 
      if (bodyData.AD_SECTION == 'FAVOURITE') {
        const findAd = await Generic.findOne({
          _id: ad_id
        });
        // if ad exist update users profile ( remove ad_id from favourite_ad)
        if (findAd) {
          await Profile.findOneAndUpdate(
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
          // mix-panel Track for - Removing Ad
          await track(' ad removed', {
            distinct_id: userId,
            ad_id: ad_id
          })
          return "AD_REMOVED_SUCCESSFULLY"
        }
        else {
          throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        }
      }
      // if body contains "MY_ADS" remove ad from My_ads
      else if (bodyData.AD_SECTION == 'MY_ADS') {
        const findAd = await Generic.findOne({
          _id: ad_id, user_id: userId
        });
        // if ad exist update users profile ( remove ad_id from m_ads)
        if (findAd) {
          await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { my_ads: ad_id } },
            { new: true }
          );
          //updating adstatus to Delete and ad_Delete_Date to current Date
          findAd.ad_status = "Delete"
          findAd.ad_Deleted_Date = currentDate
          findAd.ad_Historic_Duration_Date = Ad_Historic_Duration
          findAd.save()
          // mix-panel Track for - Removing Ad
          await track(' ad removed', {
            distinct_id: userId,
            ad_id: ad_id
          })
          return "AD_REMOVED_SUCCESSFULLY"
        }
        else {
          // mix-panel Track for -Failed  Removing Ad
          await track(' failed to remove  Ad', {
            distinct_id: userId,
            ad_id: ad_id,
            message: `ad_id : ${ad_id}  does not exist`
          });
          throw ({ status: 404, message: 'AD_NOT_EXISTS' });
        };
      };
    };
  };

  // Get particular Ad Detail with distance and user details
  static async getParticularAd(ad_id, query) {
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = 100000;
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
          'category': 1,
          'sub_category': 1,
          'title': 1,
          'views': 1,
          'saved': 1,
          'price': 1,
          'image_url': 1,
          'SelectFields': 1,
          'special_mention': 1,
          'description': 1,
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
      created_date: 1
    })
    // mixpanel -- track  get Particular ad ads
    await track('get Particular ad ads', {
      distinct_id: ad_id,
      message: `viewed ${ad_id}`
    })
    return { AdDetail, ownerDetails };
  };

  // Get Premium Ads -- User is authentcated and Ads Are filtered
  static async getPremiumAdsService(userId, query) {
    // input from parameters (longitute , latitude , maxDistance ,page ,limit )
    let lng = +query.lng;
    let lat = +query.lat;
    let maxDistance = +query.maxDistance;
    let pageVal = +query.page;
    if (pageVal == 0) pageVal = pageVal + 1
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
              'Seller_Id': 1,
              'Seller_Name': 1,
              'Seller_Joined': 1,
              'Seller_Image': 1,
              "Seller_verified": 1,
              "Seller_recommended": 1,
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
              "created_at": 1,
              'ad_expire_date': 1,
              'ad_promoted': 1,
              'isPrime': 1,
              "dist": 1
            }
          },
          {
            $match: {
              isPrime: true,
              ad_status: "Selling"
            }
          },
          {
            $sort: {
              "created_at": -1,
              "dist.calculated": 1,
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
      // mix panel track for get premium ads 
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
    let pageVal = +query.page;
    let limitval = +query.limit || 20;
    if (pageVal == 0) pageVal = pageVal + 1
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
      const getRecentAds = await Generic.aggregate([
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
              'Seller_Id': 1,
              'Seller_Name': 1,
              'Seller_Joined': 1,
              'Seller_Image': 1,
              "Seller_verified": 1,
              "Seller_recommended": 1,
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
              "created_at": 1,
              'ad_expire_date': 1,
              'ad_promoted': 1,
              'isPrime': 1,
              "dist": 1
            }
          },
          {
            $match: {
              isPrime: false,
              ad_status: "Selling"
            }
          },
          {
            $sort: {
              "created_at": -1,
              "dist.calculated": 1,
              "Seller_verified": -1,
              "Seller_recommended": -1,
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
      //mix panel track get recent ads 
      await track('get recent Ads Successfully', {
        distinct_id: userId
      })
      return getRecentAds;
    };
  };

  static async getMyAdDetails(ad_id, user_id) {
    const userExist = await Profile.findById({ _id: user_id });
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const myAdDetail = await Generic.findOne({ _id: ad_id }, {
      '_id': 1,
      "user_id": 1,
      'category': 1,
      'sub_category': 1,
      'title': 1,
      'views': 1,
      'saved': 1,
      'price': 1,
      'image_url': 1,
      "video_url": 1,
      'SelectFields': 1,
      'special_mention': 1,
      'description': 1,
      'ad_status': 1,
      'ad_type': 1,
      "ad_posted_address": 1,
      "ad_present_address": 1,
      'created_at': 1,
      'isPrime': 1,
    });
    const ownerDetails = await Profile.findById({ _id: myAdDetail.user_id }, {
      _id: 1,
      name: 1,
      profile_url: 1,
      created_date: 1
    })
    // mixpanel -- track  get Particular ad ads
    await track('get Particular ad ads', {
      distinct_id: user_id,
      message: ` user_id : ${user_id}  viewd ${ad_id}`
    })
    return {myAdDetail , ownerDetails}
  };
};