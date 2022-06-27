const Pet = require("../../../models/Ads/petSchema");
const Vehicle = require("../../../models/Ads/vehicleSchema");
const House = require("../../../models/Ads/houseSchema");
const Electronic = require("../../../models/Ads/ElectronicSchema");
const HomeAppliance = require("../../../models/Ads/homeApplianceSchema");
const KitchenAppliance = require("../../../models/Ads/homeApplianceSchema");
const Fashion = require("../../../models/Ads/fashionSchema");
const Sport = require("../../../models/Ads/sportSchema");
const Furniture = require("../../../models/Ads/furnitureSchema");
const ArtAndAntique = require("../../../models/Ads/artsAndAntiqueSchema");
const Book = require("../../../models/Ads/bookSchema");
const User = require("../../../models/Profile/userProfile");

exports.createAd = async function (req, res) {
  try {
    console.log(req.userId);

    let category = req.body.category;

    if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
      res.status(400).send({ error: "please provide data!" });
    } else {
      if (category == "Pet") {
        console.log("Inside Pet If");

        const newAd = await new Pet({
          category: category,
          sub_category: req.body.sub_category,
          animal: req.body.animal,
          breed: req.body.breed,
          condition: req.body.condition,
          description: req.body.description,
          special_mentions: req.body.special_mention,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,

          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });

        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Vehicle") {
        console.log("Inside Vehicle else If");

        let reported_by = req.body.reported_by;
        console.log(reported_by);
        console.log(req.body);
        const newAd = await new Vehicle({
          category: req.body.category,
          sub_category: req.body.sub_category,
          make: req.body.make,
          model: req.body.model,
          colour: req.body.colour,
          condition: req.body.condition,
          transmission: req.body.transmission,
          year_of_make: req.body.year_of_make,
          year_of_purchase: req.body.year_of_purchase,
          mileage: req.body.mileage,
          contact_of_owner: req.body.contact_of_owner,
          accidental: req.body.accidental,
          vehicle_registered_at: req.body.vehicle_registered_at,
          vehicle_present_at: req.body.vehicle_present_at,
          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,

          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Housing") {
        console.log("Inside Husing else If");
        console.log(req.body);
        const newAd = await new House({
          category: req.body.category,
          sub_category: req.body.sub_category,
          facing: req.body.facing,
          dimension_length: req.body.dimension_length,
          dimension_breadth: req.body.dimension_breadth,
          area: req.body.area,
          carpet_area: req.body.carpet_area,
          beds: req.body.beds,
          baths: req.body.baths,
          furnishing_type: req.body.furnishing_type,
          balconies: req.body.balconies,
          gated_community: req.body.gated_community,
          property_floor_no: req.body.property_floor_no,
          number_of_floors: req.body.number_of_floors,
          car_parking: req.body.car_parking,
          bike_parking: req.body.bike_parking,
          amenities: req.body.amenities,
          nearly_by: req.body.nearly_by,
          registration: req.body.registration,
          distance_from_main_road: req.body.distance_from_main_road,
          front_road: req.body.front_road,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Electronic") {
        console.log("Inside Electronic else If");
        console.log(req.body);
        const newAd = await new Electronic({
          category: req.body.category,
          sub_category: req.body.sub_category,
          device: req.body.device,
          brand: req.body.brand,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "HomeAppliance") {
        console.log("Inside HomeApplance else If");
        console.log(req.body);
        const newAd = await new HomeAppliance({
          category: req.body.category,
          sub_category: req.body.sub_category,
          brand: req.body.brand,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "KitchenAppliance") {
        console.log("Inside KitchenApplance else If");
        console.log(req.body);
        const newAd = await new KitchenAppliance({
          category: req.body.category,
          sub_category: req.body.sub_category,
          device: req.body.device,
          brand: req.body.brand,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Fashion") {
        console.log("Inside fashion else If");
        console.log(req.body);
        const newAd = await new Fashion({
          category: req.body.category,
          sub_category: req.body.sub_category,
          brand: req.body.brand,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Sport") {
        console.log("Inside sports else If");
        console.log(req.body);
        const newAd = await new Sport({
          category: req.body.category,
          sub_category: req.body.sub_category,
          type: req.body.type,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Furniture") {
        console.log("Inside furniture else If");
        console.log(req.body);
        const newAd = await new Furniture({
          category: req.body.category,
          sub_category: req.body.sub_category,
          colour: req.body.colour,
          year: req.body.year,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "ArtAndAntique") {
        console.log("Inside ArtAndAntique else If");
        console.log(req.body);
        const newAd = await new ArtAndAntique({
          category: req.body.category,
          sub_category: req.body.sub_category,
          state: req.body.state,

          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      } else if (category == "Book") {
        console.log("Inside Book else If");
        console.log(req.body);
        const newAd = await new Book({
          category: req.body.category,
          sub_category: req.body.sub_category,
          genre: req.body.genre,
          special_mention: req.body.special_mention,
          description: req.body.description,
          tile: req.body.tile,
          ad_present_location: req.body.ad_present_location,
          ad_posted_location: req.body.ad_posted_location,
          reported_ad_count: req.body.reported_ad_count,
          reported_by: req.body.reported_by,
          ad_expire_date: req.body.ad_expire_date,
          ad_promoted: req.body.ad_promoted,
          ad_promoted_date: req.body.ad_promoted_date,
        }).save();

        console.log(newAd);

        const updateUser = await User.findByIdAndUpdate(req.userId, {
          $push: {
            my_ads: {
              _id: newAd._id,
            },
          },
        });
        res.status(200).send({
          message: "Ad Successfully created!",
          Ad: newAd,
        });
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ error: "Something failed in ad create controller!" });
  }
};
