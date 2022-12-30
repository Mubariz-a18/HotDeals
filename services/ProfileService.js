const mongoose = require("mongoose");
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const Profile = require("../models/Profile/Profile");
const { track } = require("./mixpanel-service");
const { my_age } = require("../utils/moment");
const moment = require('moment');
const { createCreditForNewUser } = require("./CreditService");
const { apiCreateReportDoc } = require("./reportService");


module.exports = class ProfileService {
  // DB Services to Create a Profile
  static async createProfile(bodyData, userID, phoneNumber) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    //checking if profile already exist
    let profileDoc = await User.findOne({
      userNumber: phoneNumber,
    });
    if (profileDoc) {
      const userProfile = await Profile.findById({ _id: userID })
      if (!userProfile) {
        let contactNumber = profileDoc.userNumber;
        // Creating Profile
        const profileDoc1 = await Profile.create({
          _id: userID,
          name: bodyData.name,
          userNumber: {
            text: contactNumber,
            private: true
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
          country_code: bodyData.country_code,
          date_of_birth: bodyData.DOB,
          age: bodyData.age,
          gender: bodyData.gender,
          language_preference: bodyData.language_preference,
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
        //create a new report doc for new user
        await apiCreateReportDoc(userID)
        //mixpanel track for new Profile Created
        await track('New Profile Created ', {
          distinct_id: profileDoc1._id,
          $email: profileDoc.email.text
        });
        return {
          profileDoc1,
          message: "Successfully_Created",
          statusCode: 200
        };
      } else {
        return {
          userProfile,
          message: 'USER_ALREADY_EXISTS',
          statusCode: 403
        };
      }
    }
  };

  //DB Service to Get Profile By Phone Number
  static async getOthersProfile(user_id , user_ID) {
    // user_id is my id and user_ID is others id 
    const userExist = await Profile.findOne({ _id: user_id })
    if (!userExist) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const profileDoc = await Profile.findOne({
      _id: user_ID,
    });
    if (profileDoc) {
      const profileData = await Profile.aggregate(
        [
          {
            '$match': {
              '_id': mongoose.Types.ObjectId(user_ID)
            }
          }, {
            '$lookup': {
              'from': 'generics',
              'localField': '_id',
              'foreignField': 'user_id',
              'pipeline': [
                {
                  '$match': {
                    'ad_status': 'Selling'
                  }
                }
              ],
              'as': 'Ads'
            }
          }, {
            '$project': {
              '_id': 1,
              'name': 1,
              'userNumber.text': 1,
              'email': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$email.private', false
                    ]
                  },
                  'then': '$email.text',
                  'else': ''
                }
              },
              'city': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$city.private', false
                    ]
                  },
                  'then': '$city.text',
                  'else': ''
                }
              },
              'about': {
                '$cond': {
                  'if': {
                    '$eq': [
                      '$about.private', false
                    ]
                  },
                  'then': '$about.text',
                  'else': ''
                }
              },
              'profile_url': 1,
              'user_type': 1,
              'followers_count': 1,
              'followings_count': 1,
              'rate_average': 1,
              'rate_count': 1,
              'is_recommended':1,
              'is_email_verified':1,
              "Ads._id":1,
              'Ads.title': 1,
              'Ads.price': 1,
              'Ads.ad_posted_address': 1,
              'Ads.isPrime': 1,
              'Ads.image_url': 1,
              'Ads.created_at': 1,
              'Ads.ad_Premium_Date': 1
            }
          }
        ]
      );
      const Ads = profileData[0]["Ads"];
      Ads.forEach(async ad => {
        const adDetail = await Profile.find(
          {
            _id: user_id,
            "favourite_ads": {
              $elemMatch: { "ad_id": ad._id }
            }
          })
        if (adDetail.length == 0) {
          ad.isAdFav = false
        } else {
          ad.isAdFav = true
        }
      });
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
      throw ({ status: 404, message: 'USER_TO_FIND_NOT_EXISTS' });
    }
  };

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
            is_email_verified: 1,
            profile_url: 1,
            followers: 1,
            followings: 1,
            rate_average: 1,
            rate_count: 1,
            alert: 1
          }
        },
      ])
      // mixpanel track get my profile 
      await track('Get My Profile ', {
        distinct_id: user_ID,
      });
      // await apiCreateReportDoc(user_ID)
      return MyProfile
    }

  };

  // Updating Profile
  static async updateProfile(bodyData, userId) {
    const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
    const userProfile = await Profile.findOne({ _id: userId });
    if (!userProfile) {
      await track('Failed to  updated User Profile  ', {
        distinct_id: userId,
        $email: bodyData.email.text,
      });
      throw ({ status: 404, message: 'USER_NOT_EXISTS' })
    }
    else {
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
            cover_photo_url:bodyData.cover_photo_url,
            is_email_verified: userProfile.email.text !== bodyData.email.text ? false : userProfile.is_email_verified,
            date_of_birth: bodyData.date_of_birth,
            age: my_age(moment(bodyData.date_of_birth)),
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
  };

  //checkif userExist
  static async checkUserProfileService(user_ID) {
    const user = await Profile.findById({ _id: user_ID });

    if (user) {
      return user
    } else {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
  };
};
