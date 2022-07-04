const mongoose = require("mongoose");
const User = require("../models/Profile/Profile");
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
function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class AdService {
  // DB Services to Create a Ad
  static async createAd(bodyData, userId) {
    console.log("Inside Ad Service");
    if (bodyData.category == "Pet") {
      console.log("Inside Pet in AdService");
      console.log(userId);
      console.log(bodyData)
      let adDoc = await Pet.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        animal: bodyData.animal,
        breed: bodyData.breed,
        condition: bodyData.condition,
        description: bodyData.description,
        special_mention: bodyData.special_mention,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
        ad_promoted_expire_date:bodyData.ad_promoted_expire_date,
        ad_status: bodyData.ad_status,
        ad_type: bodyData.ad_type,
        is_negotiable: bodyData.is_negotiable,
        is_ad_posted: bodyData.is_ad_posted,
      });
      console.log("here:" + adDoc);

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Vehicle") {
      console.log("Inside Vehicle in AdService");
      console.log(userId);
      const adDoc = await Vehicle.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        make: bodyData.make,
        model: bodyData.model,
        colour: bodyData.colour,
        condition: bodyData.condition,
        transmission: bodyData.transmission,
        year_of_make: bodyData.year_of_make,
        year_of_purchase: bodyData.year_of_purchase,
        mileage: bodyData.mileage,
        contact_of_owner: bodyData.contact_of_owner,
        accidental: bodyData.accidental,
        vehicle_registered_at: bodyData.vehicle_registered_at,
        vehicle_present_at: bodyData.vehicle_present_at,
        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,

        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
        ad_status: bodyData.ad_status,
        ad_type: bodyData.ad_type,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Housing") {
      console.log("Inside Housing in AdService");
      console.log(userId);
      const adDoc = await House.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        facing: bodyData.facing,
        dimension_length: bodyData.dimension_length,
        dimension_breadth: bodyData.dimension_breadth,
        area: bodyData.area,
        carpet_area: bodyData.carpet_area,
        beds: bodyData.beds,
        baths: bodyData.baths,
        furnishing_type: bodyData.furnishing_type,
        balconies: bodyData.balconies,
        gated_community: bodyData.gated_community,
        property_floor_no: bodyData.property_floor_no,
        number_of_floors: bodyData.number_of_floors,
        car_parking: bodyData.car_parking,
        bike_parking: bodyData.bike_parking,
        amenities: bodyData.amenities,
        nearly_by: bodyData.nearly_by,
        registration: bodyData.registration,
        distance_from_main_road: bodyData.distance_from_main_road,
        front_road: bodyData.front_road,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
        ad_status: bodyData.ad_status,
        ad_type: bodyData.ad_type,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Electronic") {
      console.log("Inside Electronic in AdService");
      console.log(userId);
      let adDoc = await Electronic.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        device: bodyData.device,
        brand: bodyData.brand,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "HomeAppliance") {
      console.log("Inside HomeAppliance in AdService");
      console.log(userId);
      let adDoc = await HomeAppliance.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        brand: bodyData.brand,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "KitchenAppliance") {
      console.log("Inside KitchenAppliance in AdService");
      console.log(userId);
      let adDoc = await KitchenAppliance.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        device: bodyData.device,
        brand: bodyData.brand,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Fashion") {
      console.log("Inside Fashion in AdService");
      console.log(userId);
      let adDoc = await Fashion.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        brand: bodyData.brand,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Sport") {
      console.log("Inside Sport in AdService");
      console.log(userId);
      let adDoc = await Sport.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        type: bodyData.type,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Furniture") {
      console.log("Inside Furniture in AdService");
      console.log(userId);
      let adDoc = await Furniture.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        colour: bodyData.colour,
        year: bodyData.year,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "ArtAndAntique") {
      console.log("Inside ArtAndAntique in AdService");
      console.log(userId);
      let adDoc = await ArtAndAntique.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        state: bodyData.state,

        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    } else if (bodyData.category == "Book") {
      console.log("Inside Book in AdService");
      console.log(userId);
      let adDoc = await Book.create({
        category: bodyData.category,
        sub_category: bodyData.sub_category,
        genre: bodyData.genre,
        special_mention: bodyData.special_mention,
        description: bodyData.description,
        tile: bodyData.tile,
        ad_present_location: bodyData.ad_present_location,
        ad_posted_location: bodyData.ad_posted_location,
        reported_ad_count: bodyData.reported_ad_count,
        reported_by: bodyData.reported_by,
        ad_expire_date: bodyData.ad_expire_date,
        ad_promoted: bodyData.ad_promoted,
        ad_promoted_date: bodyData.ad_promoted_date,
      });

      const updateUser = await User.findByIdAndUpdate(userId, {
        $push: {
          my_ads: {
            _id: adDoc._id,
          },
        },
      });
      console.log(adDoc);
      return adDoc["_doc"];
    }
  }

  // //DB Service to Get Profile By Phone Number

  // static async getProfile(bodyData) {
  //   console.log(bodyData);
  //   const { phone_number } = bodyData;
  //   let profileDoc = await User.findOne({
  //     phone_number: phone_number,
  //   });

  //   if (profileDoc) {
  //     return profileDoc;
  //   } else {
  //     return null;
  //   }
  // }

  // static async updateProfile(bodyData) {
  //   await User.updateOne(
  //     {
  //       _id: req.userId,
  //     },
  //     {
  //       name: bodyData.name,
  //       phone_number: bodyData.phone,
  //       country_code: bodyData.country_code,
  //       email: bodyData.email,
  //       date_of_birth: bodyData.date_of_birth,
  //       age: bodyData.age,
  //       gender: bodyData.gender,
  //       user_type: bodyData.user_type,
  //       language_preference: bodyData.language_preference,
  //       city: bodyData.city,
  //       about: bodyData.about,
  //       free_credit: bodyData.free_credit,
  //       premium_credit: bodyData.premium_credit,
  //       profile_url: bodyData.profile_url,
  //     }
  //   );

  //   const profile = await User.findOne({
  //     _id: req.userId,
  //   });
  //   return profile;
  // }
};
