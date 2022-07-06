var multer = require("multer");
var upload = multer();
const mongoose = require("mongoose");
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const connectDB = require("../db/connectDatabase");
const { request } = require("express");
const Profile = require("../models/Profile/Profile");
const { getSelectionData } = require("../utils/string");

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData, userID, phoneNuber) {
    //checking if profile already exists
    console.log("inside profile service");
    let profileDoc = await User.findOne({
      userNumber: phoneNuber,
    });
    if (profileDoc) {
      const userProfile = await Profile.findOne({
        userNumber: phoneNuber,
      });
      if (!userProfile) {

        const profileDoc1 = await Profile.create({
          _id: userID,
          name: bodyData.name,
          userNumber: phoneNuber,
          country_code: bodyData.country_code,
          email: bodyData.email,
          date_of_birth: bodyData.date_of_birth,
          age: bodyData.age,
          gender: bodyData.gender,
          user_type: bodyData.user_type,
          language_preference: bodyData.language_preference,
          city: bodyData.city,
          about: bodyData.about,
          free_credit: bodyData.free_credit,
          premium_credit: bodyData.premium_credit,
          profile_url: bodyData.profile_url,
        });

        const createDefaultRating = await Rating.create({
          _id:profileDoc1._id,
          
        })

        return profileDoc1;

      }
      else{
        return userProfile;
      }
    }
  }

  //DB Service to Get Profile By Phone Number
  static async getProfile(bodyData) {
    console.log(bodyData);
    const { userNumber, contactNumber, name } = bodyData;
    console.log(contactNumber);


    // let profileDoc = await Profile.aggregate([
    //   {
    //     $group: {
    //       _id: "62c28fb3988777fe505754fd",
    //       followersCount: { $sum: { $size: "$follower_info" } },
    //       followingCount: { $sum: { $size: "$following_info" } },
    //     },
    //   },
    // ]);

    // let profileDoc = await Profile.aggregate([
    //   {
    //     $project: {
    //       _id: 1,
    //       numberOfFollower: {
    //         $cond: {
    //           if: { $isArray: "$follower_info" },
    //           then: { $size: "$follower_info" },
    //           else: "NA",
    //         },
    //       },
    //       numberOfFollowing: {
    //         $cond: {
    //           if: { $isArray: "$following_info" },
    //           then: { $size: "$following_info" },
    //           else: "NA",
    //         },
    //       },
    //     },
    //   },
    // ]);
    console.log("getting profile", profileDoc);

    // if (profileDoc) {
    //   if (name === "seeProfile") {
    //     const data = await getSelectionData(profileDoc["_doc"]); //Func to get only the non private elements from profile
    //     console.log(data);
    //     return data;
    //   } else {
    //     return profileDoc;
    //   }
    // }

    // return null;
  }

  static async updateProfile(bodyData) {
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        name: bodyData.name,
        phone_number: bodyData.phone,
        country_code: bodyData.country_code,
        email: bodyData.email,
        date_of_birth: bodyData.date_of_birth,
        age: bodyData.age,
        gender: bodyData.gender,
        user_type: bodyData.user_type,
        language_preference: bodyData.language_preference,
        city: bodyData.city,
        about: bodyData.about,
        free_credit: bodyData.free_credit,
        premium_credit: bodyData.premium_credit,
        profile_url: bodyData.profile_url,
      }
    );

    const profile = await User.findOne({
      _id: req.userId,
    });
    return profile;
  }
};
