// const Pet = require("../../../models/Ads/petSchema");
// const Vehicle = require("../../../models/Ads/vehicleSchema");
// const House = require("../../../models/Ads/houseSchema");
// const Electronic = require("../../../models/Ads/ElectronicSchema");
// const HomeAppliance = require("../../../models/Ads/homeApplianceSchema");
// const KitchenAppliance = require("../../../models/Ads/homeApplianceSchema");
// const Fashion = require("../../../models/Ads/fashionSchema");
// const Sport = require("../../../models/Ads/sportSchema");
// const Furniture = require("../../../models/Ads/furnitureSchema");
// const ArtAndAntique = require("../../../models/Ads/artsAndAntiqueSchema");
// const Book = require("../../../models/Ads/bookSchema");
// const User = require("../../../models/Profile/Profile");


// // Create Ad Controller 
// exports.createAd = async function (req, res) {
//   try {
//     console.log(req.userId);

//     let category = req.body.category;
//     // Check is body contains Data or not
//     // if True based on the category Data is saved 

//     if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
//       res.status(400).send({ error: "please provide data!" });
//     } else {
//       // PET Category 
//       if (category == "Pet") {
//         console.log("Inside Pet If");
//         const {
//           category,
//           sub_category,
//           animal,
//           breed,
//           condition,
//           description,
//           special_mentions,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body   
//         const newAd = await new Pet({
//           category,
//           sub_category,
//           animal,
//           breed,
//           condition,
//           description,
//           special_mentions,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });

//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       }
//       // Vehicle Category  
//       else if (category == "Vehicle") {
//         console.log("Inside Vehicle else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           make,
//           model,
//           colour,
//           condition,
//           transmission,
//           year_of_make,
//           year_of_purchase,
//           mileage,
//           contact_of_owner,
//           accidental,
//           vehicle_registered_at,
//           vehicle_present_at,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body;
//         const newAd = await new Vehicle({
//           category,
//           sub_category,
//           make,
//           model,
//           colour,
//           condition,
//           transmission,
//           year_of_make,
//           year_of_purchase,
//           mileage,
//           contact_of_owner,
//           accidental,
//           vehicle_registered_at,
//           vehicle_present_at,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       }
//       // Housing category 
//       else if (category == "Housing") {
//         console.log("Inside Husing else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           facing,
//           dimension_length,
//           dimension_breadth,
//           area,
//           carpet_area,
//           beds,
//           baths,
//           furnishing_type,
//           balconies,
//           gated_community,
//           property_floor_no,
//           number_of_floors,
//           car_parking,
//           bike_parking,
//           amenities,
//           nearly_by,
//           registration,
//           distance_from_main_road,
//           front_road,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body 
//         const newAd = await new House({
//           category,
//           sub_category,
//           facing,
//           dimension_length,
//           dimension_breadth,
//           area,
//           carpet_area,
//           beds,
//           baths,
//           furnishing_type,
//           balconies,
//           gated_community,
//           property_floor_no,
//           number_of_floors,
//           car_parking,
//           bike_parking,
//           amenities,
//           nearly_by,
//           registration,
//           distance_from_main_road,
//           front_road,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "Electronic") {
//         console.log("Inside Electronic else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           device,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,
//         } = req.body;
//         const newAd = await new Electronic({
//           category,
//           sub_category,
//           device,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       }
//       // Home Appliance category
//        else if (category == "HomeAppliance") {
//         console.log("Inside HomeApplance else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body;
//         const newAd = await new HomeAppliance({
//           category,
//           sub_category,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "KitchenAppliance") {
//         console.log("Inside KitchenApplance else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           device,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body;
//         const newAd = await new KitchenAppliance({
//           category,
//           sub_category,
//           device,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       }
//       // Fashion category
//       else if (category == "Fashion") {
//         console.log("Inside fashion else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,
//         } = req.body;
//         const newAd = await new Fashion({
//           category,
//           sub_category,
//           brand,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "Sport") {
//         console.log("Inside sports else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           type,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date} = req.body;
//         const newAd = await new Sport({
//           category,
//           sub_category,
//           type,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "Furniture") {
//         console.log("Inside furniture else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body
//         const newAd = await new Furniture({
//           category,
//           sub_category,
//           colour,
//           year,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "ArtAndAntique") {
//         console.log("Inside ArtAndAntique else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body;
//         const newAd = await new ArtAndAntique({
//           category,
//           sub_category,
//           state,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       } else if (category == "Book") {
//         console.log("Inside Book else If");
//         console.log(req.body);
//         const {
//           category,
//           sub_category,
//           genre,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date,} = req.body
//         const newAd = await new Book({
//           category,
//           sub_category,
//           genre,
//           special_mention,
//           description,
//           title,
//           ad_present_location,
//           ad_posted_location,
//           reported_ad_count,
//           reported_by,
//           ad_expire_date,
//           ad_promoted,
//           ad_promoted_date
//         }).save();

//         console.log(newAd);

//         const updateUser = await User.findByIdAndUpdate(req.userId, {
//           $push: {
//             my_ads: {
//               _id: newAd._id,
//             },
//           },
//         });
//         res.status(200).send({
//           message: "Ad Successfully created!",
//           Ad: newAd,
//         });
//       }
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .send({ error: "Something failed in ad create controller!" });
//   }
// };
