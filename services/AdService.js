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

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class AdService {
  // DB Services to Create a Ad
  static async createAd(bodyData, userId) {
    console.log("Inside Ad Service");
    // console.log(req.body)

    //Create Pet Ad
    // if (bodyData.category == "Pet") {
    console.log("inside ad")
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
      reported_by: bodyData.reported_by,
      ad_expire_date: bodyData.ad_expire_date,
      ad_promoted: bodyData.ad_promoted,
      ad_promoted_date: bodyData.ad_promoted_date,
      ad_promoted_expire_date: bodyData.ad_promoted_expire_date,
      ad_status: bodyData.ad_status,
      ad_type: bodyData.ad_type,
      is_negotiable: bodyData.is_negotiable,
      is_ad_posted: bodyData.is_ad_posted,
    });
    // console.log(adDoc)
    return adDoc;
    // }


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
    console.log(userId)
    const user = await Profile.findOne({
      _id: "62cd1f1bf05785a63e6ecfa3"
    })
    // console.log(user);
    console.log(user.my_ads);
    if (user) {
      const myAds = await Ads.find({
        _id: ["62bd5fc86bac1c0ccd2ed887", "62bd5f98de40679df0c71f66", "62bd5efdf53b77391368133e", "62bd5d1fe53e829fb6b6673a", "62bd5cbd34fb2ca9e83dcab7", "62cd23a9a6194e2c7e041949", "62cd2685744b3487593c0ef7", "62ce4a148f00523bbf002c47", "62ce4a82e2d2c7e512366d6c", "62ce4a9d027a1438b196e141"]
      })

      // console.log(myAds)
      // const myAdsDocs = await Ads.aggregate([
      //   // {
      //   //   $match: { _id: { $in: user.my_ads } }
      //   // },
      //   {
      //     $match: {
      //       _id: {
      //         $in: [
      //           ObjectId("62cd23a9a6194e2c7e041949"),
      //           ObjectId("62cd2685744b3487593c0ef7"),
      //           ObjectId("62ce4a148f00523bbf002c47"),
      //           ObjectId("62ce4a82e2d2c7e512366d6c"),
      //           ObjectId("62ce4a9d027a1438b196e141")
      //         ]
      //       }
      //     }
      //   },
      // {
      //   $facet: {
      //     "Selling": [{ $match: { ad_status: "Selling" } }],
      //     "Archived": [{ $match: { ad_status: "Archive" } }],
      //     "Drafts": [{ $match: { ad_status: "Draft" } }]
      //   }
      // },
      // ])
      // console.log(myAdsDocs)
      return myAds;
    }
  }

  static async changeAdStatus(bodyData, userId, ad_id) {
    console.log(ad_id)

    const user = await Profile.findOne({
      _id: userId
    })
    if (user) {

      if (bodyData.status == "ARCHIVED") {
        const findAd = await Ads.find({
          _id: "62b59d330f1f77fabbb9d258"
        });
        console.log("Ad Found" + findAd)
        const adDoc = await Book.findByIdAndUpdate(
          { _id: "62b59d330f1f77fabbb9d258" },
          { $set: { ad_status: "Delete" } }
        )
        console.log("AD Status Changed" + adDoc)
        // return adDoc;

      }
      else if (bodyData.status == "SOLD") {
        const findAd = await Ads.find({
          _id: "62b59d330f1f77fabbb9d258"
        });
        console.log("Ad Found" + findAd)
        const adDoc = await Book.findByIdAndUpdate(
          { _id: "62b59d330f1f77fabbb9d258" },
          { $set: { ad_status: "Delete" } }
        )
        console.log("AD Status Changed" + adDoc)
        // return adDoc;
      }
      else if (bodyData.status == "DELETE") {
        const findAd = await Ads.find({
          _id: "62b59d330f1f77fabbb9d258"
        });
        console.log("Ad Found" + findAd)
        const adDoc = await Book.findByIdAndUpdate(
          { _id: "62b59d330f1f77fabbb9d258" },
          { $set: { ad_status: "Delete" } }
        )
        console.log("AD Status Changed" + adDoc)
        // return adDoc;
      }
      else if (bodyData.status == "PREMEIUM") {
        const findAd = await Ads.find({
          _id: "62b59d330f1f77fabbb9d258"
        });
        console.log("Ad Found" + findAd)
        const adDoc = await Book.findByIdAndUpdate(
          { _id: "62b59d330f1f77fabbb9d258" },
          { $set: { ad_status: "Delete" } }
        )
        console.log("AD Status Changed" + adDoc)
        // return adDoc;
      }
    }
    else {

    }
  }

  static async favouriteAds(bodyData, userId, ad_id) {
    console.log("I'm inside Favourite Ads!!")

    if (bodyData.value == "Favourite") {
      const favAds = await Ads.findOneAndUpdate(
        { _id: "62b59d330f1f77fabbb9d258" },
        { $set: { is_ad_favourite: "true" } },
        { new: true }
      )
      // const Ad = Ads.findOne({
      //   _id: ""
      // })
      // if (Ad) {
      const makeFavAd = await Profile.findOneAndUpdate(
        { _id: "62c2ae90f5aae83ced255735" },
        { $push: { favourite_ads: { _id: "62b59d3b0f1f77fabbb9d25b" } } },
        { new: true }
      )
      console.log(makeFavAd)
      return makeFavAd;
      // }
    }
    else if (bodyData.value == "Unfavourite") {
      console.log(bodyData.value)
      const UnfavAds = await Ads.findOneAndUpdate(
        { _id: "62b59d330f1f77fabbb9d258" },
        { $set: { is_ad_favourite: "false" } },
        { new: true }
      )
      const makeUnFavAd = await Profile.findOneAndUpdate(
        { _id: "62c2ae90f5aae83ced255735" },
        { $pull: { favourite_ads: ObjectId("62b59d330f1f77fabbb9d258") } },
        { new: true }
      );
      return makeUnFavAd;
    }
  }

};