const Profile = require("../models/Profile/Profile");
const GlobalSearch = require("../models/GlobalSearch");
const ObjectId = require('mongodb').ObjectId;
const {track} = require('../services/mixpanel-service.js');
const mixpanel = require('mixpanel').init('a2229b42988461d6b1f1ddfdcd9cc8c3');
const {currentDate,DateAfter30Days} = require("../utils/moment");
const Generic = require("../models/Ads/genericSchema");

module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    })
    if (!findUsr){
      // Mixpanel -- ad creation failed
      await track('ad creation failed !!', { 
        distinct_id: userId,
      })
      throw ({ status: 404, message : 'USER_NOT_EXISTS'})
    }
    else{
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
          image_url,
          ad_present_location,
          ad_posted_location,
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
          image_url,
          ad_present_location,
          ad_posted_location,
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
          distinct_id: adDoc._id ,
          $latitude: bodyData.ad_posted_location.coordinates[1],
          $longitude: bodyData.ad_posted_location.coordinates[0],
        })
        const updateMyAdsInUser = await Profile.findByIdAndUpdate({_id:userId},{
          $push :{
            my_ads :ObjectId(adDoc._id)
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
          distinct_id: createGlobalSearch._id ,
          category: bodyData.category,
          sub_category: bodyData.sub_category,  
        })
        return adDoc["_doc"];
      }
    }
  }


  // Get my Ads -- user is authenticated from token and  Aggregation is of Generics and Profile is created -- based on the _id in profile and generics -ads are fetched  
  static async getMyAds(userId) {
   
    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    });

    if(!findUsr){
      // mixpanel -- track failed get my ads
      await track('failed !! get my ads', { 
        distinct_id: userId,
        message :"failed to load My Ads"
      })
      throw ({ status: 404, message : 'USER_NOT_EXISTS'})
    }
    else{
      const myAdsDocs = await Generic.aggregate([
        {
          $match: { _id: { $in: user.my_ads } }
        },
        {
          $facet: {
            "Selling": [
              { $match: { ad_status: "Selling" } },
              {
                $project: {
                  _id: 1,
                  category: 1,
                  sub_category: 1,
                  field: 1,
                  description: 1,
                  special_mention: 1,
                  title: 1,
                  saved: 1,
                  views: 1,
                  createdAt: 1,
                }
              }
            ],
            "Archived": [
              { $match: { ad_status: "Archive" } },
              {
                $project: {
                  _id: 1,
                  category: 1,
                  sub_category: 1,
                  field: 1,
                  description: 1,
                  special_mention: 1,
                  title: 1,
                  saved: 1,
                  views: 1,
                  createdAt: 1,
                }
              }
            ],
            "Drafts": [
              { $match: { ad_status: "Draft" } },
              {
                $project: {
                  _id: 1,
                  category: 1,
                  sub_category: 1,
                  field: 1,
                  description: 1,
                  special_mention: 1,
                  title: 1,
                  saved: 1,
                  views: 1,
                  createdAt: 1,
                }
              }
            ]
          }
        },
      ]);
      if(!myAdsDocs){
        throw ({ status: 404, message : 'ADS_NOT_EXISTS'})
      }
      else {
      // mixpanel track for Get My Ads
      await track('get my ads', { 
        distinct_id: userId
      });
        return myAdsDocs;
      }

      
    }
  }

  // Updating the status of Ad from body  using $set in mongodb
  static async changeAdStatus(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    if(!userExist){
            // mixpanel -- track failed to chane ad status 
            await track('failed !! to chaange ad status', { 
              distinct_id: userId,
              ad_id:ad_id,
              status : bodyData.status
            })
            throw ({ status: 404, message : 'USER_NOT_EXISTS'})
    }
    else{
          const findAd = await Generic.findOne({
            _id: ad_id
          }); 
          console.log(findAd)
          if(!findAd){
            await track('failed !! to chaange ad status', { 
              distinct_id: userId,
              ad_id:ad_id,
              status : bodyData.status
            }) 
            throw ({ status: 404, message : 'AD_NOT_EXISTS'})
          }
        else {
              // mixpanel track - when Status Of Ad changed 
              await track('ad status changed', { 
                distinct_id: userId,
                ad_id:ad_id,
                status : bodyData.status
               })

            if (bodyData.status == "ARCHIVED") {
              const adDoc = await Generic.findByIdAndUpdate(
                { _id: ad_id },
                { $set: { ad_status: "Archive" } } , 
                {returnOriginal :false , new :true}
              )
              return adDoc;
            } else if (bodyData.status == "SOLD") {
              const adDoc = await Generic.findByIdAndUpdate(
                { _id: ad_id },
                { $set: { ad_status: "Sold" } }, 
                {returnOriginal :false , new :true}
              )
              return adDoc;
            }
            else if (bodyData.status == "DELETE") {
              const adDoc = await Generic.findByIdAndUpdate(
                { _id: ad_id },
                { $set: { ad_status: "Deleted" } }, 
                {returnOriginal :false , new :true}
              )
              return adDoc;
            }
            else if (bodyData.status == "PREMEIUM") {
              // only after payment is done 
              const adDoc = await Generic.findByIdAndUpdate(
                { _id: ad_id },
                { $set: { ad_status: "PREMEIUM" } }, 
                {returnOriginal :false , new :true}
              )
              return adDoc;
            };
          };
       };
      };

  // Make Ads favourite  or Unfavourite 
  static async favouriteAds(bodyData, userId, ad_id) {
    console.log("I'm inside Favourite Ads!!")
    const findUser = await Profile.findOne({ _id: userId });
    if (findUser) {
      // mixpanel Track - when Ad is selected for favourite
      await track('Make Ad favourite ', {
        distinct_id: userId,
        ad_id: ad_id
      })
      // Ad is find from Generics collection    if body contains "Favourite"
      if (bodyData.value == "Favourite") {
        const findAd = await Generic.findOne({
          _id: ad_id
        })
        if (findAd) {
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

          return {
            type: "success",
            statusCode: 200,
            findAd
          };
        }
      }
      // Ad is find from Generics collection if body contains "UnFavourite"  Ad _id is removed from  user`s profile (faviourite_ads)
      else if (bodyData.value == "UnFavourite") {
        const findAd = await Generic.findOne({
          _id: ad_id
        })
        if (findAd) {
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
          return {
            type: "success",
            statusCode: 200,
            findAd
          };
        }
      }
    } else {
      if (bodyData.value == 'Favourite') {
        await track('failed to make ad favourites ', {
          distinct_id: userId,
          ad_id: ad_id
        })
      } else {
        await track('failed to remove ad from favourites ', {
          distinct_id: userId,
          ad_id: ad_id
        })
      }
      return {
        type: "Error",
        message: "user not found",
        statusCode: 403
      }
    }
  }

  //Get Favourite Ads -- User is Authenticated and Aggregation is created with Profile Collection and Generics Colllections  
  static async getFavouriteAds(userId) {
    const userExist = await Profile.findOne({
      _id: userId
    });

    //-- $match is used to create a relation between User_id and Ads 
    // favourite ads are Fetched
    if (userExist) {
      const getMyFavAds = await Generic.aggregate([
        {
          $match: { _id: { $in: userExist.favourite_ads } }
        },
      ]);

      // mixpanel - when get favourite ads
      await track('get favourite Ads ', {
        distinct_id: userId
      });

      if(getMyFavAds.length == 0){
        return {
          type:"No Ads",
          statusCode:200,
          message:"No Ads found"
        };
      }
      return {
        type:"success",
        statusCode:200,
        getMyFavAds
      };
    }
    else {
      // mixpanel track -- failed to get favorite ads
      await track('failed to get favourite Ads ', {
        distinct_id: userId
      });

      return{ 
        type:"Error",
        statusCode: 403,
        message: "User not Found"
      };
    };
  };


  // Delete Ads -- User is authentcated and base on the body ad is deleted
  static async deleteAds(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    // checking whether the ad exists or not
    if(!userExist){
      // mix-panel Track for -Failed  Removing Ad
      await track(' failed to remove  Ad', { 
        distinct_id: userId,
        ad_id:ad_id
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    } 
    else {
      //if exist checking the body whether it conataon : FAVOURITE or MY_ADS then ads are removed from user`s profile
      const findAd = await Generic.findOne({
        _id: ad_id
      });
      if(!findAd){
        // mix-panel Track for -Failed  Removing Ad
        await track(' failed to remove  Ad', { 
          distinct_id: userId,
          ad_id:ad_id
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
            type:"success",
            message:"removed ad successfully",
            statusCode:200,
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
            ad_id:ad_id
          })
    
          return findAd
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
      // mixpanel get ad detail failed
      await track('viewed ad failed', {
        distinct_id: userId,
        ad_id: ad_id
      })
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const findAd = await Generic.aggregate([{
      $match: { _id: ObjectId(ad_id) }
    },
    ])
    if (!findAd) {
      await track('viewed ad failed', {
        distinct_id: userId,
        ad_id: ad_id
      })
      throw ({ status: 404, message: 'AD_NOT_EXISTS' });
    }
    else {
      //Ad doc will be updated , veiw count is incremented
      const updateAd = await Generic.findByIdAndUpdate(
        { _id: ad_id },
        { $inc: { views: 1 } },
        { new: true }
      )
      // mix panel tack - when Particular ad is viewed 
      await track('viewed ad', {
        distinct_id: userId,
        ad_id: ad_id
      })
      //Mixpanel increment of user views count on ad view count
      mixpanel.people.increment(userId, 'views particular ad');
      return updateAd;
    }
  }
};