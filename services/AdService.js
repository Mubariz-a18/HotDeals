const Profile = require("../models/Profile/Profile");
const Ads = require('../models/Ads/adSchema')
const GlobalSearch = require("../models/GlobalSearch");
const Pet = require("../models/Ads/petSchema");
const Vehicle = require("../models/Ads/vehicleSchema");
const House = require("../models/Ads/houseSchema");
const Electronic = require("../models/Ads/ElectronicSchema");
const HomeAppliance = require("../models/Ads/homeApplianceSchema");
const KitchenAppliance = require("../models/Ads/homeApplianceSchema");
const Fashion = require("../models/Ads/fashionSchema");
const Sport = require("../models/Ads/sportSchema");
const Furniture = require("../models/Ads/furnitureSchema");
const ArtAndAntique = require("../models/Ads/artsAndAntiqueSchema");
const Book = require("../models/Ads/bookSchema");
const Generic = require("../models/Ads/genericSchema")
const { isObjectIdOrHexString } = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const { getFormattedDate } = require('../utils/string')

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function formateDate(ISODate) {
  console.log("Inside function" + ISODate)
  let date = new Date(ISODate);
  if (date === undefined || date === null) return "";
  return date.toISOString().substring(0, 10);
}

module.exports = class AdService {
  static async createAd(bodyData, userId) {
    console.log("Inside Ad Service");

    let reported_by = {
      user_id: bodyData.reported_by.user_id,
      reason: bodyData.reported_by.reason,
      report_date: formateDate(bodyData.reported_by.report_date)
    }
    let adDoc = await Generic.create({
      category: bodyData.category,
      sub_category: bodyData.sub_category,
      field: bodyData.field,
      description: bodyData.description,
      special_mention: bodyData.special_mention,
      title: bodyData.title,
      price: bodyData.price,
      image_url: bodyData.image_url,
      ad_present_location: bodyData.ad_present_location,
      ad_posted_location: bodyData.ad_posted_location,
      reported_ad_count: bodyData.reported_ad_count,
      reported_by: reported_by,
      ad_expire_date: formateDate(bodyData.ad_expire_date),
      ad_promoted: bodyData.ad_promoted,
      ad_promoted_date: formateDate(bodyData.ad_promoted_date),
      ad_promoted_expire_date: formateDate(bodyData.ad_promoted_expire_date),
      ad_status: bodyData.ad_status,
      ad_type: bodyData.ad_type,
      is_negotiable: bodyData.is_negotiable,
      is_ad_posted: bodyData.is_ad_posted,
    });

    //Update my_ads field in Profile Model(Store created ad ID in Profile Model)
    const updateUser = await Profile.findByIdAndUpdate(userId, {
      $push: {
        my_ads: {
          _id: adDoc._id,
        },
      },
    });

    //Create new Ad in GlobalSearch Model 
    const createGlobalSearch = await GlobalSearch.create({
      ad_id: adDoc._id,
      category: bodyData.category,
      sub_category: bodyData.sub_category,
      title: bodyData.title,
    });


    return adDoc["_doc"];


    // if (bodyData.category == "Pet") {
    //   console.log("Inside Pet in AdService");
    //   // console.log(userId)

    //   //Create Pet Ad
    //   let adDoc = await Pet.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     animal: bodyData.animal,
    //     breed: bodyData.breed,
    //     condition: bodyData.condition,
    //     description: bodyData.description,
    //     special_mention: bodyData.special_mention,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //     ad_promoted_expire_date: bodyData.ad_promoted_expire_date,
    //     ad_status: bodyData.ad_status,
    //     ad_type: bodyData.ad_type,
    //     is_negotiable: bodyData.is_negotiable,
    //     is_ad_posted: bodyData.is_ad_posted,
    //     ad_status: "Selling"
    //   });


    //   //Update my_ads field in Profile Model(Store created ad ID in Profile Model)
    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });

    //   console.log(updateUser)


    //   //Create new Ad in GlobalSearch Model 
    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Vehicle") {
    //   console.log("Inside Vehicle in AdService");

    //   const adDoc = await Vehicle.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     make: bodyData.make,
    //     model: bodyData.model,
    //     colour: bodyData.colour,
    //     condition: bodyData.condition,
    //     transmission: bodyData.transmission,
    //     year_of_make: bodyData.year_of_make,
    //     year_of_purchase: bodyData.year_of_purchase,
    //     mileage: bodyData.mileage,
    //     contact_of_owner: bodyData.contact_of_owner,
    //     accidental: bodyData.accidental,
    //     vehicle_registered_at: bodyData.vehicle_registered_at,
    //     vehicle_present_at: bodyData.vehicle_present_at,
    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,

    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //     ad_status: bodyData.ad_status,
    //     ad_type: bodyData.ad_type,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Housing") {
    //   console.log("Inside Housing in AdService");

    //   const adDoc = await House.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     facing: bodyData.facing,
    //     dimension_length: bodyData.dimension_length,
    //     dimension_breadth: bodyData.dimension_breadth,
    //     area: bodyData.area,
    //     carpet_area: bodyData.carpet_area,
    //     beds: bodyData.beds,
    //     baths: bodyData.baths,
    //     furnishing_type: bodyData.furnishing_type,
    //     balconies: bodyData.balconies,
    //     gated_community: bodyData.gated_community,
    //     property_floor_no: bodyData.property_floor_no,
    //     number_of_floors: bodyData.number_of_floors,
    //     car_parking: bodyData.car_parking,
    //     bike_parking: bodyData.bike_parking,
    //     amenities: bodyData.amenities,
    //     nearly_by: bodyData.nearly_by,
    //     registration: bodyData.registration,
    //     distance_from_main_road: bodyData.distance_from_main_road,
    //     front_road: bodyData.front_road,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //     ad_status: bodyData.ad_status,
    //     ad_type: bodyData.ad_type,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Electronic") {
    //   console.log("Inside Electronic in AdService");

    //   let adDoc = await Electronic.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     device: bodyData.device,
    //     brand: bodyData.brand,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "HomeAppliance") {
    //   console.log("Inside HomeAppliance in AdService");

    //   let adDoc = await HomeAppliance.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     brand: bodyData.brand,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "KitchenAppliance") {
    //   console.log("Inside KitchenAppliance in AdService");

    //   let adDoc = await KitchenAppliance.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     device: bodyData.device,
    //     brand: bodyData.brand,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Fashion") {
    //   console.log("Inside Fashion in AdService");

    //   let adDoc = await Fashion.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     brand: bodyData.brand,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Sport") {
    //   console.log("Inside Sport in AdService");

    //   let adDoc = await Sport.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     type: bodyData.type,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Furniture") {
    //   console.log("Inside Furniture in AdService");

    //   let adDoc = await Furniture.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     colour: bodyData.colour,
    //     year: bodyData.year,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "ArtAndAntique") {
    //   console.log("Inside ArtAndAntique in AdService");

    //   let adDoc = await ArtAndAntique.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     state: bodyData.state,

    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //     loc: bodyData.loc,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
    // else if (bodyData.category == "Book") {
    //   console.log("Inside Book in AdService");

    //   let adDoc = await Book.create({
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     genre: bodyData.genre,
    //     special_mention: bodyData.special_mention,
    //     description: bodyData.description,
    //     title: bodyData.title,
    //     ad_present_location: bodyData.ad_present_location,
    //     ad_posted_location: bodyData.ad_posted_location,
    //     reported_ad_count: bodyData.reported_ad_count,
    //     reported_by: bodyData.reported_by,
    //     ad_expire_date: bodyData.ad_expire_date,
    //     ad_promoted: bodyData.ad_promoted,
    //     ad_promoted_date: bodyData.ad_promoted_date,
    //   });


    //   const updateUser = await Profile.findByIdAndUpdate(userId, {
    //     $push: {
    //       my_ads: {
    //         _id: adDoc._id,
    //       },
    //     },
    //   });


    //   const createGlobalSearch = await GlobalSearch.create({
    //     ad_id: adDoc._id,
    //     category: bodyData.category,
    //     sub_category: bodyData.sub_category,
    //     title: bodyData.title,
    //   });


    //   return adDoc["_doc"];


    // }
  }

  static async getMyAds(userId) {
    const user = await Profile.findOne({
      _id: userId
    })
    console.log(user.my_ads);
    if (user) {
      const myAdsDocs = await Generic.aggregate([
        {
          $match: { _id: { $in: user.my_ads } }
        },
        {
          $facet: {
            "Selling": [{ $match: { ad_status: "Selling" } }],
            "Archived": [{ $match: { ad_status: "Archive" } }],
            "Drafts": [{ $match: { ad_status: "Draft" } }]
          }
        },
      ])
      return myAdsDocs;
    }
    else{
      res.send({
        statusCode:400,
        message:"User Not Found"
      })
    }
  }

  static async changeAdStatus(bodyData, userId, ad_id) {
    const userExist = await Profile.findOne({
      _id: userId
    })
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
    }
  }

  static async favouriteAds(bodyData, userId, ad_id) {
    console.log("I'm inside Favourite Ads!!")
    console.log(bodyData, userId, ad_id)

    if (bodyData.value == "Favourite") {
      const findAd = await Generic.findOne({
        _id: ad_id
      })
      if (findAd) {
        const makeFavAd = await Profile.findOneAndUpdate(
          { _id: userId },
          { $push: { favourite_ads: { _id: ad_id } } },
          { new: true }
        )
        console.log(makeFavAd)
        return makeFavAd;
      }
    }
    else if (bodyData.value == "Unfavourite") {
      const makeUnFavAd = await Profile.findOneAndUpdate(
        { _id: userId },
        { $pull: { favourite_ads: ad_id } },
        { new: true }
      );
      return makeUnFavAd;
    }
  }

  static async getFavouriteAds(userId) {
    const userExist = await Profile.findOne({
      _id: userId
    })
    if (userExist) {
      const getMyFavAds = await Generic.aggregate([
        {
          $match: { _id: { $in: userExist.favourite_ads } }
        },
      ])
      return getMyFavAds
    }
    else{
      res.send({
        statusCode:400,
        message:"No User Found"
      })
    }
  }
};