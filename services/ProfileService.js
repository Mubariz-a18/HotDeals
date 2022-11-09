const mongoose = require("mongoose");
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const Profile = require("../models/Profile/Profile");
const { track } = require("./mixpanel-service");
const { currentDate , DOB, Free_credit_Expiry, DateAfter30Days} = require("../utils/moment");
const moment = require('moment');
const Credit = require("../models/creditSchema");
const { createCreditForNewUser } = require("./CreditService");

module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData, userID, phoneNumber) {
    //checking if profile already exist
    let profileDoc = await User.findOne({
      userNumber: phoneNumber,
    });
    if (profileDoc) {
      const userProfile = await Profile.findOne({ _id: userID });
      if (!userProfile) {
        let contactNumber = profileDoc.userNumber
        // Creating Profile
        const profileDoc1 = await Profile.create({
          _id: userID,
          name: bodyData.name,
          userNumber: {
            text: contactNumber,
            private: bodyData.userNumber.private
          },
          email: {
            text: bodyData.email.text,
            private: bodyData.email.private
          },
          user_type: {
            text: bodyData.user_type.text,
            private: bodyData.user_type.private
          },
          city: {
            text: bodyData.city.text,
            private: bodyData.city.private
          },
          about: {
            text: bodyData.about.text,
            private: bodyData.about.private
          },
          country_code: bodyData.country_code,
          date_of_birth: bodyData.date_of_birth,
          age: bodyData.age,
          gender: bodyData.gender,
          language_preference: bodyData.language_preference,
          free_credit: 200,
          premium_credit: 10,
          profile_url: bodyData.profile_url,
          created_date: currentDate,
          updated_date: currentDate,
        });
        // creating a default Rating for new user
        await Rating.create({
          user_id: profileDoc1._id,
        });
        //create a new credit doc for new user
        await createCreditForNewUser(profileDoc1._id)

        //mixpanel track for new Profile Created
        await track('New Profile Created ', {
          distinct_id: profileDoc1._id,
          $email: profileDoc.email.text
        });
        return profileDoc1;
      } else {
        return userProfile;
      }
    }
  }

  //DB Service to Get Profile By Phone Number
  static async getOthersProfile(user_ID) {
    const profileDoc = await Profile.findOne({
      _id: user_ID,
    });
    if (profileDoc) {
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
            user_type:1,
            followers_count:1,
            followings_count:1,
            rate_average:1
          }
        },
      ]);
      //mixpanel trak search others profile
      await track('User searched  ', {
        distinct_id: user_ID,
      });

      return profileData;
    } else {
      //mixpanel ttrack failed to fetch user profile
      await track('User searched failed ', {
        distinct_id: user_ID,
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
  }

  // api get my profile service
  static async getMyProfile(user_ID) {
    const userExist = await Profile.findById({ _id: user_ID })
    if (!userExist) {
      // mixpanel track get my profile failed
      await track('Get My Profile Failed ', {
        distinct_id: user_ID,
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
      const MyProfile = await Profile.aggregate([
        {
          $match: { _id: mongoose.Types.ObjectId(user_ID) },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            userNumber: 1,
            email: 1,
            city: 1,
            about: 1,
            gender: 1,
            date_of_birth: 1,
            user_type: 1,
            about: 1,
            profile_url: 1,
            followers: 1,
            followings: 1,
            rate_average: 1,
            alert:1
          }
        },
      ])
      // mixpanel track get my profile 
      await track('Get My Profile ', {
        distinct_id: user_ID,
      });
      return MyProfile
    }

  }

  // Updating Profile
  static async updateProfile(bodyData, userId) {
    const userProfile = await Profile.findOne({ _id: userId });
    if(!userProfile){
      await track('Failed to  updated User Profile  ', {
        distinct_id: userId,
        $email: bodyData.email.text,
      });
      throw ({ status: 404, message : 'USER_NOT_EXISTS'})
    }
    else{
      var date1 = moment(DOB);
      var date2 = moment(bodyData.date_of_birth);
      var age = date1.diff(date2 , "years");

      const updateUsr = await Profile.findByIdAndUpdate(userId,
        {
          $set: {
                name: bodyData.name,
                email: {
                    text: bodyData.email.text,
                    private: bodyData.email.private
                  },
                user_type: {
                    text: bodyData.user_type.text,
                    private: bodyData.user_type.private
                  },
                city: {
                    text: bodyData.city.text,
                    private: bodyData.city.private
                  },
                about: {
                    text: bodyData.about.text,
                    private: bodyData.about.private
                  },
                // country_code: bodyData.country_code,
                date_of_birth: bodyData.date_of_birth,
                age: age,
                gender: bodyData.gender,
                language_preference: bodyData.language_preference,
                profile_url: bodyData.profile_url,
                updated_date: currentDate
        },
      },
      {
        new: true
      }
      );
      await track('User Profile updated  ', {
        distinct_id: userId,
        $email: bodyData.email
      });
      return updateUsr;
    }
  }
};
