var multer = require("multer");
var upload = multer();
const mongoose = require("mongoose");
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const connectDB = require("../db/connectDatabase");
const { request } = require("express");
const Profile = require("../models/Profile/Profile");

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData,userID,phoneNuber) {
    //checking if profile already exists
    console.log("inside profile service");
    console.log(phoneNuber)
    let profileDoc = await User.findOne({
      userNumber: phoneNuber,
    });
    if (profileDoc) {
      const userProfile = await Profile.findOne({
        userNumber: phoneNuber,
      });
      if (!userProfile) {
        console.log(profileDoc)

        const profileDoc1 = await Profile.create({
          _id:userID,
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
        return profileDoc1;
      } else {
        return userProfile;
      }
    }
  }

  //DB Service to Get Profile By Phone Number

  static async getProfile(bodyData) {
    console.log(bodyData);
    const { phone_number } = bodyData;
    let profileDoc = await User.findOne({
      phone_number: phone_number,
    });

    if (profileDoc) {
      return profileDoc;
    } else {
      return null;
    }
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
