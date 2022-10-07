const mongoose = require("mongoose");
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const Profile = require("../models/Profile/Profile");
const { track } = require("./mixpanel-service");

var moment = require('moment');
moment().format();

const now = moment().format('YYYY-MM-DD HH:mm:ss');

module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData, userID, phoneNuber) {

    //checking if profile already exist
    let profileDoc = await User.findOne({
      userNumber: phoneNuber,
    });
    console.log(userID)
    if (profileDoc) {

      const userProfile = await Profile.findOne({
        _id: userID,
      });
      if (!userProfile) {
        let email = bodyData.text.email;
        let user_type = bodyData.text.user_type;
        let city = bodyData.text.city;
        let about = bodyData.text.about;
        let contactNumber = profileDoc.userNumber
        
        // Creating Profile
        const profileDoc1 = await Profile.create({
          _id: userID,
          name: bodyData.name,
          userNumber: contactNumber,
          country_code: bodyData.country_code,
          email: email,
          date_of_birth: bodyData.date_of_birth,
          age: bodyData.age,
          gender: bodyData.gender,
          user_type: user_type,
          language_preference: bodyData.language_preference,
          city: city,
          about: about,
          free_credit: bodyData.free_credit,
          premium_credit: bodyData.premium_credit,
          profile_url: bodyData.profile_url,
          created_date: now,
          updated_date: now
        });

        console.log(profileDoc1)

        const createDefaultRating = await Rating.create({
          user_id: profileDoc1._id,
        });
        
       //mix panel set thenew User id with given properties
       await mixpanel.people.set(userID, {
         $first_name: profileDoc1.name,
         $email: profileDoc1.email.text,
         $created: (new Date()).toISOString()
       }, {
         $ip: '127.0.0.1'
         });

        await track('New Profile Created ', { 
          distinct_id : profileDoc1._id ,
          $email :  profileDoc.email.text
        });

        return profileDoc1;
      } else {
        console.log("inside else")
        console.log(userProfile)
        return userProfile;
      }
    }
  }

  //DB Service to Get Profile By Phone Number
  static async getProfile(user_ID) {
    const profileDoc = await Profile.findOne({
      _id: user_ID,
    });
    console.log(profileDoc)
    if (profileDoc) {
      console.log("I'm inside profile Service")
      const profileData = await Profile.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(user_ID) },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            "userNumber.text": 1,
            email: {
              $cond: { if: { $eq: ["$email.private", false] }, then: "$email.text", else: "" }
            },
            city: {
              $cond: { if: { $eq: ["$city.private", false] }, then: "$city.text", else: "" }
            },
            about: {
              $cond: { if: { $eq: ["$about.private", false] }, then: "$about.text", else: "" }
            },
            gender: 1,
          }
        },
      ]);

      await track('User searched  ', { 
        distinct_id : user_ID ,
      });

      return profileData;
    } else {
    }
  }

  // Updating Profile
  static async updateProfile(bodyData, userId) {
    const updateUsr = await Profile.findByIdAndUpdate(userId,
      {
        $set: {
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
          updated_date: moment().format('DD-MM-YY HH:mm:ss'),
        },
      },
      {
        new: true
      }
    );
    await track('User Profile updated  ', { 
      distinct_id : userId ,
      $email: bodyData.email
    });
    return updateUsr;
  }
};
