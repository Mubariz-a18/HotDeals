const mongoose = require("mongoose");
const User = require("../models/Profile/userProfile");

function capitalizeFirstLetter(string) {
  if (string === undefined || string === null) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData) {
    //checking if profile already exists

    let profileDoc = await User.findOne({
      phone_number: bodyData.phone_number,
    });

    //If Profile Exists return Profile Document

    if (profileDoc) {
      return profileDoc;
    } else {
      profileDoc = await User.create({
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
      });

      return profileDoc["_doc"];
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
