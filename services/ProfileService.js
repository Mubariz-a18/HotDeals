const mongoose = require("mongoose");
const moment = require('moment');
const User = require("../models/Profile/User");
const Rating = require("../models/ratingSchema");
const Profile = require("../models/Profile/Profile");
const Referral = require("../models/referelSchema");
const { track } = require("./mixpanel-service");
const { createCreditForNewUser } = require("./CreditService");
const { apiCreateReportDoc } = require("./reportService");
const { referral_code_generator } = require("../utils/otp.util");
const { ObjectId } = require("mongodb");
const Credit = require("../models/creditSchema");
const Alert = require("../models/alertSchema");
const Draft = require("../models/Ads/draftSchema");
const Generic = require("../models/Ads/genericSchema");
const GlobalSearch = require("../models/GlobalSearch");
const HelpService = require("./HelpService");
const Report = require("../models/reportSchema");
const { app, storage } = require("../firebaseAppSetup");
const { getAdsForPayout } = require("./AdService");
const OfferModel = require("../models/offerSchema");
const { getReferralForPayouts } = require("./referCodeService");
const HelpCenter = require("../models/helpCenterSchema");
const BusinessAds = require("../models/Ads/businessAdsShema");
const { BusinessProfile } = require("./BuisinessAdService");


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
          user_type: {
            text: bodyData.user_type.text,
            private: bodyData.user_type.private
          },
          city: {
            text: bodyData.city.text || "",
          },
          date_of_birth: bodyData.DOB,
          gender: bodyData.gender,
          language_preference: bodyData.language_preference,
          profile_url: bodyData.profile_url,
          thumbnail_url: bodyData.thumbnail_url,
          cover_photo_url: bodyData.cover_photo_url,
          created_date: currentDate,
          updated_date: currentDate
        });

        // Create a new referralCode doc
        await Referral.create({
          user_Id: profileDoc1._id,
          referral_code: referral_code_generator(bodyData.name),
          isPromoCode: false
        });

        // creating a default Rating for new user
        await Rating.create({
          user_id: profileDoc1._id,
        });

        if (!profileDoc.isDeletedOnce) {

          //create a new credit doc for new user
          await createCreditForNewUser(profileDoc1._id, 200, "Active");

        } else {

          //create a new credit doc for new user
          await createCreditForNewUser(profileDoc1._id, 0, "Empty");

        }

        //create a new report doc for new user
        await apiCreateReportDoc(userID);

        //mixpanel track for new Profile Created
        await track('New Profile Created ', {
          distinct_id: profileDoc1._id
        });

        let ShowReferral

        if (profileDoc.isDeletedOnce) {
          ShowReferral = false
        } else {
          ShowReferral = true
        }

        return {
          profileDoc1,
          message: "Successfully_Created",
          ShowReferral: ShowReferral,
          statusCode: 200
        };

      } else {

        return {

          userProfile,
          message: 'USER_ALREADY_EXISTS',
          statusCode: 403

        };
      };
    } else {

      throw ({ status: 404, message: 'USER_NOT_EXISTS' });

    }
  };

  //DB Service to Get Profile By Phone Number
  static async getOthersProfile(user_id, user_ID) {
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
              "thumbnail_url": 1,
              'cover_photo_url': 1,
              'user_type': 1,
              'followers_count': 1,
              'followings_count': 1,
              'rate_average': 1,
              'rate_count': 1,
              'is_recommended': 1,
              'is_email_verified': 1,
              "Ads._id": 1,
              'Ads.title': 1,
              'Ads.price': 1,
              'Ads.ad_posted_address': 1,
              'Ads.isPrime': 1,
              'Ads.textLanguages': 1,
              "Ads.thumbnail_url": 1,
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
      const alreadFollowing = userExist.followings.includes(user_ID);
      if (alreadFollowing) {
        profileData[0].following = true;
      } else {
        profileData[0].following = false;
      }
      const RatingDoc = await Rating.find({ user_id: user_ID }, { _id: 0, "RatingInfo": { $elemMatch: { "rating_given_by": user_id } } });

      if (RatingDoc[0].RatingInfo[0]) {
        profileData[0].rated = true;
        profileData[0].rating_given = RatingDoc[0].RatingInfo[0].rating
      } else {
        profileData[0].rated = false;
        profileData[0].rating_given = null
      }

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
          thumbnail_url: 1,
          profile_url: 1,
          language_preference: 1,
          cover_photo_url: 1,
          followers_count: 1,
          followings_count: 1,
          rate_average: 1,
          rate_count: 1,
          alert: 1
        }
      },
    ]);
    if (MyProfile.length === 0) {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
    const Offer = await OfferModel.findOne({});

    const referral_code = await Referral.findOne({
      user_Id: ObjectId(user_ID)
    }, {
      "referral_code": 1
    });

    // mixpanel track get my profile 
    await track('Get My Profile ', {
      distinct_id: user_ID,
    });

    let adsPayout = false;
    let referralPayout = false;

    if (Offer.offerValid) {
      adsPayout = true;
    } else {
      const payoutAdList = await getAdsForPayout(user_ID);
      const AdsInRevieW = payoutAdList[0].InReview;
      const AdsInApproved = payoutAdList[0].Approved;
      const claimableAds = AdsInApproved.find(obj => obj.paymentstatus === "Not_Claimed");
      if (AdsInRevieW.length > 0 || claimableAds) {
        adsPayout = true
      }
    }

    if (Offer.referralOfferValid) {
      referralPayout = true;
    } else {
      const payoutReferralList = await getReferralForPayouts(user_ID);
      const claimablePayouts = payoutReferralList.find(obj => obj.paymentstatus === "Not_Claimed")
      if (claimablePayouts) {
        referralPayout = true
      }
    }

    MyProfile[0].adsPayoutFlag = adsPayout;
    MyProfile[0].referralPayoutFlag = referralPayout;
    const isBusinessOwner = await BusinessProfile(user_ID);
    if (isBusinessOwner) {
      return { MyProfile, referral_code, isBusinessVerified: isBusinessOwner.isBusinessVerified }
    }
    return { MyProfile, referral_code }
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
            cover_photo_url: bodyData.cover_photo_url,
            is_email_verified: userProfile.email.text !== bodyData.email.text ? false : userProfile.is_email_verified,
            date_of_birth: bodyData.date_of_birth,
            gender: bodyData.gender,
            language_preference: bodyData.language_preference,
            profile_url: bodyData.profile_url,
            thumbnail_url: bodyData.thumbnail_url,
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
      const referral_code = await Referral.findOne({
        user_Id: ObjectId(userId)
      }, {
        "referral_code": 1
      });
      const Offer = await OfferModel.findOne({});
      let adsPayout = false;
      let referralPayout = false;

      if (Offer.offerValid) {
        adsPayout = true;
      } else {
        const payoutAdList = await getAdsForPayout(userId);
        const AdsInRevieW = payoutAdList[0].InReview;
        const AdsInApproved = payoutAdList[0].Approved;
        const claimableAds = AdsInApproved.find(obj => obj.paymentstatus === "Not_Claimed");
        if (AdsInRevieW.length > 0 || claimableAds) {
          adsPayout = true
        }
      }

      if (Offer.referralOfferValid) {
        referralPayout = true;
      } else {
        const payoutReferralList = await getReferralForPayouts(userId);
        const claimablePayouts = payoutReferralList.find(obj => obj.paymentstatus === "Not_Claimed")
        if (claimablePayouts) {
          referralPayout = true
        }
      }

      let adsPayoutFlag = adsPayout;
      let referralPayoutFlag = referralPayout;

      const isBusinessOwner = await BusinessProfile(userId);

      if (isBusinessOwner) {
        return { updateUsr, referral_code, adsPayoutFlag, referralPayoutFlag, isBusinessVerified: isBusinessOwner.isBusinessVerified }
      }
      return { updateUsr, referral_code, adsPayoutFlag, referralPayoutFlag }
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
  //delete userProfile Service
  static async deleteUserService(user_ID) {
    const UserID = ObjectId(user_ID)
    // const defultProfile = "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/profileimages%2Fdefault_profile.jpg?alt=media&token=eca80b6f-a8a0-4968-9c29-daf57ee474bb";
    // const defaultThumbnail = "https://firebasestorage.googleapis.com/v0/b/true-list.appspot.com/o/thumbnails%2Fdefault%20thumbnail.jpeg?alt=media&token=9b903695-9c36-4fc3-8b48-8d70a5cd4380"; 
    // const userDeleted = await Profile.findOne({ _id: user_ID });
    // const usersAds = await Generic.find({ user_id: user_ID }, {
    // image_url: 1,
    //   video_url: 1,
    //     thumbnail_url: 1
    // });
    const userDeleted = await Profile.findOneAndDelete({ _id: UserID });

    if (userDeleted) {
      await User.findOneAndUpdate({ _id: UserID }, {
        $set: {
          isDeletedOnce: true
        }
      });

      await Credit.deleteOne({ user_id: UserID });
      await Alert.deleteOne({ user_ID: UserID });
      await Draft.deleteMany({ user_id: UserID });
      await Generic.deleteMany({ user_id: UserID });
      await GlobalSearch.deleteMany({ ad_id: { $in: userDeleted.my_ads } });
      await HelpCenter.deleteMany({ user_id: UserID });
      await Rating.deleteMany({ user_id: UserID });
      await Referral.deleteMany({ user_Id: UserID });

      // if (userDeleted.profile_url !== defultProfile) {
      //   //firebase delete operation
      // } else {
      //   console.log("isdefault")
      // }
      // let images = [];
      // let videos = [];
      // let thumbnails = [];

      // usersAds.forEach(element => {
      //   element.image_url?.forEach(img => images.push(img))
      //   element.video_url?.forEach(vid => videos.push(vid))
      //   element.thumbnail_url?.forEach(thumb => {
      //     if (thumb !== defaultThumbnail) {
      //       thumbnails.push(thumb)
      //     }
      //   })

      // })


      // console.log(
      //   images, "\n",
      //   videos, "\n",
      //   thumbnails)

      // const { getStorage, ref, deleteObject } = require("firebase/storage");

      // const { initializeApp } = require("firebase/app");


      // const firebaseConfig = {
      //   apiKey: process.env.APIKEY,
      //   authDomain: process.env.AUTHDOMAIN,
      //   databaseURL: process.env.DATABASEURL,
      //   projectId: process.env.PROJECTID,
      //   storageBucket: process.env.STORAGEBUCKET,
      //   messagingSenderId: process.env.MESSAGINGSENDERID,
      //   appId: process.env.APPID,
      //   measurementId: process.env.MEASUREMENTID
      // };

      // const app = initializeApp(firebaseConfig);
      // const storage = getStorage(app);

      // if (images.length > 0) {
      //   images.forEach(img => {
      //     const desertRef = ref(storage, img)
      //     deleteObject(desertRef).then(() => {
      //       console.log("deleted")
      //     }).catch(e => {
      //       console.log(e)
      //     })
      //   });
      // }
      // if (videos.length > 0) {
      //   videos.forEach(vid => {
      //     const desertRef = ref(storage, vid)
      //     deleteObject(desertRef).then(() => {
      //       console.log("deleted")
      //     }).catch(e => {
      //       console.log(e)
      //     })
      //   })
      // }
      // if (thumbnails.length > 0) {
      //   thumbnails.forEach(thumb => {
      //     const desertRef = ref(storage, vid)
      //     deleteObject(desertRef).then(() => {
      //       console.log("deleted")
      //     }).catch(e => {
      //       console.log(e)
      //     })
      //   })
      // }

      return userDeleted
    }
    else {
      throw ({ status: 404, message: 'USER_NOT_EXISTS' });
    }
  }
};
