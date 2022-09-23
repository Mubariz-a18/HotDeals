const Profile = require("../models/Profile/Profile");
const GlobalSearch = require("../models/GlobalSearch");
const Generic = require("../models/Ads/genericSchema")
const ObjectId = require('mongodb').ObjectId;

// Moment is used for Date format ,current date ,or Specific Periods of time
var moment = require('moment');
moment().format()
var currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

var DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
console.log(DateAfter30Days)

var now = moment().format('YYYY-MM-DD HH:mm:ss');;
if (now > DateAfter30Days) {
  console.log("PAST")
} else {
  console.log("FUTURE")
}


module.exports = class AdService {
  // Create Ad  - if user is authenticated Ad is created in  GENERICS COLLECTION  and also the same doc is created for GLOBALSEARCH collection
  static async createAd(bodyData, userId) {
    console.log("Inside Ad Service", bodyData);

    const findUsr = await Profile.findOne({
      _id: ObjectId(userId)
    })
    console.log(findUsr);
    if (findUsr) {
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
        let adDoc = await Generic.create({
          user_id: findUsr._id,
          category: bodyData.category,
          sub_category: bodyData.sub_category,
          field: bodyData.field,
          description: bodyData.description,
          SelectFields: bodyData.SelectFields,
          special_mention: bodyData.special_mention,
          title: bodyData.title,
          price: bodyData.price,
          image_url: bodyData.image_url,
          ad_present_location: bodyData.ad_present_location,
          ad_posted_location: bodyData.ad_posted_location,
          ad_expire_date: DateAfter30Days,
          ad_status: bodyData.ad_status,
          is_negotiable: bodyData.is_negotiable,
          is_ad_posted: bodyData.is_ad_posted,
          created_at: currentDate,
          updated_at: currentDate,
          loc: bodyData.loc,
        });

        //Create new Ad in GlobalSearch Model 
        const createGlobalSearch = await GlobalSearch.create({
          ad_id: adDoc._id,
          category: bodyData.category,
          sub_category: bodyData.sub_category,
          title: bodyData.title,
          description: bodyData.description,
        });

        return adDoc["_doc"];
      }
    }
    else {
      res.send({
        statusCode: 403,
        message: "User Not found"
      })
    }
  }


  // Get my Ads -- user is authenticated from token and  Aggregation is of Generics and Profile is created -- based on the _id in profile and generics -ads are fetched  
  static async getMyAds(userId) {
    const user = await Profile.findOne({
      _id: ObjectId(userId)
    });
    console.log(user.my_ads);
    if (user) {
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
      return myAdsDocs;
    }
    else {
      res.send({
        statusCode: 400,
        message: "User Not Found"
      })
    }
  }

  // Updating the status of Ad from body  using $set in mongodb
  static async changeAdStatus(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    if (userExist) {
      const findAd = await Generic.findOne({
        _id: ad_id
      });
      if (findAd) {
        if (bodyData.status == "ARCHIVED") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Archive" } }
          )
          console.log("AD Status Changed" + adDoc);
          return adDoc;
        } else if (bodyData.status == "SOLD") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Sold" } }
          )
          console.log("AD Status Changed" + adDoc);
          return adDoc;
        }
        else if (bodyData.status == "DELETE") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "Deleted" } }
          )
          console.log("AD Status Changed" + adDoc);
          return adDoc;
        }
        else if (bodyData.status == "PREMEIUM") {
          const adDoc = await Generic.findByIdAndUpdate(
            { _id: ad_id },
            { $set: { ad_status: "PREMEIUM" } }
          )
          console.log("AD Status Changed" + adDoc);
          return adDoc;
        }
      }
      else {
        res.send({
          statusCode: 404,
          message: "Ad Not Found!!"
        })
      }
    }
    else {
      res.send({
        statusCode: 404,
        message: "User Not Found!!"
      })
    };
  };

  // Make Ads favourite  or Unfavourite 
  static async favouriteAds(bodyData, userId, ad_id) {
    console.log("I'm inside Favourite Ads!!")
    console.log(bodyData, userId, ad_id)

    // Ad is find from Generics collection
    //if body contains "Favourite"
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
        return makeFavAd;
      }
    }
    // Ad is find from Generics collection
    //if body contains "UnFavourite"
    //Ad _id is removed from  user`s profile (faviourite_ads)
    else if (bodyData.value == "Unfavourite") {
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
      return makeUnFavAd;
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
      ])
      return getMyFavAds
    }
    else {
      res.send({
        statusCode: 400,
        message: "No User Found"
      })
    }
  }


  // Delete Ads -- User is authentcated and base on the body ad is deleted
  static async deleteAds(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    // checking whether the ad exists or not 
    if (userExist) {
      const findAd = await Generic.findOne({
        _id: ad_id
      });
      //if exist checking the body whether it conataon : FAVOURITE or MY_ADS then ads are removed from user`s profile
      if (findAd) {
        if (bodyData.AD_SECTION == 'FAVOURITE') {
          const remove_fav_ad = await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { favourite_ads: ad_id } },
            { new: true }
          );
          return remove_fav_ad;
        }
        else if (bodyData.AD_SECTION == 'MY_ADS') {
          const remove_my_ad = await Profile.findOneAndUpdate(
            { _id: userId },
            { $pull: { my_ads: ad_id } },
            { new: true }
          );
          return remove_my_ad;
        }

      }
      else {
        res.send({
          message: "Ad Not Found",
          statusCode: 404
        })
      }
    }
    else {
      res.send({
        message: "User Not Found",
        statusCode: 404,
      })
    };
  };

  // Get Detail from Ad --  user is authenticated - Aggregation is created between Profile and Generic 

  static async getAdDetails(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    });
    // if user Exist-- and _ids are matched Ads is returned 
    if (userExist) {
      const findAd = await Generic.aggregate([
        {
          $match: { _id: ObjectId(ad_id) }
        },
      ])
    //Ad doc will be updated , veiw count is incremented
      const updateAd = await Generic.findByIdAndUpdate(
        { _id: ad_id },
        { $inc: { views: 1 } },
        { new: true }
      )
      return findAd;
    }
  }
};